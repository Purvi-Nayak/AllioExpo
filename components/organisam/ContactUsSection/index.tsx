import Button from "@components/atoms/Button";
import Text from "@components/atoms/Text";
import ContactFormModal from "@components/molecule/ContactForm";
import React, { memo, useState } from "react";
import { Platform, View } from "react-native";
import useStyle from "./style";

const ContactUsSection: React.FC = () => {
  const styles = useStyle();
  const [modalVisible, setModalVisible] = useState(false);

  const handleOpen = () => setModalVisible(true);
  const handleClose = () => setModalVisible(false);

  const handleSubmit = (fields: {
    name: string;
    mobile: string;
    email: string;
    message: string;
  }) => {
    // Handle form submission (e.g., send to backend, show toast, etc.)
  };

  if (Platform.OS === "web") {
    return (
      <View style={styles.webContainer}>
        <View style={styles.webContent}>
          <Text type="bold" style={styles.webTitle}>
            Ready to Get Started?
          </Text>
          <Text style={styles.webSubtitle}>
            Have questions or need support? We&apos;re here to help you make the
            most of ALLIO.
          </Text>
          <View style={styles.webButtonContainer}>
            <Button
              title="Contact Us"
              onPress={handleOpen}
              style={styles.webContactButton}
              textStyle={styles.webButtonText}
            />
            <Button
              title="Learn More"
              onPress={() => {}}
              style={styles.webSecondaryButton}
              textStyle={styles.webSecondaryButtonText}
            />
          </View>
        </View>
        <ContactFormModal
          visible={modalVisible}
          onClose={handleClose}
          onSubmit={handleSubmit}
        />
      </View>
    );
  }

  return (
    <View style={styles.sectionContainer}>
      <Text type="bold" style={styles.title}>
        Connect with us
      </Text>
      <Button
        title="Contact Us"
        onPress={handleOpen}
        style={styles.contactButton}
      />
      <ContactFormModal
        visible={modalVisible}
        onClose={handleClose}
        onSubmit={handleSubmit}
      />
    </View>
  );
};

export default memo(ContactUsSection);
