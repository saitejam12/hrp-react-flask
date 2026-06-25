const API_BASE_URL = '/api';

export interface ApiResponse<T> {
  data?: T;
  status: number;
  message?: string;
  error?: string;
}

async function makeRequest<T>(
  endpoint: string,
  options?: RequestInit
): Promise<ApiResponse<T>> {
  const url = `${API_BASE_URL}${endpoint}`;

  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        status: response.status,
        error: data.error || 'An error occurred',
      };
    }

    return {
      data,
      status: response.status,
    };
  } catch (error) {
    return {
      status: 500,
      error: error instanceof Error ? error.message : 'Network error',
    };
  }
}

export const api = {
  health: () => makeRequest('/health'),

  get: <T,>(endpoint: string) =>
    makeRequest<T>(endpoint, { method: 'GET' }),

  post: <T,>(endpoint: string, body: Record<string, unknown>) =>
    makeRequest<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(body),
    }),

  put: <T,>(endpoint: string, body: Record<string, unknown>) =>
    makeRequest<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(body),
    }),

  delete: <T,>(endpoint: string) =>
    makeRequest<T>(endpoint, { method: 'DELETE' }),
};
