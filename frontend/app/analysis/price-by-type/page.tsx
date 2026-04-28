import { AveragePriceByTypeAnalysis } from '@/features/analysis';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Average Price by Type — REI Engine',
  description: 'Compare property valuations dynamically based on real estate classification.',
};

export default function PriceByTypePage() {
  return <AveragePriceByTypeAnalysis />;
}
