import { IMAGES } from "@assets/index";
// import UserCard from "@components/cards/UserCard";
import { CustomSimpleTab } from "@/components/atoms/CustomSimpleTab";
import UserCard from "@/components/cards/UserCard";
import {
  Container,
  CustomFlatList,
  //   CustomSimpleTab,
  Text,
} from "@components/index";
import React, { useMemo } from "react";
import { Image, RefreshControl, View } from "react-native";
import DraggableFlatList from "react-native-draggable-flatlist";
import useStyle from "./style";
import { useMyFriends } from "./useMyFriends";
// import useStyle from "./style";
// import { useMyFriends } from "./useMyFriends";

const MyFriends = () => {
  const styles = useStyle();
  const {
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
  } = useMyFriends();

  const tabs = [
    { id: "friends", title: "Friends" },
    { id: "pending", title: "Pending" },
    { id: "all", title: "All" },
  ];

  const pinnedUserObjects = useMemo(
    () => users.filter((u) => pinnedUsers.includes(u.email)),
    [users, pinnedUsers]
  );

  const nonPinnedUsers = useMemo(
    () =>
      users
        .filter((u) => !pinnedUsers.includes(u.email))
        .sort((a, b) => (a.order ?? Infinity) - (b.order ?? Infinity)),
    [users, pinnedUsers]
  );

  const combinedUnique = useMemo(() => {
    const map = new Map<string, any>();
    [...pinnedUserObjects, ...nonPinnedUsers].forEach((u) => {
      const key = (u?.email || "").toLowerCase();
      if (!key) return;
      if (!map.has(key)) map.set(key, u);
    });
    return Array.from(map.values());
  }, [pinnedUserObjects, nonPinnedUsers]);

  const renderEmptyState = () => (
    <View style={styles.emptyStateContainer}>
      <Image
        source={IMAGES.Nodata}
        style={styles.noGalleryIcon}
        resizeMode="contain"
      />
      <Text type="bold" style={styles.emptyStateTitle}>
        No Users Found
      </Text>
      <Text type="regular" style={styles.emptyStateSubtitle}>
        Currently we don&apos;t have any users. Please share this app with your
        friends and family.
      </Text>
    </View>
  );

  return (
    <Container title="My Friends" showLoader={states?.loading}>
      <View style={styles.container}>
        <CustomSimpleTab
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        {activeTab === "friends" ? (
          <View>
            {pinnedUserObjects.map((user) => (
              <UserCard
                key={user.id}
                user={user}
                isFriendTab={true}
                pinnedUsers={pinnedUsers}
                onPin={handlePin}
                onUnpin={handleUnpin}
                selectedUser={selectedUser}
              />
            ))}

            <DraggableFlatList
              data={nonPinnedUsers}
              keyExtractor={(item) => item.id}
              renderItem={({ item, drag, isActive }) => (
                <UserCard
                  user={item}
                  drag={drag}
                  isActive={isActive}
                  isFriendTab
                  pinnedUsers={pinnedUsers}
                  onPin={handlePin}
                  onUnpin={handleUnpin}
                  onLongPressUser={setSelectedUser}
                  selectedUser={selectedUser}
                />
              )}
              onDragBegin={() => {
                handleDragBegin();
              }}
              onDragEnd={({ data, from, to }) => {
                if (from !== to) {
                  handleDragEnd({ data, from, to } as any);
                } else {
                  // ensure we exit dragging mode even if no movement
                  handleDragEnd({ data } as any);
                }
              }}
              activationDistance={50}
              ListEmptyComponent={renderEmptyState}
              // Disable pull-to-refresh while dragging
              refreshControl={
                !isDragging ? (
                  <RefreshControl
                    refreshing={states.refreshing}
                    onRefresh={onRefresh}
                  />
                ) : undefined
              }
            />
          </View>
        ) : (
          <CustomFlatList
            data={combinedUnique}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <UserCard
                user={item}
                pinnedUsers={pinnedUsers}
                isFriendTab={false}
                onLongPressUser={setSelectedUser}
                selectedUser={selectedUser}
              />
            )}
            ListEmptyComponent={renderEmptyState}
            refreshing={states?.refreshing}
            onRefresh={onRefresh}
          />
        )}
      </View>
    </Container>
  );
};

export default MyFriends;
