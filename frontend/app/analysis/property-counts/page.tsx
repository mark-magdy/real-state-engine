import { PropertyCountsAnalysis } from '@/features/analysis';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Property Counts by Area — REI Engine',
  description: 'See the distribution of property types and inventory counts',
};

export default function PropertyCountsPage() {
  return <PropertyCountsAnalysis />;
}
