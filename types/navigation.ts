import { NavigationProp } from "@react-navigation/native";

export type RootStackParamList = {
  chatdetails: {
    user?: {
      email: string;
      firstName?: string;
      profileImage?: string;
    };
    sharedMediaId?: string;
    mediaUrl?: string;
    type?: "image" | "video";
    email?: string;
  };
  profile: {
    email: string;
  };
  "(tabs)": undefined;
};

export type HomeNavigationProp = NavigationProp<RootStackParamList>;
