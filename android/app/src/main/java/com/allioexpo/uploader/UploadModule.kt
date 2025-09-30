package com.allioexpo.uploader

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
import com.facebook.react.modules.core.DeviceEventManagerModule
import java.io.BufferedInputStream
import java.io.DataOutputStream
import java.io.InputStream
import java.net.HttpURLConnection
import java.net.URL
import kotlin.concurrent.thread

class UploadModule(private val reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext), ActivityEventListener {

    companion object {
        const val REQUEST_CODE_PICK_UPLOAD = 65432
    }

    private var uploadPromise: Promise? = null
    private var currentUploadUrl: String? = null

    init {
        reactContext.addActivityEventListener(this)
    }

    override fun getName(): String {
        return "Uploader"
    }

    @ReactMethod
    fun pickAndUpload(uploadUrl: String?, promise: Promise) {
        val activity: Activity? = currentActivity
        if (activity == null) {
            promise.reject("NO_ACTIVITY", "No foreground activity")
            return
        }
        if (uploadPromise != null) {
            promise.reject("BUSY", "Another upload is in progress")
            return
        }
        if (uploadUrl == null) {
            promise.reject("NO_URL", "uploadUrl required")
            return
        }

        uploadPromise = promise
        currentUploadUrl = uploadUrl

        try {
            val intent = Intent(Intent.ACTION_OPEN_DOCUMENT).apply {
                addCategory(Intent.CATEGORY_OPENABLE)
                type = "*/*"
            }
            activity.startActivityForResult(Intent.createChooser(intent, "Select file to upload"), REQUEST_CODE_PICK_UPLOAD)
        } catch (e: Exception) {
            uploadPromise = null
            currentUploadUrl = null
            promise.reject("INTENT_ERROR", e.message)
        }
    }

    // React Native requires these methods to be present for NativeEventEmitter to avoid warnings
    @ReactMethod
    fun addListener(eventName: String) {
        // Keep for RN event emitter support - no-op
    }

    @ReactMethod
    fun removeListeners(count: Int) {
        // Keep for RN event emitter support - no-op
    }

    override fun onActivityResult(activity: Activity?, requestCode: Int, resultCode: Int, data: Intent?) {
        if (requestCode != REQUEST_CODE_PICK_UPLOAD) return

        val promise = uploadPromise ?: return
        uploadPromise = null

        if (resultCode != Activity.RESULT_OK || data == null) {
            promise.reject("CANCELLED", "User cancelled or no data returned")
            currentUploadUrl = null
            return
        }

        try {
            val uri: Uri? = data.data
            if (uri == null) {
                promise.reject("NO_URI", "No uri returned")
                currentUploadUrl = null
                return
            }

            // gather metadata
            val contentResolver = reactContext.contentResolver
            var name: String? = null
            var size: Long? = null
            try {
                val cursor: Cursor? = contentResolver.query(uri, null, null, null, null)
                cursor?.use {
                    if (it.moveToFirst()) {
                        val nameIndex = it.getColumnIndex(OpenableColumns.DISPLAY_NAME)
                        if (nameIndex != -1) name = it.getString(nameIndex)
                        val sizeIndex = it.getColumnIndex(OpenableColumns.SIZE)
                        if (sizeIndex != -1) size = it.getLong(sizeIndex)
                    }
                }
            } catch (e: Exception) {
                // ignore
            }

            val result = Arguments.createMap()
            result.putString("uri", uri.toString())
            result.putString("name", name)
            if (size != null) result.putDouble("size", size.toDouble())

            // notify JS about picked file
            sendEvent("UploaderPicked", result)

            // start upload in background thread
            val uploadUrl = currentUploadUrl
            currentUploadUrl = null
            if (uploadUrl != null) {
                thread {
                    try {
                        uploadFile(uri, uploadUrl)
                        val done = Arguments.createMap()
                        done.putString("uri", uri.toString())
                        done.putString("status", "success")
                        sendEvent("UploaderCompleted", done)
                    } catch (e: Exception) {
                        val err = Arguments.createMap()
                        err.putString("uri", uri.toString())
                        err.putString("status", "error")
                        err.putString("message", e.message)
                        sendEvent("UploaderCompleted", err)
                    }
                }
            }

            promise.resolve(result)
        } catch (e: Exception) {
            promise.reject("PICK_ERROR", e.message)
            currentUploadUrl = null
        }
    }

    override fun onNewIntent(intent: Intent?) {
        // no-op
    }

    private fun sendEvent(eventName: String, params: Any?) {
        try {
            reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
                .emit(eventName, params)
        } catch (e: Exception) {
            // ignore
        }
    }

    private fun uploadFile(uri: Uri, uploadUrl: String) {
        val resolver = reactContext.contentResolver
        var input: InputStream? = null
        var connection: HttpURLConnection? = null
        try {
            input = resolver.openInputStream(uri)
            // attempt to get size
            var totalBytes: Long = -1
            try {
                val afd = resolver.openAssetFileDescriptor(uri, "r")
                if (afd != null) {
                    totalBytes = afd.length
                    try { afd.close() } catch (_: Exception) {}
                }
            } catch (_: Exception) {}

            val url = URL(uploadUrl)
            connection = (url.openConnection() as HttpURLConnection).apply {
                doOutput = true
                requestMethod = "POST"
                connectTimeout = 30000
                readTimeout = 30000
                // if we know length, set fixed length, else use chunked
                if (totalBytes > 0) {
                    setFixedLengthStreamingMode(totalBytes)
                } else {
                    setChunkedStreamingMode(8 * 1024)
                }
                setRequestProperty("Connection", "Keep-Alive")
                setRequestProperty("Content-Type", "application/octet-stream")
                connect()
            }

            val out = DataOutputStream(connection.outputStream)
            val buffer = ByteArray(8 * 1024)
            var uploaded: Long = 0
            var read: Int
            val bis = BufferedInputStream(input)
            while (bis.read(buffer).also { read = it } != -1) {
                out.write(buffer, 0, read)
                uploaded += read.toLong()
                // emit progress
                if (totalBytes > 0) {
                    val percent = (uploaded * 100 / totalBytes).toInt()
                    val m = Arguments.createMap()
                    m.putString("uri", uri.toString())
                    m.putInt("progress", percent)
                    m.putDouble("total", totalBytes.toDouble())
                    sendEvent("UploadProgress", m)
                } else {
                    // unknown total, emit uploaded bytes
                    val m = Arguments.createMap()
                    m.putString("uri", uri.toString())
                    m.putDouble("uploaded", uploaded.toDouble())
                    sendEvent("UploadProgress", m)
                }
            }
            out.flush()
            out.close()
            bis.close()

            val responseCode = connection.responseCode
            val responseMessage = connection.responseMessage
            val m = Arguments.createMap()
            m.putString("uri", uri.toString())
            m.putInt("responseCode", responseCode)
            m.putString("responseMessage", responseMessage)
            sendEvent("UploadResponse", m)

        } finally {
            try { input?.close() } catch (_: Exception) {}
            try { connection?.disconnect() } catch (_: Exception) {}
        }
    }
}
