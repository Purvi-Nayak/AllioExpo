import responsive from "@/utils/responsive";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  header: {
    alignItems: "center",
    marginBottom: responsive.verticalScale(40),
  },
  title: {
    fontSize: responsive.moderateScale(20),
    fontWeight: "bold",
    color: "#212529",
    marginBottom: responsive.verticalScale(8),
  },
  subtitle: {
    fontSize: responsive.moderateScale(14),
    color: "#6C757D",
    textAlign: "center",
  },
  dotsContainer: {
    flexDirection: "row",
    marginBottom: responsive.verticalScale(20),
    gap: responsive.moderateScale(16),
  },
  dot: {
    width: responsive.moderateScale(18),
    height: responsive.moderateScale(18),
    borderRadius: responsive.moderateScale(9),
    borderWidth: 2,
  },
  errorText: {
    color: "#F44336",
    fontSize: responsive.moderateScale(12),
    marginBottom: responsive.verticalScale(20),
    textAlign: "center",
  },
  keypad: {
    flexDirection: "row",
    flexWrap: "wrap",
    width: responsive.moderateScale(240),
    justifyContent: "center",
    gap: responsive.moderateScale(20),
  },
  key: {
    width: responsive.moderateScale(50),
    height: responsive.moderateScale(50),
    borderRadius: responsive.moderateScale(25),
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  keyText: {
    fontSize: responsive.moderateScale(20),
    fontWeight: "600",
    color: "#212529",
  },
});
