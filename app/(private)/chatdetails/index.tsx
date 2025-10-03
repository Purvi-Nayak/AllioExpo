import { ICONS } from "@assets/index";
import {
  Button,
  CustomHeader,
  CustomModal,
  Input,
  Text,
} from "@components/index";
import { useTheme } from "@react-navigation/native";
import { formatDateLabel, formatTime, getUserData } from "@utils/helper";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect } from "react";
import {
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  Modal,
  Platform,
  TouchableOpacity,
  View,
  VirtualizedList,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import { SafeAreaView } from "react-native-safe-area-context";
import Video from "react-native-video";
import useStyle from "./style";
import { useChatDetails } from "./useChatDetails";

const ChatDetailsScreen = () => {
  const styles = useStyle();
  const { colors } = useTheme();
  const params = useLocalSearchParams<{
    user?: string;
    email?: string;
    sharedMediaId?: string;
    mediaUrl?: string;
    type?: string;
  }>();

  // Parse the user data from params
  const incomingUser = params.user ? JSON.parse(params.user) : null;
  const deeplinkEmail = params.email;
  const sharedMediaId = params.sharedMediaId;
  const mediaUrl = params.mediaUrl;
  const type = params.type;

  const initialUser =
    (incomingUser && incomingUser.email && incomingUser) ||
    (deeplinkEmail ? { email: deeplinkEmail } : undefined);

  const [resolvedUser, setResolvedUser] = React.useState<any>(initialUser);

  // Fetch full user profile if missing name or profileImage
  useEffect(() => {
    const load = async () => {
      if (!initialUser?.email) return;
      const needsFetch =
        !initialUser.firstName ||
        initialUser.firstName === "" ||
        initialUser.firstName === undefined ||
        initialUser.profileImage === undefined;
      if (!needsFetch) return;
      try {
        const profile = await getUserData(initialUser.email);
        if (profile) {
          setResolvedUser((prev: any) => ({ ...prev, ...profile }));
        }
      } catch (e) {
        console.warn("ChatDetails getUserData failed", e);
      }
    };
    load();
  }, [initialUser?.email, initialUser?.firstName, initialUser?.profileImage]);

  // use resolvedUser instead of user
  const {
    states,
    relationStatus,
    sendRequest,
    acceptRequest,
    rejectRequest,
    sendMessage,
    handleScroll,
    openImageModal,
    closeImageModal,
    openVideoModal,
    closeVideoModal,
    blockUser,
    clearChat,
    unblockUser,
    setThemeModalVisible,
    selectTheme,
    removeTheme,
    navigateToProfile,
    setMenuVisible,
    openMenu,
    openLocationFullModal,
    closeLocationFullModal,
    ensureLocationReady,
    shareCurrentLocation,
    startLiveLocationShare,
    stopLiveLocationShare,
    // isLiveSharingMine,
    // openInGoogleMaps,
    setLiveDurationMin,
    liveDurationMin,
    dismissLocationPrompt,
    openSystemLocationSettings,
    retryLocationPreparation,
    toggleSelectMessage,
    clearSelectedMessages,
    actionModalVisible,
    openActionModal,
    closeActionModal,
    deleteMessagesForMe,
    deleteMessagesForEveryone,
    pinMessage,
    handleEditMessage,
    setEditText,
    setActionMsgId,
    setIsEditing,
    // setEditMsgId,
    lastSeen,
    isOnline,
    allThemes,
    handleGoBack,
    isSelf,
    virtualListRef,
    listHelpers,
    scrollToMessage,
    scrollToBottom,
  } = useChatDetails(resolvedUser, deeplinkEmail);

  const user = resolvedUser;

  useEffect(() => {
    if (sharedMediaId && mediaUrl) {
      try {
        if (type === "image" && typeof openImageModal === "function") {
          openImageModal(mediaUrl);
        } else if (type === "video" && typeof openVideoModal === "function") {
          openVideoModal(mediaUrl);
        }
      } catch (e) {
        console.warn("Auto-open media failed", e);
      }
    }
  }, [sharedMediaId, mediaUrl, type, openImageModal, openVideoModal]);

  const showImage = user?.profileImage && user?.profileImage.trim() !== "";
  const firstLetter = showImage
    ? ""
    : isSelf
    ? "Y"
    : user?.firstName?.charAt(0)?.toUpperCase() || "?";

  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>User data not found.</Text>
      </SafeAreaView>
    );
  }

  const renderFriendStatusCard = () => {
    if (relationStatus === "accepted" || isSelf) {
      return null;
    }

    return (
      <View style={styles.card}>
        {showImage ? (
          <Image
            source={{ uri: user?.profileImage }}
            style={styles.headerImage}
          />
        ) : (
          <View style={styles.cardPlaceholderCentered}>
            <Text style={styles.cardPlaceholderText}>{firstLetter}</Text>
          </View>
        )}
        <Text style={styles.cardTitle}>Let&apos;s Connect</Text>
        <Text style={styles.cardDescriptionCentered}>
          {relationStatus === "none"
            ? "Send a friend request to start chatting."
            : relationStatus === "sent"
            ? "Waiting for approval..."
            : "This user sent you a request. Accept to start chatting."}
        </Text>

        <View style={styles.actionRowCentered}>
          {relationStatus === "notsent" && (
            <Button
              title="Send Friend Request"
              onPress={sendRequest}
              style={styles.button}
            />
          )}
          {relationStatus === "received" && (
            <>
              <Button title="Accept" onPress={acceptRequest} />
              <Button title="Reject" onPress={rejectRequest} />
            </>
          )}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={handleGoBack}>
              <Image source={ICONS.BackArrow} style={styles.backIcon} />
            </TouchableOpacity>

            {showImage ? (
              <Image
                source={{ uri: user?.profileImage }}
                style={styles.headerImage}
              />
            ) : (
              <View style={styles.headerPlaceholder}>
                <Text style={styles.headerPlaceholderText}>{firstLetter}</Text>
              </View>
            )}

            <TouchableOpacity
              style={styles.flex}
              activeOpacity={0.7}
              onPress={() => {
                if (!states?.isBlockedByThem) {
                  navigateToProfile();
                }
              }}
            >
              <Text style={styles.headerName}>
                {isSelf ? "You" : user?.firstName}
              </Text>
              {relationStatus === "accepted" && (
                <Text style={styles.headerStatus} type="bold">
                  {isOnline
                    ? "Online"
                    : lastSeen
                    ? `Last seen ${lastSeen.toString()}`
                    : ""}
                </Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity onPress={openMenu}>
              <Image source={ICONS.menu} style={styles.menuIcon} />
            </TouchableOpacity>
          </View>

          {/* Pinned Message */}
          {states?.chatHistory?.length > 0 &&
            (() => {
              const pinnedMsgId = states?.pinnedMsg || null;
              const pinnedMsg = states?.chatHistory?.find(
                (m) => m.id === pinnedMsgId
              );
              return pinnedMsg ? (
                <TouchableOpacity
                  style={[
                    styles.pinnedMessageContainer,
                    { position: "relative" },
                  ]}
                  activeOpacity={0.85}
                  onPress={() => {
                    scrollToMessage(pinnedMsgId!);
                    setActionMsgId(null);
                    states.setHighlightedMsgId(pinnedMsgId!);
                    setTimeout(() => {
                      states.setHighlightedMsgId(null);
                    }, 3000);
                  }}
                >
                  <Image
                    source={ICONS.Attach}
                    style={styles.pinnedMessageIcon}
                  />
                  <Text style={styles.pinnedMsgText}>
                    {pinnedMsg.text || "[Pinned message]"}
                  </Text>
                  <TouchableOpacity onPress={() => pinMessage()}>
                    <Image
                      source={ICONS.cancel}
                      style={styles.pinnedMessageIcon}
                    />
                  </TouchableOpacity>
                </TouchableOpacity>
              ) : null;
            })()}

          {/* Selected Messages Bar */}
          {states?.selectedMessages.length > 0 && (
            <View style={styles.selecteddMessageContainer}>
              <View style={styles.selecteddMessageview}>
                <Image
                  source={ICONS.check}
                  style={styles.selectedMessageIcon}
                />
                <Text style={styles.selecteddMessageText}>
                  {states?.selectedMessages.length} selected
                </Text>
              </View>
              <View style={styles.selecteddMessageview}>
                <TouchableOpacity onPress={openActionModal}>
                  <Image
                    source={ICONS.menu}
                    style={styles.selectedMessageIcon}
                  />
                </TouchableOpacity>
                <TouchableOpacity onPress={clearSelectedMessages}>
                  <Image
                    source={ICONS.cancel}
                    style={styles.selectedMessageIcon}
                  />
                </TouchableOpacity>
              </View>
            </View>
          )}

          <ImageBackground
            source={
              states?.selectedTheme ? { uri: states?.selectedTheme } : undefined
            }
            style={styles.messagesContainer}
            resizeMode="cover"
          >
            {/* Chat Messages List - This will be the scrollable area */}
            <VirtualizedList
              ref={virtualListRef as any}
              data={states?.chatHistory}
              getItem={listHelpers.getItem}
              getItemCount={listHelpers.getItemCount}
              keyExtractor={listHelpers.keyExtractor}
              contentContainerStyle={[
                styles.scrollContainer,
                states?.selectedTheme ? { backgroundColor: "transparent" } : {},
              ]}
              style={[
                styles.chatScrollView,
                {
                  backgroundColor: states?.selectedTheme
                    ? "transparent"
                    : colors.background,
                },
              ]}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
              onScroll={handleScroll}
              scrollEventThrottle={16}
              initialNumToRender={20}
              maxToRenderPerBatch={10}
              windowSize={10}
              removeClippedSubviews={true}
              ListHeaderComponent={
                <>
                  {relationStatus && (
                    <View style={styles.renderFriendStatusCard}>
                      {renderFriendStatusCard()}
                    </View>
                  )}
                </>
              }
              ListEmptyComponent={
                relationStatus === "accepted" && !states?.loadingMessages ? (
                  states?.isBlockedByMe ? (
                    <View style={styles.flexGrow}>
                      <View className="card" style={styles.card}>
                        {showImage ? (
                          <Image
                            source={{ uri: user?.profileImage }}
                            style={styles.headerImage}
                          />
                        ) : (
                          <View style={styles.cardPlaceholderCentered}>
                            <Text style={styles.cardPlaceholderText}>
                              {firstLetter}
                            </Text>
                          </View>
                        )}
                        <Text style={styles.cardTitle}>Block</Text>
                        <Text style={styles.cardDescriptionCentered}>
                          You blocked this user.
                        </Text>
                        <Button
                          style={styles.padding}
                          title="Unblock User"
                          onPress={states?.unblockUserInline || (() => {})}
                        />
                      </View>
                    </View>
                  ) : (
                    <View style={styles.flexGrow}>
                      <View style={styles.card}>
                        {showImage ? (
                          <Image
                            source={{ uri: user?.profileImage }}
                            style={styles.headerImage}
                          />
                        ) : (
                          <View style={styles.cardPlaceholderCentered}>
                            <Text style={styles.cardPlaceholderText}>
                              {firstLetter}
                            </Text>
                          </View>
                        )}
                        <Text style={styles.cardTitle}>Let&apos;s Message</Text>
                        <Text style={styles.cardDescriptionCentered}>
                          No messages yet.
                        </Text>
                      </View>
                    </View>
                  )
                ) : null
              }
              renderItem={({ item: chat, index }) => {
                if (!chat) return null;
                const msgId = chat.id;
                const isSelected = states?.selectedMessages.includes(msgId);

                const currentLabel = formatDateLabel(chat.timestamp);
                const prevLabel =
                  index > 0
                    ? formatDateLabel(states.chatHistory[index - 1]?.timestamp)
                    : null;
                const showDateLabel = index === 0 || currentLabel !== prevLabel;

                return (
                  <>
                    {showDateLabel && (
                      <View style={styles.dateLabelContainer}>
                        <Text style={styles.dateLabelText} type="semibold">
                          {currentLabel}
                        </Text>
                      </View>
                    )}
                    <View key={msgId} style={{ position: "relative" }}>
                      <TouchableOpacity
                        onLongPress={() => {
                          toggleSelectMessage(msgId);
                          setActionMsgId(null);
                          setIsEditing(false);
                        }}
                        onPress={() => {
                          if (states?.selectedMessages.length > 0) {
                            toggleSelectMessage(msgId);
                          } else {
                            setActionMsgId(msgId);
                          }
                        }}
                        style={[
                          styles.messageBubble,
                          chat.fromMe ? styles.myMessage : styles.theirMessage,
                          isSelected && styles.selectedItem,
                          states.highlightedMsgId === chat.id &&
                            styles.selectedItem,
                        ]}
                        activeOpacity={0.95}
                      >
                        {chat?.text && (
                          <Text
                            style={[
                              styles.messageText,
                              {
                                color: chat.fromMe ? colors.white : colors.text,
                              },
                            ]}
                          >
                            {chat.text}
                          </Text>
                        )}

                        {chat.edited && (
                          <Text type="semibold" style={styles.editedtext}>
                            edited
                          </Text>
                        )}

                        {chat?.image && (
                          <TouchableOpacity
                            onPress={() => openImageModal(chat.image!)}
                          >
                            <Image
                              source={{ uri: chat.image! }}
                              style={[
                                styles.chatImage,
                                { marginTop: chat.text ? 5 : 0 },
                              ]}
                              resizeMode="cover"
                            />
                          </TouchableOpacity>
                        )}

                        <View style={styles.timeContainer}>
                          <Text
                            style={[
                              styles.timeText,
                              {
                                color: chat.fromMe ? colors.white : colors.gray,
                              },
                            ]}
                          >
                            {formatTime(chat.timestamp)}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    </View>
                  </>
                );
              }}
            />
          </ImageBackground>

          {/* Input Container */}
          {(relationStatus === "accepted" || isSelf) && (
            <View style={styles.inputContainer}>
              <Input
                placeholder={
                  states.isEditing
                    ? "Edit your message..."
                    : "Type your message..."
                }
                value={states.isEditing ? states.editText : states.message}
                onChangeText={(text) => {
                  if (states.isEditing) {
                    setEditText(text);
                  } else {
                    states.setMessage(text);
                  }
                }}
                multiline
                numberOfLines={3}
                containerStyle={styles.textInputContainer}
                inputStyle={styles.textInput}
              />
              <TouchableOpacity
                onPress={async () => {
                  if (states.isEditing) {
                    await handleEditMessage();
                  } else {
                    await sendMessage();
                  }
                  scrollToBottom(true);
                }}
                style={styles.sendButton}
              >
                <Image source={ICONS.Send} style={styles.sendIcon} />
              </TouchableOpacity>
            </View>
          )}

          {/* Modals */}
          <CustomModal
            visible={states?.imageModalVisible}
            title="Image"
            onClose={closeImageModal}
          >
            {states?.selectedImage && (
              <Image
                source={{ uri: states?.selectedImage }}
                style={styles.modalImage}
                resizeMode="contain"
              />
            )}
          </CustomModal>

          <CustomModal
            visible={states?.videoModalVisible}
            title="Video"
            onClose={closeVideoModal}
          >
            {states?.selectedVideo && (
              <Video
                source={{ uri: states?.selectedVideo }}
                style={styles.modalVideo}
                controls
                resizeMode="contain"
                paused={false}
              />
            )}
          </CustomModal>

          {/* Menu Modal */}
          <Modal
            visible={states?.menuVisible}
            transparent
            animationType="fade"
            onRequestClose={() => setMenuVisible(false)}
          >
            <TouchableOpacity
              style={styles.flex}
              activeOpacity={1}
              onPress={() => setMenuVisible(false)}
            >
              <View style={styles.menuContainer}>
                {!isSelf && (
                  <TouchableOpacity
                    onPress={() => {
                      setMenuVisible(false);
                      if (states?.isBlockedByMe) {
                        unblockUser();
                      } else {
                        blockUser();
                      }
                    }}
                    style={styles.padding}
                  >
                    <Text type="semibold" style={styles.menuText}>
                      {states?.isBlockedByMe ? "Unblock User" : "Block User"}
                    </Text>
                  </TouchableOpacity>
                )}

                <TouchableOpacity
                  onPress={() => {
                    setMenuVisible(false);
                    clearChat();
                  }}
                  style={styles.padding}
                >
                  <Text type="semibold" style={styles.menuText}>
                    Clear Chat
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => {
                    setMenuVisible(false);
                    setThemeModalVisible(true);
                  }}
                  style={styles.padding}
                >
                  <Text type="semibold" style={styles.menuText}>
                    Theme
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={async () => {
                    setMenuVisible(false);
                    const ok = await ensureLocationReady();
                    if (ok) {
                      openLocationFullModal();
                    } else {
                      states?.setLocationPromptVisible?.(true);
                    }
                  }}
                  style={styles.padding}
                >
                  <Text type="semibold" style={styles.menuText}>
                    Share Location
                  </Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          </Modal>

          {/* Theme Modal */}
          <CustomModal
            visible={states?.themeModalVisible}
            title="Select Chat Theme"
            onClose={() => setThemeModalVisible(false)}
          >
            <View style={styles.themeGrid}>
              {allThemes.map((theme) => {
                const isSelected = states?.selecturl === theme.fileKey;

                return (
                  <TouchableOpacity
                    key={theme.fileKey}
                    onPress={() => {
                      states?.setselecturl(theme.fileKey);
                    }}
                    style={[
                      styles.themeOption,
                      isSelected && {
                        borderWidth: 5,
                        borderColor: colors.primary,
                      },
                    ]}
                  >
                    <Image
                      source={{ uri: theme.url }}
                      style={styles.themeImage}
                      resizeMode="cover"
                    />
                  </TouchableOpacity>
                );
              })}
            </View>

            <Button
              title="Apply"
              loading={states?.loding}
              onPress={() => selectTheme(states?.selecturl)}
            />

            {states?.selectedTheme && (
              <Button title="Remove Theme" onPress={removeTheme} />
            )}
          </CustomModal>

          {/* Location Modal */}
          <Modal
            visible={states?.locationFullVisible}
            onRequestClose={closeLocationFullModal}
            animationType="slide"
            presentationStyle="fullScreen"
          >
            <View style={styles.flex}>
              <CustomHeader
                showProfileLogo={false}
                showAppLogo={false}
                showBackArrow={true}
                title="Share Location"
                onProfilePress={() => {}}
                onBackPress={closeLocationFullModal}
              />

              <View style={styles.flex}>
                <MapView
                  style={styles.map}
                  showsUserLocation
                  followsUserLocation
                  provider="google"
                  initialRegion={
                    states?.currentCoords
                      ? {
                          latitude: states.currentCoords.latitude,
                          longitude: states.currentCoords.longitude,
                          latitudeDelta: 0.01,
                          longitudeDelta: 0.01,
                        }
                      : {
                          latitude: 20.5937,
                          longitude: 78.9629,
                          latitudeDelta: 10,
                          longitudeDelta: 10,
                        }
                  }
                  region={
                    states?.currentCoords
                      ? {
                          latitude: states.currentCoords.latitude,
                          longitude: states.currentCoords.longitude,
                          latitudeDelta: 0.01,
                          longitudeDelta: 0.01,
                        }
                      : undefined
                  }
                >
                  {states?.currentCoords && (
                    <Marker
                      coordinate={{
                        latitude: states.currentCoords.latitude,
                        longitude: states.currentCoords.longitude,
                      }}
                      title="You"
                      description="Current location"
                    />
                  )}
                </MapView>
              </View>

              <View style={styles.bottomSheet}>
                <View style={styles.bottomSheetHeader}>
                  <Text type="semibold" style={styles.bottomSheetTitle}>
                    Choose what to share
                  </Text>

                  <View style={styles.durationChips}>
                    {[15, 30, 60].map((min) => {
                      const selected = liveDurationMin === min;
                      return (
                        <TouchableOpacity
                          key={min}
                          onPress={() => setLiveDurationMin(min)}
                          style={[
                            styles.durationChip,
                            selected && styles.durationChipSelected,
                          ]}
                        >
                          <Text
                            type="semibold"
                            style={[
                              styles.durationChipText,
                              selected && styles.durationChipTextSelected,
                            ]}
                          >
                            {min}m
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>

                <View style={styles.buttonGroup}>
                  <Button
                    title={
                      states?.currentCoords
                        ? "Send current location"
                        : "Finding your location..."
                    }
                    disabled={!states?.currentCoords}
                    onPress={async () => {
                      const ok = await ensureLocationReady();
                      if (ok) {
                        await shareCurrentLocation();
                        closeLocationFullModal();
                      }
                    }}
                  />

                  {!states?.isLiveSharingMine ? (
                    <Button
                      title={`Share live location (${liveDurationMin} min)`}
                      onPress={async () => {
                        const ok = await ensureLocationReady();
                        if (ok) {
                          await startLiveLocationShare();
                          closeLocationFullModal();
                        }
                      }}
                    />
                  ) : (
                    <Button
                      title="Stop live location"
                      onPress={async () => {
                        await stopLiveLocationShare();
                        closeLocationFullModal();
                      }}
                    />
                  )}
                </View>
              </View>
            </View>
          </Modal>

          <CustomModal
            visible={states?.locationPromptVisible}
            title="Turn on Location"
            onClose={dismissLocationPrompt}
          >
            <Text style={styles.promptText}>
              To share your location, please turn on Location Services and grant
              permission.
            </Text>
            <View style={styles.buttonGroup}>
              <Button
                title="Open Settings"
                onPress={openSystemLocationSettings}
              />
              <Button title="Try Again" onPress={retryLocationPreparation} />
            </View>
          </CustomModal>

          <CustomModal
            visible={actionModalVisible}
            title="Message Actions"
            onClose={closeActionModal}
          >
            {states.selectedMessages.length > 0 &&
            states?.selectedMessages.every((msgId) => {
              const msg = states.chatHistory.find((m) => m.id === msgId);
              return msg?.fromMe;
            }) ? (
              <Button
                title="Delete for Everyone"
                onPress={deleteMessagesForEveryone}
              />
            ) : null}

            {states?.selectedMessages.length > 0 && (
              <Button title="Delete for Me" onPress={deleteMessagesForMe} />
            )}

            <Button title="Cancel" onPress={closeActionModal} />
          </CustomModal>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
};

export default ChatDetailsScreen;
