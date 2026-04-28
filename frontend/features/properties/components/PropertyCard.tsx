import { Bath, BedDouble, Maximize, ExternalLink } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { Property } from '@/shared/types/common.types';
import { formatCurrency } from '@/shared/lib/utils';

interface PropertyCardProps {
  property: Property;
}

export function PropertyCard({ property }: PropertyCardProps) {
  // Use price from search results or fallback to full_price/rent
  const displayPrice = property.price ?? property.full_price ?? property.rent ?? 0;
  const isRent = property.listing_type === 'rent' || !!property.rent;
  const priceLabel = isRent ? ' / month' : '';

  const CardContent = (
    <div
      id={`property-card-${property.id}`}
      className="group relative h-full overflow-hidden rounded-xl border border-border bg-card transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer"
    >
      {/* Image placeholder */}
      <div className="relative aspect-[4/3] bg-gradient-to-br from-warm-100 to-warm-200 overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center text-warm-300">
          <svg className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        </div>
        <div className="absolute top-3 left-3 flex gap-2">
          <Badge variant="secondary" className="bg-white/90 backdrop-blur-sm text-foreground font-semibold text-[10px] uppercase tracking-wider">
            {property.property_type}
          </Badge>
          {isRent && (
            <Badge className="bg-teal-600 text-white border-none text-[10px] uppercase tracking-wider">
              Rent
            </Badge>
          )}
        </div>
        
        {property.url && (
          <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="bg-white/90 p-1.5 rounded-full shadow-sm">
              <ExternalLink className="h-3.5 w-3.5 text-coral" />
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        <div>
          <h3 className="font-bold text-foreground line-clamp-1 group-hover:text-coral transition-colors leading-tight">
            {property.title}
          </h3>
          <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1">
            <span className="truncate">{property.area}</span>
            {property.compound && (
              <>
                <span className="text-warm-300">·</span>
                <span className="truncate">{property.compound}</span>
              </>
            )}
          </p>
        </div>

        {/* Specs */}
        <div className="flex items-center gap-4 text-xs font-medium text-text-secondary">
          <span className="flex items-center gap-1.5">
            <BedDouble className="h-4 w-4 text-text-muted" />
            {property.bedrooms}
          </span>
          <span className="flex items-center gap-1.5">
            <Bath className="h-4 w-4 text-text-muted" />
            {property.bathrooms}
          </span>
          <span className="flex items-center gap-1.5">
            <Maximize className="h-4 w-4 text-text-muted" />
            {property.meter_square} m²
          </span>
        </div>

        {/* Price */}
        <div className="pt-3 mt-1 border-t border-border/60">
          <p className="text-lg font-extrabold text-foreground tracking-tight">
            {formatCurrency(displayPrice)}
            <span className="text-xs font-medium text-text-secondary ml-1 lowercase">
              {priceLabel}
            </span>
          </p>
        </div>
      </div>
    </div>
  );

  if (property.url) {
    return (
      <a href={property.url} target="_blank" rel="noopener noreferrer" className="block h-full no-underline">
        {CardContent}
      </a>
    );
  }

  return CardContent;
}
