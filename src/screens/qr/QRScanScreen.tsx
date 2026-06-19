import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import type { RootStackParamList } from '../../types';
import { tokenStorage } from '../../storage/tokenStorage';
import { decodeQRToken, isQRTokenExpired } from '../../utils/tokenUtils';
import { initGuestSession } from '../../services/sessionService';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'QRScan'>;
  route: RouteProp<RootStackParamList, 'QRScan'>;
};

type Status = 'resolving' | 'error';

export default function QRScanScreen({ navigation, route }: Props) {
  const { token: qrToken } = route.params;
  const [status, setStatus] = useState<Status>('resolving');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    let cancelled = false;

    async function resolve() {
      // 1. Decode and validate the QR token client-side
      const payload = decodeQRToken(qrToken);

      if (!payload) {
        if (!cancelled) { setErrorMsg('Invalid QR code.'); setStatus('error'); }
        return;
      }

      if (isQRTokenExpired(qrToken)) {
        if (!cancelled) { setErrorMsg('This QR code has expired. Ask store staff to refresh it.'); setStatus('error'); }
        return;
      }

      const storeId = payload.sub; // sub = storeId

      // 2. Check if this device has a logged-in user
      const savedAccessToken = await tokenStorage.get();

      if (savedAccessToken) {
        // ── APP USER ──────────────────────────
        // Already authenticated. Use their token directly.
        // No session/init call needed.
        if (!cancelled) {
          navigation.replace('SessionHome', {
            storeId,
            sessionToken: savedAccessToken,
            // sessionId omitted — not applicable for app users
          });
        }
        return;
      }

      // ── GUEST ─────────────────────────────
      // No login. Call session/init to get a session token.
      try {
        const result = await initGuestSession(qrToken);
        if (!cancelled) {
          navigation.replace('SessionHome', {
            storeId: result.response.storeId,
            sessionId: result.response.sessionId,
            sessionToken: result.response.sessionToken,
          });
        }
      } catch (err: any) {
        if (!cancelled) {
          setErrorMsg(err?.message ?? 'Could not start session. Please scan again.');
          setStatus('error');
        }
      }
    }

    resolve();
    return () => { cancelled = true; };
  }, [qrToken, navigation]);

  if (status === 'error') {
    return (
      <SafeAreaView className="flex-1 bg-[#F0FDF4] items-center justify-center px-8">
        <Text className="text-5xl mb-4">😕</Text>
        <Text className="text-base font-bold text-[#1F2937] text-center mb-2">
          Something went wrong
        </Text>
        <Text className="text-sm text-[#6B7280] text-center">{errorMsg}</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-[#F0FDF4] items-center justify-center gap-4">
      <View className="w-16 h-16 rounded-2xl bg-[#166534] items-center justify-center">
        <Text className="text-3xl">🛒</Text>
      </View>
      <ActivityIndicator color="#166534" size="large" />
      <Text className="text-sm text-[#6B7280] mt-2">Starting your session…</Text>
    </SafeAreaView>
  );
}