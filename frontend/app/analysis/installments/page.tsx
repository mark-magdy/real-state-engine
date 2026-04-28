'use client';

import { GenericAnalysisPage } from '@/features/analysis';

export default function InstallmentsPage() {
  return (
    <GenericAnalysisPage
      endpoint="installments-by-area"
      title="Installment Plans"
      subtitle="Analyze installment periods and payment structures across different areas."
    />
  );
}
