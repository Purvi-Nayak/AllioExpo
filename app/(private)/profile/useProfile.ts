import { fetchImages, fetchVideos } from "@/redux/slices/MediaSlice";
import firestore from "@react-native-firebase/firestore";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

interface UseProfileProps {
  userEmail?: string;
}

const useProfile = ({ userEmail }: UseProfileProps = {}) => {
  const [activeTab, setActiveTab] = useState<string>("images");
  const [isFriend, setIsFriend] = useState<boolean>(false);
  const [userData, setUserData] = useState<any>({
    email: "",
    firstName: undefined,
    lastName: undefined,
    mobileNo: undefined,
    profileImage: undefined,
  });

  const router = useRouter();
  const authEmail = useSelector((state: any) => state.auth?.user?.email);
  const images = useSelector((state: any) => state.media?.images ?? []);
  const videos = useSelector((state: any) => state.media?.videos ?? []);

  const dispatch = useDispatch<any>();

  const email = userEmail;
  const isExternalProfile = !!userEmail && userEmail !== authEmail;

  useEffect(() => {
    const fetchUserData = async () => {
      if (!email) return;
      try {
        const data = await getUserData(email);
        if (data) {
          setUserData({
            email: data.email || email,
            firstName: data.firstName,
            lastName: data.lastName,
            mobileNo: data.mobileNo,
            profileImage: data.profileImage,
          });
        } else {
          setUserData({ ...userData, email });
        }
      } catch (error) {
        console.error("[useProfile] Failed to load user data:", error);
        setUserData({ ...userData, email });
      }
    };

    fetchUserData();
  }, [email]);

  useEffect(() => {
    if (email) {
      dispatch(fetchImages(email));
      dispatch(fetchVideos(email));
    }
  }, [email]);

  const handleTabChange = useCallback((tab: string) => setActiveTab(tab), []);

  const navigateToMyFriends = useCallback(() => {
    router.push("/(private)/(tabs)/chat");
  }, [router]);

  return {
    states: {
      isFriend,
      activeTab,
      setActiveTab: handleTabChange,
    },
    data: {
      email: userData.email,
      firstName: userData.firstName,
      lastName: userData.lastName,
      mobileNo: userData.mobileNo,
      profileImage: userData.profileImage,
      images: images,
      videos: videos,
      allImages: images,
      allVideos: videos,
    },
    isExternalProfile,
    isFriend,
    navigateToMyFriends,
  };
};

const getUserData = async (email: string) => {
  try {
    const normalizedEmail = email.trim().toLowerCase();
    const querySnapshot = await firestore()
      .collection("users")
      .where("email", "==", normalizedEmail)
      .limit(1)
      .get();

    if (!querySnapshot.empty) {
      const userDoc = querySnapshot.docs[0].data() as any;
      return {
        email: userDoc.email || normalizedEmail,
        firstName: userDoc.firstName || "",
        lastName: userDoc.lastName || "",
        profileImage: userDoc.profileImage || undefined,
        mobileNo: userDoc.mobileNo || "",
      };
    }

    return null;
  } catch (error) {
    console.error("[useProfile] getUserData error:", error);
    return null;
  }
};

export default useProfile;
