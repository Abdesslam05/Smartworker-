'use client';

import useSWR from 'swr';
import { useEffect } from 'react';
import { fetcher } from '../../../lib/api';
import { hydrateSession, useSession } from '../../../store/useSession';
import { useToasts } from '../../../store/useToast';

interface StatsResponse {
  users: number;
  workers: number;
  projects: number;
}

export default function AdminDashboard() {
  const { user } = useSession();
  const { addToast } = useToasts();

  useEffect(() => {
    hydrateSession();
  }, []);

  const { data: stats } = useSWR<StatsResponse>(user ? '/admin/stats' : null, fetcher, {
    onError: () => addToast({ title: 'Unable to load metrics', type: 'error' }),
  });

  if (!user || user.role !== 'admin') {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-3xl flex-col items-center justify-center gap-4 px-6 text-center">
        <h1 className="text-3xl font-semibold text-slate-900">Admins only</h1>
        <p className="text-slate-600">You need administrator access to view this dashboard.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-8 px-6 py-12">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold text-slate-900">Operations command center</h1>
        <p className="text-sm text-slate-600">Verify workers, moderate reviews, and monitor platform health.</p>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        <div className="card space-y-2 p-6">
          <p className="text-sm uppercase tracking-wide text-brand-muted">Total users</p>
          <p className="text-3xl font-semibold text-slate-900">{stats?.users ?? '—'}</p>
        </div>
        <div className="card space-y-2 p-6">
          <p className="text-sm uppercase tracking-wide text-brand-muted">Verified workers</p>
          <p className="text-3xl font-semibold text-slate-900">{stats?.workers ?? '—'}</p>
        </div>
        <div className="card space-y-2 p-6">
          <p className="text-sm uppercase tracking-wide text-brand-muted">Live projects</p>
          <p className="text-3xl font-semibold text-slate-900">{stats?.projects ?? '—'}</p>
        </div>
      </div>
      <div className="card space-y-4 p-6">
        <h2 className="text-xl font-semibold text-slate-900">Next steps</h2>
        <ul className="list-disc space-y-2 pl-6 text-sm text-slate-600">
          <li>Review pending worker certifications and mark as verified.</li>
          <li>Monitor trending search terms to plan new service categories.</li>
          <li>Export engagement data for executive reporting.</li>
        </ul>
      </div>
    </div>
  );
}
