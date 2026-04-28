// features/analysis/components/PropertyCountsAnalysis.tsx
'use client';

import React, { useState, useMemo } from 'react';
import { useAnalysis } from '../hooks/useAnalysis';
import { PropertyCountResponse } from '../types/analysis.types';
import { LoadingSpinner } from '@/shared/components/feedback/LoadingSpinner';
import { ErrorDisplay } from '@/shared/components/feedback/ErrorDisplay';
import { AnalysisContainer } from './AnalysisContainer';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from 'recharts';

function PropertyCountsDataView({ data }: { data: PropertyCountResponse }) {
  if (!data?.property_counts_by_area?.length) {
    return <div className="text-muted-foreground p-6 text-center">No data found.</div>;
  }
  
  return (
    <div className="overflow-x-auto border border-border rounded-lg">
      <table className="w-full text-sm text-left">
        <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b border-border">
          <tr>
            <th className="px-4 py-3">Area</th>
            <th className="px-4 py-3 text-right">Property Count</th>
          </tr>
        </thead>
        <tbody>
          {data.property_counts_by_area.map((item, idx) => (
             <tr key={idx} className="border-b border-border/50 last:border-0 hover:bg-muted/50">
               <td className="px-4 py-3 font-medium">{item.area}</td>
               <td className="px-4 py-3 text-right font-bold text-primary">{item.property_count}</td>
             </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function PropertyCountsChartView({ data }: { data: PropertyCountResponse }) {
  const chartData = useMemo(() => {
    if (!data?.property_counts_by_area) return [];
    return data.property_counts_by_area
      .filter(item => item.area && item.property_count > 0)
      .map(item => ({
        area: item.area,
        count: item.property_count
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 15);
  }, [data]);

  const chartConfig = {
    count: {
      label: "Property Count",
      color: "var(--color-primary)",
    },
  };

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold mb-4">Top 15 Areas by Volume</h3>
        <div className="h-[400px] w-full">
          <ChartContainer config={chartConfig} className="h-full w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 20, right: 0, left: 0, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted))" />
                <XAxis 
                  dataKey="area" 
                  angle={-30} 
                  textAnchor="end" 
                  height={80} 
                  tick={{ fontSize: 11 }} 
                  stroke="hsl(var(--muted-foreground))"
                />
                <YAxis 
                  stroke="hsl(var(--muted-foreground))"
                  tick={{ fontSize: 11 }} 
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar 
                  dataKey="count" 
                  fill="var(--color-primary)" 
                  radius={[4, 4, 0, 0]} 
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </div>
    </div>
  );
}

function PropertyCountsFilterView({ onFilterChange }: { onFilterChange: (f: Record<string, string>) => void }) {
  const [localFilters, setLocalFilters] = useState<Record<string, string>>({});

  const handleChange = (key: string, value: string) => {
    setLocalFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = Object.fromEntries(Object.entries(localFilters).filter(([, v]) => v !== ''));
    onFilterChange(cleaned);
  };

  const handleReset = () => {
    setLocalFilters({});
    onFilterChange({});
  };

  return (
    <form onSubmit={handleApply} className="flex flex-col space-y-6">
      <p className="text-muted-foreground">Filter property volumes based on price and property type thresholds.</p>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl">
        <label className="flex flex-col space-y-1.5">
          <span className="text-sm font-medium">Property Type</span>
          <select 
            className="border border-border rounded-lg p-2.5 bg-card focus:border-primary outline-none"
            value={localFilters.property_type || ''}
            onChange={(e) => handleChange('property_type', e.target.value)}
          >
            <option value="">All Types</option>
            <option value="apartment">Apartment</option>
            <option value="villa">Villa</option>
            <option value="townhouse">Townhouse</option>
            <option value="penthouse">Penthouse</option>
            <option value="chalet">Chalet</option>
          </select>
        </label>
      </div>

      <div className="flex space-x-3 pt-4 border-t border-border max-w-2xl">
        <button type="submit" className="bg-primary text-primary-light font-medium py-2.5 px-6 rounded-lg hover:bg-primary-hover transition-colors">
          Apply Filters
        </button>
        <button type="button" onClick={handleReset} className="border border-border text-foreground font-medium py-2.5 px-6 rounded-lg hover:bg-muted transition-colors">
          Reset
        </button>
      </div>
    </form>
  );
}

export function PropertyCountsAnalysis() {
  const [filters, setFilters] = useState<Record<string, string>>({});
  const { data, isLoading, error, refetch } = useAnalysis<PropertyCountResponse>('property-counts', filters);

  if (isLoading) return <LoadingSpinner text="Counting properties..." className="mt-20" />;
  if (error) return <ErrorDisplay message={error} onRetry={refetch} className="mt-20" />;

  return (
    <AnalysisContainer
      title="Property Counts"
      subtitle="Analyze the overall volume and supply of properties broken down by area."
      dataView={<PropertyCountsDataView data={data!} />}
      chartView={<PropertyCountsChartView data={data!} />}
      filterView={<PropertyCountsFilterView onFilterChange={setFilters} />}
    />
  );
}