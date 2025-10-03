import { StyleSheet } from "react-native";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";

const useStyle = () => {
  const styles = StyleSheet.create({
    container: {
      marginBottom: verticalScale(15),
    },
    tabContainer: {
      flexDirection: "row",
      // backgroundColor: "#F8F9FA",
      borderRadius: moderateScale(8),
      padding: scale(4),
      marginHorizontal: scale(10),
    },
    tab: {
      flex: 1,
      paddingVertical: verticalScale(12),
      alignItems: "center",
      justifyContent: "center",
      borderRadius: moderateScale(6),
    },
    activeTab: {
      backgroundColor: "#FFFFFF",
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 2,
    },
    tabText: {
      fontSize: moderateScale(14),
      color: "#666666",
      fontWeight: "500",
    },
    activeTabText: {
      color: "#007AFF",
      fontWeight: "600",
    },
    indicator: {
      position: "relative",
      height: verticalScale(3),
      backgroundColor: "transparent",
      marginTop: verticalScale(8),
      marginHorizontal: scale(16),
    },
    activeIndicator: {
      position: "absolute",
      height: "100%",
      backgroundColor: "#007AFF",
      borderRadius: moderateScale(2),
      top: 0,
    },
  });

  return styles;
};

export default useStyle;
