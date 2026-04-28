import { apiClient } from '@/shared/lib/api-client';
import type { Property } from '@/shared/types/common.types';

export const propertyService = {
  getAll: () => apiClient.get<Property[]>('/properties'),
  getById: (id: string) => apiClient.get<Property>(`/properties/${id}`),
};
