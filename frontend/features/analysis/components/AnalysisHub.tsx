import Link from 'next/link';
import {
  TrendingUp,
  MapPin,
  BarChart3,
  Home,
  Calendar,
  Percent,
  ArrowRight,
  type LucideIcon,
} from 'lucide-react';

interface AnalysisCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  href: string;
  accentColor?: 'coral' | 'teal';
}

function AnalysisCard({
  icon: Icon,
  title,
  description,
  href,
  accentColor = 'coral',
}: AnalysisCardProps) {
  const colorClasses =
    accentColor === 'coral'
      ? 'bg-coral-light text-coral'
      : 'bg-teal-light text-teal';

  return (
    <Link
      href={href}
      id={`analysis-card-${title.toLowerCase().replace(/\s+/g, '-')}`}
      className="group flex flex-col rounded-xl border border-border bg-card p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:border-coral/20"
    >
      <div
        className={`inline-flex h-12 w-12 items-center justify-center rounded-xl ${colorClasses} mb-4 transition-transform group-hover:scale-110`}
      >
        <Icon className="h-5 w-5" />
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-1">{title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed flex-1">
        {description}
      </p>
      <div className="mt-4 flex items-center gap-1.5 text-sm font-medium text-coral">
        View Analysis
        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
      </div>
    </Link>
  );
}

export function AnalysisHub() {
  const analyses = [
    {
      icon: TrendingUp,
      title: 'ROI Analysis',
      description:
        'Calculate return on investment and compare rental yields across areas.',
      href: '/analysis/roi',
      accentColor: 'coral' as const,
    },
    {
      icon: MapPin,
      title: 'Average Price by Location',
      description:
        'Compare average property prices across different neighborhoods and cities.',
      href: '/analysis/average-price',
      accentColor: 'teal' as const,
    },
    {
      icon: BarChart3,
      title: 'Property Counts',
      description:
        'See the distribution of property types and inventory counts by area.',
      href: '/analysis/property-counts',
      accentColor: 'coral' as const,
    },
    {
      icon: Home,
      title: 'Price by Type',
      description:
        'Compare average prices across apartments, villas, townhouses, and more.',
      href: '/analysis/price-by-type',
      accentColor: 'teal' as const,
    },
    {
      icon: Calendar,
      title: 'Installment Plans',
      description:
        'Analyze installment periods and payment structures across areas.',
      href: '/analysis/installments',
      accentColor: 'coral' as const,
    },
    {
      icon: Percent,
      title: 'Down Payment Analysis',
      description:
        'Compare down payment requirements as a percentage of total cost.',
      href: '/analysis/downpayment',
      accentColor: 'teal' as const,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {analyses.map((analysis, i) => (
        <div
          key={analysis.title}
          className={`animate-slide-up opacity-0 stagger-${Math.min(i + 1, 6)}`}
        >
          <AnalysisCard {...analysis} />
        </div>
      ))}
    </div>
  );
}
