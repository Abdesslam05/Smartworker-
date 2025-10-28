'use client';

import { useEffect, useState } from 'react';
import useSWR from 'swr';
import { fetcher, api } from '../../../lib/api';
import { hydrateSession, useSession } from '../../../store/useSession';
import { useToasts } from '../../../store/useToast';
import { WorkerCard } from '../../../components/WorkerCard';

interface ProjectResponse {
  _id: string;
  title: string;
  description: string;
  budget: number;
  location: {
    address: string;
  };
}

interface ProfileResponse {
  _id: string;
  specialization: string[];
  experienceYears: number;
  ratingAverage: number;
  ratingCount: number;
  availabilityStatus: string;
  user: {
    name: string;
    location: {
      address: string;
    };
  };
}

export default function WorkerDashboard() {
  const { user } = useSession();
  const { addToast } = useToasts();
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    hydrateSession();
  }, []);

  const { data: projects } = useSWR<ProjectResponse[]>(user ? '/projects' : null, fetcher);
  const { data: profile, mutate } = useSWR<ProfileResponse>(user ? '/workers/me' : null, fetcher);

  const updateAvailability = async (status: 'available' | 'busy' | 'on_leave') => {
    if (!user) return;
    setIsUpdating(true);
    try {
      await api.put('/workers/me', { availabilityStatus: status, specialization: profile?.specialization || ['General electrical'], experienceYears: profile?.experienceYears || 1 });
      addToast({ title: 'Availability updated', type: 'success' });
      mutate();
    } catch (error) {
      addToast({ title: 'Update failed', type: 'error' });
    } finally {
      setIsUpdating(false);
    }
  };

  if (!user) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-3xl flex-col items-center justify-center gap-4 px-6 text-center">
        <h1 className="text-3xl font-semibold text-slate-900">Professionals only</h1>
        <p className="text-slate-600">Sign in or create a worker profile to start receiving client leads.</p>
        <div className="flex gap-4">
          <a href="/(auth)/login" className="button-primary">
            Sign in
          </a>
          <a href="/(auth)/register?role=worker" className="rounded-lg border border-brand-accent px-4 py-2 font-semibold text-brand-accent">
            Become a SmartWorker
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-8 px-6 py-12">
      <div className="card flex flex-col gap-4 p-6 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-slate-900">Hello, {user.name.split(' ')[0]}</h1>
          <p className="text-sm text-slate-600">Keep your profile updated to stay on top of project matches.</p>
        </div>
        <div className="flex items-center gap-3">
          {['available', 'busy', 'on_leave'].map((status) => (
            <button
              key={status}
              onClick={() => updateAvailability(status as any)}
              disabled={isUpdating}
              className={`rounded-full border px-4 py-2 text-sm font-semibold capitalize transition ${
                profile?.availabilityStatus === status
                  ? 'border-brand-accent bg-brand-accent/10 text-brand-accent'
                  : 'border-slate-200 text-slate-600 hover:border-brand-accent hover:text-brand-accent'
              }`}
            >
              {status.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>
      {profile && (
        <WorkerCard
          id={profile._id}
          name={profile.user.name}
          specialization={profile.specialization}
          rating={profile.ratingAverage || 0}
          reviewCount={profile.ratingCount || 0}
          experienceYears={profile.experienceYears || 0}
          location={profile.user.location?.address || 'Morocco'}
        />
      )}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-slate-900">Open client requests</h2>
          <a href="/projects" className="text-sm font-semibold text-brand-accent hover:underline">
            See all projects
          </a>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {projects?.slice(0, 4).map((project) => (
            <div key={project._id} className="card p-6">
              <h3 className="text-lg font-semibold text-slate-900">{project.title}</h3>
              <p className="mt-2 text-sm text-slate-600 line-clamp-3">{project.description}</p>
              <div className="mt-4 text-sm text-slate-600">
                Budget: <span className="font-semibold">{project.budget.toLocaleString()} MAD</span>
              </div>
              <div className="text-sm text-slate-600">Location: {project.location?.address || 'Morocco'}</div>
              <button className="button-primary mt-4 w-full">Submit proposal</button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
