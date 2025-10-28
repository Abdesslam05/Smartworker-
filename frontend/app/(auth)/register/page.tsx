'use client';

import { FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '../../../lib/api';
import { useSession, hydrateSession } from '../../../store/useSession';
import { useToasts } from '../../../store/useToast';

export default function RegisterPage() {
  const router = useRouter();
  const { addToast } = useToasts();
  const { setSession } = useSession();
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    role: 'client',
    address: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    hydrateSession();
  }, []);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    try {
      const { data } = await api.post('/auth/register', {
        name: form.name,
        email: form.email,
        phone: form.phone,
        password: form.password,
        role: form.role,
        languages: ['Arabic', 'French'],
        location: {
          address: form.address,
        },
      });
      setSession({ user: data.user, accessToken: data.accessToken });
      addToast({ title: 'Account created', description: 'Complete your profile to appear in search results.', type: 'success' });
      router.push(form.role === 'worker' ? '/(dashboard)/worker' : '/(dashboard)/client');
    } catch (error: any) {
      addToast({ title: 'Registration failed', description: error?.response?.data?.message || 'Try again later', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-2xl flex-col justify-center px-6 py-16">
      <div className="card grid gap-8 p-8 md:grid-cols-2">
        <div className="space-y-4">
          <h1 className="text-2xl font-semibold text-slate-900">Create your free account</h1>
          <p className="text-sm text-slate-600">
            Join SmartWorker Connect as a client to post projects or as a professional to showcase your expertise.
          </p>
        </div>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Full name</label>
            <input
              value={form.name}
              onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
              required
              className="w-full rounded-lg border border-slate-200 px-4 py-2 focus:border-brand-accent focus:outline-none"
            />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
                required
                className="w-full rounded-lg border border-slate-200 px-4 py-2 focus:border-brand-accent focus:outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Phone</label>
              <input
                value={form.phone}
                onChange={(event) => setForm((prev) => ({ ...prev, phone: event.target.value }))}
                required
                className="w-full rounded-lg border border-slate-200 px-4 py-2 focus:border-brand-accent focus:outline-none"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Password</label>
            <input
              type="password"
              value={form.password}
              onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
              required
              className="w-full rounded-lg border border-slate-200 px-4 py-2 focus:border-brand-accent focus:outline-none"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Role</label>
            <select
              value={form.role}
              onChange={(event) => setForm((prev) => ({ ...prev, role: event.target.value }))}
              className="w-full rounded-lg border border-slate-200 px-4 py-2 focus:border-brand-accent focus:outline-none"
            >
              <option value="client">Client</option>
              <option value="worker">Professional</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Primary location</label>
            <input
              value={form.address}
              onChange={(event) => setForm((prev) => ({ ...prev, address: event.target.value }))}
              placeholder="e.g. Casablanca, Derb Ghalaf"
              required
              className="w-full rounded-lg border border-slate-200 px-4 py-2 focus:border-brand-accent focus:outline-none"
            />
          </div>
          <button type="submit" className="button-primary w-full" disabled={isLoading}>
            {isLoading ? 'Creating account...' : 'Create account'}
          </button>
          <p className="text-center text-sm text-slate-600">
            Already have an account?{' '}
            <Link href="/(auth)/login" className="text-brand-accent hover:underline">
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
