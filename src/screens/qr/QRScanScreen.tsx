import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import type { RootStackParamList } from '../../types';
import { ENV } from '../../config/env';
import { sessionStorage } from '../../storage/sessionStorage';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'QRScan'>;
  route: RouteProp<RootStackParamList, 'QRScan'>;
};

type Status = 'loading' | 'success' | 'error';

export default function QRScanScreen({ route, navigation }: Props) {
  const { token } = route.params;
  const [status, setStatus] = useState<Status>('loading');
  const [message, setMessage] = useState('Initializing session…');

  useEffect(() => {
    const initSession = async () => {
      try {
        const res = await fetch(`${ENV.API_BASE_URL}/api/sessions/init`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            qrToken: token,
            deviceInfo: navigator.userAgent ?? 'Unknown device',
          }),
        });

        if (!res.ok) throw new Error(`Server error: ${res.status}`);

        const data = await res.json();
        const storeId: string = data?.response?.storeId;
        const sessionId: string | undefined = data?.response?.sessionId;
        const sessionToken: string = data?.response?.sessionToken;

        if (!storeId) throw new Error('Session response missing store information.');
        if (!sessionToken) throw new Error('Session response missing access token.');

        await sessionStorage.save({ sessionToken, storeId, sessionId });
        navigation.replace('SessionHome', { storeId, sessionId, sessionToken });
      } catch (err: any) {
        setStatus('error');
        setMessage(err?.message ?? 'Something went wrong. Please try again.');
      }
    };

    initSession();
  }, [token]);

  return (
    <SafeAreaView className="flex-1 bg-[#F8FBF9] items-center justify-center px-8">
      <View className="w-20 h-20 rounded-full bg-[#E8F2EC] items-center justify-center mb-6">
        <Text className="text-4xl">
          {status === 'loading' ? '⏳' : status === 'success' ? '✅' : '❌'}
        </Text>
      </View>

      <Text className="text-2xl font-extrabold text-[#1A2E22] text-center mb-3">
        {status === 'loading' ? 'Connecting…' : status === 'success' ? 'You\'re connected!' : 'Failed'}
      </Text>

      <Text className="text-sm text-[#5A7566] text-center leading-6">
        {message}
      </Text>

      {status === 'loading' && (
        <ActivityIndicator className="mt-6" color="#2D7A4F" />
      )}
    </SafeAreaView>
  );
}