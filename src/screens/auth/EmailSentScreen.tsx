// ─────────────────────────────────────────────
//  EmailSentScreen.tsx
//
//  Shown immediately after a successful signup.
//  Receives `email` from navigation params and
//  displays a "check your inbox" message.
//
//  The user can:
//    • Tap "Open email app" (platform deep link)
//    • Tap "Back to sign in" → Login screen
// ─────────────────────────────────────────────

import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Linking,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import type { RootStackParamList } from '../../types';
import { resendVerification } from '../../services/authService';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'EmailSent'>;
  route: RouteProp<RootStackParamList, 'EmailSent'>;
};

type ResendState = 'idle' | 'loading' | 'success' | 'error';

export default function EmailSentScreen({ navigation, route }: Props) {
  const { email } = route.params;

  const [resendState, setResendState] = useState<ResendState>('idle');
  const [resendMessage, setResendMessage] = useState('');

  const handleResend = async () => {
    if (resendState === 'loading' || resendState === 'success') return;

    setResendState('loading');
    try {
      const message = await resendVerification(email);
      setResendMessage(message);
      setResendState('success');
    } catch (err: any) {
      setResendMessage(err?.message ?? 'Something went wrong. Please try again.');
      setResendState('error');
    }
  };

  const openEmailApp = () => {
    Linking.openURL('mailto:');
  };

  return (
    <SafeAreaView className="flex-1 bg-[#F8FBF9]">
      <View className="flex-1 items-center justify-center px-8">

        {/* Icon */}
        <View className="w-24 h-24 rounded-full bg-[#E8F2EC] items-center justify-center mb-8">
          <Text className="text-5xl">📧</Text>
        </View>

        {/* Heading */}
        <Text className="text-[28px] font-extrabold text-[#1A2E22] text-center leading-tight mb-3">
          Check your inbox
        </Text>

        {/* Body */}
        <Text className="text-sm text-[#5A7566] text-center leading-6 mb-2">
          We sent a verification link to
        </Text>
        <Text className="text-base font-semibold text-[#2D7A4F] text-center mb-4">
          {email}
        </Text>
        <Text className="text-sm text-[#5A7566] text-center leading-6 mb-8">
          Click the link in the email to activate your account.
          The link expires in 24 hours.
        </Text>

        {/* Open mail CTA */}
        <TouchableOpacity
          className="w-full h-14 rounded-xl bg-[#2D7A4F] items-center justify-center mb-6"
          onPress={openEmailApp}
        >
          <Text className="text-white font-semibold text-base">Open email app</Text>
        </TouchableOpacity>

        {/* Resend section */}
        <View className="items-center mb-8">
          <Text className="text-sm text-[#5A7566] mb-2">
            Didn't receive it? Check your spam or
          </Text>

          {resendState === 'loading' ? (
            <View className="flex-row items-center gap-2 py-1">
              <ActivityIndicator size="small" color="#2D7A4F" />
              <Text className="text-sm text-[#2D7A4F]">Sending…</Text>
            </View>
          ) : resendState === 'success' ? (
            <View className="flex-row items-center gap-1 py-1">
              <Text className="text-sm text-[#2D7A4F]">✓</Text>
              <Text className="text-sm font-medium text-[#2D7A4F]">Email sent</Text>
            </View>
          ) : (
            <TouchableOpacity onPress={handleResend} className="py-1">
              <Text className="text-sm font-semibold text-[#2D7A4F] underline">
                resend the email
              </Text>
            </TouchableOpacity>
          )}

          {resendState === 'error' && (
            <Text className="text-xs text-[#D94F3D] text-center mt-2">
              {resendMessage}
            </Text>
          )}
        </View>

        {/* Divider */}
        <View className="flex-row items-center w-full mb-6">
          <View className="flex-1 h-px bg-[#E8F2EC]" />
          <Text className="text-xs text-[#9BB5A4] mx-3">or</Text>
          <View className="flex-1 h-px bg-[#E8F2EC]" />
        </View>

        {/* Back to sign in */}
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text className="text-sm font-semibold text-[#5A7566]">
            Back to sign in
          </Text>
        </TouchableOpacity>

      </View>
    </SafeAreaView>
  );
}