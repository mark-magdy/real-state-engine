'use client';

import { GenericAnalysisPage } from '@/features/analysis';

export default function PropertyCountsPage() {
  return (
    <GenericAnalysisPage
      endpoint="property-counts"
      title="Property Counts by Area"
      subtitle="See the distribution of property types and inventory counts across different areas."
    />
  );
}
