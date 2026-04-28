'use client';

import { useState, useEffect, useCallback } from 'react';
import { apiClient, type ApiError } from '@/shared/lib/api-client';

interface UseApiState<T> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useApi<T>(endpoint: string | null): UseApiState<T> {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!endpoint) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await apiClient.get<T>(endpoint);
      setData(result);
    } catch (err) {
      const apiErr = err as ApiError;
      setError(apiErr.message || 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  }, [endpoint]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, isLoading, error, refetch: fetchData };
}
