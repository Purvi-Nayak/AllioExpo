import { useTheme } from "@/constants/Colors";
import responsive from "@/utils/responsive";
import { height, width } from "@utils/helper";
import { StyleSheet } from "react-native";
import { scale } from "react-native-size-matters";

const useStyle = () => {
  const colors = useTheme();

  return StyleSheet.create({
    headerContainer: {
      position: "relative",
      height: responsive.isMobile ? height * 0.08 : height * 0.06,
      backgroundColor: colors.primary,
      justifyContent: "center",
      alignItems: "center",
      paddingTop: responsive.isMobile ? responsive.spacing.xs() : 0,
    },
    leftButton: {
      position: "absolute",
      left: width * 0.04,
      top: "50%",
      transform: [{ translateY: -scale(18) }],
      zIndex: 1,
      padding: scale(8),
      backgroundColor: "transparent",
    },
    leftLogo: {
      position: "absolute",
      left: width * 0.04,
      top: "50%",
      transform: [{ translateY: -scale(22) }],
      zIndex: 1,
    },
    centerContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: responsive.isMobile ? width * 0.2 : width * 0.15,
    },
    rightButton: {
      position: "absolute",
      right: width * 0.04,
      top: "50%",
      transform: [{ translateY: -scale(15) }],
      zIndex: 1,
    },
    backIcon: {
      width: scale(18),
      height: scale(18),
      tintColor: colors.black,
    },
    title: {
      fontSize: responsive.isMobile
        ? responsive.typography.bodyLarge()
        : responsive.typography.title(),
      color: colors.black,
      textAlign: "center",
      fontWeight: "bold",
    },
    logoStyle: {
      width: responsive.isMobile ? scale(40) : scale(50),
      height: responsive.isMobile ? scale(40) : scale(50),
    },
  });
};

export default useStyle;
