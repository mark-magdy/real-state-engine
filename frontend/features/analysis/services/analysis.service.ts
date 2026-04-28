import { apiClient } from '@/shared/lib/api-client';

export const analysisService = {
  getROI: () => apiClient.get<Record<string, unknown>>('/analysis/roi'),
  getAveragePrice: (location: string) =>
    apiClient.get<Record<string, unknown>>(`/analysis/average-price/${encodeURIComponent(location)}`),
  getPropertyCounts: () =>
    apiClient.get<Record<string, unknown>>('/analysis/property-counts'),
  getAvgPriceByType: () =>
    apiClient.get<Record<string, unknown>>('/analysis/average-price-by-type'),
  getInstallmentsByArea: () =>
    apiClient.get<Record<string, unknown>>('/analysis/installments-by-area'),
  getDownpaymentPercentage: () =>
    apiClient.get<Record<string, unknown>>('/analysis/downpayment-percentage'),
};
