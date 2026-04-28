'use client';

import { useState, useMemo } from 'react';
import { useProperties } from '../hooks/useProperties';
import { PropertyCard } from './PropertyCard';
import { FilterPanel, type FilterState } from './FilterPanel';
import { LoadingSpinner } from '@/shared/components/feedback/LoadingSpinner';
import { ErrorDisplay } from '@/shared/components/feedback/ErrorDisplay';
import { EmptyState } from '@/shared/components/data-display/EmptyState';
import { Container } from '@/shared/components/layout/Container';
import { PageHeader } from '@/shared/components/layout/PageHeader';
import type { Property } from '@/shared/types/common.types';

export function PropertyFinder() {
  const { data: properties, isLoading, error, refetch } = useProperties();
  const [filters, setFilters] = useState<FilterState>({
    type: '',
    area: '',
    minPrice: '',
    maxPrice: '',
    bedrooms: '',
  });

  const filtered = useMemo(() => {
    if (!properties) return [];

    return properties.filter((p: Property) => {
      if (filters.type && p.property_type !== filters.type) return false;
      if (filters.area && p.area !== filters.area) return false;
      if (filters.bedrooms && p.bedrooms < parseInt(filters.bedrooms)) return false;
      if (filters.minPrice) {
        const price = p.full_price ?? p.rent ?? 0;
        if (price < parseInt(filters.minPrice)) return false;
      }
      if (filters.maxPrice) {
        const price = p.full_price ?? p.rent ?? 0;
        if (price > parseInt(filters.maxPrice)) return false;
      }
      return true;
    });
  }, [properties, filters]);

  return (
    <>
      <PageHeader
        title="Find Properties"
        subtitle="Browse and filter properties to find your perfect match."
      />
      <Container className="py-8">
        {isLoading && <LoadingSpinner text="Loading properties..." />}
        {error && <ErrorDisplay message={error} onRetry={refetch} />}
        {properties && (
          <div className="space-y-6 animate-fade-in">
            <FilterPanel
              filters={filters}
              onChange={setFilters}
              resultCount={filtered.length}
            />

            {filtered.length === 0 ? (
              <EmptyState
                title="No properties match your filters"
                description="Try adjusting your filters to see more results."
                action={
                  <button
                    onClick={() =>
                      setFilters({ type: '', area: '', minPrice: '', maxPrice: '', bedrooms: '' })
                    }
                    className="rounded-full bg-coral px-5 py-2.5 text-sm font-medium text-white hover:bg-coral-hover transition-colors"
                  >
                    Clear Filters
                  </button>
                }
              />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {filtered.map((property, i) => (
                  <div
                    key={property.id}
                    className={`animate-slide-up opacity-0 stagger-${Math.min(i + 1, 6)}`}
                  >
                    <PropertyCard property={property} />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </Container>
    </>
  );
}
