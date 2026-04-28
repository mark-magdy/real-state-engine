import { PropertyFinder } from '@/features/properties';

export const metadata = {
  title: 'Find Properties',
  description: 'Browse and filter real estate properties by type, area, price, and more.',
};

export default function PropertiesPage() {
  return <PropertyFinder />;
}
