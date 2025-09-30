package com.allioexpo.fileuploader

import android.app.Activity
import android.content.Intent
import android.database.Cursor
import android.net.Uri
import android.provider.OpenableColumns
import android.widget.Toast
import com.facebook.react.bridge.*
import com.facebook.react.modules.core.DeviceEventManagerModule
import java.io.File
import java.io.FileOutputStream
import java.io.InputStream
import java.util.concurrent.Executors

class FileUploaderModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext), ActivityEventListener {

    companion object {
        const val REQUEST_CODE_PICK_FILE = 10011
    }

    private var pendingPromise: Promise? = null
    // keep params for backwards compatibility but they are ignored; upload will be local
    private var pendingUploadUrl: String? = null
    private var pendingHeaders: ReadableMap? = null

    private val executor = Executors.newSingleThreadExecutor()

    init {
        reactContext.addActivityEventListener(this)
    }

    override fun getName(): String {
        return "FileUploader"
    }

    @ReactMethod
    fun pickAndUpload(uploadUrl: String?, headers: ReadableMap?, promise: Promise) {
        val currentActivity: Activity? = currentActivity
        if (currentActivity == null) {
            promise.reject("NO_ACTIVITY", "No current activity")
            return
        }

        if (pendingPromise != null) {
            promise.reject("IN_PROGRESS", "Another pick/upload is already in progress")
            return
        }

        // store but will not perform network upload; we keep signature for compatibility
        pendingPromise = promise
        pendingUploadUrl = uploadUrl
        pendingHeaders = headers

        try {
            val intent = Intent(Intent.ACTION_OPEN_DOCUMENT)
            intent.addCategory(Intent.CATEGORY_OPENABLE)
            intent.type = "*/*"
            intent.putExtra(Intent.EXTRA_ALLOW_MULTIPLE, false)
            // Grant persistable permission so the app can read the URI later
            intent.addFlags(Intent.FLAG_GRANT_PERSISTABLE_URI_PERMISSION)
            intent.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION)

            // Use a chooser to ensure the system opens a picker dialog
            val chooser = Intent.createChooser(intent, "Select file")
            currentActivity.startActivityForResult(chooser, REQUEST_CODE_PICK_FILE)
        } catch (e: Exception) {
            pendingPromise = null
            pendingUploadUrl = null
            pendingHeaders = null
            promise.reject("INTENT_ERROR", e.message)
        }
    }

    // RN expects addListener/removeListeners when using NativeEventEmitter
    @ReactMethod
    fun addListener(eventName: String) {
        // no-op
    }

    @ReactMethod
    fun removeListeners(count: Int) {
        // no-op
    }

    override fun onActivityResult(activity: Activity?, requestCode: Int, resultCode: Int, data: Intent?) {
        if (requestCode != REQUEST_CODE_PICK_FILE) return

        val promise = pendingPromise ?: return
        pendingPromise = null

        if (activity == null) {
            promise.reject("NO_ACTIVITY", "No activity")
            return
        }

        if (data == null || data.data == null) {
            promise.reject("NO_FILE", "No file selected")
            return
        }

        val uri = data.data!!
        // Persist permission
        try {
            val flags = data.flags and (Intent.FLAG_GRANT_READ_URI_PERMISSION or Intent.FLAG_GRANT_WRITE_URI_PERMISSION)
            activity.contentResolver.takePersistableUriPermission(uri, flags)
        } catch (ignore: Exception) {
        }

        // Get metadata
        val cursor: Cursor? = activity.contentResolver.query(uri, null, null, null, null)
        var displayName: String? = null
        var size: Long = -1
        try {
            cursor?.use {
                if (it.moveToFirst()) {
                    val nameIndex = it.getColumnIndex(OpenableColumns.DISPLAY_NAME)
                    if (nameIndex != -1) displayName = it.getString(nameIndex)
                    val sizeIndex = it.getColumnIndex(OpenableColumns.SIZE)
                    if (sizeIndex != -1) size = it.getLong(sizeIndex)
                }
            }
        } catch (e: Exception) {
        }

        val mimeType = activity.contentResolver.getType(uri) ?: "application/octet-stream"

        // Show native toast
        try {
            Toast.makeText(reactApplicationContext, "Picked: ${displayName ?: uri.lastPathSegment}", Toast.LENGTH_SHORT).show()
        } catch (ignore: Exception) {}

        // perform local copy to cache directory with progress events
        val headers = pendingHeaders
        pendingUploadUrl = null
        pendingHeaders = null

        executor.execute {
            try {
                val resultMap = copyToCacheWithProgress(uri, displayName ?: uri.lastPathSegment ?: "file", mimeType, size)
                promise.resolve(resultMap)
            } catch (e: Exception) {
                promise.reject("COPY_ERROR", e.message)
            }
        }
    }

    override fun onNewIntent(intent: Intent?) {
        // no-op
    }

    private fun copyToCacheWithProgress(uri: Uri, name: String, mimeType: String, knownSize: Long): WritableMap {
        val resolver = reactApplicationContext.contentResolver
        val cacheDir = reactApplicationContext.cacheDir
        // ensure unique filename
        var targetFile = File(cacheDir, name)
        if (targetFile.exists()) {
            val base = name
            val timestamp = System.currentTimeMillis()
            targetFile = File(cacheDir, "${timestamp}_$base")
        }

        var input: InputStream? = null
        var output: FileOutputStream? = null
        try {
            input = resolver.openInputStream(uri) ?: throw Exception("Unable to open input stream")
            output = FileOutputStream(targetFile)

            val totalBytes = if (knownSize > 0) knownSize else tryGetContentLength(uri)

            // Emit initial 0% so very small files show progress start
            sendProgressEvent(0, uri.toString())

            val buffer = ByteArray(8 * 1024)
            var uploaded: Long = 0
            var read: Int
            var lastPercent = -1

            while (input.read(buffer).also { read = it } != -1) {
                output.write(buffer, 0, read)
                uploaded += read
                if (totalBytes > 0) {
                    val percent = ((uploaded * 100) / totalBytes).toInt()
                    if (percent != lastPercent) {
                        lastPercent = percent
                        sendProgressEvent(percent, uri.toString())
                    }
                } else {
                    // unknown size
                    sendProgressEvent(-1, uri.toString(), uploaded)
                }
            }

            // final event
            if (totalBytes > 0) sendProgressEvent(100, uri.toString())

            val result = Arguments.createMap()
            result.putString("fileName", targetFile.name)
            result.putString("fileUri", Uri.fromFile(targetFile).toString())
            result.putString("mimeType", mimeType)
            if (totalBytes >= 0) result.putDouble("size", totalBytes.toDouble())
            result.putBoolean("success", true)
            return result

        } finally {
            try { output?.flush() } catch (_: Exception) {}
            try { output?.close() } catch (_: Exception) {}
            try { input?.close() } catch (_: Exception) {}
        }
    }

    private fun tryGetContentLength(uri: Uri): Long {
        var size: Long = -1
        try {
            val cursor = reactApplicationContext.contentResolver.query(uri, arrayOf(OpenableColumns.SIZE), null, null, null)
            cursor?.use {
                if (it.moveToFirst()) {
                    val sizeIndex = it.getColumnIndex(OpenableColumns.SIZE)
                    if (sizeIndex != -1) size = it.getLong(sizeIndex)
                }
            }
        } catch (e: Exception) {
        }
        return size
    }

    private fun sendProgressEvent(percent: Int, fileUri: String, bytesUploaded: Long = -1) {
        val params = Arguments.createMap()
        if (percent >= 0) params.putInt("progress", percent) else params.putInt("progress", -1)
        params.putString("fileUri", fileUri)
        if (bytesUploaded >= 0) params.putDouble("bytesUploaded", bytesUploaded.toDouble())

        try {
            reactApplicationContext
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
                .emit("FileUploadProgress", params)
        } catch (_: Exception) {
        }
    }
}
