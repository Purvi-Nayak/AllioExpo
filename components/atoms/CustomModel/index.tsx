import { useTheme } from '@react-navigation/native';
import React, { memo } from 'react';
import {
  GestureResponderEvent,
  Image,
  Modal,
  TouchableOpacity,
  View,
} from 'react-native';
import { ICONS } from '../../../assets';
import CustomLoader from '../CustomLoader';
import Text from '../Text';
import useStyle from './style';

interface CustomModalProps {
  visible: boolean | any;
  title: string;
  description?: string;
  onClose?: (event: GestureResponderEvent) => void;
  children?: React.ReactNode;
  loading?: boolean;
}

const CustomModal: React.FC<CustomModalProps> = ({
  visible,
  title,
  description,
  onClose,
  children,
  loading,
}) => {
  const { colors } = useTheme();
  const styles = useStyle();

  return (
    <>
      <Modal
        transparent
        animationType="fade"
        presentationStyle="overFullScreen"
        visible={visible}
        onRequestClose={onClose}>
        <View style={[styles.overlay, { backgroundColor: colors.modelbg }]}>
          <View style={[styles.card, { backgroundColor: colors.text }]}>
            {onClose && (
              <TouchableOpacity
                onPress={onClose}
                style={styles.closeIconContainer}>
                <Image
                  source={ICONS.cancel}
                  style={styles.closeIcon}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            )}

            <Text type="bold" style={styles.title}>
              {title}
            </Text>

            {description && (
              <Text style={styles.description}>{description}</Text>
            )}

            <View style={styles.children}>{children}</View>
          </View>
        </View>
      </Modal>
      {loading && <CustomLoader visible={loading} />}
    </>
  );
};

export default memo(CustomModal);
