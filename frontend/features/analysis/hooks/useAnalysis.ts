'use client';

import { useApi } from '@/shared/hooks/useApi';

export function useAnalysis<T = Record<string, unknown>>(endpoint: string) {
  return useApi<T>(`/analysis/${endpoint}`);
}
