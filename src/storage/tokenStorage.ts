import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

const ACCESS_TOKEN_KEY = 'grocspot_access_token';

export const tokenStorage = {
  async save(token: string) {
    if (Platform.OS === 'web') {
      localStorage.setItem(ACCESS_TOKEN_KEY, token);
      return;
    }

    await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, token);
  },

  async get() {
    if (Platform.OS === 'web') {
      return localStorage.getItem(ACCESS_TOKEN_KEY);
    }

    return await SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
  },

  async clear() {
    if (Platform.OS === 'web') {
      localStorage.removeItem(ACCESS_TOKEN_KEY);
      return;
    }

    await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
  },
};