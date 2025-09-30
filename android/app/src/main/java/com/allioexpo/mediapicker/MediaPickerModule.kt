package com.allioexpo.mediapicker

import android.app.Activity
import android.content.Intent
import android.graphics.BitmapFactory
import android.net.Uri
import android.provider.MediaStore
import com.facebook.react.bridge.ActivityEventListener
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.WritableMap
import java.io.InputStream

class MediaPickerModule(private val reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext), ActivityEventListener {

    companion object {
        const val REQUEST_CODE_PICK = 12345
    }

    private var pickerPromise: Promise? = null

    init {
        reactContext.addActivityEventListener(this)
    }

    override fun getName(): String {
        return "MediaPicker"
    }

    @ReactMethod
    fun pickMedia(promise: Promise) {
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
            val intent = Intent(Intent.ACTION_PICK).apply {
                type = "*/*"
                putExtra(Intent.EXTRA_MIME_TYPES, arrayOf("image/*", "video/*"))
            }
            val chooser = Intent.createChooser(intent, "Select media")
            activity.startActivityForResult(chooser, REQUEST_CODE_PICK)
        } catch (e: Exception) {
            pickerPromise = null
            promise.reject("INTENT_ERROR", e.message)
        }
    }

    override fun onActivityResult(activity: Activity?, requestCode: Int, resultCode: Int, data: Intent?) {
        if (requestCode != REQUEST_CODE_PICK) return

        val promise = pickerPromise ?: return
        pickerPromise = null

        if (resultCode != Activity.RESULT_OK || data == null) {
            promise.reject("CANCELLED", "User cancelled or no data returned")
            return
        }

        try {
            val uri: Uri? = data.data
            if (uri == null) {
                promise.reject("NO_URI", "No media uri returned")
                return
            }

            val contentResolver = reactContext.contentResolver
            val mimeType = contentResolver.getType(uri)

            val result: WritableMap = Arguments.createMap()
            result.putString("uri", uri.toString())
            result.putString("mime", mimeType)

            if (mimeType != null && mimeType.startsWith("image")) {
                // image metadata
                try {
                    val options = BitmapFactory.Options()
                    options.inJustDecodeBounds = true
                    var input: InputStream? = null
                    try {
                        input = contentResolver.openInputStream(uri)
                        BitmapFactory.decodeStream(input, null, options)
                    } finally {
                        input?.close()
                    }
                    result.putInt("width", options.outWidth)
                    result.putInt("height", options.outHeight)
                } catch (_: Exception) {}
                result.putString("type", "image")
            } else if (mimeType != null && mimeType.startsWith("video")) {
                // no file copy, just basic info
                result.putString("type", "video")
            } else {
                result.putString("type", "unknown")
            }

            promise.resolve(result)
        } catch (e: Exception) {
            promise.reject("PICK_ERROR", e.message)
        }
    }

    override fun onNewIntent(intent: Intent?) {
        // no-op
    }
}
