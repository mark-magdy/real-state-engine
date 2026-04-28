import { AnalysisHub } from '@/features/analysis';
import { PageHeader } from '@/shared/components/layout/PageHeader';
import { Container } from '@/shared/components/layout/Container';

export const metadata = {
  title: 'Market Analysis',
  description: 'Comprehensive real estate market analysis including ROI, pricing trends, and property distribution.',
};

export default function AnalysisPage() {
  return (
    <>
      <PageHeader
        title="Market Analysis"
        subtitle="Explore comprehensive analytics to understand market trends and find the best opportunities."
      />
      <Container className="py-10">
        <AnalysisHub />
      </Container>
    </>
  );
}
