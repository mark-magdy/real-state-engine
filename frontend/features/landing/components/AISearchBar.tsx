'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Sparkles, ArrowRight, Loader2 } from 'lucide-react';

export function AISearchBar() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const placeholder = 'What areas have the best ROI?';

  const handleSearch = async () => {
    if (!query.trim()) return;

    setIsSearching(true);
    setError(null);

    try {
      const res = await fetch('/api/ai-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: query.trim() }),
      });

      if (!res.ok) throw new Error('Search failed');

      const data = await res.json();

      if (data.route) {
        const params = data.params
          ? '?' + new URLSearchParams(data.params).toString()
          : '';
        router.push(data.route + params);
      } else {
        setError('Could not understand your query. Try browsing the analysis pages directly.');
      }
    } catch {
      setError('AI search is unavailable. Browse the analysis pages manually.');
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="relative group">
        {/* Glow effect */}
        <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-coral/20 via-coral/10 to-teal/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-lg" />

        <div className="relative flex items-center rounded-full border-2 border-border bg-card shadow-lg transition-all duration-300 group-hover:border-coral/30 group-hover:shadow-xl focus-within:border-coral focus-within:shadow-xl">
          <div className="flex items-center pl-5 text-muted-foreground">
            {isSearching ? (
              <Loader2 className="h-5 w-5 animate-spin text-coral" />
            ) : (
              <Sparkles className="h-5 w-5" />
            )}
          </div>

          <input
            id="ai-search-input"
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setError(null);
            }}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder={placeholder}
            className="flex-1 bg-transparent px-4 py-4 text-base text-foreground placeholder:text-muted-foreground focus:outline-none"
            disabled={isSearching}
          />

          <button
            onClick={handleSearch}
            disabled={isSearching || !query.trim()}
            id="ai-search-submit"
            className="mr-2 flex items-center gap-2 rounded-full bg-coral px-5 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:bg-coral-hover disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSearching ? 'Thinking...' : 'Search'}
            {!isSearching && <ArrowRight className="h-3.5 w-3.5" />}
          </button>
        </div>
      </div>

      {error && (
        <p className="mt-3 text-center text-sm text-muted-foreground animate-fade-in">
          {error}
        </p>
      )}

      {/* Quick suggestions */}
      <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
        <span className="text-xs text-muted-foreground">Try:</span>
        {['ROI Analysis', 'Price Trends', 'Find Properties'].map((suggestion) => (
          <button
            key={suggestion}
            onClick={() => setQuery(suggestion)}
            className="rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground transition-colors hover:border-coral/30 hover:text-coral"
          >
            {suggestion}
          </button>
        ))}
      </div>
    </div>
  );
}
