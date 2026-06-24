import { apiFetch } from './apiClient';
import { API_URLS } from './apiUrls';

export { ApiError } from './apiClient';

export interface SignUpPayload {
  firstName: string;
  lastName: string;
  email: string;
  mobileNumber: string;
  password: string;
}

export interface SignUpResponse {
  message?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  statusCode: number;
  message: string;
  response: {
    accessToken: string;
    tokenType: string;
  };
}

const JSON_HEADERS: HeadersInit = { 'Content-Type': 'application/json', accept: '*/*' };

export async function signUp(payload: SignUpPayload): Promise<SignUpResponse> {
  return apiFetch<SignUpResponse>(API_URLS.auth.signUp, {
    method: 'POST',
    headers: JSON_HEADERS,
    body: JSON.stringify(payload),
  });
}

export async function login(payload: LoginPayload): Promise<LoginResponse> {
  return apiFetch<LoginResponse>(API_URLS.auth.login, {
    method: 'POST',
    headers: JSON_HEADERS,
    body: JSON.stringify(payload),
  });
}

export async function googleLogin(googleToken: string): Promise<LoginResponse> {
  return apiFetch<LoginResponse>(API_URLS.auth.google, {
    method: 'POST',
    headers: JSON_HEADERS,
    body: JSON.stringify({ token: googleToken }),
  });
}

export async function resendVerification(email: string): Promise<string> {
  const data = await apiFetch<{ message?: string }>(API_URLS.auth.resendVerification, {
    method: 'POST',
    headers: JSON_HEADERS,
    body: JSON.stringify({ email }),
  });
  return data?.message ?? 'Verification email sent.';
}
