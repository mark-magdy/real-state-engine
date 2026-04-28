import { DownpaymentAnalysis } from '@/features/analysis';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Downpayment Analysis — REI Engine',
  description: 'Average downpayment requirements across areas.',
};

export default function DownpaymentPage() {
  return <DownpaymentAnalysis />;
}
