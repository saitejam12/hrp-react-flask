import { useState, useEffect } from 'react';
import { api } from '../services/api';
import type { ApiResponse } from '../services/api';

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  status: number | null;
}

export function useApi<T>(endpoint: string) {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: true,
    error: null,
    status: null,
  });

  useEffect(() => {
    const fetchData = async () => {
      setState({ data: null, loading: true, error: null, status: null });
      const response = await api.get<T>(endpoint);

      setState({
        data: response.data || null,
        loading: false,
        error: response.error || null,
        status: response.status,
      });
    };

    fetchData();
  }, [endpoint]);

  return state;
}

export async function useMutation<T>(
  endpoint: string,
  method: 'POST' | 'PUT' | 'DELETE' = 'POST'
) {
  return async (body?: Record<string, unknown>): Promise<ApiResponse<T>> => {
    if (method === 'DELETE') {
      return api.delete<T>(endpoint);
    }

    if (method === 'PUT') {
      return api.put<T>(endpoint, body || {});
    }

    return api.post<T>(endpoint, body || {});
  };
}
