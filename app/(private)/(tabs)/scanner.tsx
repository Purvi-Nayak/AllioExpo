import { CameraView, useCameraPermissions } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import { useEffect, useRef, useState } from "react";
import {
  AppState,
  Linking,
  Platform,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { Overlay } from "@/components/Overlay";
import { showError } from "@/utils/toastConfig";
import { useRouter } from "expo-router";

const ALLOWED_EXTS = ["png", "jpg", "jpeg", "webp", "gif", "bmp"];
const QR_API_URL = "https://api.qrserver.com/v1/read-qr-code/";

export default function HomeScreen() {
  const isWeb = Platform.OS === "web";
  const [permission, requestPermission] = useCameraPermissions();
  const [requesting, setRequesting] = useState(false);
  const qrLock = useRef(false);
  const appState = useRef(AppState.currentState);
  const router = useRouter();

  // Reset lock when app resumes
  useEffect(() => {
    const subscription = AppState.addEventListener("change", (next) => {
      if (appState.current.match(/inactive|background/) && next === "active") {
        qrLock.current = false;
      }
      appState.current = next;
    });
    return () => subscription.remove();
  }, []);

  // Auto-request camera permission on mobile if undetermined
  useEffect(() => {
    if (!isWeb && permission?.status === "undetermined") {
      (async () => {
        setRequesting(true);
        try {
          await requestPermission();
        } finally {
          setRequesting(false);
        }
      })();
    }
  }, [permission, requestPermission, isWeb]);

  // helper to validate simple email
  const isEmail = (value: string) =>
    typeof value === "string" &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

  const handleDecodedResult = async (decoded: string | null) => {
    if (!decoded) {
      showError("No data found in QR code");
      return;
    }

    if (isEmail(decoded)) {
      router.push({
        pathname: "/(private)/profile",
        params: { userEmail: decoded },
      });
      return;
    }

    // fallback: open as external link
    if (Platform.OS === "web" && typeof window !== "undefined") {
      window.open(decoded, "_blank", "noopener,noreferrer");
    } else {
      Linking.openURL(decoded).catch(() =>
        showError("Could not open link: " + decoded)
      );
    }
  };

  const decodeQRCodeFromImage = async (uri: string): Promise<string | null> => {
    try {
      const res = await fetch(uri);
      const blob = await res.blob();
      if (!blob.type?.startsWith("image/")) return null;

      const extFromUri = uri.split(".").pop()?.split("?")[0]?.toLowerCase();
      const ext =
        extFromUri && ALLOWED_EXTS.includes(extFromUri)
          ? extFromUri
          : blob.type.split("/")[1] || "jpg";

      const form = new FormData();
      // @ts-ignore
      form.append("file", blob, `qr.${ext}`);

      const api = await fetch(QR_API_URL, { method: "POST", body: form });
      const json = await api.json();
      return json?.[0]?.symbol?.[0]?.data ?? null;
    } catch (err) {
      console.error("decode error", err);
      return null;
    }
  };

  const pickImage = async () => {
    if (!isWeb) {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        showError("Media library permission is required to upload an image.");
        return null;
      }
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 1,
    });

    if ((result as any).canceled ?? (result as any).cancelled) return null;
    return (result as any).assets?.[0]?.uri ?? (result as any).uri ?? null;
  };

  const handlePickImageAndDecode = async () => {
    try {
      const uri = await pickImage();
      if (!uri) return;

      const decoded = await decodeQRCodeFromImage(uri);
      if (!decoded) {
        showError("No QR code found in the selected image.");
        return;
      }
      await handleDecodedResult(decoded);
    } catch (err) {
      console.error(err);
      showError("There was an error processing the image. Please try again.");
    }
  };

  const renderPermissionScreen = () => {
    const denied = permission?.status === "denied";
    return (
      <SafeAreaView style={styles.container}>
        <Text style={{ marginBottom: 12, textAlign: "center" }}>
          {denied
            ? "Camera permission was denied. Enable it in settings or upload a QR image."
            : "Camera access is required to scan QR codes. Grant permission or upload a QR image."}
        </Text>

        <View style={{ gap: 12 }}>
          {!denied && (
            <Pressable
              onPress={async () => {
                setRequesting(true);
                await requestPermission();
                setRequesting(false);
              }}
              style={styles.actionButton}
            >
              <Text>
                {requesting ? "Requesting…" : "Request Camera Permission"}
              </Text>
            </Pressable>
          )}

          {denied && (
            <Pressable
              onPress={Linking.openSettings}
              style={styles.actionButton}
            >
              <Text>Open Settings</Text>
            </Pressable>
          )}

          <Pressable
            onPress={handlePickImageAndDecode}
            style={styles.actionButton}
          >
            <Text>Upload QR Image</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  };

  if (isWeb) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={{ marginBottom: 12 }}>
          Upload an image containing a QR code
        </Text>
        <Pressable
          onPress={handlePickImageAndDecode}
          style={styles.actionButton}
        >
          <Text>Upload QR Image</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  if (!permission) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Checking camera permissions…</Text>
      </SafeAreaView>
    );
  }

  if (!permission.granted) return renderPermissionScreen();

  return (
    <SafeAreaView style={styles.container}>
      <Text>QR Code Scanner</Text>
      <Text style={{ marginTop: 20 }}>
        Point the camera at a QR code to scan
      </Text>

      <CameraView
        style={StyleSheet.absoluteFillObject}
        facing="back"
        onBarcodeScanned={({ data }) => {
          if (data && !qrLock.current) {
            qrLock.current = true;
            setTimeout(() => handleDecodedResult(data), 500);
          }
        }}
      />

      <Overlay />

      <View style={styles.cameraButtonsContainer} pointerEvents="box-none">
        <Pressable
          onPress={handlePickImageAndDecode}
          style={styles.uploadButton}
        >
          <Text style={styles.uploadButtonText}>Upload QR Image</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  cameraButtonsContainer: {
    position: "absolute",
    bottom: 40,
    left: 0,
    right: 0,
    alignItems: "center",
    zIndex: 10000,
  },
  uploadButton: {
    backgroundColor: "rgba(255,255,255,0.9)",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  uploadButtonText: {
    color: "#000",
    fontWeight: "600",
  },
  actionButton: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    alignItems: "center",
  },
});
