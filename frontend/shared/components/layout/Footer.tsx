import Link from 'next/link';
import { BarChart3 } from 'lucide-react';
import { NAV_LINKS } from '@/shared/lib/constants';

export function Footer() {
  return (
    <footer id="main-footer" className="border-t border-border bg-muted/30">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-coral text-white">
                <BarChart3 className="h-3.5 w-3.5" />
              </div>
              <span className="text-base font-bold tracking-tight">
                REI <span className="text-coral">Engine</span>
              </span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              Data-driven real estate analytics. Make smarter investment decisions with market insights.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-sm font-semibold mb-3">Navigation</h4>
            <ul className="space-y-2">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Analysis */}
          <div>
            <h4 className="text-sm font-semibold mb-3">Analysis</h4>
            <ul className="space-y-2">
              {['ROI', 'Average Price', 'Property Counts', 'Down Payment'].map((item) => (
                <li key={item}>
                  <Link
                    href={`/analysis/${item.toLowerCase().replace(/\s+/g, '-')}`}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} REI Engine. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground">
            Built for smarter real estate decisions.
          </p>
        </div>
      </div>
    </footer>
  );
}
