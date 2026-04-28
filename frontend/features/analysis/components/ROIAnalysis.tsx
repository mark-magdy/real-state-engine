'use client';

import { useAnalysis } from '../hooks/useAnalysis';
import { LoadingSpinner } from '@/shared/components/feedback/LoadingSpinner';
import { ErrorDisplay } from '@/shared/components/feedback/ErrorDisplay';
import { StatCard } from '@/shared/components/data-display/StatCard';
import { Container } from '@/shared/components/layout/Container';
import { PageHeader } from '@/shared/components/layout/PageHeader';
import { TrendingUp } from 'lucide-react';

export function ROIAnalysis() {
  const { data, isLoading, error, refetch } = useAnalysis('roi');

  return (
    <>
      <PageHeader
        title="ROI Analysis"
        subtitle="Calculate return on investment and rental yields across different areas."
      />
      <Container className="py-10">
        {isLoading && <LoadingSpinner text="Calculating ROI..." />}
        {error && <ErrorDisplay message={error} onRetry={refetch} />}
        {data && (
          <div className="space-y-6 animate-fade-in">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              <StatCard
                label="Average ROI"
                value={typeof data === 'object' && data !== null ? JSON.stringify(data) : String(data)}
                icon={TrendingUp}
              />
            </div>
            <div className="rounded-xl border border-border bg-card p-6">
              <h3 className="text-lg font-semibold mb-4">Raw Data</h3>
              <pre className="text-sm text-muted-foreground font-mono bg-muted p-4 rounded-lg overflow-auto">
                {JSON.stringify(data, null, 2)}
              </pre>
            </div>
          </div>
        )}
      </Container>
    </>
  );
}
