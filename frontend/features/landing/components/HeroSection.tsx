import { AISearchBar } from './AISearchBar';
import { TrendingUp, Building2, BarChart3 } from 'lucide-react';

export function HeroSection() {
  return (
    <section
      id="hero-section"
      className="relative overflow-hidden bg-gradient-to-br from-warm-50 via-background to-coral-light/30"
    >
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-coral/5 blur-3xl" />
        <div className="absolute -bottom-32 -left-32 h-[500px] w-[500px] rounded-full bg-teal/5 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-coral/3 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 py-20 md:py-32">
        <div className="text-center space-y-6 animate-fade-in">
          {/* Badge */}
          {/* <div className="inline-flex items-center gap-2 rounded-full border border-coral/20 bg-coral-light px-4 py-1.5">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-coral opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-coral" />
            </span>
            <span className="text-xs font-semibold text-coral">AI-Powered Analytics</span>
          </div> */}

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-foreground leading-[1.1]">
            Find Your Next
            <br />
            <span className="bg-gradient-to-r from-coral to-coral-hover bg-clip-text text-transparent">
              Real Estate
            </span>{' '}
            Investment
          </h1>

          {/* Subtitle */}
          <p className="mx-auto max-w-xl text-base md:text-lg text-muted-foreground leading-relaxed">
            Data-driven market insights, AI-powered analysis, and comprehensive
            property data to help you make smarter investment decisions.
          </p>

          {/* Search Bar */}
          <div className="pt-4">
            <AISearchBar />
          </div>

          {/* Trust indicators */}
          <div className="pt-8 flex flex-wrap items-center justify-center gap-8 text-muted-foreground">
            {[
              { icon: Building2, label: 'Properties Analyzed', value: '10K+' },
              { icon: BarChart3, label: 'Market Reports', value: '6+' },
              { icon: TrendingUp, label: 'Data Points', value: '50K+' },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-center gap-2">
                <Icon className="h-4 w-4 text-coral" />
                <span className="text-sm font-semibold text-foreground">{value}</span>
                <span className="text-sm">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
