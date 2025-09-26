import { FONTS } from "@/assets";
import responsive from "@/utils/responsive";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: responsive.moderateScale(20),
    ...(responsive.containerStyle(500) as any),
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  welcomeContainer: {
    alignItems: "center",
    marginBottom: responsive.verticalScale(30),
  },
  welcomeText: {
    fontSize: responsive.moderateScale(18),
    fontFamily: FONTS.bold,
  },
  nameText: {
    fontSize: responsive.moderateScale(20),
    marginTop: responsive.verticalScale(4),
  },
  title: {
    fontSize: responsive.moderateScale(28),
    fontFamily: FONTS.bold,
    textAlign: "center",
    marginBottom: responsive.verticalScale(12),
  },
  subtitle: {
    fontSize: responsive.moderateScale(14),
    fontFamily: FONTS.regular,
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
    fontFamily: FONTS.extrabold,
    fontSize: responsive.moderateScale(20),
  },
  forgotButton: {
    marginTop: responsive.verticalScale(30),
    padding: responsive.moderateScale(12),
  },
  forgotText: {
    color: "#FFCE1B",
    fontSize: responsive.moderateScale(14),
    fontFamily: FONTS.extrabold,
    textAlign: "center",
  },
});
