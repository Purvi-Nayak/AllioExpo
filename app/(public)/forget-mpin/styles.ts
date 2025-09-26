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
  },
  formContainer: {
    width: "100%",
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
  },
  submitButton: {
    marginTop: responsive.verticalScale(24),
    marginBottom: responsive.verticalScale(16),
  },
  backButton: {
    padding: responsive.moderateScale(16),
    alignItems: "center",
  },
  backText: {
    fontSize: responsive.moderateScale(14),
    fontFamily: "Poppins-Medium",
  },
  instructionsContainer: {
    backgroundColor: "rgba(74, 144, 226, 0.1)",
    borderRadius: responsive.moderateScale(12),
    padding: responsive.moderateScale(20),
    marginBottom: responsive.verticalScale(32),
  },
  instructionTitle: {
    fontSize: responsive.moderateScale(16),
    fontFamily: "Poppins-SemiBold",
    marginBottom: responsive.verticalScale(12),
  },
  instruction: {
    fontSize: responsive.moderateScale(12),
    fontFamily: "Poppins-Regular",
    lineHeight: responsive.moderateScale(18),
    marginBottom: responsive.verticalScale(8),
  },
  resendButton: {
    padding: responsive.moderateScale(12),
    alignItems: "center",
    marginBottom: responsive.verticalScale(8),
  },
  resendText: {
    fontSize: responsive.moderateScale(14),
    fontFamily: "Poppins-Medium",
  },
});
