import { IMAGES } from '../assets';
import { Environment } from './environment';

import { width } from './helper';
interface OnboardingItem {
  id: string;
  image: any;
  title: string;
  description: string;
}

// Use environment-based Google Web Client ID instead of hardcoded
const WEB_CLIENT_ID = Environment.GOOGLE_WEB_CLIENT_ID;

const CARD_WIDTH = width * 0.94;
const SPACING = (width - CARD_WIDTH) / 0.6;

// Use environment-based API URL instead of hardcoded
const BASE_URL = Environment.API_BASE_URL;

const onboardingData: OnboardingItem[] = [
  {
    id: '1',
    image: IMAGES.First,
    title: 'Smart Tools, One App',
    description:
      'From QR scanning to social login, access all smart tools in one place.',
  },
  {
    id: '2',
    image: IMAGES.SecondOnboarding,
    title: 'Secure & Private',
    description:
      'Biometrics, PIN lock, and encrypted messaging for ultimate security.',
  },
  {
    id: '3',
    image: IMAGES.OnboardingThree,
    title: 'Smarter Media',
    description:
      'Capture, edit, and share videos or photos with advanced tools.',
  },
  {
    id: '4',
    image: IMAGES.First,
    title: 'Real-Time & Background Features',
    description:
      'Enable push notifications, background tasks, and live tracking.',
  },
  {
    id: '5',
    image: IMAGES.SecondOnboarding,
    title: 'Multi-language + Voice Assistant',
    description:
      'Speak to control, read text aloud, and use your app in any language.',
  },
];





const LICENSE_KEY =
  'z_9lMDUqcUwlNkjjU52ZLFQbwBvxJ60uSd_ouvwBDRCKtmK5fbZAtHFd3889zr9v';

  const FeaturesDataItem = [
    {
      image: IMAGES.Notification,
      title: ' ScanQR',
      description: 'Scan documents quickly and save them securely.',
      buttonText: 'ScanQR',
    },
    {
      image: IMAGES.Notification,
      title: 'Video Editing',
      description: 'Stay updated with instant alerts and reminders.',
      buttonText: 'Video Editing',
    },
    {
      image: IMAGES.Notification,
      title: 'Photo Editing',
      description: 'Scan QR codes and barcodes with ease.',
      buttonText: 'Photo Editing',
    },
  
    {
      image: IMAGES.Notification,
      title: 'Home',
      description: 'Fast and reliable scanning for all your needs.',
      buttonText: 'Home',
    },
  ];

export {
  BASE_URL, CARD_WIDTH, FeaturesDataItem,
  LICENSE_KEY, onboardingData, SPACING, WEB_CLIENT_ID
};

