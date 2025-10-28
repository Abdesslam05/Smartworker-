'use client';

import useSWR from 'swr';
import { useEffect } from 'react';
import Link from 'next/link';
import { fetcher } from '../../../lib/api';
import { ProjectCard } from '../../../components/ProjectCard';
import { hydrateSession, useSession } from '../../../store/useSession';
import { useToasts } from '../../../store/useToast';

interface ProjectResponse {
  _id: string;
  title: string;
  description: string;
  budget: number;
  location: {
    address: string;
  };
  status: string;
}

export default function ClientDashboard() {
  const { user } = useSession();
  const { addToast } = useToasts();

  useEffect(() => {
    hydrateSession();
  }, []);

  const { data, isLoading } = useSWR<ProjectResponse[]>(user ? '/projects' : null, fetcher, {
    onError: () => addToast({ title: 'Unable to load projects', type: 'error' }),
  });

  if (!user) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-3xl flex-col items-center justify-center gap-4 px-6 text-center">
        <h1 className="text-3xl font-semibold text-slate-900">Sign in to manage your projects</h1>
        <p className="text-slate-600">Access live proposals, hire professionals, and track progress.</p>
        <div className="flex gap-4">
          <a href="/(auth)/login" className="button-primary">
            Sign in
          </a>
          <a href="/(auth)/register" className="rounded-lg border border-brand-accent px-4 py-2 font-semibold text-brand-accent">
            Create account
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-8 px-6 py-12">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-slate-900">Welcome back, {user.name.split(' ')[0]}</h1>
          <p className="text-sm text-slate-600">Post new projects, monitor proposals, and collaborate with your hires.</p>
        </div>
        <Link href="/projects/new" className="button-primary text-sm">
          Post a new project
        </Link>
      </div>
      {isLoading && <p className="text-brand-muted">Loading your projects...</p>}
      <div className="grid gap-6 md:grid-cols-2">
        {data?.map((project) => (
          <ProjectCard
            key={project._id}
            id={project._id}
            title={project.title}
            description={project.description}
            budget={project.budget}
            location={project.location?.address || 'Morocco'}
            status={project.status}
          />
        ))}
      </div>
      {data?.length === 0 && (
        <div className="card p-8 text-center text-slate-600">
          <p>You have no active projects yet. Start by posting your first smart-home request.</p>
        </div>
      )}
    </div>
  );
}
