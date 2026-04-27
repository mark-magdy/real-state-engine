'use client';

import { useEffect, useState } from 'react';

type Property = {
  id: string;
  title: string;
  property_type: string;
  full_price?: number;
  rent?: number;
};

export default function Home() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Determine API URL (default to localhost API for dev, or injected via Next Config)
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/properties';
    const fetchUrl = apiUrl.endsWith('/api/properties') ? apiUrl : `${apiUrl}/api/properties`;

    fetch(fetchUrl)
      .then((res) => res.json())
      .then((data) => {
        setProperties(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to fetch properties:', err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen p-8 bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50">
      <main className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Available Properties</h1>
        
        {loading ? (
          <p className="text-lg">Loading properties...</p>
        ) : properties.length === 0 ? (
          <p className="text-lg">No properties available.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((prop) => (
              <div key={prop.id} className="bg-white dark:bg-zinc-800 p-6 rounded-lg shadow-md border border-zinc-200 dark:border-zinc-700">
                <h2 className="text-2xl font-semibold mb-2">{prop.title}</h2>
                <div className="flex justify-between items-center mt-4">
                  <span>
                    {prop.property_type}
                  </span>

                  <span>
                    ${(prop.full_price ?? prop.rent ?? 0).toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
