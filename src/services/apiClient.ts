export class ApiError extends Error {
  constructor(
    public statusCode: number,
    message: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export function bearerHeaders(token: string): HeadersInit {
  return {
    'Authorization': `Bearer ${token}`,
    'accept': '*/*',
  };
}

export async function apiFetch<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(url, options);
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = data?.message ?? data?.error ?? `Request failed (${response.status})`;
    throw new ApiError(response.status, message);
  }
  return data as T;
}
