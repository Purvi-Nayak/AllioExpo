import responsive from "@/utils/responsive";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: responsive.moderateScale(20),
    ...(responsive.containerStyle(500) as any),
  },
  header: {
    paddingTop: responsive.verticalScale(20),
    paddingBottom: responsive.verticalScale(20),
  },
  backButton: {
    padding: responsive.moderateScale(8),
    alignSelf: "flex-start",
  },
  backText: {
    fontSize: responsive.moderateScale(14),
    fontFamily: "Poppins-Medium",
  },
  content: {
    flex: 1,
    alignItems: "center",
  },
  title: {
    fontSize: responsive.moderateScale(28),
    fontFamily: "Poppins-Bold",
    textAlign: "center",
    marginBottom: responsive.verticalScale(12),
  },
  subtitle: {
    fontSize: responsive.moderateScale(14),
    fontFamily: "Poppins-Regular",
    textAlign: "center",
    marginBottom: responsive.verticalScale(40),
    paddingHorizontal: responsive.moderateScale(20),
    lineHeight: responsive.moderateScale(22),
  },
  dotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: responsive.verticalScale(40),
    gap: responsive.moderateScale(16),
  },
  dot: {
    width: responsive.moderateScale(16),
    height: responsive.moderateScale(16),
    borderRadius: responsive.moderateScale(8),
  },
  keypad: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    width: responsive.width(85),
    maxWidth: responsive.moderateScale(300),
  },
  keypadButton: {
    width: responsive.moderateScale(70),
    height: responsive.verticalScale(50),
    margin: responsive.moderateScale(8),
    borderRadius: responsive.moderateScale(12),
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  keypadText: {
    fontFamily: "Poppins-SemiBold",
    fontSize: responsive.moderateScale(20),
  },
  continueButton: {
    width: "100%",
    paddingVertical: responsive.verticalScale(16),
    borderRadius: responsive.moderateScale(12),
    marginTop: responsive.verticalScale(40),
    alignItems: "center",
  },
  continueText: {
    fontSize: responsive.moderateScale(14),
    fontFamily: "Poppins-SemiBold",
  },
});
