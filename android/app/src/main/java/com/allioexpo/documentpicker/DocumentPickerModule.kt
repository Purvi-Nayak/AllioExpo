package com.allioexpo.documentpicker

import android.app.Activity
import android.content.Intent
import android.database.Cursor
import android.net.Uri
import android.provider.OpenableColumns
import com.facebook.react.bridge.ActivityEventListener
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.WritableMap
import java.io.File
import java.io.FileOutputStream
import java.io.InputStream
import androidx.core.content.FileProvider
import android.webkit.MimeTypeMap

class DocumentPickerModule(private val reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext), ActivityEventListener {

    companion object {
        const val REQUEST_CODE_PICK_DOC = 54321
    }

    private var pickerPromise: Promise? = null

    init {
        reactContext.addActivityEventListener(this)
    }

    override fun getName(): String {
        return "DocumentPicker"
    }

    @ReactMethod
    fun pickDocument(promise: Promise) {
        val activity: Activity? = currentActivity
        if (activity == null) {
            promise.reject("NO_ACTIVITY", "No foreground activity")
            return
        }
        if (pickerPromise != null) {
            promise.reject("BUSY", "Another picker is in progress")
            return
        }
        pickerPromise = promise

        try {
            val intent = Intent(Intent.ACTION_OPEN_DOCUMENT).apply {
                addCategory(Intent.CATEGORY_OPENABLE)
                type = "*/*"
                putExtra(Intent.EXTRA_MIME_TYPES, arrayOf(
                    "application/pdf",
                    "application/msword",
                    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                    "application/vnd.ms-excel",
                    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                    "application/vnd.ms-powerpoint",
                    "text/plain"
                ))
            }
            activity.startActivityForResult(Intent.createChooser(intent, "Select document"), REQUEST_CODE_PICK_DOC)
        } catch (e: Exception) {
            pickerPromise = null
            promise.reject("INTENT_ERROR", e.message)
        }
    }

    override fun onActivityResult(activity: Activity?, requestCode: Int, resultCode: Int, data: Intent?) {
        if (requestCode != REQUEST_CODE_PICK_DOC) return

        val promise = pickerPromise ?: return
        pickerPromise = null

        if (resultCode != Activity.RESULT_OK || data == null) {
            promise.reject("CANCELLED", "User cancelled or no data returned")
            return
        }

        try {
            val uri: Uri? = data.data
            if (uri == null) {
                promise.reject("NO_URI", "No document uri returned")
                return
            }

            val contentResolver = reactContext.contentResolver
            val mimeType = contentResolver.getType(uri)

            val result: WritableMap = Arguments.createMap()
            result.putString("originalUri", uri.toString())
            result.putString("mime", mimeType)
            result.putString("type", "document")

            // try to get display name and size
            try {
                var name: String? = null
                var size: Long? = null
                val cursor: Cursor? = contentResolver.query(uri, null, null, null, null)
                cursor?.use {
                    if (it.moveToFirst()) {
                        val nameIndex = it.getColumnIndex(OpenableColumns.DISPLAY_NAME)
                        if (nameIndex != -1) name = it.getString(nameIndex)
                        val sizeIndex = it.getColumnIndex(OpenableColumns.SIZE)
                        if (sizeIndex != -1) size = it.getLong(sizeIndex)
                    }
                }
                if (name != null) result.putString("name", name)
                if (size != null) result.putDouble("size", size.toDouble())
            } catch (e: Exception) {
                // ignore
            }

            // try to copy to cache and return cached file uri so app can preview easily
            try {
                val inputStream: InputStream? = contentResolver.openInputStream(uri)
                if (inputStream != null) {
                    val extension = when (mimeType) {
                        "application/pdf" -> ".pdf"
                        "application/msword" -> ".doc"
                        "application/vnd.openxmlformats-officedocument.wordprocessingml.document" -> ".docx"
                        "application/vnd.ms-excel" -> ".xls"
                        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" -> ".xlsx"
                        else -> ""
                    }
                    val outFile = File(reactContext.cacheDir, "picked_doc_${System.currentTimeMillis()}$extension")
                    var outputStream: FileOutputStream? = null
                    try {
                        outputStream = FileOutputStream(outFile)
                        val buffer = ByteArray(8 * 1024)
                        var len: Int
                        while (inputStream.read(buffer).also { len = it } > 0) {
                            outputStream.write(buffer, 0, len)
                        }
                        outputStream.flush()
                        val cached = Uri.fromFile(outFile).toString()
                        result.putString("uri", cached)
                        result.putString("cachedFile", cached)
                    } finally {
                        try { inputStream.close() } catch (_: Exception) {}
                        try { outputStream?.close() } catch (_: Exception) {}
                    }
                }
            } catch (e: Exception) {
                // ignore copy failure
            }

            promise.resolve(result)
        } catch (e: Exception) {
            promise.reject("PICK_ERROR", e.message)
        }
    }

    override fun onNewIntent(intent: Intent?) {
        // no-op
    }

    @ReactMethod
    fun openFile(uriString: String?) {
        if (uriString == null) return
        val activity: Activity? = currentActivity
        if (activity == null) return
        try {
            var uri = Uri.parse(uriString)
            var mimeType: String? = null

            // if file:// scheme, convert to content uri via FileProvider for Android N+
            if (uriString.startsWith("file://")) {
                val file = File(uri.path ?: "")
                if (file.exists()) {
                    val authority = reactContext.packageName + ".fileprovider"
                    uri = FileProvider.getUriForFile(reactContext, authority, file)
                    // guess mime from extension
                    val ext = file.extension
                    if (ext.isNotEmpty()) {
                        mimeType = MimeTypeMap.getSingleton().getMimeTypeFromExtension(ext.lowercase())
                    }
                }
            } else {
                // try to get mime from content resolver
                try { mimeType = reactContext.contentResolver.getType(uri) } catch (_: Exception) {}
            }

            // First try ACTION_VIEW
            val viewIntent = Intent(Intent.ACTION_VIEW).apply {
                setDataAndType(uri, mimeType ?: "*/*")
                addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION)
            }

            val pm = reactContext.packageManager
            val resolveInfo = pm.resolveActivity(viewIntent, 0)
            if (resolveInfo != null) {
                val chooser = Intent.createChooser(viewIntent, "Open file")
                activity.startActivity(chooser)
                return
            }

            // Fallback: try ACTION_SEND share to allow other apps (Drive, cloud apps) to receive the file
            val sendIntent = Intent(Intent.ACTION_SEND).apply {
                putExtra(Intent.EXTRA_STREAM, uri)
                type = mimeType ?: "*/*"
                addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION)
            }
            val chooser2 = Intent.createChooser(sendIntent, "Open file with")
            activity.startActivity(chooser2)
        } catch (e: Exception) {
            // ignore
        }
    }
}
