import { ENV } from '../config/env';

const BASE_URL = ENV.API_BASE_URL;

// ── Shared error class ────────────────────────

export class ApiError extends Error {
  constructor(
    public statusCode: number,
    message: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// ── Types ─────────────────────────────────────

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

// ── signup ────────────────────────────────────

export async function signUp(payload: SignUpPayload): Promise<SignUpResponse> {
  const response = await fetch(`${BASE_URL}/api/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', accept: '*/*' },
    body: JSON.stringify(payload),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message = data?.message || data?.error || `Request failed (${response.status})`;
    throw new ApiError(response.status, message);
  }

  return data as SignUpResponse;
}

// ── login ─────────────────────────────────────

export async function login(payload: LoginPayload): Promise<LoginResponse> {
  const response = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', accept: '*/*' },
    body: JSON.stringify(payload),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message = data?.message || data?.error || `Request failed (${response.status})`;
    throw new ApiError(response.status, message);
  }

  return data as LoginResponse;
}

// ── googleLogin ───────────────────────────────
//
//  Sends the Google id_token to your backend.
//  Backend verifies it with Google and returns
//  the same LoginResponse shape as email/password.

export async function googleLogin(googleToken: string): Promise<LoginResponse> {
  const response = await fetch(`${BASE_URL}/api/auth/google`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', accept: '*/*' },
    body: JSON.stringify({ token: googleToken }),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message = data?.message || data?.error || `Request failed (${response.status})`;
    throw new ApiError(response.status, message);
  }

  return data as LoginResponse;
}

// ── resendVerification ────────────────────────

export async function resendVerification(email: string): Promise<string> {
  const response = await fetch(`${BASE_URL}/api/auth/resend-verification`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', accept: '*/*' },
    body: JSON.stringify({ email }),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message = data?.message || data?.error || `Request failed (${response.status})`;
    throw new ApiError(response.status, message);
  }

  return data?.message ?? 'Verification email sent.';
}