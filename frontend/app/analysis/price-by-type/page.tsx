'use client';

import { GenericAnalysisPage } from '@/features/analysis';

export default function PriceByTypePage() {
  return (
    <GenericAnalysisPage
      endpoint="average-price-by-type"
      title="Price by Property Type"
      subtitle="Compare average prices across apartments, villas, townhouses, and more."
    />
  );
}
