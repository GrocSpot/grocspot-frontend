import { useState } from 'react';
import { login, ApiError } from '../services/authService';
import { tokenStorage } from '../storage/tokenStorage';
import { getUserRole, decodeAccessToken } from '../utils/tokenUtils';

export interface LoginFormValues {
  email: string;
  password: string;
}

type FormErrors = Partial<Record<keyof LoginFormValues, string>>;


const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(values: LoginFormValues): FormErrors {
  const errors: FormErrors = {};

  if (!values.email.trim()) {
    errors.email = 'Email address is required.';
  } else if (!EMAIL_REGEX.test(values.email.trim())) {
    errors.email = 'Enter a valid email address.';
  }

  if (!values.password) {
    errors.password = 'Password is required.';
  }

  return errors;
}


export function useLoginForm() {
  const [values, setValues] = useState<LoginFormValues>({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (field: keyof LoginFormValues) => (value: string) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (callbacks: {
    onSuccess: () => void;
    onUnverified: (email: string) => void;
    onManager: (storeId: string, accessToken: string) => void; 
  }) => {
    // 1. Client-side validation
    const validationErrors = validate(values);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);
    try {
      // 2. Call the backend
      const data = await login({
        email: values.email.trim(),
        password: values.password,
      });

      // 3. Save token securely on device
      await tokenStorage.save(data.response.accessToken);

      // 4. Navigate to home
       const role = getUserRole(data.response.accessToken);
    const payload = decodeAccessToken(data.response.accessToken);
if (role === 'manager' && payload?.storeId) {
  callbacks.onManager(payload.storeId, data.response.accessToken);
  return;
}
    callbacks.onSuccess();
    } catch (err) {
      if (err instanceof ApiError) {
        // 5a. Email not verified → take them to EmailSent
        //     so they can resend the verification link
        if (
          err.statusCode === 401 &&
          err.message.toLowerCase().includes('verify')
        ) {
          callbacks.onUnverified(values.email.trim());
          return;
        }
        // 5b. Any other error → show inline under email field
        setErrors({ email: err.message });
      } else {
        setErrors({ email: 'Network error. Please try again.' });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return {
    values,
    errors,
    isLoading,
    showPassword,
    handleChange,
    handleSubmit,
    toggleShowPassword: () => setShowPassword((v) => !v),
  };
}   