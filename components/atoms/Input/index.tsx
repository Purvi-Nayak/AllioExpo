// // components/ui/Input/index.tsx
// import { useTheme } from "@react-navigation/native";
// import React, { useState } from "react";
// import {
//   Image,
//   KeyboardTypeOptions,
//   TextInput,
//   TouchableOpacity,
//   View,
// } from "react-native";
// import { ICONS } from "../../../assets";
// import Text from "../Text";
// import useStyle from "./style";

// interface InputProps {
//   label?: string;
//   placeholder?: string;
//   value?: string;
//   onChangeText?: (text: string) => void;
//   onBlur?: (e?: any) => void;
//   keyboardType?: KeyboardTypeOptions;
//   autoCapitalize?: "none" | "sentences" | "words" | "characters";
//   maxLength?: number;
//   multiline?: boolean;
//   numberOfLines?: number;
//   secureTextEntry?: boolean;
//   editable?: boolean;
//   error?: string;
//   touched?: boolean;
//   containerStyle?: any;
//   inputStyle?: any;
//   labelStyle?: any;
//   errorStyle?: any;
// }

// const Input: React.FC<InputProps> = ({
//   label,
//   placeholder,
//   value,
//   onChangeText,
//   onBlur,
//   keyboardType = "default",
//   autoCapitalize = "none",
//   maxLength,
//   multiline = false,
//   numberOfLines = 1,
//   secureTextEntry = false,
//   editable = true,
//   error,
//   touched,
//   containerStyle,
//   inputStyle,
//   labelStyle,
//   errorStyle,
//   ...props
// }) => {
//   const { colors } = useTheme();
//   const styles = useStyle();
//   const [isFocused, setIsFocused] = useState(false);
//   const [isPasswordVisible, setIsPasswordVisible] = useState(false);

//   const hasError = Boolean(error && touched);

//   return (
//     <View style={[styles.wrapper, containerStyle]}>
//       {label && <Text style={[styles.label(colors), labelStyle]}>{label}</Text>}

//       <View
//         style={styles.inputContainer(colors, isFocused, hasError, editable)}
//       >
//         <TextInput
//           style={[
//             styles.textInput(colors),
//             multiline && styles.textInputMultiline,
//             inputStyle,
//           ]}
//           value={value}
//           onChangeText={onChangeText}
//           onFocus={() => setIsFocused(true)}
//           onBlur={(e) => {
//             setIsFocused(false);
//             onBlur?.(e);
//           }}
//           placeholder={placeholder}
//           placeholderTextColor={colors.border}
//           keyboardType={keyboardType}
//           autoCapitalize={autoCapitalize}
//           maxLength={maxLength}
//           multiline={multiline}
//           numberOfLines={multiline ? numberOfLines : 1}
//           secureTextEntry={secureTextEntry && !isPasswordVisible}
//           editable={editable}
//           {...props}
//         />

//         {secureTextEntry && (
//           <TouchableOpacity
//             style={styles.passwordToggle}
//             onPress={() => setIsPasswordVisible(!isPasswordVisible)}
//             activeOpacity={0.7}
//           >
//             <Image
//               source={isPasswordVisible ? ICONS.account : ICONS.account}
//               style={styles.icon(colors)}
//             />
//           </TouchableOpacity>
//         )}
//       </View>

//       {hasError && (
//         <Text style={[styles.errorText(colors), errorStyle]}>{error}</Text>
//       )}

//       {maxLength && value && (
//         <Text style={styles.counterText(colors)}>
//           {value.length}/{maxLength}
//         </Text>
//       )}
//     </View>
//   );
// };

// export default Input;
// components/ui/Input/index.tsx
import { useTheme } from "@/constants/Colors"; // Use your custom hook
import React, { useState } from "react";
import {
  Image,
  KeyboardTypeOptions,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { ICONS } from "../../../assets";
import Text from "../Text";
import useStyle from "./style";

interface InputProps {
  label?: string;
  placeholder?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  onBlur?: (e?: any) => void;
  keyboardType?: KeyboardTypeOptions;
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  maxLength?: number;
  multiline?: boolean;
  numberOfLines?: number;
  secureTextEntry?: boolean;
  editable?: boolean;
  error?: string;
  touched?: boolean;
  containerStyle?: any;
  inputStyle?: any;
  labelStyle?: any;
  errorStyle?: any;
}

const Input: React.FC<InputProps> = ({
  label,
  placeholder,
  value,
  onChangeText,
  onBlur,
  keyboardType = "default",
  autoCapitalize = "none",
  maxLength,
  multiline = false,
  numberOfLines = 1,
  secureTextEntry = false,
  editable = true,
  error,
  touched,
  containerStyle,
  inputStyle,
  labelStyle,
  errorStyle,
  ...props
}) => {
  const colors = useTheme(); // Your custom hook returns the theme directly
  const styles = useStyle();
  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const hasError = Boolean(error && touched);

  return (
    <View style={[styles.wrapper, containerStyle]}>
      {label && <Text style={[styles.label, labelStyle]}>{label}</Text>}

      <View
        style={[
          styles.inputContainer,
          isFocused && styles.inputContainerFocused,
          hasError && styles.inputContainerError,
          !editable && styles.inputContainerDisabled,
        ]}
      >
        <TextInput
          style={[
            styles.textInput,
            multiline && styles.textInputMultiline,
            inputStyle,
          ]}
          value={value}
          onChangeText={onChangeText}
          onFocus={() => setIsFocused(true)}
          onBlur={(e) => {
            setIsFocused(false);
            onBlur?.(e);
          }}
          placeholder={placeholder}
          placeholderTextColor={colors.gray}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          maxLength={maxLength}
          multiline={multiline}
          numberOfLines={multiline ? numberOfLines : 1}
          secureTextEntry={secureTextEntry && !isPasswordVisible}
          editable={editable}
          {...props}
        />

        {secureTextEntry && (
          <TouchableOpacity
            style={styles.passwordToggle}
            onPress={() => setIsPasswordVisible(!isPasswordVisible)}
            activeOpacity={0.7}
          >
            <Image
              source={isPasswordVisible ? ICONS.eyeOff : ICONS.eye}
              style={styles.icon}
            />
          </TouchableOpacity>
        )}
      </View>

      {hasError && <Text style={[styles.errorText, errorStyle]}>{error}</Text>}

      {maxLength && value && (
        <Text style={styles.counterText}>
          {value.length}/{maxLength}
        </Text>
      )}
    </View>
  );
};

export default Input;
