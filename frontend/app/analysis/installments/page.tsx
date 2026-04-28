import { InstallmentsAnalysis } from '@/features/analysis';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Installment Analysis — REI Engine',
  description: 'Analyze average maximum installment durations.',
};

export default function InstallmentsPage() {
  return <InstallmentsAnalysis />;
}
