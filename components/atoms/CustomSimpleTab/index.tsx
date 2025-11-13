import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import useStyle from "./style";

interface Tab {
  id: string;
  title: string;
}

interface CustomSimpleTabProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

export const CustomSimpleTab: React.FC<CustomSimpleTabProps> = ({
  tabs,
  activeTab,
  onTabChange,
}) => {
  const styles = useStyle();

  return (
    <View style={styles.container}>
      <View style={styles.tabContainer}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.id}
            style={[styles.tab, activeTab === tab.id && styles.activeTab]}
            onPress={() => onTabChange(tab.id)}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === tab.id && styles.activeTabText,
              ]}
            >
              {tab.title}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.indicator}>
        <View
          style={[
            styles.activeIndicator,
            {
              left: `${
                (tabs.findIndex((tab) => tab.id === activeTab) * 100) /
                tabs.length
              }%`,
              width: `${100 / tabs.length}%`,
            },
          ]}
        />
      </View>
    </View>
  );
};
