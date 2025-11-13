import firestore, {
  FirebaseFirestoreTypes,
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  query,
  setDoc,
  where,
} from "@react-native-firebase/firestore";
import { useCallback, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
// import { RootState } from "../../../../redux/store";
import { getAllUsers } from "../../../../utils/helper";
import { showError } from "../../../../utils/toastConfig";

interface User {
  id: string;
  email: string;
  relationStatus: "none" | "accepted" | "sent" | "received" | "pending";
  order?: number;
}

export const useMyFriends = () => {
  //   const currentUserEmail = useSelector(
  //     (state: RootState) => state.auth.userData.email
  //   );
  const data = useSelector((state: any) => state?.userData);
  const currentUserEmail = data?.data?.email;

  const [activeTab, setActiveTab] = useState<"friends" | "pending" | "all">(
    "friends"
  );
  const [users, setUsers] = useState<User[]>([]);
  const [pinnedUsers, setPinnedUsers] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const states = { loading, refreshing };

  // Cache the current user's doc ref so we don't re-query by email each time
  const currentUserDocRefRef =
    useRef<FirebaseFirestoreTypes.DocumentReference | null>(null);

  const getCurrentUserDocRef = useCallback(async () => {
    if (!currentUserEmail) return null;

    if (currentUserDocRefRef.current) {
      return currentUserDocRefRef.current;
    }

    const db = firestore();
    const usersCollection = collection(db, "users");
    const q = query(
      usersCollection,
      where("email", "==", currentUserEmail),
      limit(1)
    );
    const snap = await getDocs(q);

    const ref = !snap.empty
      ? snap.docs[0].ref
      : doc(db, "users", "auto-generated-id");

    currentUserDocRefRef.current = ref;
    return ref;
  }, [currentUserEmail]);

  // Invalidate cached ref on email change
  useEffect(() => {
    currentUserDocRefRef.current = null;
  }, [currentUserEmail]);

  // ------------------- Fetch Pinned -------------------
  const refreshPinned = useCallback(async () => {
    if (!currentUserEmail) return;

    try {
      const userDocRef = await getCurrentUserDocRef();
      if (!userDocRef) return;

      const docSnapshot = await getDoc(userDocRef);
      if (docSnapshot.exists()) {
        const data = docSnapshot.data() || {};
        setPinnedUsers((data as any)?.pinned ?? []);
      } else {
        setPinnedUsers([]);
      }
    } catch (e) {
      console.error("Error fetching pinned users:", e);
    }
  }, [currentUserEmail, getCurrentUserDocRef]);

  // ------------------- Ensure Self Relation -------------------
  const ensureSelfRelation = useCallback(async () => {
    if (!currentUserEmail) return;
    const me = currentUserEmail.toLowerCase();
    const db = firestore();
    const selfDocRef = doc(db, "relation", `${me}_${me}`);
    const selfDocSnapshot = await getDoc(selfDocRef);

    if (!selfDocSnapshot.exists()) {
      await setDoc(selfDocRef, { from: me, to: me, isAccept: true });
      console.log("Created self-relation document");
    }
  }, [currentUserEmail]);

  // ------------------- Fetch Users with Relation -------------------
  const fetchAllUsersWithRelation = useCallback(async () => {
    if (!currentUserEmail) return;
    setLoading(true);

    try {
      const email1 = currentUserEmail.toLowerCase();

      await ensureSelfRelation();

      const allUsers = await getAllUsers(currentUserEmail);
      const db = firestore();
      const relationCollection = collection(db, "relation");
      const relationSnapshot = await getDocs(relationCollection);

      // Use cached user doc ref here
      const userDocRef = await getCurrentUserDocRef();
      const userDocSnapshot = userDocRef ? await getDoc(userDocRef) : undefined;

      let savedOrder: Record<string, number> = {};
      let savedPinned: string[] = [];
      if (userDocSnapshot?.exists()) {
        const data = userDocSnapshot.data() || {};
        savedOrder = (data as any)?.order ?? {};
        savedPinned = (data as any)?.pinned ?? [];
        setPinnedUsers(savedPinned);
      }

      const relationMap: Record<
        string,
        { from: string; to: string; isAccept: boolean }
      > = {};
      relationSnapshot.forEach((docSnap: any) => {
        const data = docSnap.data();
        const from = (data?.from || "").toLowerCase();
        const to = (data?.to || "").toLowerCase();
        const isAccept = !!data?.isAccept;

        if (!from || !to) return;

        relationMap[`${from}_${to}`] = { from, to, isAccept };
        relationMap[`${to}_${from}`] = { from, to, isAccept };

        if (from === to && isAccept) {
          relationMap["self"] = { from, to, isAccept };
        }
      });

      const mappedUsersRaw = allUsers.map((user: any) => {
        const originalEmail = (user.email ?? "").trim();
        const normalized = originalEmail.toLowerCase();
        const relation = normalized
          ? relationMap[`${email1}_${normalized}`]
          : undefined;
        const isSelf = normalized === email1;

        let relationStatus: User["relationStatus"] = "none";
        if (isSelf) relationStatus = relation?.isAccept ? "accepted" : "none";
        else if (!relation) relationStatus = "none";
        else if (relation.isAccept) relationStatus = "accepted";
        else if (relation.from === email1) relationStatus = "sent";
        else if (relation.to === email1) relationStatus = "received";
        else relationStatus = "pending";

        return {
          ...user,
          email: originalEmail,
          relationStatus,
          order:
            originalEmail && !savedPinned.includes(originalEmail)
              ? savedOrder[originalEmail]
              : undefined,
        };
      });

      const dedupMap = new Map<string, User>();
      mappedUsersRaw.forEach((u: any) => {
        const key = (u.email || "").toLowerCase();
        if (!key) return;
        if (!dedupMap.has(key)) dedupMap.set(key, u);
      });

      let filteredUsers = Array.from(dedupMap.values()).filter((user) => {
        if (activeTab === "all") return true;
        if (activeTab === "friends") return user.relationStatus === "accepted";
        if (activeTab === "pending")
          return ["sent", "received", "pending"].includes(user.relationStatus);
        return true;
      });

      const selfDoc = relationMap["self"];
      if (
        (activeTab === "all" &&
          !filteredUsers.some(
            (u) => (u.email || "").toLowerCase() === email1
          )) ||
        (activeTab === "friends" &&
          selfDoc?.isAccept &&
          !filteredUsers.some((u) => (u.email || "").toLowerCase() === email1))
      ) {
        filteredUsers.push({
          id: `self-${email1}`,
          email: currentUserEmail,
          relationStatus: activeTab === "friends" ? "accepted" : "none",
          order:
            !savedPinned.includes(currentUserEmail) &&
            savedOrder[currentUserEmail] !== undefined
              ? savedOrder[currentUserEmail]
              : undefined,
        });
      }

      const orderedUsers = filteredUsers
        .filter((u) => u.order !== undefined)
        .sort((a, b) => a.order! - b.order!);
      const unorderedUsers = filteredUsers.filter((u) => u.order === undefined);
      setUsers([...orderedUsers, ...unorderedUsers]);
      setSelectedUser(false);
    } catch (err) {
      console.error("Error fetching users with relation:", err);
    } finally {
      setLoading(false);
    }
  }, [currentUserEmail, activeTab, ensureSelfRelation, getCurrentUserDocRef]);

  // ------------------- Pin / Unpin -------------------
  const handlePin = useCallback(
    async (email: string) => {
      if (pinnedUsers.length >= 2) {
        showError("You can pin up to 2 users only.");
        return;
      }
      try {
        const userDocRef = await getCurrentUserDocRef();
        if (!userDocRef) return;

        const newPinned = [...pinnedUsers, email];
        await setDoc(userDocRef, { pinned: newPinned }, { merge: true });
        await refreshPinned();
      } catch (e) {
        console.error("Error pinning user:", e);
      }
    },
    [pinnedUsers, getCurrentUserDocRef, refreshPinned]
  );

  const handleUnpin = useCallback(
    async (email: string) => {
      try {
        const userDocRef = await getCurrentUserDocRef();
        if (!userDocRef) return;

        const docSnapshot = await getDoc(userDocRef);
        if (docSnapshot.exists()) {
          const data = docSnapshot.data() || {};
          const savedOrder: Record<string, number> = (data as any)?.order ?? {};
          const newPinned = pinnedUsers.filter((e) => e !== email);

          const newOrder: Record<string, number> = {};
          Object.entries(savedOrder).forEach(([e, idx]) => {
            if (e === email) return;
            if (!newPinned.includes(e))
              newOrder[e] = (typeof idx === "number" ? idx : 9999) + 1;
          });
          newOrder[email] = 0;

          await setDoc(
            userDocRef,
            { pinned: newPinned, order: newOrder },
            { merge: true }
          );
          await refreshPinned();
          await fetchAllUsersWithRelation();
        }
      } catch (e) {
        console.error("Error unpinning user:", e);
      } finally {
        setSelectedUser(false);
      }
    },
    [
      pinnedUsers,
      getCurrentUserDocRef,
      refreshPinned,
      fetchAllUsersWithRelation,
    ]
  );

  // ------------------- Save Order -------------------
  const saveUserOrder = useCallback(
    async (updatedUsers: User[]) => {
      try {
        const userDocRef = await getCurrentUserDocRef();
        if (!userDocRef) return;

        const orderData: Record<string, number> = {};
        updatedUsers.forEach((u, index) => {
          if (u.email && !pinnedUsers.includes(u.email))
            orderData[u.email] = index;
        });
        await setDoc(userDocRef, { order: orderData }, { merge: true });
      } catch (e) {
        console.error("Error saving order:", e);
      } finally {
        await refreshPinned();
        await fetchAllUsersWithRelation();
        setSelectedUser(false);
      }
    },
    [
      pinnedUsers,
      getCurrentUserDocRef,
      refreshPinned,
      fetchAllUsersWithRelation,
    ]
  );

  const handleDragEnd = useCallback(
    ({ data }: { data: User[] }) => {
      setUsers(data);
      saveUserOrder(data);
      setIsDragging(false);
    },
    [saveUserOrder]
  );

  const handleDragBegin = useCallback(() => {
    setIsDragging(true);
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchAllUsersWithRelation();
    await refreshPinned();
    setRefreshing(false);
  }, [fetchAllUsersWithRelation, refreshPinned]);

  // ------------------- Effects -------------------
  useEffect(() => {
    fetchAllUsersWithRelation();
    refreshPinned();
  }, [activeTab, fetchAllUsersWithRelation, refreshPinned]);

  return {
    activeTab,
    setActiveTab,
    users,
    pinnedUsers,
    states,
    onRefresh,
    handlePin,
    handleUnpin,
    handleDragEnd,
    selectedUser,
    setSelectedUser,
    isDragging,
    handleDragBegin,
  };
};
