import React from "react";
import {
  Button,
  DeviceEventEmitter,
  NativeModules,
  Platform,
  StyleSheet,
  Text,
  View,
} from "react-native";

const { FileUploader } = NativeModules;

// Reusable helper: bytes -> human readable string
export const formatBytes = (bytes?: number | null) => {
  if (!bytes || bytes <= 0) return "0 B";
  const k = 1024;
  const units = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${units[i]}`;
};

// Hook that encapsulates native upload interaction + progress animation
function useFileUpload() {
  const [picked, setPicked] = React.useState<any | null>(null);
  const [nativeProgress, setNativeProgress] = React.useState<number | null>(
    null
  ); // percent 0-100 or -1 when unknown
  const [displayedProgress, setDisplayedProgress] = React.useState<number>(0);
  const [uploadedBytes, setUploadedBytes] = React.useState<number | null>(null);

  const displayedRef = React.useRef<number>(0);
  const pickedRef = React.useRef<any | null>(null);
  const animRef = React.useRef<number | null>(null);
  const webIntervalRef = React.useRef<number | null>(null);

  // mirror state to refs where needed
  const setDisplayed = (v: number) => {
    displayedRef.current = v;
    setDisplayedProgress(v);
  };

  const clearAnimation = () => {
    if (animRef.current != null) {
      clearInterval(animRef.current as any);
      animRef.current = null;
    }
  };

  // Animate displayedProgress toward `target` using a duration influenced by file size
  const animateTo = (
    target: number,
    fileSizeBytes?: number | null,
    onComplete?: () => void
  ) => {
    clearAnimation();

    const start = Math.max(0, Math.floor(displayedRef.current));
    const end = Math.max(0, Math.min(100, Math.floor(target)));
    if (end <= start) {
      onComplete?.();
      return;
    }

    const diff = end - start;
    const minDuration = 600; // ms

    // scale duration by file size (MB) with sensible caps
    const sizeMB = (fileSizeBytes || 0) / (1024 * 1024);
    const sizeFactor = 1 + Math.min(4, sizeMB / 5); // 1x..5x

    const duration = Math.max(minDuration, diff * 12 * sizeFactor);
    const stepMs = Math.max(10, Math.floor(duration / diff));

    let current = start;
    setDisplayed(current);

    animRef.current = setInterval(() => {
      current += 1;
      setDisplayed(current);
      if (current >= end) {
        clearAnimation();
        onComplete?.();
      }
    }, stepMs) as unknown as number;
  };

  // Handle native events. Single handler supports multiple payload shapes.
  React.useEffect(() => {
    const handler = (e: any) => {
      if (!e) return;

      // picked metadata event
      if (e.picked || e.fileName || e.name || e.uri) {
        const meta = e.picked || e || {};
        setPicked(meta);
        pickedRef.current = meta;
        return;
      }

      // explicit percent
      if (typeof e.progress === "number" && e.progress >= 0) {
        setNativeProgress(e.progress);
        setUploadedBytes(null);
        animateTo(e.progress, e.total || e.size || pickedRef.current?.size);
        return;
      }

      // uploaded/total bytes
      if (
        typeof e.uploaded === "number" &&
        typeof e.total === "number" &&
        e.total > 0
      ) {
        const pct = Math.floor((e.uploaded / e.total) * 100);
        setNativeProgress(pct);
        setUploadedBytes(e.uploaded);
        animateTo(pct, e.total || pickedRef.current?.size);
        return;
      }

      // unknown total but bytes uploaded
      if (
        typeof e.uploaded === "number" ||
        typeof e.bytesUploaded === "number"
      ) {
        const bytes =
          typeof e.uploaded === "number" ? e.uploaded : e.bytesUploaded;
        setNativeProgress(-1);
        setUploadedBytes(bytes);
        animateTo(
          Math.min(95, displayedRef.current + 8),
          e.total || e.size || pickedRef.current?.size
        );
        return;
      }

      // completion signals: treat as done
      if (e.completed || e.success || e.done) {
        setNativeProgress(100);
        animateTo(100, pickedRef.current?.size, () => {
          setTimeout(() => {
            setNativeProgress(null);
            setDisplayed(0);
          }, 500);
        });
        return;
      }
    };

    // Register a small set of event names commonly used
    const eventNames = [
      "UploaderPicked",
      "UploadProgress",
      "FileUploadProgress",
      "UploaderCompleted",
      "UploadResponse",
    ];
    const subs = eventNames.map((name) =>
      DeviceEventEmitter.addListener(name, handler)
    );

    return () => {
      subs.forEach((s) => s.remove());
      clearAnimation();
      // clear any web simulation interval
      if (webIntervalRef.current != null) {
        clearInterval(webIntervalRef.current as any);
        webIntervalRef.current = null;
      }
    };
  }, []);

  // Web-only file picker helper
  const pickFileWeb = (accept = "*") => {
    return new Promise<File | null>((resolve) => {
      if (Platform.OS !== "web") return resolve(null);
      const input = document.createElement("input");
      input.type = "file";
      if (accept && accept !== "*") input.accept = accept;
      input.onchange = () => {
        const f = input.files && input.files[0] ? input.files[0] : null;
        resolve(f);
      };
      input.click();
    });
  };

  // Public start function that calls the native pick & upload
  const start = async () => {
    // Web path: simulate upload using browser file API
    if (Platform.OS === "web") {
      try {
        const file = await pickFileWeb("*");
        if (!file) return null;

        const meta = {
          uri: URL.createObjectURL(file),
          name: file.name,
          size: file.size,
        };
        setPicked(meta);
        pickedRef.current = meta;

        setNativeProgress(0);
        setDisplayed(0);
        setUploadedBytes(0);

        // simulate upload: duration scales with file size
        const sizeMB = Math.max(0.01, file.size / (1024 * 1024));
        const duration = Math.min(
          60000,
          Math.max(1000, Math.floor(sizeMB * 1200))
        );
        const steps = 20; // number of progress updates
        const stepMs = Math.max(50, Math.floor(duration / steps));
        const bytesPerStep = Math.ceil(file.size / steps);

        let uploaded = 0;
        let step = 0;
        webIntervalRef.current = window.setInterval(() => {
          step += 1;
          uploaded = Math.min(file.size, uploaded + bytesPerStep);
          setUploadedBytes(uploaded);
          const pct = Math.floor((uploaded / file.size) * 100);
          setNativeProgress(pct);
          animateTo(pct, file.size);

          if (uploaded >= file.size || step >= steps) {
            if (webIntervalRef.current != null) {
              clearInterval(webIntervalRef.current as any);
              webIntervalRef.current = null;
            }
            // finalize
            setNativeProgress(100);
            animateTo(100, file.size, () => {
              setTimeout(() => {
                setNativeProgress(null);
                setDisplayed(0);
              }, 500);
            });
          }
        }, stepMs);

        return meta;
      } catch (err) {
        console.warn("web pick/upload error", err);
        return null;
      }
    }

    // native path
    if (!FileUploader || typeof FileUploader.pickAndUpload !== "function") {
      console.warn("FileUploader native module not available");
      return;
    }

    try {
      setNativeProgress(0);
      setDisplayed(0);
      setUploadedBytes(null);
      const res = await FileUploader.pickAndUpload(null, null);
      if (res) {
        setPicked(res);
        pickedRef.current = res;
      }
      return res;
    } catch (err) {
      console.warn("pickAndUpload error", err);
      setNativeProgress(null);
      setDisplayed(0);
      return null;
    }
  };

  return {
    picked,
    nativeProgress,
    displayedProgress,
    uploadedBytes,
    start,
  } as const;
}

export default function HomeScreen() {
  const { picked, nativeProgress, displayedProgress, uploadedBytes, start } =
    useFileUpload();

  return (
    <View style={styles.container}>
      <Button title="Pick & Upload file" onPress={start} />

      {picked && (
        <View style={{ marginTop: 12 }}>
          <Text>Name: {picked.name || picked.fileName}</Text>
          <Text>Size: {formatBytes(picked.size || picked.fileSize)}</Text>
          <Text>URI: {picked.uri || picked.fileUri}</Text>
        </View>
      )}

      {nativeProgress != null && (
        <View style={{ marginTop: 12, width: 300 }}>
          <View style={styles.progressContainer}>
            <View
              style={[
                styles.progressBar,
                { width: `${Math.max(0, Math.min(100, displayedProgress))}%` },
              ]}
            />
          </View>
          <View style={{ marginTop: 8 }}>
            {displayedProgress >= 0 ? (
              <Text>Uploading: {displayedProgress}%</Text>
            ) : (
              <Text>
                Uploading:{" "}
                {uploadedBytes != null
                  ? `${formatBytes(uploadedBytes)} (${uploadedBytes} bytes)`
                  : "..."}
              </Text>
            )}
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  progressContainer: {
    height: 12,
    backgroundColor: "#e6e6e6",
    borderRadius: 6,
    overflow: "hidden",
    width: 300,
  },
  progressBar: { height: 12, backgroundColor: "#007aff" },
});
