import { apiClient } from '@/shared/lib/api-client';
import type {
  ROIResponse,
  PropertyCountResponse,
  AveragePriceResponse,
  InstallmentsResponse,
  DownpaymentResponse,
} from '../types/analysis.types';

const buildUrl = (url: string, filters?: Record<string, string | number>) => {
  if (!filters || Object.keys(filters).length === 0) return url;
  const params = new URLSearchParams(filters as Record<string, string>).toString();
  return `${url}?${params}`;
};

export const analysisService = {
  getROI: (filters?: Record<string, string>) =>
    apiClient.get<ROIResponse>(buildUrl('/analysis/roi', filters)),
  getAveragePrice: (location: string, filters?: Record<string, string>) =>
    apiClient.get<Record<string, unknown>>(buildUrl(`/analysis/average-price/${encodeURIComponent(location)}`, filters)),
  getPropertyCounts: (filters?: Record<string, string>) =>
    apiClient.get<PropertyCountResponse>(buildUrl('/analysis/property-counts', filters)),
  getAvgPriceByType: (filters?: Record<string, string>) =>
    apiClient.get<AveragePriceResponse>(buildUrl('/analysis/average-price-by-type', filters)),
  getInstallmentsByArea: (filters?: Record<string, string>) =>
    apiClient.get<InstallmentsResponse>(buildUrl('/analysis/installments-by-area', filters)),
  getDownpaymentPercentage: (filters?: Record<string, string>) =>
    apiClient.get<DownpaymentResponse>(buildUrl('/analysis/downpayment-percentage', filters)),
};
