import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Button,
  DeviceEventEmitter,
  Dimensions,
  NativeModules,
  StyleSheet,
  Text,
  View,
} from "react-native";

const { RotationSensor } = NativeModules as any;

// Hook to subscribe to native RotationSensor and provide latest values
function useRotation({ maxAngle = 30, interval = 50 } = {}) {
  const [values, setValues] = useState({
    percentX: 0,
    percentY: 0,
    rollDeg: 0,
    pitchDeg: 0,
    sideX: "center",
    sideY: "center",
  });

  useEffect(() => {
    // start native sensor if available
    try {
      if (
        RotationSensor &&
        typeof RotationSensor.startListening === "function"
      ) {
        RotationSensor.startListening(maxAngle, interval);
      }
    } catch (_e) {}

    const sub = DeviceEventEmitter.addListener("RotationChanged", (e: any) => {
      if (!e) return;
      setValues({
        percentX:
          typeof e.percentX === "number"
            ? Math.max(-100, Math.min(100, e.percentX))
            : 0,
        percentY:
          typeof e.percentY === "number"
            ? Math.max(-100, Math.min(100, e.percentY))
            : 0,
        rollDeg: typeof e.rollDeg === "number" ? e.rollDeg : 0,
        pitchDeg: typeof e.pitchDeg === "number" ? e.pitchDeg : 0,
        sideX: typeof e.sideX === "string" ? e.sideX : "center",
        sideY: typeof e.sideY === "string" ? e.sideY : "center",
      });
    });

    return () => {
      sub.remove();
      try {
        if (
          RotationSensor &&
          typeof RotationSensor.stopListening === "function"
        ) {
          RotationSensor.stopListening();
        }
      } catch (_e) {}
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return values;
}

export default function Chat() {
  const { width, height } = Dimensions.get("window");
  const boxSize = 120;
  // safe margins to keep box fully visible and leave space for controls/info
  const topMargin = 100; // space for top controls/status
  const bottomMargin = 140; // space for bottom info
  const leftMargin = 20;
  const rightMargin = 20;

  // compute maximum translation from screen center while ensuring box edges stay inside screen
  const maxOffsetX = Math.max(
    0,
    (width - boxSize - leftMargin - rightMargin) / 2
  );
  // do not subtract extra offset here — compute symmetric available area from center
  const maxOffsetY = Math.max(
    0,
    (height - boxSize - topMargin - bottomMargin) / 2
  );

  const animXY = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  const animRotate = useRef(new Animated.Value(0)).current;
  const [enabled, setEnabled] = useState(true);

  const { percentX, percentY, rollDeg, pitchDeg, sideX, sideY } = useRotation({
    maxAngle: 30,
    interval: 50,
  });

  // update animation whenever rotation values change
  useEffect(() => {
    // If device is in landscape, swap axes mapping so sliding still feels natural.
    const isLandscape = width > height;

    // Use native percents (clamped in hook) — -100..100
    // Map to pixel offsets. If percent magnitude >= 100 => jump to edge.
    let horizontalPercent = percentX;
    let verticalPercent = percentY;

    if (isLandscape) {
      // In many devices the pitch/roll axes swap in landscape so swap percent mapping.
      // This is a best-effort mapping: horizontal movement uses percentY and vertical uses percentX
      horizontalPercent = percentY;
      verticalPercent = -percentX; // invert to keep intuitive up/down
    }

    // Ensure we respect the direction determined by native side as a safety check
    // If native says sideX is left but percent is positive, flip sign
    if (sideX === "left" && horizontalPercent > 0)
      horizontalPercent = -Math.abs(horizontalPercent);
    if (sideX === "right" && horizontalPercent < 0)
      horizontalPercent = Math.abs(horizontalPercent);
    if (sideY === "up" && verticalPercent > 0)
      verticalPercent = -Math.abs(verticalPercent);
    if (sideY === "down" && verticalPercent < 0)
      verticalPercent = Math.abs(verticalPercent);

    // map percent (-100..100) to pixel offsets and clamp to stage bounds
    const targetXUnclamped = (horizontalPercent / 100) * maxOffsetX;
    const targetYUnclamped = (verticalPercent / 100) * maxOffsetY;

    const targetX = Math.max(
      -maxOffsetX,
      Math.min(maxOffsetX, targetXUnclamped)
    );
    const targetY = Math.max(
      -maxOffsetY,
      Math.min(maxOffsetY, targetYUnclamped)
    );

    // Deadzone threshold: ignore tiny movements to prevent jitter (pixels)
    const MOVE_THRESHOLD = 8; // change to 5..10 as desired

    // Read current animated values (safe access to __getValue)
    const currentX = (animXY.x as any).__getValue
      ? (animXY.x as any).__getValue()
      : 0;
    const currentY = (animXY.y as any).__getValue
      ? (animXY.y as any).__getValue()
      : 0;

    const deltaX = Math.abs(targetX - currentX);
    const deltaY = Math.abs(targetY - currentY);

    // If both axis changes are within the threshold, don't animate
    if (deltaX <= MOVE_THRESHOLD && deltaY <= MOVE_THRESHOLD) {
      return; // skip animation to avoid tiny movements
    }

    Animated.parallel([
      Animated.timing(animXY, {
        toValue: { x: targetX, y: targetY },
        duration: 120,
        useNativeDriver: true,
      }),
      // Animated.timing(animRotate, {
      //   toValue: rollDeg || 0,
      //   duration: 120,
      //   useNativeDriver: true,
      // }),
    ]).start();
  }, [
    percentX,
    percentY,
    rollDeg,
    animXY,
    animRotate,
    maxOffsetX,
    maxOffsetY,
    width,
    height,
    sideX,
    sideY,
  ]);

  // Rotation smoothing: wrap-safe shortest-angle delta, deadzone and exponential smoothing
  const smoothedRollRef = useRef<number>(0);
  useEffect(() => {
    const RAW = rollDeg || 0;
    const current = (animRotate as any).__getValue
      ? (animRotate as any).__getValue()
      : smoothedRollRef.current || 0;

    // compute shortest angular difference between RAW and current (degrees)
    let delta = ((RAW - current + 180) % 360) - 180;

    // deadzone: ignore tiny angle changes
    const ROT_DEADZONE = 3; // degrees
    if (Math.abs(delta) <= ROT_DEADZONE) return;

    // smoothing factor (0..1). Lower -> smoother/slower
    const ALPHA = 0.18;
    const next = current + delta * ALPHA;
    smoothedRollRef.current = next;

    Animated.timing(animRotate, {
      toValue: next,
      duration: 120,
      useNativeDriver: true,
    }).start();
  }, [rollDeg, animRotate]);

  const rotateInterpolate = animRotate.interpolate({
    inputRange: [-180, 180],
    outputRange: ["-180deg", "180deg"],
  });

  return (
    <View style={styles.container}>
      <View style={styles.controls}>
        <Button
          title={enabled ? "Stop" : "Start"}
          onPress={() => {
            setEnabled((s) => {
              const next = !s;
              try {
                if (
                  RotationSensor &&
                  typeof RotationSensor[
                    next ? "startListening" : "stopListening"
                  ] === "function"
                ) {
                  if (next) RotationSensor.startListening(30, 50);
                  else RotationSensor.stopListening();
                }
              } catch (_e) {}
              return next;
            });
          }}
        />
      </View>

      {/* Stage positioned inside safe margins so translations keep the box visible */}
      <View
        style={[
          styles.stage,
          {
            left: leftMargin,
            right: rightMargin,
            top: topMargin,
            bottom: bottomMargin,
          },
        ]}
        pointerEvents="none"
      >
        <Animated.View
          style={[
            styles.box,
            {
              transform: [
                { translateX: animXY.x },
                { translateY: animXY.y },
                { rotate: rotateInterpolate },
              ],
            },
          ]}
        />
      </View>

      <View style={styles.info}>
        <Text>percentX: {percentX.toFixed(1)}%</Text>
        <Text>percentY: {percentY.toFixed(1)}%</Text>
        <Text>sideX: {sideX}</Text>
        <Text>sideY: {sideY}</Text>
        <Text>roll: {rollDeg.toFixed(1)}°</Text>
        <Text>pitch: {pitchDeg.toFixed(1)}°</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  // stretch full screen; stage will be absolutely positioned inside safe margins
  container: { flex: 1 },
  controls: { position: "absolute", top: 40, right: 20 },
  // stage is absolutely positioned within safe margins provided dynamically
  stage: {
    position: "absolute",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  box: {
    width: 120,
    height: 120,
    backgroundColor: "#007aff",
    borderRadius: 8,
    zIndex: 10,
    elevation: 10,
  },
  info: { position: "absolute", bottom: 40, alignItems: "center" },
});
