'use client';

import React, { useState, useMemo } from 'react';
import { useAnalysis } from '../hooks/useAnalysis';
import { AveragePriceResponse } from '../types/analysis.types';
import { LoadingSpinner } from '@/shared/components/feedback/LoadingSpinner';
import { ErrorDisplay } from '@/shared/components/feedback/ErrorDisplay';
import { AnalysisContainer } from './AnalysisContainer';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from 'recharts';

function AveragePriceDataView({ data }: { data: AveragePriceResponse }) {
  if (!data?.avg_price_by_type?.length) {
    return <div className="text-muted-foreground p-6 text-center">No data found.</div>;
  }
  
  return (
    <div className="overflow-x-auto border border-border rounded-lg">
      <table className="w-full text-sm text-left">
        <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b border-border">
          <tr>
            <th className="px-4 py-3">Property Type</th>
            <th className="px-4 py-3 text-right">Average Price (EGP)</th>
            <th className="px-4 py-3 text-right">Properties Count</th>
          </tr>
        </thead>
        <tbody>
          {data.avg_price_by_type.map((item, idx) => (
             <tr key={idx} className="border-b border-border/50 last:border-0 hover:bg-muted/50">
               <td className="px-4 py-3 font-medium capitalize">{item.property_type || 'Unknown'}</td>
               <td className="px-4 py-3 text-right font-bold text-primary">
                 {new Intl.NumberFormat('en-EG', { style: 'currency', currency: 'EGP', maximumFractionDigits: 0 }).format(item.avg_price)}
               </td>
               <td className="px-4 py-3 text-right text-muted-foreground">
                 {item.count || 0}
               </td>
             </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function AveragePriceChartView({ data }: { data: AveragePriceResponse }) {
  const chartData = useMemo(() => {
    if (!data?.avg_price_by_type) return [];
    return data.avg_price_by_type
      .filter(item => item.property_type) // Ensure type exists
      .map(item => ({
        type: item.property_type,
        avgPrice: item.avg_price
      }))
      .slice(0, 10);
  }, [data]);

  const chartConfig = {
    avgPrice: {
      label: "Average Price (EGP)",
      color: "var(--color-primary)",
    },
  };

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold mb-4">Average Price per Property Type</h3>
        <div className="h-[400px] w-full">
          <ChartContainer config={chartConfig} className="h-full w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="hsl(var(--muted))" />
                <XAxis 
                  type="number"
                  tickFormatter={(val) => `E£${(val / 1000000).toFixed(1)}M`} 
                  stroke="hsl(var(--muted-foreground))"
                  tick={{ fontSize: 12 }} 
                />
                <YAxis 
                  type="category"
                  dataKey="type" 
                  stroke="hsl(var(--muted-foreground))"
                  tick={{ fontSize: 12, className: "capitalize" }}
                  width={100}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar 
                  dataKey="avgPrice" 
                  fill="var(--color-primary)" 
                  radius={[0, 4, 4, 0]} 
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </div>
    </div>
  );
}

function AveragePriceFilterView({ onFilterChange }: { onFilterChange: (f: Record<string, string>) => void }) {
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
      <p className="text-muted-foreground">Filter the properties to calculate average prices dynamically.</p>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl">
        <label className="flex flex-col space-y-1.5">
          <span className="text-sm font-medium">Location / Area</span>
          <input 
            className="border border-border rounded-lg p-2.5 bg-card focus:border-primary outline-none" 
            placeholder="e.g. New Cairo" 
            value={localFilters.area || ''}
            onChange={(e) => handleChange('area', e.target.value)}
          />
        </label>
        
        <label className="flex flex-col space-y-1.5">
          <span className="text-sm font-medium">Compound</span>
          <input 
            className="border border-border rounded-lg p-2.5 bg-card focus:border-primary outline-none" 
            placeholder="e.g. Madinaty" 
            value={localFilters.compound || ''}
            onChange={(e) => handleChange('compound', e.target.value)}
          />
        </label>

        <label className="flex flex-col space-y-1.5">
          <span className="text-sm font-medium">Minimum Bedrooms</span>
          <input 
            type="number"
            min="1"
            className="border border-border rounded-lg p-2.5 bg-card focus:border-primary outline-none" 
            placeholder="e.g. 2" 
            value={localFilters.bedrooms || ''}
            onChange={(e) => handleChange('bedrooms', e.target.value)}
          />
        </label>

        <label className="flex flex-col space-y-1.5">
          <span className="text-sm font-medium">Property Size (Min Sqm)</span>
          <input 
            type="number"
            min="0"
            className="border border-border rounded-lg p-2.5 bg-card focus:border-primary outline-none" 
            placeholder="e.g. 100" 
            value={localFilters.meter_square || ''}
            onChange={(e) => handleChange('meter_square', e.target.value)}
          />
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

export function AveragePriceByTypeAnalysis() {
  const [filters, setFilters] = useState<Record<string, string>>({});
  const { data, isLoading, error, refetch } = useAnalysis<AveragePriceResponse>('average-price-by-type', filters);

  if (isLoading) return <LoadingSpinner text="Crunching average prices..." className="mt-20" />;
  if (error) return <ErrorDisplay message={error} onRetry={refetch} className="mt-20" />;

  return (
    <AnalysisContainer
      title="Average Price by Type"
      subtitle="Compare property valuations dynamically based on real estate classification."
      dataView={<AveragePriceDataView data={data!} />}
      chartView={<AveragePriceChartView data={data!} />}
      filterView={<AveragePriceFilterView onFilterChange={setFilters} />}
    />
  );
}