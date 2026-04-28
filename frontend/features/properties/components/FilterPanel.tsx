'use client';

import { PROPERTY_TYPES, AREAS } from '@/shared/lib/constants';

export interface FilterState {
  type: string;
  area: string;
  minPrice: string;
  maxPrice: string;
  bedrooms: string;
}

interface FilterPanelProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
  resultCount: number;
}

export function FilterPanel({ filters, onChange, resultCount }: FilterPanelProps) {
  const updateFilter = (key: keyof FilterState, value: string) => {
    onChange({ ...filters, [key]: value });
  };

  return (
    <div className="space-y-4">
      {/* Filter pills row */}
      <div className="flex flex-wrap gap-2">
        {/* Property Type */}
        <select
          id="filter-type"
          value={filters.type}
          onChange={(e) => updateFilter('type', e.target.value)}
          className="rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-foreground focus:border-coral focus:outline-none focus:ring-1 focus:ring-coral appearance-none cursor-pointer hover:border-warm-400 transition-colors"
        >
          <option value="">All Types</option>
          {PROPERTY_TYPES.map((type) => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>

        {/* Area */}
        <select
          id="filter-area"
          value={filters.area}
          onChange={(e) => updateFilter('area', e.target.value)}
          className="rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-foreground focus:border-coral focus:outline-none focus:ring-1 focus:ring-coral appearance-none cursor-pointer hover:border-warm-400 transition-colors"
        >
          <option value="">All Areas</option>
          {AREAS.map((area) => (
            <option key={area} value={area}>{area}</option>
          ))}
        </select>

        {/* Bedrooms */}
        <select
          id="filter-bedrooms"
          value={filters.bedrooms}
          onChange={(e) => updateFilter('bedrooms', e.target.value)}
          className="rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-foreground focus:border-coral focus:outline-none focus:ring-1 focus:ring-coral appearance-none cursor-pointer hover:border-warm-400 transition-colors"
        >
          <option value="">Bedrooms</option>
          {[1, 2, 3, 4, 5].map((n) => (
            <option key={n} value={n}>{n}+ Beds</option>
          ))}
        </select>

        {/* Clear filters */}
        {Object.values(filters).some(Boolean) && (
          <button
            onClick={() =>
              onChange({ type: '', area: '', minPrice: '', maxPrice: '', bedrooms: '' })
            }
            className="rounded-full border border-coral/20 bg-coral-light px-4 py-2 text-sm font-medium text-coral hover:bg-coral hover:text-white transition-colors"
          >
            Clear Filters
          </button>
        )}
      </div>

      {/* Results count */}
      <p className="text-sm text-muted-foreground">
        <span className="font-semibold text-foreground">{resultCount}</span>{' '}
        {resultCount === 1 ? 'property' : 'properties'} found
      </p>
    </div>
  );
}
