import { setStateKey } from '@/redux/slices/AuthSlice';
import { ICONS } from '@assets/index';
import {
  FacebookAuthProvider,
  getAuth,
  signInWithCredential,
} from '@react-native-firebase/auth';
import firestore, { doc, setDoc } from '@react-native-firebase/firestore';
import { Environment } from '@utils/environment';
import { checkUserExistsByEmail } from '@utils/helper';
import { showError } from '@utils/toastConfig';
import * as Crypto from 'expo-crypto';
import { useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import React, { memo } from 'react';
import { useDispatch } from 'react-redux';
import SocialButton from '../socialButton';

interface SignInWithFacebookProps {
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const SignInWithFacebook: React.FC<SignInWithFacebookProps> = ({
  setLoading,
}) => {
  const dispatch = useDispatch();
  const router = useRouter();

  const handleFacebookLogin = async () => {
    setLoading(true);
    try {
      console.log('🚀 Starting Facebook Sign-In process with expo-auth-session...');

      // Use Firebase redirect URI that matches your Facebook app configuration
      const redirectUri = 'https://allio-cd2b5.firebaseapp.com/__/auth/handler';

      console.log('📱 Redirect URI:', redirectUri);

      // Generate state parameter for security
      const state = await Crypto.digestStringAsync(
        Crypto.CryptoDigestAlgorithm.SHA256,
        Math.random().toString(36).substring(7)
      );

      // Facebook OAuth URL with parameters matching your Firebase setup
      const facebookAuthUrl = `https://www.facebook.com/v18.0/dialog/oauth?` +
        `client_id=${Environment.FACEBOOK_APP_ID}&` +
        `redirect_uri=${encodeURIComponent(redirectUri)}&` +
        `scope=public_profile,email&` +
        `response_type=token&` +
        `state=${state}&` +
        `display=popup`;

      console.log('🔗 Facebook Auth URL:', facebookAuthUrl);

      // Open Facebook auth URL using expo-web-browser
      const result = await WebBrowser.openAuthSessionAsync(
        facebookAuthUrl,
        redirectUri
      );

      if (result.type === 'success') {
        console.log(' Facebook auth successful');
        
        // Extract access token from URL
        const url = result.url;
        const urlParams = new URLSearchParams(url.split('#')[1]);
        const accessToken = urlParams.get('access_token');

        if (accessToken) {
          console.log(' Facebook access token received');

          // Get user profile from Facebook Graph API
          const userInfoResponse = await fetch(
            `https://graph.facebook.com/me?fields=id,name,email,picture&access_token=${accessToken}`
          );
          const userInfo = await userInfoResponse.json();

          console.log('✅ Facebook user info received:', {
            id: userInfo.id,
            name: userInfo.name,
            email: userInfo.email,
          });

          // Create Firebase credential with Facebook access token
          const credential = FacebookAuthProvider.credential(accessToken);
          
          // Sign in with Firebase
          const userCredential = await signInWithCredential(getAuth(), credential);
          const user = userCredential.user;
          const firebaseToken = await user.getIdToken();

          console.log('✅ Firebase authentication successful');

          // Check if user exists in Firestore
          const userExists = await checkUserExistsByEmail(user.email ?? "");

          const userData = {
            firstName: userInfo.name?.split(' ')[0] || '',
            lastName: userInfo.name?.split(' ')[1] || '',
            email: user.email || userInfo.email,
            profileImage: userInfo.picture?.data?.url || user.photoURL || '',
            provider: 'facebook',
            createdAt: new Date().toISOString(),
          };

          // Save user data in Firestore if new user
          if (!userExists) {
            const db = firestore();
            const userDocRef = doc(db, "users", user.uid);
            await setDoc(userDocRef, userData);
          }

          // Update Redux state
          dispatch(setStateKey({ key: 'token', value: firebaseToken }));
          dispatch(setStateKey({ key: 'userData', value: userData }));

          console.log('Facebook Sign-In Success - Redux state updated');
          console.log('Token set:', !!firebaseToken);

          // Navigate to home page
          setTimeout(() => {
            router.replace("/(private)/(tabs)/home");
          }, 100);

        } else {
          throw new Error('Failed to get access token from Facebook');
        }
      } else if (result.type === 'cancel') {
        console.log(' Facebook login cancelled by user');
        return;
      } else {
        throw new Error('Facebook authentication failed');
      }
    } catch (error: any) {
      console.error(' Facebook Login Error:', error);
      
      let errorMessage = 'Facebook sign-in failed. Please try again.';
      
      if (error.code) {
        switch (error.code) {
          case 'auth/account-exists-with-different-credential':
            errorMessage = 'An account with this email already exists. Please sign in using your original method.';
            break;
          case 'auth/invalid-credential':
            errorMessage = 'Invalid Facebook credentials';
            break;
          case 'auth/operation-not-allowed':
            errorMessage = 'Facebook sign-in is not enabled';
            break;
          case 'auth/user-disabled':
            errorMessage = 'This user account has been disabled';
            break;
          default:
            errorMessage = error.message || 'Facebook sign-in failed';
        }
      } else if (error.message) {
        errorMessage = error.message;
      }

      showError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SocialButton
      icon={ICONS.FaceBook}
      onPress={handleFacebookLogin}
      accessibilityLabel="Login with Facebook"
      testID="facebook-login"
    />
  );
};

export default memo(SignInWithFacebook);
