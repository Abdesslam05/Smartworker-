'use client';

import { Suspense, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import useSWR from 'swr';
import { fetcher } from '../../lib/api';
import { WorkerCard } from '../../components/WorkerCard';

interface WorkerResponse {
  _id: string;
  specialization: string[];
  ratingAverage: number;
  ratingCount: number;
  experienceYears: number;
  user: {
    name: string;
    location: {
      address: string;
    };
  };
}

const specializations = ['Smart Home', 'Solar', 'EV Charging', 'Security Systems', 'Lighting', 'Networking'];

const WorkerDirectory = () => {
  const params = useSearchParams();
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const { data, isLoading } = useSWR<WorkerResponse[]>('/workers', fetcher);

  const filtered = useMemo(() => {
    if (!data) return [];
    const query = params.get('q');
    const location = params.get('location');
    return data.filter((worker) => {
      const matchesQuery = query
        ? [worker.user.name, worker.specialization.join(' '), worker.user.location?.address].some((field) =>
            field?.toLowerCase().includes(query.toLowerCase())
          )
        : true;
      const matchesLocation = location
        ? worker.user.location?.address?.toLowerCase().includes(location.toLowerCase())
        : true;
      const matchesSpecialization = activeFilter ? worker.specialization.includes(activeFilter) : true;
      return matchesQuery && matchesLocation && matchesSpecialization;
    });
  }, [data, params, activeFilter]);

  return (
    <div className="mx-auto max-w-6xl space-y-8 px-6 py-12">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-slate-900">Discover trusted professionals</h1>
          <p className="text-sm text-slate-600">
            Filter by specialization, experience, and ratings to find the perfect match for your project.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {specializations.map((tag) => (
            <button
              key={tag}
              onClick={() => setActiveFilter((prev) => (prev === tag ? null : tag))}
              className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                activeFilter === tag
                  ? 'border-brand-accent bg-brand-accent/10 text-brand-accent'
                  : 'border-slate-200 text-slate-600 hover:border-brand-accent hover:text-brand-accent'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>
      {isLoading && <p className="text-brand-muted">Loading professionals...</p>}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((worker) => (
          <WorkerCard
            key={worker._id}
            id={worker._id}
            name={worker.user.name}
            specialization={worker.specialization}
            rating={worker.ratingAverage || 0}
            reviewCount={worker.ratingCount || 0}
            experienceYears={worker.experienceYears || 0}
            location={worker.user.location?.address || 'Morocco'}
          />
        ))}
      </div>
      {filtered.length === 0 && !isLoading && (
        <div className="card p-8 text-center text-slate-600">
          <p>No professionals match your filters yet. Try removing filters or check back soon.</p>
        </div>
      )}
    </div>
  );
};

export default function WorkersPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center text-brand-muted">Loading workers...</div>}>
      <WorkerDirectory />
    </Suspense>
  );
}
