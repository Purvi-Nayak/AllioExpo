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
    marginBottom: 40,
  },
  welcomeText: {
    fontSize: 20,
    // fontFamily: "Poppins-Regular",
  },
  nameText: {
    fontSize: 24,
    fontFamily: "Poppins-Bold",
    marginTop: 4,
  },
  biometricContainer: {
    alignItems: "center",
    marginBottom: 60,
  },
  biometricIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 30,
    backgroundColor: "rgba(255, 206, 27, 0.1)",
  },
  biometricEmoji: {
    fontSize: 40,
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
    paddingHorizontal: 20,
    lineHeight: 24,
  },
  buttonsContainer: {
    width: "100%",
    gap: 16,
  },
  retryButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  retryText: {
    fontSize: 16,
    fontFamily: "Poppins-SemiBold",
  },
  mpinButton: {
    paddingVertical: 16,
    alignItems: "center",
  },
  mpinText: {
    fontSize: 16,
    fontFamily: "Poppins-Medium",
  },
});
