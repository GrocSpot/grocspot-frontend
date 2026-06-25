import { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Platform, View, ActivityIndicator } from 'react-native';
import type { RootStackParamList } from '../types';

import SignUpScreen from '../screens/auth/SignUpScreen';
import EmailSentScreen from '../screens/auth/EmailSentScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import HomeScreen from '../screens/home/HomeScreen';
import QRScanScreen from '../screens/qr/QRScanScreen';
import SessionHomeScreen from '../screens/session/SessionHomeScreen';
import { sessionStorage } from '../storage/sessionStorage';
import { ENV } from '../config/env';
import * as Linking from 'expo-linking';
import LayoutEditorScreen from '../screens/layout/LayoutEditorScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();
const frontendUrl = new URL(ENV.FRONTEND_BASE_URL);

const linking = {
  prefixes: [
    Linking.createURL('/'),                                          
    `${frontendUrl.protocol}//${frontendUrl.host}`,                
    'https://grocspot.com',                                       
  ],
  config: {
    screens: {
      QRScan: {
        path: 'scan',
        parse: { token: (token: string) => token },
      },
    },
  },
};
export default function RootNavigator() {
  const [initialRoute, setInitialRoute] =
    useState<keyof RootStackParamList>('Login');
  const [sessionParams, setSessionParams] =
    useState<RootStackParamList['SessionHome'] | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    async function resolveInitialRoute() {
      // On native, always start at Login — deep links handle QR flow
      if (Platform.OS !== 'web') {
        setReady(true);
        return;
      }

      // On web: if URL has ?token= let the linking config handle it (QRScan)
      const hasQRToken = window.location.search.includes('token=');
      if (hasQRToken) {
        setReady(true);
        return;
      }

      // On web reload with no token: check for a saved valid session
      const persisted = await sessionStorage.get();
      if (persisted) {
        setInitialRoute('SessionHome');
        setSessionParams(persisted);
      }

      setReady(true);
    }

    resolveInitialRoute();
  }, []);

  // Don't render navigator until we know the initial route
  if (!ready) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#F0FDF4' }}>
        <ActivityIndicator color="#166534" />
      </View>
    );
  }

  return (
    <NavigationContainer linking={linking}>
      <Stack.Navigator initialRouteName={initialRoute} screenOptions={{ headerShown: false, animation: 'slide_from_right', }} >
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
        <Stack.Screen name="EmailSent" component={EmailSentScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="QRScan" component={QRScanScreen} />
        <Stack.Screen name="SessionHome" component={SessionHomeScreen} initialParams={sessionParams ?? undefined} />
        <Stack.Screen name="LayoutEditor" component={LayoutEditorScreen} options={{ gestureEnabled: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}