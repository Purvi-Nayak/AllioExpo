// style.ts
import { CARD_WIDTH, SPACING } from "@utils/constant";
import { Platform, StyleSheet } from "react-native";
import responsive from "../../../utils/responsive";

export interface FeatureDataItem {
  image: any;
  title: string;
  description: string;
  buttonText: string;
}

const styles = StyleSheet.create({
  textone: {
    padding:
      Platform.OS === "web" ? responsive.scale(15) : responsive.scale(10),
    fontSize:
      Platform.OS === "web" ? responsive.scale(22) : responsive.scale(28),
    fontWeight: "bold",
    fontFamily: "Poppins-Bold",
    textAlign: Platform.OS === "web" ? "center" : "left",
  },
  container: {
    paddingVertical: responsive.scale(20),
    ...(Platform.OS === "web" && {
      paddingHorizontal: responsive.scale(20),
    }),
  },
  // Web-specific styles
  webHeader: {
    alignItems: "center",
    marginBottom: responsive.scale(50),
    paddingHorizontal: responsive.scale(20),
  },
  webTitle: {
    fontSize: responsive.scale(32),
    fontWeight: "bold",
    fontFamily: "Poppins-Bold",
    textAlign: "center",
    marginBottom: responsive.scale(16),
    color: "#2c3e50",
  },
  webSubtitle: {
    fontSize: responsive.scale(16),
    fontFamily: "Poppins-Regular",
    textAlign: "center",
    color: "#7f8c8d",
    maxWidth: 600,
    lineHeight: responsive.scale(24),
  },
  webGridContainer: {
    justifyContent: "center",
    paddingHorizontal: responsive.scale(20),
  },
  webColumnWrapper: {
    justifyContent: "space-around",
    marginBottom: responsive.scale(30),
  },
  webCardContainer: {
    width: Math.min(responsive.width(28), 350),
    marginHorizontal: responsive.scale(12),
  },
});

export default function useStyle() {
  return {
    CARD_WIDTH:
      Platform.OS === "web" ? Math.min(responsive.width(25), 300) : CARD_WIDTH,
    SPACING: Platform.OS === "web" ? responsive.scale(16) : SPACING,
    styles,
  };
}
