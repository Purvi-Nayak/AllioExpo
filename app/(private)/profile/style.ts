import { useTheme } from "@/constants/Colors";
import responsive from "@/utils/responsive";
import { Platform, StyleSheet } from "react-native";

const useStyle = () => {
  const colors = useTheme();

  // avatar size responsive to device
  const avatarSize = responsive.scale(
    responsive.isDesktop ? 110 : responsive.isTablet ? 96 : 88
  );

  // media item sizing per breakpoint
  const mediaItemWidth = responsive.isDesktop
    ? "31%"
    : responsive.isTablet
    ? "47%"
    : "48%";
  const mediaItemHeight = responsive.verticalScale(
    responsive.isDesktop ? 220 : 180
  );

  // container center on web with max width
  // Increase web max width and reduce large side gutters so content is wider on desktop
  // Use same web width as AI Assistant for consistent layout
  const webContainer = responsive.isWeb
    ? {
        ...responsive.containerStyle(1000),
        paddingHorizontal: responsive.isDesktop
          ? responsive.spacing.lg()
          : responsive.spacing.md(),
      }
    : {};

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background ?? colors.white,
      ...webContainer,
    },

    profileHeaderContainer: {
      paddingHorizontal: responsive.isWeb
        ? responsive.spacing.lg()
        : responsive.spacing.md(),
      paddingVertical: responsive.spacing.md(),
      backgroundColor: colors.background,
      borderBottomWidth: 1,
      borderBottomColor: colors.black,
    },

    topSectionContainer: {
      flexDirection: "row",
      alignItems: "center",
    },

    profileImageContainer: {
      position: "relative",
    },

    profileImage: {
      width: avatarSize,
      height: avatarSize,
      borderRadius: avatarSize / 2,
      borderWidth: responsive.isWeb ? 4 : 3,
      borderColor: colors.primary,
    },

    onlineIndicator: {
      position: "absolute",
      bottom: responsive.scale(6),
      right: responsive.scale(6),
      width: responsive.scale(16),
      height: responsive.scale(16),
      borderRadius: responsive.scale(8),
      backgroundColor: colors.green,
      borderWidth: 2,
      borderColor: colors.white,
    },

    nameAndStatsContainer: {
      flex: 1,
      marginLeft: responsive.spacing.sm(),
    },

    profileStats: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      width: "100%",
      marginTop: responsive.spacing.sm(),
    },

    statItem: {
      alignItems: "center",
      paddingHorizontal: responsive.spacing.sm(),
    },

    statSeparator: {
      width: 1.5,
      height: responsive.verticalScale(30),
      backgroundColor: colors.primary,
      marginHorizontal: responsive.spacing.sm(),
    },

    statNumber: {
      fontSize: responsive.typography.subtitle(),
      color: colors.primary,
    },

    statLabel: {
      fontSize: responsive.typography.body(),
      color: colors.text,
      marginTop: responsive.spacing.xs(),
    },

    profileInfoContainer: {
      alignItems: "flex-start",
      marginTop: responsive.spacing.sm(),
    },

    displayName: {
      fontSize: responsive.typography.title(),
      color: colors.text,
    },

    email: {
      fontSize: responsive.typography.body(),
      color: colors.text,
      opacity: 0.8,
    },

    mobileNo: {
      fontSize: responsive.typography.caption(),
      color: colors.text,
      opacity: 0.7,
    },

    actionButton: {
      borderWidth: 1,
      borderRadius: 8,
      paddingVertical: responsive.spacing.sm(),
      paddingHorizontal: responsive.spacing.lg(),
      alignItems: "center",
      justifyContent: "center",
    },

    actionButtonText: {
      color: colors.text,
      fontSize: responsive.typography.body(),
    },

    contentHeader: {
      flexDirection: "row",
      justifyContent: "space-around",
      paddingHorizontal: responsive.spacing.md(),
      marginTop: responsive.spacing.md(),
    },

    tab: {
      width: "35%",
      paddingVertical: responsive.spacing.sm(),
      alignItems: "center",
    },

    activeTab: {
      borderBottomWidth: 2,
      borderBottomColor: colors.primary,
    },

    tabText: {
      fontSize: responsive.typography.body(),
      color: colors.text,
    },

    activeTabText: {
      color: colors.primary,
    },

    contentContainer: {
      flex: 1,
      padding: responsive.spacing.md(),
      width: "100%",
    },

    gridContent: {
      flexGrow: 1,
      marginTop: responsive.spacing.md(),
      paddingBottom:
        Platform.OS === "web"
          ? responsive.spacing.lg()
          : responsive.spacing.xl(),
    },

    gridRow: {
      gap: responsive.spacing.sm(),
    },

    mediaItem: {
      width: mediaItemWidth,
      height: mediaItemHeight,
      borderRadius: 8,
      marginBottom: responsive.spacing.md(),
      backgroundColor: colors.lightgray,
    },

    emptyContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingVertical: responsive.spacing.xl(),
    },

    emptyText: {
      fontSize: responsive.typography.title(),
      color: colors.text,
      opacity: 0.7,
    },
  });
};

export default useStyle;
