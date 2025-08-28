import React, { forwardRef, memo } from "react";
import { FlatList, RefreshControl } from "react-native";
import Text from "../Text";
import useStyle from "./style";

interface CustomFlatListProps {
  data: any[];
  renderItem: ({ item, index }: { item: any; index: number }) => React.ReactNode;
  numColumns?: number;
  columnWrapperStyle?: object;
  contentContainerStyle?: object;
  ListEmptyComponent?: React.ReactNode;
  [key: string]: any;
  refreshing?: boolean;
  onRefresh?: () => void;
}

const CustomFlatList = forwardRef<FlatList<any>, CustomFlatListProps>(
  (
    {
      numColumns = 1,
      columnWrapperStyle,
      contentContainerStyle,
      ListEmptyComponent,
      renderItem,
      data,
      refreshing = false,
      onRefresh,
      ...props
    },
    ref
  ) => {
    const styles = useStyle();

    return (
      <FlatList
        ref={ref}
        data={data}
        renderItem={renderItem}
        numColumns={numColumns}
        showsVerticalScrollIndicator={false}
        keyExtractor={(_, i) => i?.toString()}
        columnWrapperStyle={numColumns > 1 ? columnWrapperStyle : undefined}
        contentContainerStyle={[
          contentContainerStyle,
          data.length === 0 && styles.center,
        ]}
        ListEmptyComponent={
          ListEmptyComponent || (
            <Text type="bold" style={styles.emptyText}>
              No items found.
            </Text>
          )
        }
        removeClippedSubviews={false}
        refreshControl={
          onRefresh ? (
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          ) : undefined
        }
        {...props}
      />
    );
  }
);

export default memo(CustomFlatList);
