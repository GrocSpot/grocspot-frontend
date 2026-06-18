// ─────────────────────────────────────────────
//  useSignUpForm.ts
//
//  Manages all state for the sign-up form:
//    • field values (5 fields matching the backend)
//    • per-field validation errors
//    • loading state while API call is in flight
//    • password visibility toggles
//    • calls authService.signUp() on submit
//
//  The screen itself has zero business logic —
//  it just reads from this hook and renders.
// ─────────────────────────────────────────────

import { useState } from 'react';
import { signUp, ApiError } from '../services/authService';

// ── Form shape ────────────────────────────────

export interface SignUpFormValues {
  firstName: string;
  lastName: string;
  email: string;
  mobileNumber: string;
  password: string;
  confirmPassword: string;
}

type FormErrors = Partial<Record<keyof SignUpFormValues, string>>;

// ── Validation ────────────────────────────────

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MOBILE_REGEX = /^[6-9]\d{9}$/; // Indian mobile: starts 6-9, 10 digits
const PASSWORD_REGEX =
  /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&#^])[A-Za-z\d@$!%*?&#^]{8,}$/;

function validate(values: SignUpFormValues): FormErrors {
  const errors: FormErrors = {};

  if (!values.firstName.trim()) {
    errors.firstName = 'First name is required.';
  }

  if (!values.lastName.trim()) {
    errors.lastName = 'Last name is required.';
  }

  if (!values.email.trim()) {
    errors.email = 'Email address is required.';
  } else if (!EMAIL_REGEX.test(values.email.trim())) {
    errors.email = 'Enter a valid email address.';
  }

  if (!values.mobileNumber.trim()) {
    errors.mobileNumber = 'Mobile number is required.';
  } else if (!MOBILE_REGEX.test(values.mobileNumber.trim())) {
    errors.mobileNumber = 'Enter a valid 10-digit mobile number.';
  }

  if (!values.password) {
    errors.password = 'Password is required.';
  } else if (!PASSWORD_REGEX.test(values.password)) {
    errors.password =
      'Min 8 chars with uppercase, lowercase, number & special char.';
  }

  if (!values.confirmPassword) {
    errors.confirmPassword = 'Please confirm your password.';
  } else if (values.password !== values.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match.';
  }

  return errors;
}

// ── Hook ─────────────────────────────────────

export function useSignUpForm() {
  const [values, setValues] = useState<SignUpFormValues>({
    firstName: '',
    lastName: '',
    email: '',
    mobileNumber: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Update a single field and clear its error immediately on edit
  const handleChange = (field: keyof SignUpFormValues) => (value: string) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  // Called by the screen's "Create Account" button.
  // onSuccess: navigation callback injected by the screen.
  const handleSubmit = async (onSuccess: () => void) => {
    // 1. Run client-side validation first (no network call if invalid)
    const validationErrors = validate(values);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);
    try {
      // 2. Call the backend
      await signUp({
        firstName: values.firstName.trim(),
        lastName: values.lastName.trim(),
        email: values.email.trim(),
        mobileNumber: values.mobileNumber.trim(),
        password: values.password,
      });

      // 3. On success — let the screen navigate
      onSuccess();
    } catch (err) {
      // 4. Show the backend error message inline under the email field
      if (err instanceof ApiError) {
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
    showConfirmPassword,
    handleChange,
    handleSubmit,
    toggleShowPassword: () => setShowPassword((v) => !v),
    toggleShowConfirmPassword: () => setShowConfirmPassword((v) => !v),
  };
}