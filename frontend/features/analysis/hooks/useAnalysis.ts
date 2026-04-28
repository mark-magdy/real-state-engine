'use client';

import { useApi } from '@/shared/hooks/useApi';

export function useAnalysis<T = Record<string, unknown>>(endpoint: string, filters?: Record<string, string | number>) {
  if (!filters || Object.keys(filters).length === 0) {
    return useApi<T>(`/analysis/${endpoint}`);
  }
  const params = new URLSearchParams(filters as Record<string, string>).toString();
  return useApi<T>(`/analysis/${endpoint}?${params}`);
}
