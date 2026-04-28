'use client';

import { useApi } from '@/shared/hooks/useApi';
import type { Property } from '@/shared/types/common.types';

export function useProperties() {
  return useApi<Property[]>('/properties');
}

export function useProperty(id: string) {
  return useApi<Property>(`/properties/${id}`);
}
