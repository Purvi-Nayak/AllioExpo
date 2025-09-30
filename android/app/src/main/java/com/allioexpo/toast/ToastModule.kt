package com.allioexpo.toast

import android.os.Handler
import android.os.Looper
import android.widget.Toast
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

class ToastModule(private val reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String {
        return "Toast"
    }

    @ReactMethod
    fun showToast(message: String?) {
        val msg = message ?: ""
        Handler(Looper.getMainLooper()).post {
            try {
                Toast.makeText(reactContext.applicationContext, msg, Toast.LENGTH_SHORT).show()
            } catch (e: Exception) {
                // ignore
            }
        }
    }
}
