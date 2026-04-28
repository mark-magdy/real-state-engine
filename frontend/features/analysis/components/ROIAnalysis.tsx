'use client';

import React, { useState, useMemo } from 'react';
import { useAnalysis } from '../hooks/useAnalysis';
import { ROIResponse, ROIProperty } from '../types/analysis.types';
import { LoadingSpinner } from '@/shared/components/feedback/LoadingSpinner';
import { ErrorDisplay } from '@/shared/components/feedback/ErrorDisplay';
import { StatCard } from '@/shared/components/data-display/StatCard';
import { TrendingUp, Activity, MapPin } from 'lucide-react';
import { AnalysisContainer } from './AnalysisContainer';

import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from '@/components/ui/chart';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

// --- DATA VIEW (Existing table structure isolated) ---
function ROIAnalysisDataView({ data, summary }: { data: ROIResponse; summary: any }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <StatCard label="Overall Average ROI" value={`${summary.avgRoi}%`} icon={TrendingUp} />
        <StatCard label="Top Performing Area" value={summary.topArea} icon={MapPin} />
        <StatCard label="Analyzed Properties" value={summary.totalProps.toString()} icon={Activity} />
      </div>
      {Object.entries(data.roi).map(([area, properties]) => (
        <div key={area} className="rounded-lg border border-border mt-6">
          <h3 className="text-lg font-semibold bg-muted p-4 rounded-t-lg">{area}</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-y border-border">
                <tr>
                  <th className="px-4 py-3">Title</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">Investment Mode</th>
                  <th className="px-4 py-3 text-right">Recover (Yrs)</th>
                  <th className="px-4 py-3 text-right">ROI %</th>
                </tr>
              </thead>
              <tbody>
                {properties.map((prop, idx) => (
                  <tr key={idx} className="border-b border-border/50 last:border-0 hover:bg-muted/50">
                    <td className="px-4 py-3 font-medium">{prop.title}</td>
                    <td className="px-4 py-3 capitalize">{prop.apartment_type}</td>
                    <td className="px-4 py-3 text-muted-foreground">{prop.investment_type}</td>
                    <td className="px-4 py-3 text-right">
                      {prop.months_to_break_even 
                        ? (prop.months_to_break_even / 12).toFixed(1) 
                        : prop.months_to_recover_year_one_cash 
                          ? (prop.months_to_recover_year_one_cash / 12).toFixed(1) 
                          : '-'}
                    </td>
                    <td className="px-4 py-3 text-right font-bold text-primary">
                      {prop.roi_percentage}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
}

// --- CHART VIEW Placeholder ---
function ROIAnalysisChartView({ data }: { data: ROIResponse }) {
  const chartData = useMemo(() => {
    if (!data?.roi) return [];
    return Object.entries(data.roi)
      .map(([area, properties]) => {
        const avg = properties.reduce((acc, p) => acc + (p.roi_percentage || 0), 0) / properties.length;
        return { area, avgRoi: parseFloat(avg.toFixed(2)), count: properties.length };
      })
      .sort((a, b) => b.avgRoi - a.avgRoi)
      .slice(0, 10); // Top 10 by average ROI
  }, [data]);

  const pieData = useMemo(() => {
    if (!data?.roi) return [];
    const typeMap: Record<string, { totalRoi: number; count: number }> = {};
    
    Object.values(data.roi).forEach((properties) => {
      properties.forEach(p => {
        const t = p.apartment_type || 'Unknown';
        if (!typeMap[t]) typeMap[t] = { totalRoi: 0, count: 0 };
        typeMap[t].totalRoi += p.roi_percentage || 0;
        typeMap[t].count += 1;
      });
    });

    const COLORS = ['#FF385C', '#00A699', '#FC642D', '#FFB400', '#008A05', '#428BFF'];
    return Object.entries(typeMap).map(([type, stats], idx) => ({
      type,
      avgRoi: parseFloat((stats.totalRoi / stats.count).toFixed(2)),
      fill: COLORS[idx % COLORS.length]
    }));
  }, [data]);

  const chartConfig = {
    avgRoi: {
      label: "Average ROI (%)",
      color: "var(--color-primary)",
    },
  };

  const pieConfig = {
    avgRoi: {
      label: "Average ROI (%)",
    },
  };

  return (
    <div className="space-y-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Chart 1: Bar Chart */}
        <div className="border border-border p-6 rounded-xl bg-card">
          <h3 className="text-lg font-semibold mb-6">Top 10 Areas by Average ROI</h3>
          <div className="h-[300px] w-full">
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
                    tickFormatter={(val) => `${val}%`} 
                    stroke="hsl(var(--muted-foreground))"
                    tick={{ fontSize: 11 }} 
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar 
                    dataKey="avgRoi" 
                    fill="var(--color-primary)" 
                    radius={[4, 4, 0, 0]} 
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        </div>

        {/* Chart 2: Pie Chart */}
        <div className="border border-border p-6 rounded-xl bg-card">
          <h3 className="text-lg font-semibold mb-6">Average ROI by Property Type</h3>
          <div className="h-[300px] w-full">
            <ChartContainer config={pieConfig} className="h-full w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="avgRoi"
                    nameKey="type"
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={100}
                    label={(props: any) => `${props.type} (${props.avgRoi}%)`}
                    paddingAngle={2}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <ChartLegend content={<ChartLegendContent />} />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- FILTERS & INTERACTION Placeholder ---
function ROIAnalysisFilterView({ onFilterChange }: { onFilterChange: (f: Record<string, string>) => void }) {
  const [localFilters, setLocalFilters] = useState<Record<string, string>>({});

  const handleChange = (key: string, value: string) => {
    setLocalFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    // Clean empty values
    const cleaned = Object.fromEntries(Object.entries(localFilters).filter(([, v]) => v !== ''));
    onFilterChange(cleaned);
  };

  const handleReset = () => {
    setLocalFilters({});
    onFilterChange({});
  };

  return (
    <form onSubmit={handleApply} className="flex flex-col space-y-6">
      <p className="text-muted-foreground">Fine-tune the analysis by applying specific filters.</p>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl">
        <label className="flex flex-col space-y-1.5">
          <span className="text-sm font-medium">Property Type</span>
          <select 
            className="border border-border rounded-lg p-2.5 bg-card focus:border-primary outline-hidden"
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
          <span className="text-sm font-medium">Location / Area</span>
          <input 
            className="border border-border rounded-lg p-2.5 bg-card focus:border-primary outline-hidden" 
            placeholder="e.g. New Cairo" 
            value={localFilters.area || ''}
            onChange={(e) => handleChange('area', e.target.value)}
          />
        </label>

        <label className="flex flex-col space-y-1.5">
          <span className="text-sm font-medium">Compound</span>
          <input 
            className="border border-border rounded-lg p-2.5 bg-card focus:border-primary outline-hidden" 
            placeholder="e.g. Mivida" 
            value={localFilters.compound || ''}
            onChange={(e) => handleChange('compound', e.target.value)}
          />
        </label>

        <label className="flex flex-col space-y-1.5">
          <span className="text-sm font-medium">Bedrooms</span>
          <input 
            type="number"
            min="1"
            className="border border-border rounded-lg p-2.5 bg-card focus:border-primary outline-hidden" 
            placeholder="Minimum bedrooms" 
            value={localFilters.bedrooms || ''}
            onChange={(e) => handleChange('bedrooms', e.target.value)}
          />
        </label>

        <label className="flex flex-col space-y-1.5">
          <span className="text-sm font-medium">Min Price (EGP)</span>
          <input 
            type="number"
            min="0"
            className="border border-border rounded-lg p-2.5 bg-card focus:border-primary outline-hidden" 
            placeholder="0" 
            value={localFilters.min_price || ''}
            onChange={(e) => handleChange('min_price', e.target.value)}
          />
        </label>

        <label className="flex flex-col space-y-1.5">
          <span className="text-sm font-medium">Max Price (EGP)</span>
          <input 
            type="number"
            min="0"
            className="border border-border rounded-lg p-2.5 bg-card focus:border-primary outline-hidden" 
            placeholder="No limit" 
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

export function ROIAnalysis() {
  const [filters, setFilters] = useState<Record<string, string>>({});
  const { data, isLoading, error, refetch } = useAnalysis<ROIResponse>('roi', filters);

  const summary = useMemo(() => {
    if (!data?.roi) return { avgRoi: 0, topArea: 'N/A', totalProps: 0 };
    let totalRoi = 0, totalItems = 0, maxAreaRoi = 0, topAreaName = 'N/A';
    Object.entries(data.roi).forEach(([area, properties]) => {
      let areaTotalRoi = 0;
      properties.forEach((p) => { areaTotalRoi += p.roi_percentage || 0; totalRoi += p.roi_percentage || 0; totalItems++; });
      const areaAvg = properties.length ? areaTotalRoi / properties.length : 0;
      if (areaAvg > maxAreaRoi) { maxAreaRoi = areaAvg; topAreaName = area; }
    });
    return { avgRoi: totalItems ? (totalRoi / totalItems).toFixed(2) : 0, topArea: topAreaName, totalProps: totalItems };
  }, [data]);

  if (isLoading) return <LoadingSpinner text="Calculating ROI..." className="mt-20" />;
  if (error) return <ErrorDisplay message={error} onRetry={refetch} className="mt-20" />;
  if (!data || Object.keys(data.roi).length === 0) {
    return <div className="p-10 text-center text-muted-foreground">No ROI data available.</div>;
  }

  return (
    <AnalysisContainer
      title="ROI Analysis"
      subtitle="Calculate return on investment and rental yields across different areas."
      dataView={<ROIAnalysisDataView data={data} summary={summary} />}
      chartView={<ROIAnalysisChartView data={data} />}
      filterView={<ROIAnalysisFilterView onFilterChange={setFilters} />}
    />
  );
}
