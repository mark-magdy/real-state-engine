import Link from 'next/link';
import { TrendingUp, MapPin, BarChart3, Home, Calendar, Percent, ArrowRight } from 'lucide-react';
import { Container } from '@/shared/components/layout/Container';

const features = [
  {
    icon: TrendingUp,
    title: 'ROI Analysis',
    description: 'Calculate return on investment and rental yields across different areas.',
    href: '/analysis/roi',
    color: 'bg-coral-light text-coral',
  },
  {
    icon: MapPin,
    title: 'Price by Location',
    description: 'Compare average property prices across different neighborhoods.',
    href: '/analysis/average-price',
    color: 'bg-teal-light text-teal',
  },
  {
    icon: BarChart3,
    title: 'Market Distribution',
    description: 'See property type distribution and inventory counts by area.',
    href: '/analysis/property-counts',
    color: 'bg-coral-light text-coral',
  },
  {
    icon: Home,
    title: 'Price by Type',
    description: 'Compare prices across apartments, villas, townhouses, and more.',
    href: '/analysis/price-by-type',
    color: 'bg-teal-light text-teal',
  },
  {
    icon: Calendar,
    title: 'Installment Plans',
    description: 'Analyze installment periods and payment structures by area.',
    href: '/analysis/installments',
    color: 'bg-coral-light text-coral',
  },
  {
    icon: Percent,
    title: 'Down Payment Analysis',
    description: 'Compare down payment requirements as percentage of total cost.',
    href: '/analysis/downpayment',
    color: 'bg-teal-light text-teal',
  },
];

export function FeatureShowcase() {
  return (
    <section id="features-section" className="py-20 md:py-28">
      <Container>
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
            Market Intelligence at Your Fingertips
          </h2>
          <p className="mt-3 text-base text-muted-foreground max-w-xl mx-auto">
            Explore comprehensive analytics to understand market trends and find the best opportunities.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((feature, i) => (
            <Link
              key={feature.title}
              href={feature.href}
              id={`feature-card-${feature.title.toLowerCase().replace(/\s+/g, '-')}`}
              className={`group relative overflow-hidden rounded-xl border border-border bg-card p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:border-coral/20 animate-slide-up opacity-0 stagger-${Math.min(i + 1, 6)}`}
            >
              <div className={`inline-flex h-11 w-11 items-center justify-center rounded-lg ${feature.color} mb-4 transition-transform group-hover:scale-110`}>
                <feature.icon className="h-5 w-5" />
              </div>

              <h3 className="text-lg font-semibold text-foreground mb-1.5">
                {feature.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {feature.description}
              </p>

              <div className="mt-4 flex items-center gap-1.5 text-sm font-medium text-coral opacity-0 group-hover:opacity-100 transition-opacity">
                Explore
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
