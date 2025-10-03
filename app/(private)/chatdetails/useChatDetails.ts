import { HomeNavigationProp } from "@/types/navigation";
import { useUserCard } from "@components/cards/UserCard/useUserCard";
import firestore, {
  addDoc,
  collection,
  deleteField,
  doc,
  getDoc,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  where,
} from "@react-native-firebase/firestore";
import { useNavigation } from "@react-navigation/native";
import { formatLastSeen, getAllUsers } from "@utils/helper";
import { showError, showSuccess } from "@utils/toastConfig";
import { useCallback, useEffect, useRef, useState } from "react";
import { ScrollView, VirtualizedList } from "react-native";
import { useSelector } from "react-redux";

type ChatMsg = {
  id: string;
  text?: string;
  image?: string | null;
  video?: string | null;
  fromMe: boolean;
  timestamp?: any;
  location?: { latitude: number; longitude: number } | null;
  liveShare?: { id: string; active: boolean } | null;
  deletedFor?: { [email: string]: boolean };
  edited?: boolean;
};

type LatLng = { latitude: number; longitude: number };

export const useChatDetails = (
  targetUser: { email?: string },
  deeplinkEmail?: string
) => {
  const data = useSelector((state) => state?.userData);
  const myEmail = data?.data?.email;

  const {
    relationStatus,
    handleSend: sendRequest,
    handleAccept: acceptRequest,
    handleReject: rejectRequest,
  } = useUserCard(myEmail, targetUser?.email, targetUser);

  const navigation = useNavigation<HomeNavigationProp>();

  const [imageModalVisible, setImageModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [videoModalVisible, setVideoModalVisible] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);

  const [isBlockedByMe, setIsBlockedByMe] = useState<boolean>(false);
  const [isBlockedByThem, setIsBlockedByThem] = useState<boolean>(false);
  const [clearTime, setClearTime] = useState<any>(null);

  const [themeModalVisible, setThemeModalVisible] = useState<boolean>(false);
  const [loding, setloding] = useState<boolean>(false);
  const [selectedTheme, setSelectedTheme] = useState<string | null>(null);
  const [selecturl, setselecturl] = useState<string | null>(null);
  const [selectedThemeKey, setSelectedThemeKey] = useState<string | null>(null);

  const [menuVisible, setMenuVisible] = useState<boolean>(false);

  // Location UI & state
  const [locationFullVisible, setLocationFullVisible] =
    useState<boolean>(false);
  const [locationPromptVisible, setLocationPromptVisible] =
    useState<boolean>(false);
  const [currentCoords, setCurrentCoords] = useState<LatLng | null>(null);
  const [liveDurationMin, setLiveDurationMin] = useState<number>(15);

  const [chatHistory, setChatHistory] = useState<ChatMsg[]>([]);

  const [liveShareIdMine, setLiveShareIdMine] = useState<string | null>(null);
  const [isLiveSharingMine, setIsLiveSharingMine] = useState<boolean>(false);
  const liveWatchId = useRef<number | null>(null);
  const liveEndTimer = useRef<NodeJS.Timeout | null>(null);

  const scrollViewRef = useRef<ScrollView | null>(null);
  const virtualListRef = useRef<VirtualizedList<any> | null>(null);
  const [loadingMessages, setLoadingMessages] = useState<boolean>(false);

  const [selectedMessages, setSelectedMessages] = useState<string[]>([]);
  const [actionModalVisible, setActionModalVisible] = useState<boolean>(false);

  const [replyToMsg, setReplyToMsg] = useState<ChatMsg | null>(null);
  const [pinnedMsg, setPinnedMsg] = useState<string | null>(null);

  const [actionMsgId, setActionMsgId] = useState<string | null>(null);
  const [editModalVisible, setEditModalVisible] = useState<boolean>(false);
  const [editText, setEditText] = useState<string>("");

  const [editMsgId, setEditMsgId] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [highlightedMsgId, setHighlightedMsgId] = useState<string | null>(null);

  const [lastSeen, setLastSeen] = useState<string>("");
  const [isOnline, setIsOnline] = useState<boolean>(false);

  const [allThemes, setAllThemes] = useState<
    { fileKey: string; url: string }[]
  >([]);

  const isAutoScroll = useRef(true);

  const scrollToBottom = useCallback(
    (animated = true) => {
      const count = chatHistory.length;
      if (count === 0) return;

      const scroll = () => {
        try {
          (virtualListRef.current as any)?.scrollToIndex?.({
            index: count - 1,
            animated,
          });
        } catch {
          scrollViewRef.current?.scrollToEnd?.({ animated });
        }
      };

      if (virtualListRef.current || scrollViewRef.current) {
        requestAnimationFrame(scroll);
      }
    },
    [chatHistory.length]
  );

  const handleScroll = useCallback((e: any) => {
    const { layoutMeasurement, contentOffset, contentSize } = e.nativeEvent;
    const paddingToBottom = 20;
    const isBottom =
      layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom;
    isAutoScroll.current = isBottom;
  }, []);

  const openImageModal = useCallback((imageUrl: string) => {
    setSelectedImage(imageUrl);
    setImageModalVisible(true);
  }, []);

  const closeImageModal = useCallback(() => {
    setImageModalVisible(false);
    setSelectedImage(null);
  }, []);

  const openVideoModal = useCallback((videoUri: string) => {
    setSelectedVideo(videoUri);
    setVideoModalVisible(true);
  }, []);

  const closeVideoModal = useCallback(() => {
    setSelectedVideo(null);
    setVideoModalVisible(false);
  }, []);

  // Normalize and detect self chat
  const myNorm = (myEmail || "").trim().toLowerCase();
  const otherNorm = ((targetUser?.email as string) || "").trim().toLowerCase();
  const isSelf = !!myNorm && myNorm === otherNorm;

  // Firestore paths - Updated to v22+ modular approach
  const relationId = (() => {
    if (!myNorm || !otherNorm) {
      return null;
    }
    return `${myNorm}_${otherNorm}`;
  })();

  useEffect(() => {
    if (!myEmail || !targetUser?.email || !relationId) {
      return;
    }

    // Updated to use modular syntax
    const db = firestore();
    const relationRef = doc(db, "relation", relationId);

    // Relation listener
    const unsubRelation = onSnapshot(relationRef, (docSnap) => {
      const data = docSnap.data();
      if (data) {
        setIsBlockedByMe(data[`block_${myEmail}`] || false);
        setIsBlockedByThem(data[`block_${targetUser.email}`] || false);
        setClearTime(data[`clearTime_${myEmail}`] || null);
      }
    });

    const messagesQuery = query(
      collection(relationRef, "messages"),
      orderBy("timestamp", "asc")
    );

    const unsubMessages = onSnapshot(messagesQuery, (snapshot) => {
      const msgs: ChatMsg[] = snapshot.docs
        .map((docSnap) => {
          const d = docSnap.data() || {};
          return {
            id: docSnap.id,
            text: d.text || "",
            image: d.image || null,
            video: d.video || null,
            location: d.location || null,
            liveShare: d.liveShare || null,
            fromMe: d.from === myEmail,
            timestamp: d.timestamp,
            deletedFor: d.deletedFor || {},
            edited: d.edited || false,
          } as ChatMsg;
        })
        .filter((msg) => {
          if (msg.deletedFor && msg.deletedFor[myEmail]) return false;
          if (!clearTime) return true;
          return msg.timestamp?.toDate?.() > clearTime.toDate?.();
        });

      setChatHistory(msgs);
      setLoadingMessages(false);
    });

    return () => {
      unsubRelation();
      unsubMessages();
    };
  }, [myEmail, targetUser?.email, relationId, clearTime]);

  useEffect(() => {
    const db = firestore();
    const themeImagesRef = collection(db, "themeImages");

    const unsub = onSnapshot(themeImagesRef, (snapshot) => {
      const themes = snapshot.docs.map((docSnap) => docSnap.data()) as {
        fileKey: string;
        url: string;
      }[];
      setAllThemes(themes);
    });

    return () => unsub();
  }, []);

  useEffect(() => {
    if (!targetUser?.email) {
      return;
    }

    let intervalId: number | null = null;

    const fetchTargetUser = async () => {
      try {
        const allUsers = await getAllUsers(myEmail);
        const target = allUsers.find((u) => u.email === targetUser.email);

        if (target) {
          if (target.lastSeen) {
            const lastSeenDate = target.lastSeen.toDate
              ? target.lastSeen.toDate()
              : new Date(target.lastSeen);
            setLastSeen(formatLastSeen(lastSeenDate));
          }

          if (typeof target.online === "boolean") {
            setIsOnline(target.online);
          }
        }
      } catch {
        // ignore
      }
    };

    fetchTargetUser();
    intervalId = setInterval(fetchTargetUser, 30000);

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [myEmail, targetUser.email]);

  const handleSendMessage = useCallback(async () => {
    if (!message.trim() || !relationId) {
      return;
    }

    try {
      const timestamp = serverTimestamp();
      const db = firestore();
      const relationRef = doc(db, "relation", relationId);
      const docSnapshot = await getDoc(relationRef);

      if (!docSnapshot.exists()) {
        await setDoc(relationRef, {
          from: myNorm,
          to: otherNorm,
          isAccept: true,
          timestamp,
        });
      } else if (docSnapshot.exists() && !docSnapshot.data()?.isAccept) {
        await setDoc(
          relationRef,
          {
            isAccept: true,
            from: myNorm,
            to: otherNorm,
          },
          { merge: true }
        );
      }

      const messagesRef = collection(relationRef, "messages");
      await addDoc(messagesRef, {
        text: message.trim(),
        from: myEmail,
        to: targetUser?.email,
        timestamp,
      });

      setMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  }, [message, relationId, myNorm, otherNorm, myEmail, targetUser?.email]);

  const blockUser = useCallback(async () => {
    if (!relationId) return;
    const db = firestore();
    const relationRef = doc(db, "relation", relationId);

    await setDoc(relationRef, { [`block_${myEmail}`]: true }, { merge: true });
    setIsBlockedByMe(true);
    showSuccess("User blocked");
  }, [relationId, myEmail]);

  const unblockUser = useCallback(async () => {
    if (!relationId) return;
    const db = firestore();
    const relationRef = doc(db, "relation", relationId);

    await setDoc(relationRef, { [`block_${myEmail}`]: false }, { merge: true });
    setIsBlockedByMe(false);
    showSuccess("User unblocked");
  }, [relationId, myEmail]);

  const clearChat = useCallback(async () => {
    try {
      if (!relationId) return;
      const now = new Date();
      const db = firestore();
      const relationRef = doc(db, "relation", relationId);

      await setDoc(
        relationRef,
        { [`clearTime_${myEmail}`]: serverTimestamp() },
        { merge: true }
      );
      setClearTime({ toDate: () => now });
      showSuccess("Chat cleared from your side");
    } catch (error) {
      console.error("Clear chat failed:", error);
      showError("Failed to clear chat");
    }
  }, [relationId, myEmail]);

  const selectTheme = useCallback(
    async (fileKey: string | null) => {
      if (!relationId || !fileKey) return;
      setloding(true);

      try {
        const db = firestore();
        const themeQuery = query(
          collection(db, "themeImages"),
          where("fileKey", "==", fileKey),
          limit(1)
        );

        const querySnapshot = await getDocs(themeQuery);

        if (querySnapshot.empty) {
          showError("Theme not found");
          return;
        }

        const themeData = querySnapshot.docs[0].data();
        const themeUrl = themeData.url;

        const relationRef = doc(db, "relation", relationId);
        await setDoc(
          relationRef,
          {
            themeUrl,
            themeKey: fileKey,
            updatedAt: new Date(),
          },
          { merge: true }
        );

        setSelectedTheme(themeUrl);
        setSelectedThemeKey(fileKey);
        setThemeModalVisible(false);
        showSuccess("Theme applied successfully!");
      } catch (err) {
        console.error(err);
        showError("Failed to apply theme");
      } finally {
        setloding(false);
      }
    },
    [relationId]
  );

  const removeTheme = useCallback(async () => {
    try {
      if (!relationId) return;
      const db = firestore();
      const relationRef = doc(db, "relation", relationId);

      await setDoc(
        relationRef,
        {
          themeUrl: deleteField(),
          themeKey: deleteField(),
        },
        { merge: true }
      );

      setSelectedTheme(null);
      setSelectedThemeKey(null);
      setselecturl(null);

      showSuccess("Theme removed, default background applied");
    } catch (err) {
      console.error(err);
      showError("Failed to remove theme");
    } finally {
      setThemeModalVisible(false);
    }
  }, [relationId]);

  const navigateToProfile = useCallback(() => {
    // Navigate to profile screen - this will be implemented later
    console.log("Navigate to profile:", targetUser?.email);
  }, [targetUser?.email]);

  const openMenu = useCallback(() => setMenuVisible(true), []);

  const handleGoBack = useCallback(() => {
    if (deeplinkEmail) {
      navigation.navigate("(tabs)" as never);
    } else {
      navigation.goBack();
    }
  }, [navigation, deeplinkEmail]);

  // Mock functions for location features
  const askLocationPermission = useCallback(async (): Promise<boolean> => {
    return true;
  }, []);

  const ensureLocationReady = useCallback(async (): Promise<boolean> => {
    return true;
  }, []);

  const openLocationFullModal = () => setLocationFullVisible(true);
  const closeLocationFullModal = () => setLocationFullVisible(false);
  const dismissLocationPrompt = () => setLocationPromptVisible(false);
  const openSystemLocationSettings = () => {};
  const retryLocationPreparation = async () => {};
  const shareCurrentLocation = async () => {};
  const startLiveLocationShare = async () => {};
  const stopLiveLocationShare = async () => {};
  const openInGoogleMaps = () => {};
  // const setLiveDurationMin = () => {};
  // const liveDurationMin = 15;

  // Mock functions for message actions
  const toggleSelectMessage = useCallback((msgId: string) => {
    setSelectedMessages((prev) =>
      prev.includes(msgId)
        ? prev.filter((id) => id !== msgId)
        : [...prev, msgId]
    );
  }, []);

  const clearSelectedMessages = useCallback(() => setSelectedMessages([]), []);
  const openActionModal = useCallback(() => setActionModalVisible(true), []);
  const closeActionModal = useCallback(() => setActionModalVisible(false), []);
  const deleteMessagesForMe = async () => {};
  const deleteMessagesForEveryone = async () => {};
  const pinMessage = async () => {};
  const handleEditMessage = async () => {};

  // VirtualizedList helpers
  const listHelpers = {
    getItem: (data: ChatMsg[] | null | undefined, index: number) =>
      data ? data[index] : null,
    getItemCount: (data: ChatMsg[] | null | undefined) =>
      data ? data.length : 0,
    keyExtractor: (item: ChatMsg | null | undefined) =>
      item?.id ?? String(Math.random()),
  };

  const scrollToMessage = useCallback(
    (msgId: string) => {
      const idx = chatHistory.findIndex((m) => m.id === msgId);
      if (idx === -1) return;

      const scroll = () => {
        try {
          (virtualListRef.current as any)?.scrollToIndex?.({
            index: idx,
            animated: true,
          });
        } catch {
          scrollViewRef.current?.scrollTo?.({
            y: Math.max(0, idx - 1) * 100,
            animated: true,
          });
        }
      };

      if (virtualListRef.current || scrollViewRef.current) {
        requestAnimationFrame(scroll);
      }
    },
    [chatHistory]
  );

  const states = {
    message,
    setMessage,
    chatHistory,
    scrollViewRef,
    imageModalVisible,
    selectedImage,
    videoModalVisible,
    selectedVideo,
    isBlockedByMe,
    isBlockedByThem,
    themeModalVisible,
    selectedTheme,
    setselecturl,
    selecturl,
    loding,
    loadingMessages,
    selectedThemeKey,
    menuVisible,
    selectedMessages,
    locationFullVisible,
    locationPromptVisible,
    currentCoords,
    isLiveSharingMine,
    setLocationPromptVisible,
    editModalVisible,
    editText,
    actionMsgId,
    pinnedMsg,
    isEditing,
    highlightedMsgId,
    setHighlightedMsgId,
    unblockUserInline: () => unblockUser(),
  };

  return {
    states,
    relationStatus,
    sendRequest: async () => {
      try {
        await sendRequest();
        showSuccess("Friend request sent");
      } catch {
        showError("Send request failed");
      }
    },
    acceptRequest: async () => {
      try {
        await acceptRequest();
        showSuccess("Request accepted");
      } catch {
        showError("Accept failed");
      }
    },
    rejectRequest: async () => {
      try {
        await rejectRequest();
        showSuccess("Request rejected");
      } catch {
        showError("Reject failed");
      }
    },
    sendMessage: handleSendMessage,
    chatHistory,
    handleScroll,
    selectedImage,
    openImageModal,
    closeImageModal,
    selectedVideo,
    openVideoModal,
    closeVideoModal,
    blockUser,
    unblockUser,
    clearChat,
    setThemeModalVisible,
    selectedTheme,
    selectTheme,
    setselecturl,
    navigateToProfile,
    removeTheme,
    setMenuVisible,
    openLocationFullModal,
    closeLocationFullModal,
    ensureLocationReady,
    shareCurrentLocation,
    startLiveLocationShare,
    stopLiveLocationShare,
    isLiveSharingMine,
    openInGoogleMaps,
    liveDurationMin,
    setLiveDurationMin,
    openMenu,
    openSystemLocationSettings,
    retryLocationPreparation,
    dismissLocationPrompt,
    selectedMessages,
    toggleSelectMessage,
    clearSelectedMessages,
    actionModalVisible,
    openActionModal,
    closeActionModal,
    deleteMessagesForMe,
    deleteMessagesForEveryone,
    pinMessage,
    replyToMsg,
    handleEditMessage,
    setEditText,
    setEditModalVisible,
    setActionMsgId,
    setIsEditing,
    setEditMsgId,
    lastSeen,
    isOnline,
    allThemes,
    handleGoBack,
    isSelf,
    // VirtualizedList support
    virtualListRef,
    listHelpers,
    scrollToMessage,
    scrollToBottom,
  };
};
