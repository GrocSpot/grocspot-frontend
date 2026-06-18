import Constants from 'expo-constants';

const extra = Constants.expoConfig?.extra ?? {};

export const ENV = {
  API_BASE_URL: (extra.API_BASE_URL as string) ?? 'http://localhost:8080',
  GOOGLE_CLIENT_ID_WEB: (extra.GOOGLE_CLIENT_ID_WEB as string) ?? '',
} as const;