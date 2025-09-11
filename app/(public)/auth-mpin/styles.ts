import { FONTS } from "@/assets";
import { Dimensions, StyleSheet } from "react-native";

const { width } = Dimensions.get("window");

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  welcomeContainer: {
    alignItems: "center",
    marginBottom: 30,
  },
  welcomeText: {
    fontSize: 20,
    fontFamily: FONTS.bold,
  },
  nameText: {
    fontSize: 24,
    marginTop: 4,
  },
  title: {
    fontSize: 28,
    fontFamily: FONTS.bold,
    textAlign: "center",
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: FONTS.regular,
    textAlign: "center",
    marginBottom: 40,
    paddingHorizontal: 20,
    lineHeight: 24,
  },
  dotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 40,
    gap: 16,
  },
  dot: {
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  keypad: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    width: width - 40,
    maxWidth: 300,
  },
  keypadButton: {
    width: (width - 80) / 3,
    maxWidth: 80,
    height: 60,
    margin: 8,
    borderRadius: 12,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  keypadText: {
    fontFamily: FONTS.extrabold,
  },
  forgotButton: {
    marginTop: 30,
    padding: 12,
  },
  forgotText: {
    color: "#FFCE1B",
    fontSize: 16,
    fontFamily: FONTS.extrabold,
    textAlign: "center",
  },
});
