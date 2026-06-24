import 'dotenv/config';

const frontendUrl = new URL(process.env.FRONTEND_BASE_URL ?? 'http://localhost:8081');

export default {
  expo: {
    name: 'grocspot-frontend',
    slug: 'grocspot-frontend',
    scheme: 'grocspot',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/icon.png',
    userInterfaceStyle: 'light',
    plugins: [
      'expo-secure-store'
    ],
    ios: {
      supportsTablet: true,
    },
    android: {
      intentFilters: [
        {
          action: 'VIEW',
          autoVerify: true,
          data: [
            {
              scheme: frontendUrl.protocol.replace(':', ''),
              host: frontendUrl.hostname,
              pathPrefix: '/scan',
            },
          ],
          category: ['BROWSABLE', 'DEFAULT'],
        },
      ],
      adaptiveIcon: {
        backgroundColor: '#E6F4FE',
        foregroundImage: './assets/android-icon-foreground.png',
        backgroundImage: './assets/android-icon-background.png',
        monochromeImage: './assets/android-icon-monochrome.png',
      },
      predictiveBackGestureEnabled: false,
    },
    web: {
      favicon: './assets/favicon.png',
    },
    extra: {
      API_BASE_URL: process.env.API_BASE_URL,
      FRONTEND_BASE_URL: process.env.FRONTEND_BASE_URL,
      GOOGLE_CLIENT_ID_WEB: process.env.GOOGLE_CLIENT_ID_WEB,
      GOOGLE_CLIENT_ID_ANDROID: process.env.GOOGLE_CLIENT_ID_ANDROID,
      GOOGLE_CLIENT_ID_IOS: process.env.GOOGLE_CLIENT_ID_IOS,
    },
  }
};