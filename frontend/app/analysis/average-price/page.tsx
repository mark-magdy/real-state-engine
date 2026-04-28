'use client';

import { GenericAnalysisPage } from '@/features/analysis';

export default function AveragePricePage() {
  return (
    <GenericAnalysisPage
      endpoint="average-price/all"
      title="Average Price by Location"
      subtitle="Compare average property prices across different neighborhoods and cities."
    />
  );
}
