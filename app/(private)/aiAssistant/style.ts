import { useTheme } from "@/constants/Colors";
import responsive from "@/utils/responsive";
import { StyleSheet } from "react-native";

const useStyle = () => {
  const colors = useTheme();

  return StyleSheet.create({
    gradientContainer: {
      flex: 1,
    },
    container: {
      flex: 1,
      // Use responsive.containerStyle directly for web
      ...(responsive.isWeb ? responsive.containerStyle(1000) : {}),
    },
    chatContainer: {
      flex: 1,
      paddingBottom: responsive.scale(80), // Space for input (compact on web)
      // Reduce side padding on web so bubbles can be closer to container edge
    },
    messageContainer: {
      // even tighter vertical spacing on web
      marginVertical: responsive.isWeb
        ? responsive.scale(1)
        : responsive.scale(4),
      paddingHorizontal: responsive.isWeb
        ? responsive.scale(6)
        : responsive.scale(8),
    },
    userMessageContainer: {
      alignSelf: "flex-end",
      maxWidth: responsive.isWeb
        ? responsive.isDesktop
          ? 760
          : responsive.isTablet
          ? 620
          : "85%"
        : "85%",
      // push user bubble slightly closer to the right edge but keep a small gap
      marginRight: responsive.isWeb ? responsive.spacing.sm() : 0,
    },
    aiMessageContainer: {
      alignSelf: "flex-start",
      maxWidth: responsive.isWeb
        ? responsive.isDesktop
          ? 760
          : responsive.isTablet
          ? 620
          : "85%"
        : "85%",
      marginLeft: responsive.isWeb ? responsive.spacing.sm() : 0,
    },
    messageBubble: {
      paddingHorizontal: responsive.isWeb
        ? responsive.scale(8)
        : responsive.scale(12),
      paddingVertical: responsive.isWeb
        ? responsive.scale(6)
        : responsive.scale(12),
      // slightly smaller radius for compact web look
      borderRadius: responsive.isWeb
        ? responsive.scale(10)
        : responsive.scale(12),
      borderWidth: 1,
      justifyContent: "space-between",
      backgroundColor: "rgba(255, 255, 255, 0.04)",
      // Remove web-only CSS like backdropFilter for RN compatibility
    },
    userBubble: {
      backgroundColor: "rgba(251, 192, 45, 0.9)",
      borderColor: "rgba(251, 192, 45, 0.3)",
      // softer corner radii on web to reduce perceived height
      borderBottomRightRadius: responsive.isWeb ? responsive.scale(6) : 0,
      borderTopLeftRadius: responsive.isWeb ? responsive.scale(6) : 0,
    },
    aiBubble: {
      backgroundColor: "rgba(75, 85, 99, 0.45)",
      borderColor: "rgba(156, 163, 175, 0.3)",
      borderBottomLeftRadius: responsive.isWeb ? responsive.scale(6) : 0,
      borderTopRightRadius: responsive.isWeb ? responsive.scale(6) : 0,
    },
    mainContentContainer: {
      // ...existing code...
    },
    messageText: {
      fontSize: responsive.isWeb
        ? responsive.typography.body() * 0.95
        : responsive.typography.body(),
      lineHeight: responsive.isWeb
        ? responsive.scale(20)
        : responsive.scale(22),
      color: colors.text,
    },
    userText: {
      color: colors.text,
    },
    aiText: {
      color: colors.text,
    },
    inputContainer: {
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: responsive.isWeb ? "center" : "flex-end",
      paddingHorizontal: responsive.isWeb ? 0 : responsive.spacing.md(),
      paddingVertical: responsive.isWeb
        ? responsive.spacing.xs()
        : responsive.spacing.sm(),
    },
    // Constrain input width on web so the input area doesn't span entire screen
    inputField: {
      flex: 1,
      marginRight: responsive.scale(8),
      borderRadius: responsive.scale(20),
      paddingVertical: responsive.scale(6),
      color: colors.text,
      fontSize: responsive.isWeb
        ? responsive.typography.body() * 0.95
        : responsive.typography.body(),
      maxWidth: "90%",
    },
    sendButton: {
      width: responsive.isWeb ? responsive.scale(45) : responsive.scale(40),
      height: responsive.isWeb ? responsive.scale(45) : responsive.scale(40),
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(251, 192, 45, 0.9)",
      borderRadius: responsive.isWeb
        ? responsive.scale(5)
        : responsive.scale(22),
    },
    disabledButton: {
      backgroundColor: "rgba(251, 192, 45, 0.3)",
    },
    sendIcon: {
      resizeMode: "contain",
      width: responsive.scale(20),
      height: responsive.scale(20),
      tintColor: colors.text,
    },
    loaderContainer: {
      alignSelf: "flex-start",
      marginVertical: responsive.scale(4),
      paddingHorizontal: responsive.scale(8),
    },
    loaderBubble: {
      paddingHorizontal: responsive.scale(16),
      paddingVertical: responsive.scale(12),
      borderBottomLeftRadius: 0,
      borderTopRightRadius: 0,
      borderRadius: responsive.scale(12),
      backgroundColor: "rgba(75, 85, 99, 0.4)",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "flex-start",
    },
    typingIndicator: {
      fontSize: responsive.typography.body(),
      color: colors.text,
      opacity: 0.8,
      marginLeft: responsive.scale(8),
    },
    bubbleContainer: {
      flexDirection: "row",
    },
    bubble: {
      width: responsive.scale(8),
      height: responsive.scale(8),
      borderRadius: responsive.scale(4),
      backgroundColor: "rgba(251, 192, 45, 0.8)",
      marginRight: responsive.scale(6),
    },
    printButton: {
      marginTop: responsive.scale(10),
      paddingHorizontal: responsive.scale(12),
      paddingVertical: responsive.scale(6),
      borderRadius: responsive.scale(16),
      borderWidth: 1,
      borderColor: "rgba(251, 192, 45, 0.6)",
      alignSelf: "flex-start",
      backgroundColor: "rgba(251, 192, 45, 0.1)",
    },
    printButtonText: {
      fontSize: responsive.scale(12),
      color: "rgba(251, 192, 45, 0.9)",
    },
    copyButton: {
      paddingVertical: responsive.isWeb
        ? responsive.scale(3)
        : responsive.scale(5),
      flexDirection: "row",
      alignItems: "center",
      gap: responsive.scale(5),
    },
    copyIcon: {
      width: responsive.isWeb ? responsive.scale(12) : responsive.scale(16),
      height: responsive.isWeb ? responsive.scale(12) : responsive.scale(16),
      resizeMode: "contain",
      tintColor: "rgba(156, 163, 175, 0.8)",
    },
    copyText: {
      fontSize: responsive.isWeb ? responsive.scale(10) : responsive.scale(12),
      color: "rgba(156, 163, 175, 0.8)",
    },
    // Enhanced Empty State Styles
    emptyContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: responsive.scale(20),
    },
    logoContainer: {
      alignItems: "center",
      justifyContent: "center",
      marginBottom: responsive.scale(30),
      position: "relative",
    },
    logoGlow: {
      position: "absolute",
      width: responsive.isWeb ? responsive.scale(100) : responsive.scale(120),
      height: responsive.isWeb ? responsive.scale(100) : responsive.scale(120),
      borderRadius: responsive.scale(60),
      backgroundColor: "rgba(251, 192, 45, 0.45)",
      shadowColor: colors.primary,
      shadowOffset: {
        width: 0,
        height: 0,
      },
      shadowOpacity: 0.8,
      shadowRadius: 20,
      elevation: 8,
    },
    logoIcon: {
      width: responsive.isWeb ? responsive.scale(64) : responsive.scale(80),
      height: responsive.isWeb ? responsive.scale(64) : responsive.scale(80),
      resizeMode: "contain",
      tintColor: colors.skyBlue,
    },
    emptyTitle: {
      fontSize: responsive.isWeb
        ? responsive.typography.titleLarge() * 0.9
        : responsive.typography.titleLarge(),
      color: colors.text,
      textAlign: "center",
      marginBottom: responsive.scale(8),
      letterSpacing: 0.5,
    },
    emptySubtitle: {
      fontSize: responsive.isWeb
        ? responsive.typography.bodyLarge() * 0.95
        : responsive.typography.bodyLarge(),
      color: colors.text,
      textAlign: "center",
      lineHeight: responsive.scale(24),
      letterSpacing: 0.2,
    },
  });
};

export default useStyle;
