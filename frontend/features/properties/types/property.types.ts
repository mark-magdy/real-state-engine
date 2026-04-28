import type { Property } from '@/shared/types/common.types';

export interface PropertySearchResponse {
  properties: Property[];
  total_count: number;
  page: number;
  limit: number;
  total_pages: number;
}

export interface PropertyFilters {
  area?: string;
  listing_type?: string;
  property_type?: string;
  min_price?: string;
  max_price?: string;
  bedrooms?: string;
  bathrooms?: string;
  compound?: string;
  page?: number;
}
