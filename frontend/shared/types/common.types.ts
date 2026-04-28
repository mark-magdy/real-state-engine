export interface Property {
  id: string;
  title: string;
  property_type: string;
  down_payment: number | null;
  installment: number | null;
  area: string;
  compound: string;
  meter_square: number;
  bedrooms: number;
  bathrooms: number;
  rent: number | null;
  full_price: number | null;
  price?: number | null;
  listing_type?: string;
  url?: string;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
}
