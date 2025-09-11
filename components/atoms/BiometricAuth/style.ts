import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    fontSize: 16,
    color: '#6C757D',
  },
  authContainer: {
    alignItems: 'center',
    width: '100%',
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#F8F9FA',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 2,
    borderColor: '#E9ECEF',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#212529',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#6C757D',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 22,
  },
  authButton: {
    backgroundColor: '#2196F3',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginBottom: 16,
    gap: 8,
  },
  authButtonDisabled: {
    backgroundColor: '#9E9E9E',
  },
  authButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  fallbackButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  fallbackButtonText: {
    color: '#6C757D',
    fontSize: 16,
    textDecorationLine: 'underline',
  },
  unavailableContainer: {
    alignItems: 'center',
    padding: 20,
  },
  unavailableTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FF9800',
    marginTop: 16,
    marginBottom: 8,
  },
  unavailableText: {
    fontSize: 16,
    color: '#6C757D',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
});
