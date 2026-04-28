// features/analysis/components/AnalysisContainer.tsx
'use client';

import React, { useState } from 'react';
import { PageHeader } from '@/shared/components/layout/PageHeader';
import { Container } from '@/shared/components/layout/Container';
import { BarChart2, Table as TableIcon, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AnalysisContainerProps {
  title: string;
  subtitle: string;
  dataView: React.ReactNode;
  chartView: React.ReactNode;
  filterView: React.ReactNode;
}

export function AnalysisContainer({ title, subtitle, dataView, chartView, filterView }: AnalysisContainerProps) {
  const [activeTab, setActiveTab] = useState<'data' | 'charts' | 'filters'>('data');

  return (
    <>
      <PageHeader title={title} subtitle={subtitle} />
      
      <Container className="py-6 space-y-6">
        {/* Sub-Navigation (Tabs) */}
        <div className="flex flex-wrap gap-2 border-b border-border bg-card p-2 rounded-xl sticky top-[4rem] z-10 shadow-sm">
          <Button 
            variant={activeTab === 'data' ? 'default' : 'ghost'}
            className="rounded-lg flex-1 sm:flex-none"
            onClick={() => setActiveTab('data')}
          >
            <TableIcon className="w-4 h-4 mr-2" /> Data View
          </Button>
          <Button 
            variant={activeTab === 'charts' ? 'default' : 'ghost'}
            className="rounded-lg flex-1 sm:flex-none"
            onClick={() => setActiveTab('charts')}
          >
            <BarChart2 className="w-4 h-4 mr-2" /> Charts
          </Button>
          <Button 
            variant={activeTab === 'filters' ? 'default' : 'ghost'}
            className="rounded-lg flex-1 sm:flex-none"
            onClick={() => setActiveTab('filters')}
          >
            <Filter className="w-4 h-4 mr-2" /> Filters & Interact
          </Button>
        </div>

        {/* Tab Content */}
        <div className="animate-fade-in custom-scroll">
          {activeTab === 'data' && (
            <div className="bg-card border border-border rounded-xl p-6 min-h-[400px]">
              {dataView}
            </div>
          )}
          {activeTab === 'charts' && (
            <div className="bg-card border border-border rounded-xl p-6 min-h-[400px]">
              {chartView}
            </div>
          )}
          {activeTab === 'filters' && (
            <div className="bg-card border border-border rounded-xl p-6 min-h-[400px]">
              {filterView}
            </div>
          )}
        </div>
      </Container>
    </>
  );
}
