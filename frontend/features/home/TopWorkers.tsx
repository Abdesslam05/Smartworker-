'use client';

import useSWR from 'swr';
import { WorkerCard } from '../../components/WorkerCard';
import { fetcher } from '../../lib/api';

interface WorkerResponse {
  _id: string;
  user: {
    name: string;
    location: {
      address: string;
    };
  };
  specialization: string[];
  ratingAverage: number;
  ratingCount: number;
  experienceYears: number;
}

export const TopWorkers = () => {
  const { data, isLoading } = useSWR<WorkerResponse[]>('/workers', fetcher);

  return (
    <section className="bg-slate-50 py-16">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-semibold text-slate-900">Featured professionals</h2>
            <p className="text-slate-600">Recommended by homeowners across Casablanca, Rabat, and Marrakech.</p>
          </div>
          <a href="/workers" className="text-sm font-semibold text-brand-accent hover:underline">
            View all workers
          </a>
        </div>
        {isLoading && <p className="text-brand-muted">Loading top workers...</p>}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {data?.slice(0, 6).map((worker) => (
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
      </div>
    </section>
  );
};
