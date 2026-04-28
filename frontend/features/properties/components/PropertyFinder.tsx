'use client';

import { useSearchProperties } from '../hooks/useProperties';
import { PropertyCard } from './PropertyCard';
import { FilterPanel } from './FilterPanel';
import { LoadingSpinner } from '@/shared/components/feedback/LoadingSpinner';
import { ErrorDisplay } from '@/shared/components/feedback/ErrorDisplay';
import { EmptyState } from '@/shared/components/data-display/EmptyState';
import { Container } from '@/shared/components/layout/Container';
import { PageHeader } from '@/shared/components/layout/PageHeader';
import { Button } from '@/components/ui/button';

export function PropertyFinder() {
  const { data, isLoading, error, filters, updateFilters, refetch } = useSearchProperties({
    listing_type: 'buy',
  });

  const properties = data?.properties || [];
  const totalCount = data?.total_count || 0;
  const totalPages = data?.total_pages || 1;
  const currentPage = data?.page || 1;

  const handlePageChange = (newPage: number) => {
    updateFilters({ page: newPage });
  };

  const handleClearFilters = () => {
    updateFilters({
      area: '',
      property_type: '',
      min_price: '',
      max_price: '',
      bedrooms: '',
      bathrooms: '',
      compound: '',
      listing_type: 'buy',
      page: 1,
    });
  };

  return (
    <>
      <PageHeader
        title="Find Properties"
        subtitle="Browse and filter properties to find your perfect match."
      />
      <Container className="py-8">
        <div className="space-y-8">
          <FilterPanel
            filters={filters}
            onChange={(newFilters) => updateFilters({ ...newFilters, page: 1 })}
            resultCount={totalCount}
          />

          {isLoading ? (
            <div className="flex justify-center py-20">
              <LoadingSpinner text="Searching properties..." />
            </div>
          ) : error ? (
            <ErrorDisplay message={error} onRetry={refetch} />
          ) : properties.length === 0 ? (
            <EmptyState
              title="No properties match your filters"
              description="Try adjusting your filters or area to see more results."
              action={
                <Button onClick={handleClearFilters} variant="default">
                  Clear Filters
                </Button>
              }
            />
          ) : (
            <div className="space-y-10">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {properties.map((property, i) => (
                  <div
                    key={property.id || i}
                    className="animate-fade-in"
                    style={{ animationDelay: `${Math.min(i * 50, 500)}ms` }}
                  >
                    <PropertyCard property={property} />
                  </div>
                ))}
              </div>

              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-4 pt-6 border-t border-border">
                  <Button
                    variant="outline"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  <span className="text-sm font-medium">
                    Page {currentPage} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </Container>
    </>
  );
}
