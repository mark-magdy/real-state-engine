'use client';

import { useAnalysis } from '../hooks/useAnalysis';
import { LoadingSpinner } from '@/shared/components/feedback/LoadingSpinner';
import { ErrorDisplay } from '@/shared/components/feedback/ErrorDisplay';
import { Container } from '@/shared/components/layout/Container';
import { PageHeader } from '@/shared/components/layout/PageHeader';

interface GenericAnalysisPageProps {
  endpoint: string;
  title: string;
  subtitle: string;
}

export function GenericAnalysisPage({ endpoint, title, subtitle }: GenericAnalysisPageProps) {
  const { data, isLoading, error, refetch } = useAnalysis(endpoint);

  return (
    <>
      <PageHeader title={title} subtitle={subtitle} />
      <Container className="py-10">
        {isLoading && <LoadingSpinner text="Loading analysis data..." />}
        {error && <ErrorDisplay message={error} onRetry={refetch} />}
        {data && (
          <div className="space-y-6 animate-fade-in">
            <div className="rounded-xl border border-border bg-card p-6">
              <h3 className="text-lg font-semibold mb-4">Analysis Results</h3>
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
