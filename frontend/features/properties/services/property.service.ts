import { apiClient } from '@/shared/lib/api-client';
import type { Property } from '@/shared/types/common.types';
import type { PropertyFilters, PropertySearchResponse } from '../types/property.types';

export const propertyService = {
  getAll: () => apiClient.get<Property[]>('/properties'),
  getById: (id: string) => apiClient.get<Property>(`/properties/${id}`),
  search: (filters: PropertyFilters) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        params.append(key, value.toString());
      }
    });
    return apiClient.get<PropertySearchResponse>(`/properties/search?${params.toString()}`);
  },
};
