package com.allioexpo.rotation

import android.hardware.Sensor
import android.hardware.SensorEvent
import android.hardware.SensorEventListener
import android.hardware.SensorManager
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.modules.core.DeviceEventManagerModule
import kotlin.math.abs
import kotlin.math.max
import kotlin.math.min

/**
 * RotationModule
 * - Listens to device rotation vector sensor and emits `RotationChanged` events to JS.
 * - Event payload includes roll/pitch in degrees and normalized percents for X/Y movement.
 */
class RotationModule(private val reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext), SensorEventListener {

    companion object {
        const val NAME = "RotationSensor"
        const val DEFAULT_MAX_ANGLE_DEG = 30.0f // angle that maps to full (100%) movement
        const val DEFAULT_INTERVAL_MS = 50L
    }

    private val sensorManager: SensorManager = reactContext.getSystemService(ReactApplicationContext.SENSOR_SERVICE) as SensorManager
    private val rotationSensor: Sensor? = sensorManager.getDefaultSensor(Sensor.TYPE_ROTATION_VECTOR)

    @Volatile
    private var listening = false
    private var lastEmitMs = 0L
    private var intervalMs = DEFAULT_INTERVAL_MS
    private var maxAngleDeg = DEFAULT_MAX_ANGLE_DEG

    override fun getName(): String {
        return NAME
    }

    @ReactMethod
    fun addListener(eventName: String) {
        // no-op for RN's NativeEventEmitter compatibility
    }

    @ReactMethod
    fun removeListeners(count: Int) {
        // no-op for RN's NativeEventEmitter compatibility
    }

    @ReactMethod
    fun startListening(maxAngle: Double?, interval: Int?) {
        maxAngleDeg = (maxAngle ?: DEFAULT_MAX_ANGLE_DEG.toDouble()).toFloat()
        intervalMs = (interval ?: DEFAULT_INTERVAL_MS.toInt()).toLong()
        if (listening) return
        rotationSensor?.let {
            listening = sensorManager.registerListener(this, it, SensorManager.SENSOR_DELAY_GAME)
        }
    }

    @ReactMethod
    fun stopListening() {
        if (!listening) return
        sensorManager.unregisterListener(this)
        listening = false
    }

    override fun onAccuracyChanged(sensor: Sensor?, accuracy: Int) {
        // ignore
    }

    override fun onSensorChanged(event: SensorEvent?) {
        if (event == null) return
        val now = System.currentTimeMillis()
        if (now - lastEmitMs < intervalMs) return
        lastEmitMs = now

        try {
            // Compute rotation matrix and orientation angles (radians)
            val rotationMatrix = FloatArray(9)
            SensorManager.getRotationMatrixFromVector(rotationMatrix, event.values)
            val orientation = FloatArray(3)
            SensorManager.getOrientation(rotationMatrix, orientation)

            val azimuth = orientation[0]
            val pitch = orientation[1]
            val roll = orientation[2]

            val pitchDeg = Math.toDegrees(pitch.toDouble()).toFloat()
            val rollDeg = Math.toDegrees(roll.toDouble()).toFloat()

            // Normalize to percent based on maxAngleDeg
            val normRoll = (rollDeg / maxAngleDeg).coerceIn(-1f, 1f)
            val normPitch = (pitchDeg / maxAngleDeg).coerceIn(-1f, 1f)

            val percentX = (normRoll * 100f)
            val percentY = (normPitch * 100f)

            val sideX = when {
                percentX > 5f -> "right"
                percentX < -5f -> "left"
                else -> "center"
            }
            val sideY = when {
                percentY > 5f -> "down"
                percentY < -5f -> "up"
                else -> "center"
            }

            val m = Arguments.createMap()
            m.putDouble("roll", roll.toDouble())
            m.putDouble("pitch", pitch.toDouble())
            m.putDouble("rollDeg", rollDeg.toDouble())
            m.putDouble("pitchDeg", pitchDeg.toDouble())
            m.putDouble("percentX", percentX.toDouble())
            m.putDouble("percentY", percentY.toDouble())
            m.putString("sideX", sideX)
            m.putString("sideY", sideY)

            sendEvent("RotationChanged", m)
        } catch (e: Exception) {
            // ignore any sensor conversion errors
        }
    }

    private fun sendEvent(eventName: String, params: Any?) {
        try {
            reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
                .emit(eventName, params)
        } catch (e: Exception) {
            // ignore
        }
    }
}
