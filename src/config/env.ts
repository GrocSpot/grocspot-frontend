import Constants from 'expo-constants';

const extra = Constants.expoConfig?.extra ?? {};

export const ENV = {
  API_BASE_URL: (extra.API_BASE_URL as string) ?? 'http://localhost:8080',
  FRONTEND_BASE_URL: (extra.FRONTEND_BASE_URL as string) ?? 'http://localhost:8081',
  GOOGLE_CLIENT_ID_WEB: (extra.GOOGLE_CLIENT_ID_WEB as string) ?? '',
  GOOGLE_CLIENT_ID_ANDROID: (extra.GOOGLE_CLIENT_ID_ANDROID as string) ?? '',
  GOOGLE_CLIENT_ID_IOS: (extra.GOOGLE_CLIENT_ID_IOS as string) ?? '',
} as const;