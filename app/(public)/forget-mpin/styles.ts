import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  headerBackButton: {
    padding: 8,
  },
  headerBackText: {
    fontSize: 16,
    fontFamily: "Poppins-Medium",
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: "center",
  },
  formContainer: {
    width: "100%",
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
    lineHeight: 24,
  },
  submitButton: {
    marginTop: 24,
    marginBottom: 16,
  },
  backButton: {
    padding: 16,
    alignItems: "center",
  },
  backText: {
    fontSize: 16,
    fontFamily: "Poppins-Medium",
  },
  instructionsContainer: {
    backgroundColor: "rgba(74, 144, 226, 0.1)",
    borderRadius: 12,
    padding: 20,
    marginBottom: 32,
  },
  instructionTitle: {
    fontSize: 18,
    fontFamily: "Poppins-SemiBold",
    marginBottom: 12,
  },
  instruction: {
    fontSize: 14,
    fontFamily: "Poppins-Regular",
    lineHeight: 20,
    marginBottom: 8,
  },
  resendButton: {
    padding: 12,
    alignItems: "center",
    marginBottom: 8,
  },
  resendText: {
    fontSize: 16,
    fontFamily: "Poppins-Medium",
  },
});
