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

    let data: unknown;
    try {
      data = await response.json();
    } catch {
      return {
        status: response.status,
        error: response.ok ? 'Invalid response from server' : `Server error (${response.status})`,
      };
    }

    if (!response.ok) {
      return {
        status: response.status,
        error: (data as Record<string, string>)?.error || 'An error occurred',
      };
    }

    return {
      data: data as T,
      status: response.status,
    };
  } catch {
    return {
      status: 500,
      error: 'Cannot connect to server. Make sure the backend is running.',
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
