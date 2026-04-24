const BASE_URL = import.meta.env.VITE_API_URL ?? '/api/v1';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

interface RequestOptions {
  method?: HttpMethod;
  body?: unknown;
  token?: string;
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', body, token } = options;

  const headers: HeadersInit = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const response = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  const json = await response.json();

  if (!response.ok) {
    throw new Error(json.error ?? 'Erro inesperado na requisição');
  }

  return json as T;
}

/* Convenience wrappers */
export const api = {
  get:    <T>(path: string, token?: string) =>
    request<T>(path, { method: 'GET', token }),

  post:   <T>(path: string, body: unknown, token?: string) =>
    request<T>(path, { method: 'POST', body, token }),

  put:    <T>(path: string, body: unknown, token?: string) =>
    request<T>(path, { method: 'PUT', body, token }),

  patch:  <T>(path: string, body: unknown, token?: string) =>
    request<T>(path, { method: 'PATCH', body, token }),

  delete: <T>(path: string, token?: string) =>
    request<T>(path, { method: 'DELETE', token }),
};
