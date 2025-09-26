import responsive from "@/utils/responsive";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    ...(responsive.containerStyle(500) as any),
  },
  header: {
    paddingHorizontal: responsive.moderateScale(20),
    paddingTop: responsive.verticalScale(20),
    paddingBottom: responsive.verticalScale(10),
  },
  headerBackButton: {
    padding: responsive.moderateScale(8),
  },
  headerBackText: {
    fontSize: responsive.moderateScale(14),
    fontFamily: "Poppins-Medium",
  },
  content: {
    flex: 1,
    paddingHorizontal: responsive.moderateScale(20),
    justifyContent: "center",
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
    lineHeight: responsive.moderateScale(22),
    paddingHorizontal: responsive.moderateScale(20),
  },
  dotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: responsive.verticalScale(40),
  },
  dot: {
    width: responsive.moderateScale(18),
    height: responsive.moderateScale(18),
    borderRadius: responsive.moderateScale(9),
    marginHorizontal: responsive.moderateScale(10),
  },
  keypad: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    width: responsive.width(80),
    marginBottom: responsive.verticalScale(30),
  },
  keypadButton: {
    width: responsive.width(18),
    height: responsive.verticalScale(50),
    justifyContent: "center",
    alignItems: "center",
    margin: responsive.moderateScale(8),
    borderRadius: responsive.moderateScale(12),
    borderWidth: 1,
  },
  keypadText: {
    fontFamily: "Poppins-SemiBold",
    fontSize: responsive.moderateScale(20),
  },
  resendButton: {
    padding: responsive.moderateScale(16),
    alignItems: "center",
  },
  resendText: {
    fontSize: responsive.moderateScale(14),
    fontFamily: "Poppins-Medium",
  },
});
