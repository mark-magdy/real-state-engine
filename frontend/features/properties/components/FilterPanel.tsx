'use client';

import { useState } from 'react';
import { PROPERTY_TYPES, AREAS } from '@/shared/lib/constants';
import type { PropertyFilters } from '../types/property.types';
import { Button } from '@/components/ui/button';
import { Search, SlidersHorizontal } from 'lucide-react';

interface FilterPanelProps {
  filters: PropertyFilters;
  onChange: (filters: PropertyFilters) => void;
  resultCount: number;
}

export function FilterPanel({ filters: initialFilters, onChange, resultCount }: FilterPanelProps) {
  const [localFilters, setLocalFilters] = useState<PropertyFilters>(initialFilters);
  const [showOptional, setShowOptional] = useState(false);

  const updateFilter = (key: keyof PropertyFilters, value: string) => {
    setLocalFilters({ ...localFilters, [key]: value });
  };

  const handleSearch = () => {
    onChange(localFilters);
  };

  const handleClear = () => {
    const cleared = {
      area: '',
      property_type: '',
      min_price: '',
      max_price: '',
      bedrooms: '',
      bathrooms: '',
      compound: '',
      listing_type: 'buy',
    };
    setLocalFilters(cleared);
    onChange(cleared);
  };

  return (
    <div className="bg-surface border border-border rounded-2xl p-6 shadow-card space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* MANDATORY FILTERS */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-text-secondary ml-1">
            Listing Type *
          </label>
          <select
            value={localFilters.listing_type}
            onChange={(e) => updateFilter('listing_type', e.target.value)}
            className="w-full rounded-xl border border-border bg-white px-4 py-3 text-sm font-medium focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary appearance-none cursor-pointer transition-all"
          >
            <option value="buy">Buy</option>
            <option value="rent">Rent</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-text-secondary ml-1">
            Location / Area *
          </label>
          <select
            value={localFilters.area}
            onChange={(e) => updateFilter('area', e.target.value)}
            className="w-full rounded-xl border border-border bg-white px-4 py-3 text-sm font-medium focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary appearance-none cursor-pointer transition-all"
          >
            <option value="">All Areas</option>
            {AREAS.map((area) => (
              <option key={area} value={area}>
                {area}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-text-secondary ml-1">
            Property Type
          </label>
          <select
            value={localFilters.property_type}
            onChange={(e) => updateFilter('property_type', e.target.value)}
            className="w-full rounded-xl border border-border bg-white px-4 py-3 text-sm font-medium focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary appearance-none cursor-pointer transition-all"
          >
            <option value="">All Types</option>
            {PROPERTY_TYPES.map((type) => (
              <option key={type} value={type.toLowerCase()}>
                {type}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-end pb-0.5">
          <Button onClick={handleSearch} variant="default" className="w-full h-[46px] gap-2">
            <Search className="w-4 h-4" />
            Search
          </Button>
        </div>
      </div>

      {/* OPTIONAL FILTERS TOGGLE */}
      <div className="flex items-center justify-between pt-2 border-t border-border">
        <button
          onClick={() => setShowOptional(!showOptional)}
          className="flex items-center gap-2 text-sm font-semibold text-text-primary hover:text-primary transition-colors"
        >
          <SlidersHorizontal className="w-4 h-4" />
          {showOptional ? 'Hide Optional Filters' : 'More Filters'}
        </button>

        <div className="flex items-center gap-4">
          <span className="text-sm text-text-secondary">
            <span className="font-bold text-text-primary">{resultCount}</span> results
          </span>
          <button
            onClick={handleClear}
            className="text-sm font-medium text-text-secondary hover:text-primary underline underline-offset-4"
          >
            Clear All
          </button>
        </div>
      </div>

      {showOptional && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 animate-slide-down">
          <div className="space-y-2">
            <label className="text-xs font-medium text-text-secondary">Min Price</label>
            <input
              type="number"
              placeholder="0"
              value={localFilters.min_price}
              onChange={(e) => updateFilter('min_price', e.target.value)}
              className="w-full rounded-xl border border-border bg-white px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-medium text-text-secondary">Max Price</label>
            <input
              type="number"
              placeholder="Any"
              value={localFilters.max_price}
              onChange={(e) => updateFilter('max_price', e.target.value)}
              className="w-full rounded-xl border border-border bg-white px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-medium text-text-secondary">Min Bedrooms</label>
            <select
              value={localFilters.bedrooms}
              onChange={(e) => updateFilter('bedrooms', e.target.value)}
              className="w-full rounded-xl border border-border bg-white px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary appearance-none cursor-pointer"
            >
              <option value="">Any</option>
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <option key={n} value={n}>
                  {n}+ Beds
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-medium text-text-secondary">Min Bathrooms</label>
            <select
              value={localFilters.bathrooms}
              onChange={(e) => updateFilter('bathrooms', e.target.value)}
              className="w-full rounded-xl border border-border bg-white px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary appearance-none cursor-pointer"
            >
              <option value="">Any</option>
              {[1, 2, 3, 4].map((n) => (
                <option key={n} value={n}>
                  {n}+ Baths
                </option>
              ))}
            </select>
          </div>
        </div>
      )}
    </div>
  );
}
