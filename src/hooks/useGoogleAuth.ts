// ─────────────────────────────────────────────
//  src/hooks/useGoogleAuth.ts
// ─────────────────────────────────────────────

import { useState } from 'react';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { makeRedirectUri } from 'expo-auth-session';
import { googleLogin, ApiError } from '../services/authService';
import { tokenStorage } from '../storage/tokenStorage';
import { ENV } from '../config/env';

WebBrowser.maybeCompleteAuthSession();

export function useGoogleAuth() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [request, response, promptAsync] = Google.useAuthRequest({
    webClientId: ENV.GOOGLE_CLIENT_ID_WEB,
    redirectUri: makeRedirectUri(),
  });

  const signInWithGoogle = async (callbacks: {
    onSuccess: () => void;
    onError?: (message: string) => void;
  }) => {
    setError(null);
    setIsLoading(true);

    try {
      const result = await promptAsync();

      if (result.type !== 'success') {
        setIsLoading(false);
        return;
      }

      const googleToken =
        result.params?.id_token ?? result.authentication?.idToken;

      if (!googleToken) {
        throw new Error('No token received from Google.');
      }

      const data = await googleLogin(googleToken);
      await tokenStorage.save(data.response.accessToken);
      callbacks.onSuccess();
    } catch (err) {
      const message =
        err instanceof ApiError
          ? err.message
          : 'Google sign-in failed. Please try again.';
      setError(message);
      callbacks.onError?.(message);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    signInWithGoogle,
    isLoading,
    error,
    isReady: !!request,
  };
}