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
  optionsContainer: {
    width: "100%",
    gap: responsive.verticalScale(20),
  },
  optionButton: {
    borderWidth: 2,
    borderRadius: responsive.moderateScale(16),
    padding: responsive.moderateScale(24),
    alignItems: "center",
    backgroundColor: "rgba(255, 206, 27, 0.05)",
  },
  optionIcon: {
    fontSize: responsive.moderateScale(32),
    marginBottom: responsive.verticalScale(12),
  },
  optionTitle: {
    fontSize: responsive.moderateScale(16),
    fontFamily: "Poppins-SemiBold",
    marginBottom: responsive.verticalScale(8),
    textAlign: "center",
  },
  optionDescription: {
    fontSize: responsive.moderateScale(12),
    fontFamily: "Poppins-Regular",
    textAlign: "center",
    lineHeight: responsive.moderateScale(18),
  },
  note: {
    fontSize: responsive.moderateScale(10),
    fontFamily: "Poppins-Regular",
    textAlign: "center",
    marginTop: responsive.verticalScale(40),
    paddingHorizontal: responsive.moderateScale(20),
    lineHeight: responsive.moderateScale(16),
  },
});
