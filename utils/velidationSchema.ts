import * as Yup from 'yup';

const useValidation = () => {
  const loginValidationSchema = Yup.object().shape({
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required')
      .trim(),
    password: Yup.string()
      .min(6, 'Password must be at least 6 characters')
      .required('Password is required')
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        'Password must contain lowercase, uppercase letters and a number'
      ),
  });

  const forgotPasswordSchema = Yup.object().shape({
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required')
      .trim(),
  });

  const registrationValidationSchema = Yup.object().shape({
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required')
      .trim(),
    password: Yup.string()
      .min(6, 'Password must be at least 6 characters')
      .required('Password is required')
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        'Password must contain lowercase, uppercase letters and a number'
      ),
    firstName: Yup.string()
      .required('First name is required')
      .min(2, 'First name must be at least 2 characters'),
    lastName: Yup.string()
      .required('Last name is required')
      .min(2, 'Last name must be at least 2 characters'),
    mobileNo: Yup.string()
      .required('Mobile number is required')
      .matches(/^[0-9]{10}$/, 'Mobile number must be 10 digits'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password')], 'Passwords must match')
      .required('Please confirm your password'),
  });

  const emailOnlyValidationSchema = Yup.object().shape({
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required'),
  });

  const contactUsValidationSchema = Yup.object().shape({
    name: Yup.string()
      .required('Name is required')
      .min(2, 'Name must be at least 2 characters'),
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required')
      .trim(),
    mobile: Yup.string()
      .required('Mobile number is required')
      .matches(/^[0-9]{10}$/, 'Mobile number must be 10 digits'),
    message: Yup.string()
      .required('Message is required')
      .min(10, 'Message must be at least 10 characters'),
  });

  return {
    loginValidationSchema,
    forgotPasswordSchema,
    registrationValidationSchema,
    contactUsValidationSchema,
    emailOnlyValidationSchema,
  };
};

export default useValidation;
