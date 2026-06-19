import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

const SESSION_KEY = 'grocspot_session';

export interface StoredSession {
  sessionToken: string;
  storeId: string;
  sessionId?: string;
}

function isExpired(token: string): boolean {
  try {
    const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64 + '=='.slice(0, (4 - (base64.length % 4)) % 4);
    const payload = JSON.parse(atob(padded));
    return payload.exp * 1000 < Date.now();
  } catch {
    return true;
  }
}

async function getRaw(): Promise<string | null> {
  if (Platform.OS === 'web') return localStorage.getItem(SESSION_KEY);
  return SecureStore.getItemAsync(SESSION_KEY);
}

async function setRaw(value: string): Promise<void> {
  if (Platform.OS === 'web') { localStorage.setItem(SESSION_KEY, value); return; }
  await SecureStore.setItemAsync(SESSION_KEY, value);
}

async function deleteRaw(): Promise<void> {
  if (Platform.OS === 'web') { localStorage.removeItem(SESSION_KEY); return; }
  await SecureStore.deleteItemAsync(SESSION_KEY);
}

export const sessionStorage = {
  async save(session: StoredSession): Promise<void> {
    await setRaw(JSON.stringify(session));
  },

  async get(): Promise<StoredSession | null> {
    try {
      const raw = await getRaw();
      if (!raw) return null;
      const session: StoredSession = JSON.parse(raw);
      if (isExpired(session.sessionToken)) {
        await deleteRaw();
        return null;
      }
      return session;
    } catch {
      return null;
    }
  },

  async clear(): Promise<void> {
    await deleteRaw();
  },
};
