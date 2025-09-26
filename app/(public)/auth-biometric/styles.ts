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
    marginBottom: responsive.verticalScale(40),
  },
  welcomeText: {
    fontSize: responsive.moderateScale(18),
    fontFamily: "Poppins-Regular",
  },
  nameText: {
    fontSize: responsive.moderateScale(20),
    fontFamily: "Poppins-Bold",
    marginTop: responsive.verticalScale(4),
  },
  biometricContainer: {
    alignItems: "center",
    marginBottom: responsive.verticalScale(60),
  },
  biometricIcon: {
    width: responsive.moderateScale(80),
    height: responsive.moderateScale(80),
    borderRadius: responsive.moderateScale(40),
    borderWidth: 3,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: responsive.verticalScale(30),
    backgroundColor: "rgba(255, 206, 27, 0.1)",
  },
  biometricEmoji: {
    fontSize: responsive.moderateScale(32),
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
    paddingHorizontal: responsive.moderateScale(20),
    lineHeight: responsive.moderateScale(22),
  },
  buttonsContainer: {
    width: "100%",
    gap: responsive.verticalScale(16),
  },
  retryButton: {
    paddingVertical: responsive.verticalScale(16),
    borderRadius: responsive.moderateScale(12),
    alignItems: "center",
  },
  retryText: {
    fontSize: responsive.moderateScale(14),
    fontFamily: "Poppins-SemiBold",
  },
  mpinButton: {
    paddingVertical: responsive.verticalScale(16),
    alignItems: "center",
  },
  mpinText: {
    fontSize: responsive.moderateScale(14),
    fontFamily: "Poppins-Medium",
  },
});
