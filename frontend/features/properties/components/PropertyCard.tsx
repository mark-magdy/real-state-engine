import { Bath, BedDouble, Maximize } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { Property } from '@/shared/types/common.types';
import { formatCurrency } from '@/shared/lib/utils';

interface PropertyCardProps {
  property: Property;
}

export function PropertyCard({ property }: PropertyCardProps) {
  const price = property.full_price ?? property.rent;
  const priceLabel = property.rent ? '/month' : '';

  return (
    <div
      id={`property-card-${property.id}`}
      className="group overflow-hidden rounded-xl border border-border bg-card transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
    >
      {/* Image placeholder */}
      <div className="relative aspect-[4/3] bg-gradient-to-br from-warm-200 to-warm-300 overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center text-warm-400">
          <svg className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        </div>
        <div className="absolute top-3 left-3">
          <Badge variant="secondary" className="bg-white/90 backdrop-blur-sm text-foreground font-semibold text-xs">
            {property.property_type}
          </Badge>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        <div>
          <h3 className="font-semibold text-foreground line-clamp-1 group-hover:text-coral transition-colors">
            {property.title}
          </h3>
          <p className="text-sm text-muted-foreground mt-0.5">
            {property.area}
            {property.compound && ` · ${property.compound}`}
          </p>
        </div>

        {/* Specs */}
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <BedDouble className="h-3.5 w-3.5" />
            {property.bedrooms}
          </span>
          <span className="flex items-center gap-1">
            <Bath className="h-3.5 w-3.5" />
            {property.bathrooms}
          </span>
          <span className="flex items-center gap-1">
            <Maximize className="h-3.5 w-3.5" />
            {property.meter_square} m²
          </span>
        </div>

        {/* Price */}
        <div className="pt-2 border-t border-border">
          <p className="text-lg font-bold text-foreground">
            {formatCurrency(price)}
            {priceLabel && (
              <span className="text-sm font-normal text-muted-foreground">{priceLabel}</span>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
