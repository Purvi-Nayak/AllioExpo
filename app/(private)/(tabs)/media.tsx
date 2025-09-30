import React, { useEffect, useRef, useState } from "react";
import {
  Button,
  Image,
  Linking,
  NativeModules,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { useVideoPlayer, VideoSource, VideoView } from "expo-video";

const { MediaPicker, DocumentPicker, Toast } = NativeModules;

export default function HomeScreen() {
  const [media, setMedia] = useState<any | null>(null);
  const [videoSource, setVideoSource] = useState<VideoSource | null>(null);
  const objectUrlRef = useRef<string | null>(null);

  useEffect(() => {
    if (media && media.type === "video" && media.uri) {
      if (Platform.OS === "web") {
        setVideoSource(null);
      } else {
        setVideoSource(media.uri);
      }
    } else {
      setVideoSource(null);
    }
  }, [media]);

  // cleanup object URL when media changes or on unmount (web)
  useEffect(() => {
    return () => {
      if (objectUrlRef.current) {
        try {
          URL.revokeObjectURL(objectUrlRef.current);
        } catch (_e) {}
        objectUrlRef.current = null;
      }
    };
  }, []);

  const player = useVideoPlayer(videoSource || "", (p: any) => {
    p.play();
  });

  const showToast = (msg: string) => {
    try {
      if (Platform.OS === "web") {
        return window.alert(msg);
      }
      Toast?.showToast?.(msg);
    } catch (_e) {
      if (Platform.OS === "web") window.alert(msg);
    }
  };

  // Web helper to open a file input and return the selected File
  const pickFileWeb = (accept = "*") => {
    return new Promise<File | null>((resolve) => {
      if (Platform.OS !== "web") return resolve(null);
      const input = document.createElement("input");
      input.type = "file";
      if (accept && accept !== "*") input.accept = accept;
      input.onchange = () => {
        const f = input.files && input.files[0] ? input.files[0] : null;
        resolve(f);
        // do not remove immediately to allow browser to handle
      };
      input.click();
    });
  };

  const openPicker = async () => {
    try {
      if (Platform.OS === "web") {
        // accept images and videos
        const file = await pickFileWeb("image/*,video/*");
        if (!file) return;
        const url = URL.createObjectURL(file);
        objectUrlRef.current = url;
        const type = file.type.startsWith("image")
          ? "image"
          : file.type.startsWith("video")
          ? "video"
          : "unknown";
        const res = {
          uri: url,
          type,
          name: file.name,
          size: file.size,
          file,
        };
        setMedia(res);
        showToast("Media picked successfully");
        return;
      }

      const res = await MediaPicker?.pickMedia();
      setMedia(res);
      showToast("Media picked successfully");
    } catch (e) {
      console.warn("Picker error", e);
    }
  };

  const openDocumentPicker = async () => {
    try {
      if (Platform.OS === "web") {
        const file = await pickFileWeb("*");
        if (!file) return;
        const url = URL.createObjectURL(file);
        objectUrlRef.current = url;
        const res = {
          uri: url,
          type: "document",
          name: file.name,
          size: file.size,
          file,
        };
        setMedia(res);
        showToast("Document picked successfully");
        return;
      }

      const res = await DocumentPicker?.pickDocument();
      setMedia(res);
      showToast("Document picked successfully");
    } catch (e) {
      console.warn("Document picker error", e);
    }
  };

  return (
    <View style={styles.container}>
      <Button title="Pick image or video" onPress={openPicker} />
      <View style={{ height: 12 }} />
      <Button title="Pick document" onPress={openDocumentPicker} />

      {media && media.type === "image" && (
        <Image
          source={{ uri: media.uri }}
          style={styles.img}
          resizeMode="contain"
        />
      )}

      {Platform.OS === "web" &&
        media &&
        media.type === "video" &&
        media.uri && (
          // use native <video> element on web
          <video
            src={media.uri}
            controls
            style={{ width: 300, height: 300, marginTop: 20 }}
          />
        )}

      {Platform.OS !== "web" && videoSource && (
        <VideoView player={player} style={styles.img} nativeControls={true} />
      )}

      {media &&
        media.type === "video" &&
        Platform.OS !== "web" &&
        !videoSource && (
          <Text style={{ marginTop: 20 }}>Video selected: {media.uri}</Text>
        )}

      {media && media.type === "document" && (
        <TouchableOpacity
          onPress={() => {
            try {
              if (Platform.OS === "web") {
                // open object URL in new tab
                const u = media.uri;
                if (u) window.open(u, "_blank");
                return;
              }

              DocumentPicker.openFile(media.uri);
            } catch (e) {
              const u = media.uri;
              if (u)
                Linking.openURL(u).catch(() => showToast("Cannot open file"));
            }
          }}
          style={styles.doc}
        >
          <Text>{media.name || "Open document"}</Text>
        </TouchableOpacity>
      )}

      <Text>
        {media
          ? JSON.stringify({ ...media, file: undefined }, null, 2)
          : "No media selected"}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  doc: {
    width: 300,
    padding: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    marginTop: 20,
  },
  img: {
    width: 300,
    height: 300,
    marginTop: 20,
  },
});
