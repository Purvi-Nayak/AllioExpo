import { Formik } from 'formik';
import React, { memo, useEffect, useState } from 'react';
import { KeyboardAvoidingView, Platform } from 'react-native';

import useValidation from '@/utils/velidationSchema';
import Button from '@components/atoms/Button';
import Input from '@components/atoms/Input';

import BottomModal from '@components/atoms/BottomModal';
import useStyle from './style';

interface ContactFormModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (fields: {
    name: string;
    mobile: string;
    email: string;
    message: string;
  }) => void;
}

const ContactFormModal: React.FC<ContactFormModalProps> = ({
  visible,
  onClose,
  onSubmit,
}) => {
  const styles = useStyle();
  const { contactUsValidationSchema } = useValidation();

  // Remount Formik on every open to clear touched/errors
  const [formKey, setFormKey] = useState(0);
  useEffect(() => {
    if (visible) setFormKey((k) => k + 1);
  }, [visible]);

  return (
    <Formik
      key={formKey}
      initialValues={{ name: '', mobile: '', email: '', message: '' }}
      validationSchema={contactUsValidationSchema}
      onSubmit={(values, { resetForm }) => {
        onSubmit(values);
        resetForm();
        onClose();
      }}>
      {({
        handleChange,
        handleBlur,
        handleSubmit,
        values,
        errors,
        touched,
        isSubmitting,
      }) => (
        <BottomModal visible={visible} onClose={onClose} title="Contact Us">
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <Input
              placeholder="name"
              value={values.name}
              onChangeText={handleChange('name')}
              onBlur={handleBlur('name')}
              error={touched.name ? errors.name : ''}
              touched={touched.name}
              containerStyle={styles.input}
            />
            <Input
              placeholder="mobile"
              value={values.mobile}
              onChangeText={handleChange('mobile')}
              onBlur={handleBlur('mobile')}
              keyboardType="phone-pad"
              error={touched.mobile ? errors.mobile : ''}
              touched={touched.mobile}
              containerStyle={styles.input}
            />
            <Input
              placeholder="email"
              value={values.email}
              onChangeText={handleChange('email')}
              onBlur={handleBlur('email')}
              keyboardType="email-address"
              error={touched.email ? errors.email : ''}
              touched={touched.email}
              containerStyle={styles.input}
            />
            <Input
              placeholder="message"
              value={values.message}
              onChangeText={handleChange('message')}
              onBlur={handleBlur('message')}
              multiline
              error={touched.message ? errors.message : ''}
              touched={touched.message}
              containerStyle={styles.input}
              inputStyle={styles.messageInput}
            />
            <Button
              title="Send"
              onPress={handleSubmit as any}
              disabled={isSubmitting}
              style={styles.button}
            />
          </KeyboardAvoidingView>
        </BottomModal>
      )}
    </Formik>
  );
};

export default memo(ContactFormModal);
