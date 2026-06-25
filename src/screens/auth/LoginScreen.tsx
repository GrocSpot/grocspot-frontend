import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useLoginForm } from '../../hooks/useLoginForm';
import { useGoogleAuth } from '../../hooks/useGoogleAuth';
import { Input } from '../../components/ui/Input';
import { Divider } from '../../components/ui/Divider';
import type { RootStackParamList } from '../../types';
import { Button } from '../../components/ui/button';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Login'>;
};

const EyeIcon = ({ visible }: { visible: boolean }) => (
  <Text className="text-[#9BB5A4] text-base">{visible ? '🙈' : '👁️'}</Text>
);

export default function LoginScreen({ navigation }: Props) {
  const {
    values,
    errors,
    isLoading,
    showPassword,
    handleChange,
    handleSubmit,
    toggleShowPassword,
  } = useLoginForm();

  const {
    signInWithGoogle,
    isLoading: isGoogleLoading,
    error: googleError,
    isReady,
  } = useGoogleAuth();

  const onSuccess = () => navigation.navigate('Home');
  const onUnverified = (email: string) => navigation.navigate('EmailSent', { email });
  const onManager = (storeId: string, accessToken: string) =>
    navigation.reset({
      index: 0,
      routes: [{ name: 'LayoutEditor', params: { storeId, accessToken } }],
    });

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
          {/* Header */}
          <View className="mb-8">
            <View className="w-14 h-14 rounded-2xl bg-[#2D7A4F] items-center justify-center mb-5">
              <Text className="text-white text-2xl">🛒</Text>
            </View>
            <Text className="text-[30px] font-extrabold text-[#1A2E22] leading-tight">
              Welcome back to{'\n'}
              <Text className="text-[#2D7A4F]">GrocSpot</Text>
            </Text>
            <Text className="text-sm text-[#5A7566] mt-2">
              Sign in to continue shopping.
            </Text>
          </View>

          {/* Email + password */}
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
            label="Password"
            placeholder="Your password"
            value={values.password}
            onChangeText={handleChange('password')}
            error={errors.password}
            secureTextEntry={!showPassword}
            autoCapitalize="none"
            returnKeyType="done"
            onSubmitEditing={() => handleSubmit({ onSuccess, onUnverified, onManager })}
            rightIcon={<EyeIcon visible={showPassword} />}
            onRightIconPress={toggleShowPassword}
          />

          {/* Forgot password */}
          <TouchableOpacity className="self-end mb-6 -mt-2">
            <Text className="text-sm font-medium text-[#2D7A4F]">Forgot password?</Text>
          </TouchableOpacity>

          {/* Sign in CTA */}
          <Button
            title="Sign In"
            loading={isLoading}
            onPress={() => handleSubmit({ onSuccess, onUnverified, onManager })}
          />

          <Divider label="or continue with" />

          {/* Social buttons row */}
          <View className="flex-row gap-3">

            {/* Google */}
            <TouchableOpacity
              className={`flex-1 h-14 rounded-xl border border-[#D4E6DC] bg-white items-center justify-center flex-row gap-2 ${(!isReady || isGoogleLoading) ? 'opacity-60' : ''}`}
              onPress={() => signInWithGoogle({ onSuccess, onError: () => {} })}
              disabled={!isReady || isGoogleLoading}
            >
              {isGoogleLoading ? (
                <ActivityIndicator size="small" color="#2D7A4F" />
              ) : (
                <>
                  <Text className="text-lg font-bold" style={{ color: '#4285F4' }}>G</Text>
                  <Text className="text-sm font-semibold text-[#1A2E22]">Google</Text>
                </>
              )}
            </TouchableOpacity>

            {/* Apple — UI only for now */}
            <TouchableOpacity
              className="flex-1 h-14 rounded-xl border border-[#D4E6DC] bg-white items-center justify-center flex-row gap-2"
            >
              <Text className="text-lg">🍎</Text>
              <Text className="text-sm font-semibold text-[#1A2E22]">Apple</Text>
            </TouchableOpacity>

          </View>

          {/* Google error */}
          {googleError ? (
            <Text className="text-xs text-[#D94F3D] text-center mt-3">{googleError}</Text>
          ) : null}

          {/* Footer */}
          <View className="flex-row justify-center items-center mt-8">
            <Text className="text-sm text-[#5A7566]">Don't have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
              <Text className="text-sm font-semibold text-[#2D7A4F]">Sign up</Text>
            </TouchableOpacity>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}