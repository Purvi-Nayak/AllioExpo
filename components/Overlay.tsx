import { Canvas, DiffRect, rect, rrect } from "@shopify/react-native-skia";
import { StyleSheet, View, useWindowDimensions } from "react-native";

const innerDimension = 300;

export const Overlay = () => {
  const { width, height } = useWindowDimensions();

  // Recreate shapes when dimensions change
  const outer = rrect(rect(0, 0, width, height), 0, 0);
  const inner = rrect(
    rect(
      width / 2 - innerDimension / 2,
      height / 2 - innerDimension / 2,
      innerDimension,
      innerDimension
    ),
    50,
    50
  );

  return (
    <View style={styles.overlayContainer} pointerEvents="none">
      <Canvas style={{ width, height }}>
        <DiffRect inner={inner} outer={outer} color="black" opacity={0.5} />
      </Canvas>
    </View>
  );
};

const styles = StyleSheet.create({
  overlayContainer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 9999,
    elevation: 9999,
  },
});
