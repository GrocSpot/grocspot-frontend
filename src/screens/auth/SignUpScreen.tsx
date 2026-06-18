// ─────────────────────────────────────────────
//  SignUpScreen.tsx
//
//  Renders the sign-up form.
//  Has ZERO business logic — all state and
//  API calls live in useSignUpForm.
//
//  On success → navigates to 'EmailSent' screen.
// ─────────────────────────────────────────────

import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSignUpForm } from '../../hooks/useSignUpForm';
import { RootStackParamList } from '../../types';
import { Input } from '../../components/ui/Input';
import { Divider } from '../../components/ui/Divider';
import { Button } from '../../components/ui/button';

// ── Types ────────────────────────────────────

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'SignUp'>;
};

// ── Eye toggle icon ──────────────────────────

const EyeIcon = ({ visible }: { visible: boolean }) => (
  <Text className="text-[#9BB5A4] text-base">{visible ? '🙈' : '👁️'}</Text>
);

// ── Screen ───────────────────────────────────

export default function SignUpScreen({ navigation }: Props) {
  const {
    values,
    errors,
    isLoading,
    showPassword,
    showConfirmPassword,
    handleChange,
    handleSubmit,
    toggleShowPassword,
    toggleShowConfirmPassword,
  } = useSignUpForm();

  // This runs after a successful API call
  const onSuccess = () => {
    navigation.navigate('EmailSent', { email: values.email.trim() });
  };

  return (
    <SafeAreaView className="flex-1 bg-[#F8FBF9]">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView
          contentContainerClassName="flex-grow px-6 py-8"
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >

          {/* ── Header ── */}
          <View className="mb-8">
            <View className="w-14 h-14 rounded-2xl bg-[#2D7A4F] items-center justify-center mb-5">
              <Text className="text-white text-2xl">🛒</Text>
            </View>
            <Text className="text-[30px] font-extrabold text-[#1A2E22] leading-tight">
              Create your{'\n'}
              <Text className="text-[#2D7A4F]">GrocSpot</Text> account
            </Text>
            <Text className="text-sm text-[#5A7566] mt-2">
              Fresh groceries, delivered fast. Let's get you set up.
            </Text>
          </View>

          {/* ── Form fields ── */}

          {/* Row: First + Last name side by side */}
          <View className="flex-row gap-3 mb-0">
            <View className="flex-1">
              <Input
                label="First Name"
                placeholder="John"
                value={values.firstName}
                onChangeText={handleChange('firstName')}
                error={errors.firstName}
                autoCapitalize="words"
                returnKeyType="next"
              />
            </View>
            <View className="flex-1">
              <Input
                label="Last Name"
                placeholder="Doe"
                value={values.lastName}
                onChangeText={handleChange('lastName')}
                error={errors.lastName}
                autoCapitalize="words"
                returnKeyType="next"
              />
            </View>
          </View>

          <Input
            label="Email Address"
            placeholder="john@example.com"
            value={values.email}
            onChangeText={handleChange('email')}
            error={errors.email}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            returnKeyType="next"
          />

          <Input
            label="Mobile Number"
            placeholder="9876543210"
            value={values.mobileNumber}
            onChangeText={handleChange('mobileNumber')}
            error={errors.mobileNumber}
            keyboardType="phone-pad"
            returnKeyType="next"
            maxLength={10}
          />

          <Input
            label="Password"
            placeholder="Min 8 chars, uppercase, number & symbol"
            value={values.password}
            onChangeText={handleChange('password')}
            error={errors.password}
            secureTextEntry={!showPassword}
            autoCapitalize="none"
            returnKeyType="next"
            rightIcon={<EyeIcon visible={showPassword} />}
            onRightIconPress={toggleShowPassword}
          />

          <Input
            label="Confirm Password"
            placeholder="Repeat your password"
            value={values.confirmPassword}
            onChangeText={handleChange('confirmPassword')}
            error={errors.confirmPassword}
            secureTextEntry={!showConfirmPassword}
            autoCapitalize="none"
            returnKeyType="done"
            onSubmitEditing={() => handleSubmit(onSuccess)}
            rightIcon={<EyeIcon visible={showConfirmPassword} />}
            onRightIconPress={toggleShowConfirmPassword}
          />

          {/* ── Terms ── */}
          <Text className="text-xs text-[#9BB5A4] mb-6 leading-5">
            By creating an account you agree to our{' '}
            <Text className="text-[#2D7A4F] font-medium">Terms of Service</Text>{' '}
            and{' '}
            <Text className="text-[#2D7A4F] font-medium">Privacy Policy</Text>.
          </Text>

          {/* ── CTA ── */}
          <Button
            title="Create Account"
            loading={isLoading}
            onPress={() => handleSubmit(onSuccess)}
          />

          <Divider label="or continue with" />

          {/* ── Footer ── */}
          <View className="flex-row justify-center items-center mt-8">
            <Text className="text-sm text-[#5A7566]">Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text className="text-sm font-semibold text-[#2D7A4F]">Sign in</Text>
            </TouchableOpacity>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}