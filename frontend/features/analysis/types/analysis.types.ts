// e:\projects\realstate\real-state-engine\frontend\features\analysis\types\analysis.types.ts

export interface ROIProperty {
  title: string;
  compound?: string;
  apartment_type: string;
  investment_type: string;
  rent: number;
  roi_percentage: number;
  months_to_break_even?: number;
  months_to_recover_year_one_cash?: number;
  down_payment?: number;
  installment?: number;
  avg_full_price?: number;
}

export interface ROIResponse {
  roi: Record<string, ROIProperty[]>;
}

export interface PropertyCountItem {
  area: string;
  property_count: number;
}

export interface PropertyCountResponse {
  property_counts_by_area: PropertyCountItem[];
}

export interface AveragePriceItem {
  property_type: string;
  avg_price: number;
  count?: number;
}

export interface AveragePriceResponse {
  avg_price_by_type: AveragePriceItem[];
}

export interface AveragePriceByAreaItem {
  area: string;
  avg_price: number;
  count?: number;
}

export interface AveragePriceByAreaResponse {
  avg_price_by_area: AveragePriceByAreaItem[];
}

export interface InstallmentsItem {
  area: string;
  avg_installment: number;
  properties_count: number;
}

export interface InstallmentsResponse {
  installments_by_area: InstallmentsItem[];
}

export interface DownpaymentItem {
  area: string;
  avg_downpayment_percentage: number;
}

export interface DownpaymentResponse {
  downpayment_percentage_by_area: DownpaymentItem[];
}
