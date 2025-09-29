import { useTheme } from "@react-navigation/native";
import { StyleSheet } from "react-native";

const useStyle = () => {
  const { colors } = useTheme();
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    profileHeaderContainer: {
      paddingHorizontal: 16,
      paddingVertical: 16,
      backgroundColor: colors.background,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    topSectionContainer: {
      flexDirection: "row",
      alignItems: "center",
    },
    profileImageContainer: {
      position: "relative",
    },
    profileImage: {
      width: 88,
      height: 88,
      borderRadius: 44,
      borderWidth: 3,
      borderColor: colors.primary,
    },
    onlineIndicator: {
      position: "absolute",
      bottom: 6,
      right: 6,
      width: 16,
      height: 16,
      borderRadius: 8,
      backgroundColor: colors.green || "#00FF00",
      borderWidth: 2,
      borderColor: colors.card,
    },
    nameAndStatsContainer: {
      flex: 1,
      marginLeft: 12,
    },
    profileStats: {
      flexDirection: "row",
      justifyContent: "space-evenly",
      alignItems: "center",
      width: "100%",
    },
    statItem: {
      alignItems: "center",
    },
    statSeparator: {
      width: 1.5,
      height: 30,
      backgroundColor: colors.primary,
    },
    statNumber: {
      fontSize: 18,
      color: colors.primary,
    },
    statLabel: {
      fontSize: 14,
      color: colors.text,
      marginTop: 4,
    },
    profileInfoContainer: {
      alignItems: "flex-start",
      marginTop: 8,
    },
    displayName: {
      fontSize: 18,
      color: colors.text,
    },
    email: {
      fontSize: 14,
      color: colors.text,
      opacity: 0.8,
    },
    mobileNo: {
      fontSize: 13,
      color: colors.text,
      opacity: 0.7,
    },
    actionButton: {
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 8,
      paddingVertical: 8,
      alignItems: "center",
      justifyContent: "center",
    },
    actionButtonText: {
      color: colors.text,
      fontSize: 14,
    },
    contentHeader: {
      flexDirection: "row",
      justifyContent: "space-around",
    },
    tab: {
      width: "35%",
      paddingVertical: 10,
      alignItems: "center",
    },
    activeTab: {
      borderBottomWidth: 2,
      borderBottomColor: colors.primary,
    },
    tabText: {
      fontSize: 16,
      color: colors.text,
    },
    activeTabText: {
      color: colors.primary,
    },
    contentContainer: {
      flex: 1,
      padding: 12,
    },
    gridContent: {
      flexGrow: 1,
    },
    gridRow: {
      justifyContent: "space-between",
    },
    mediaItem: {
      width: "45%",
      height: 180,
      borderRadius: 8,
    },
    emptyContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingVertical: 40,
    },
    emptyText: {
      fontSize: 18,
      color: colors.text,
      opacity: 0.7,
    },
  });
};

export default useStyle;
