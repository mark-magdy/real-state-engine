'use client';

import { useState, useEffect, useCallback } from 'react';
import { useApi } from '@/shared/hooks/useApi';
import { propertyService } from '../services/property.service';
import type { Property } from '@/shared/types/common.types';
import type { PropertyFilters, PropertySearchResponse } from '../types/property.types';

export function useProperties() {
  return useApi<Property[]>('/properties');
}

export function useProperty(id: string) {
  return useApi<Property>(`/properties/${id}`);
}

export function useSearchProperties(initialFilters: PropertyFilters = {}) {
  const [data, setData] = useState<PropertySearchResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<PropertyFilters>(initialFilters);

  const search = useCallback(async (currentFilters: PropertyFilters) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await propertyService.search(currentFilters);
      setData(result);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch properties');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    search(filters);
  }, [filters, search]);

  const updateFilters = (newFilters: Partial<PropertyFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters, page: newFilters.page ?? 1 }));
  };

  return {
    data,
    isLoading,
    error,
    filters,
    updateFilters,
    refetch: () => search(filters),
  };
}
