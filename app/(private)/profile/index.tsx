import { Container } from "@/components";
import CustomFlatList from "@/components/atoms/FlatList";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import useStyle from "./style";
import useProfile from "./useProfile";

export default function ProfileScreen() {
  const styles = useStyle();
  const params = useLocalSearchParams();
  const routeEmail = params?.userEmail;

  const { states, data, isExternalProfile, navigateToMyFriends, isFriend } =
    useProfile({ userEmail: routeEmail });

  const displayName =
    (data.firstName && data.lastName && `${data.firstName} ${data.lastName}`) ||
    data.firstName ||
    data.lastName ||
    "";

  const imageSource = data.profileImage
    ? { uri: data.profileImage }
    : undefined;

  return (
    <Container showLoader={false} showBackArrow title="Profile">
      <View style={styles.container}>
        <View style={styles.profileHeaderContainer}>
          <View style={styles.topSectionContainer}>
            <View style={styles.profileImageContainer}>
              <Image
                source={imageSource}
                style={styles.profileImage}
                defaultSource={undefined}
              />
              <View style={styles.onlineIndicator} />
            </View>

            <View style={styles.nameAndStatsContainer}>
              {displayName ? (
                <Text style={styles.displayName}>{displayName}</Text>
              ) : null}

              <View style={styles.profileStats}>
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>
                    {data.allImages?.length || 0}
                  </Text>
                  <Text style={styles.statLabel}>Images</Text>
                </View>

                <View style={styles.statSeparator} />

                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>
                    {data.allVideos?.length || 0}
                  </Text>
                  <Text style={styles.statLabel}>Videos</Text>
                </View>

                <View style={styles.statSeparator} />

                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>0</Text>
                  <Text style={styles.statLabel}>Reels</Text>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.profileInfoContainer}>
            <Text style={styles.email}>{data.email}</Text>
            {data.mobileNo ? (
              <Text style={styles.mobileNo}>{data.mobileNo}</Text>
            ) : null}
          </View>

          {isExternalProfile ? (
            isFriend ? (
              <TouchableOpacity
                style={styles.actionButton}
                onPress={navigateToMyFriends}
              >
                <Text style={styles.actionButtonText}>Friend Request</Text>
              </TouchableOpacity>
            ) : null
          ) : null}
        </View>

        <View style={styles.contentContainer}>
          <View style={styles.contentHeader}>
            <TouchableOpacity
              style={[
                styles.tab,
                states.activeTab === "images" && styles.activeTab,
              ]}
              onPress={() => states.setActiveTab("images")}
            >
              <Text
                style={[
                  styles.tabText,
                  states.activeTab === "images" && styles.activeTabText,
                ]}
              >
                Images
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.tab,
                states.activeTab === "videos" && styles.activeTab,
              ]}
              onPress={() => states.setActiveTab("videos")}
            >
              <Text
                style={[
                  styles.tabText,
                  states.activeTab === "videos" && styles.activeTabText,
                ]}
              >
                Videos
              </Text>
            </TouchableOpacity>
          </View>

          {states.activeTab === "videos" ? (
            <CustomFlatList
              key="videos"
              data={data.videos || []}
              renderItem={({ item }: { item: any }) => (
                <View style={{ width: "48%", marginBottom: 12 }}>
                  <Text>Video</Text>
                </View>
              )}
              numColumns={2}
              columnWrapperStyle={styles.gridRow}
              contentContainerStyle={styles.gridContent}
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>No Videos Yet</Text>
                </View>
              }
            />
          ) : (
            <CustomFlatList
              key="images"
              data={data.images || []}
              renderItem={({ item }: { item: any }) => (
                <Image source={{ uri: item }} style={styles.mediaItem} />
              )}
              numColumns={2}
              columnWrapperStyle={styles.gridRow}
              contentContainerStyle={styles.gridContent}
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>No Images Yet</Text>
                </View>
              }
            />
          )}
        </View>
      </View>
    </Container>
  );
}
