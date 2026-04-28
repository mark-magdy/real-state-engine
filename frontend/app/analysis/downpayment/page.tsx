'use client';

import { GenericAnalysisPage } from '@/features/analysis';

export default function DownpaymentPage() {
  return (
    <GenericAnalysisPage
      endpoint="downpayment-percentage"
      title="Down Payment Analysis"
      subtitle="Compare down payment requirements as a percentage of total cost across areas."
    />
  );
}
