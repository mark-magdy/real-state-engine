import Link from 'next/link';
import { ArrowRight, Search } from 'lucide-react';
import { Container } from '@/shared/components/layout/Container';

export function CTASection() {
  return (
    <section id="cta-section" className="py-20 md:py-28">
      <Container>
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-coral to-coral-hover p-10 md:p-16 text-white text-center">
          {/* Decorative circles */}
          <div className="absolute -top-16 -right-16 h-64 w-64 rounded-full bg-white/10 blur-2xl" />
          <div className="absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-white/5 blur-2xl" />

          <div className="relative space-y-5">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              Ready to Find Your Ideal Property?
            </h2>
            <p className="text-base md:text-lg text-white/80 max-w-lg mx-auto">
              Browse our database of properties and filter by area, type, price, and more.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <Link
                href="/properties"
                id="cta-browse-properties"
                className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-3 text-sm font-semibold text-coral hover:bg-white/90 transition-colors shadow-lg"
              >
                <Search className="h-4 w-4" />
                Browse Properties
              </Link>
              <Link
                href="/analysis"
                id="cta-view-analytics"
                className="inline-flex items-center gap-2 rounded-full border-2 border-white/30 px-7 py-3 text-sm font-semibold text-white hover:bg-white/10 transition-colors"
              >
                View Analytics
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
