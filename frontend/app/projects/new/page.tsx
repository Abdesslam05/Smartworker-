'use client';

import { FormEvent, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '../../../lib/api';
import { hydrateSession, useSession } from '../../../store/useSession';
import { useToasts } from '../../../store/useToast';

export default function NewProjectPage() {
  const router = useRouter();
  const { user } = useSession();
  const { addToast } = useToasts();
  const [form, setForm] = useState({
    title: '',
    description: '',
    budget: '',
    address: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    hydrateSession();
  }, []);

  if (!user) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-3xl flex-col items-center justify-center gap-4 px-6 text-center">
        <h1 className="text-3xl font-semibold text-slate-900">Sign in to post a project</h1>
        <p className="text-slate-600">Create a client account to get matched with top-rated professionals.</p>
        <a href="/(auth)/login" className="button-primary">
          Sign in
        </a>
      </div>
    );
  }

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);
    try {
      await api.post('/projects', {
        title: form.title,
        description: form.description,
        budget: Number(form.budget),
        location: {
          address: form.address,
        },
        photos: [],
      });
      addToast({ title: 'Project created', description: 'We are now matching you with nearby professionals.', type: 'success' });
      router.push('/(dashboard)/client');
    } catch (error: any) {
      addToast({ title: 'Unable to post project', description: error?.response?.data?.message || 'Try again later', type: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6 px-6 py-12">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold text-slate-900">Describe your project</h1>
        <p className="text-sm text-slate-600">Share as much detail as possible so we can recommend the right experts.</p>
      </div>
      <form onSubmit={onSubmit} className="card space-y-4 p-8">
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">Title</label>
          <input
            value={form.title}
            onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
            required
            className="w-full rounded-lg border border-slate-200 px-4 py-2 focus:border-brand-accent focus:outline-none"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">Description</label>
          <textarea
            value={form.description}
            onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
            required
            rows={6}
            className="w-full rounded-lg border border-slate-200 px-4 py-2 focus:border-brand-accent focus:outline-none"
          />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Budget (MAD)</label>
            <input
              type="number"
              value={form.budget}
              onChange={(event) => setForm((prev) => ({ ...prev, budget: event.target.value }))}
              required
              className="w-full rounded-lg border border-slate-200 px-4 py-2 focus:border-brand-accent focus:outline-none"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Project address</label>
            <input
              value={form.address}
              onChange={(event) => setForm((prev) => ({ ...prev, address: event.target.value }))}
              required
              className="w-full rounded-lg border border-slate-200 px-4 py-2 focus:border-brand-accent focus:outline-none"
            />
          </div>
        </div>
        <button type="submit" className="button-primary w-full" disabled={isSubmitting}>
          {isSubmitting ? 'Posting...' : 'Post project'}
        </button>
      </form>
    </div>
  );
}
