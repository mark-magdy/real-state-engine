import { AveragePriceByAreaAnalysis } from '@/features/analysis';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Average Price by Location â€” REI Engine',
  description: 'Compare average property prices across different neighborhoods and cities.',
};

export default function AveragePricePage() {
  return <AveragePriceByAreaAnalysis />;
}
