'use client';

import React, { useState, useMemo } from 'react';
import { useAnalysis } from '../hooks/useAnalysis';
import { DownpaymentResponse } from '../types/analysis.types';
import { LoadingSpinner } from '@/shared/components/feedback/LoadingSpinner';
import { ErrorDisplay } from '@/shared/components/feedback/ErrorDisplay';
import { AnalysisContainer } from './AnalysisContainer';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from 'recharts';

function DownpaymentDataView({ data }: { data: DownpaymentResponse }) {
  if (!data?.downpayment_percentage_by_area?.length) {
    return <div className="text-muted-foreground p-6 text-center">No data found.</div>;
  }
  
  return (
    <div className="overflow-x-auto border border-border rounded-lg">
      <table className="w-full text-sm text-left">
        <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b border-border">
          <tr>
            <th className="px-4 py-3">Location / Area</th>
            <th className="px-4 py-3 text-right">Req. Downpayment (%)</th>
          </tr>
        </thead>
        <tbody>
          {data.downpayment_percentage_by_area.map((item, idx) => (
             <tr key={idx} className="border-b border-border/50 last:border-0 hover:bg-muted/50">
               <td className="px-4 py-3 font-medium capitalize">{item.area || 'Unknown'}</td>
               <td className="px-4 py-3 text-right font-bold text-primary">
                 {item.avg_downpayment_percentage?.toFixed(2) || 0}%
               </td>
             </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function DownpaymentChartView({ data }: { data: DownpaymentResponse }) {
  const chartData = useMemo(() => {
    if (!data?.downpayment_percentage_by_area) return [];
    return data.downpayment_percentage_by_area
      .filter(item => item.area && item.avg_downpayment_percentage > 0)
      .map(item => ({
        area: item.area,
        avgDp: parseFloat(item.avg_downpayment_percentage.toFixed(2))
      }))
      .sort((a, b) => a.avgDp - b.avgDp) // Show lowest barrier to entry first
      .slice(0, 20); // Top 20 Most Accessible Areas
  }, [data]);

  const chartConfig = {
    avgDp: {
      label: "Average Downpayment (%)",
      color: "var(--color-primary)",
    },
  };

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold mb-4">Top 20 Most Accessible Areas (Lowest Downpayment %)</h3>
        <div className="h-[400px] w-full">
          <ChartContainer config={chartConfig} className="h-full w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
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
                  tickFormatter={(val) => `${val}%`} 
                  stroke="hsl(var(--muted-foreground))"
                  tick={{ fontSize: 11 }} 
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar 
                  dataKey="avgDp" 
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

function DownpaymentFilterView({ onFilterChange }: { onFilterChange: (f: Record<string, string>) => void }) {
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
      <p className="text-muted-foreground">Isolate property brackets to see their respective downpayment loads.</p>
      
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
        
        <label className="flex flex-col space-y-1.5">
          <span className="text-sm font-medium">Maximum Base Price</span>
          <input 
            type="number"
            className="border border-border rounded-lg p-2.5 bg-card focus:border-primary outline-none"
            placeholder="No maximum"
            value={localFilters.max_price || ''}
            onChange={(e) => handleChange('max_price', e.target.value)}
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

export function DownpaymentAnalysis() {
  const [filters, setFilters] = useState<Record<string, string>>({});
  const { data, isLoading, error, refetch } = useAnalysis<DownpaymentResponse>('downpayment-percentage', filters);

  if (isLoading) return <LoadingSpinner text="Computing downpayment gaps..." className="mt-20" />;
  if (error) return <ErrorDisplay message={error} onRetry={refetch} className="mt-20" />;

  return (
    <AnalysisContainer
      title="Downpayment Percentage Analysis"
      subtitle="Analyze barriers to entry and cash-to-close metrics by area."
      dataView={<DownpaymentDataView data={data!} />}
      chartView={<DownpaymentChartView data={data!} />}
      filterView={<DownpaymentFilterView onFilterChange={setFilters} />}
    />
  );
}