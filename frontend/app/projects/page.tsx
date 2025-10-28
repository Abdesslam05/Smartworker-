'use client';

import useSWR from 'swr';
import { ProjectCard } from '../../components/ProjectCard';
import { fetcher } from '../../lib/api';

interface ProjectResponse {
  _id: string;
  title: string;
  description: string;
  budget: number;
  status: string;
  location: {
    address: string;
  };
}

export default function ProjectsPage() {
  const { data, isLoading } = useSWR<ProjectResponse[]>('/projects', fetcher);

  return (
    <div className="mx-auto max-w-6xl space-y-8 px-6 py-12">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold text-slate-900">Browse active smart-home projects</h1>
        <p className="text-sm text-slate-600">Search public opportunities posted by clients throughout Morocco.</p>
      </div>
      {isLoading && <p className="text-brand-muted">Loading projects...</p>}
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
      {data?.length === 0 && !isLoading && (
        <div className="card p-8 text-center text-slate-600">
          <p>No public projects yet. Encourage clients to publish briefs for your services.</p>
        </div>
      )}
    </div>
  );
}
