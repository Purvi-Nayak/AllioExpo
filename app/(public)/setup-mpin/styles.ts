import { Dimensions, StyleSheet } from "react-native";

const { width } = Dimensions.get("window");

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    paddingTop: 20,
    paddingBottom: 20,
  },
  backButton: {
    padding: 8,
    alignSelf: "flex-start",
  },
  backText: {
    fontSize: 16,
    fontFamily: "Poppins-Medium",
  },
  content: {
    flex: 1,
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontFamily: "Poppins-Bold",
    textAlign: "center",
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: "Poppins-Regular",
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
    fontFamily: "Poppins-SemiBold",
  },
  continueButton: {
    width: "100%",
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 40,
    alignItems: "center",
  },
  continueText: {
    fontSize: 16,
    fontFamily: "Poppins-SemiBold",
  },
});
