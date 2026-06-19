import React, { useEffect, useRef, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { NavigationContainer, createNavigationContainerRef } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as Linking from 'expo-linking';
import type { RootStackParamList } from '../types';
import { sessionStorage } from '../storage/sessionStorage';

import SignUpScreen from '../screens/auth/SignUpScreen';
import EmailSentScreen from '../screens/auth/EmailSentScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import HomeScreen from '../screens/home/HomeScreen';
import QRScanScreen from '../screens/qr/QRScanScreen';
import SessionHomeScreen from '../screens/session/SessionHomeScreen';
import SearchScreen from '../screens/search/SearchScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();
const navRef = createNavigationContainerRef<RootStackParamList>();

const prefix = Linking.createURL('/');

const linking = {
  prefixes: [prefix, 'https://grocspot.com', 'http://localhost:8081'],
  config: {
    screens: {
      QRScan: 'scan',
      Login: 'login',
      Home: 'home',
    },
  },
};

export default function RootNavigator() {
  const [ready, setReady] = useState(false);
  const pendingSession = useRef<Parameters<typeof navRef.navigate>[1] & { name?: string } | null>(null);

  useEffect(() => {
    sessionStorage.get().then((session) => {
      if (session) {
        pendingSession.current = session;
      }
      setReady(true);
    });
  }, []);

  if (!ready) {
    return (
      <View style={{ flex: 1, backgroundColor: '#F8FBF9', alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" color="#2D7A4F" />
      </View>
    );
  }

  return (
    <NavigationContainer
      ref={navRef}
      linking={linking}
      onReady={() => {
        const session = pendingSession.current;
        if (session) {
          navRef.navigate('SessionHome', {
            storeId: (session as any).storeId,
            sessionToken: (session as any).sessionToken,
            sessionId: (session as any).sessionId,
          });
        }
      }}
    >
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{ headerShown: false, animation: 'slide_from_right' }}
      >
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
        <Stack.Screen name="EmailSent" component={EmailSentScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="QRScan" component={QRScanScreen} />
        <Stack.Screen name="SessionHome" component={SessionHomeScreen} />
        <Stack.Screen name="Search" component={SearchScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
