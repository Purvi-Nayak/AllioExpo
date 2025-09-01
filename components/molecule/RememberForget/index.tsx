import CustomCheckBox from "@components/atoms/CheckBox";
import Text from "@components/atoms/Text";
import { router } from "expo-router";
import React, { memo } from "react";
import { Pressable, View } from "react-native";
import useStyle from "./style";

interface RememberForgotProps {
  remember: boolean;
  onCheckboxPress: () => void;
}

const RememberForgot: React.FC<RememberForgotProps> = ({
  remember,
  onCheckboxPress,
}) => {
  const styles = useStyle();
  return (
    <View style={styles.rememberForgotView}>
      <CustomCheckBox
        label="Remember me"
        checked={remember}
        onPress={onCheckboxPress}
      />

      <Pressable
        onPress={() => router.navigate("/(public)/forgetpassword")}
        style={({ pressed }) => [{ opacity: pressed ? 0.5 : 1 }]}
      >
        <Text style={styles.forgotpassText} type="semibold">
          Forgot Password?
        </Text>
      </Pressable>
    </View>
  );
};

export default memo(RememberForgot);
