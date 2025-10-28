'use client';

import { FormEvent, useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { api } from '../../../lib/api';
import { useSession, hydrateSession } from '../../../store/useSession';
import { useToasts } from '../../../store/useToast';

const LoginContent = () => {
  const router = useRouter();
  const { addToast } = useToasts();
  const { setSession } = useSession();
  const params = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    hydrateSession();
  }, []);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    try {
      const { data } = await api.post('/auth/login', { email, password });
      setSession({ user: data.user, accessToken: data.accessToken });
      addToast({ title: 'Welcome back 👋', description: 'You are signed in.', type: 'success' });
      const redirect = params.get('redirect') || '/';
      router.push(redirect);
    } catch (error: any) {
      addToast({ title: 'Unable to sign in', description: error?.response?.data?.message || 'Check your credentials', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-6 py-16">
      <div className="card space-y-6 p-8">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-semibold text-slate-900">Sign in to SmartWorker Connect</h1>
          <p className="text-sm text-slate-600">Access your dashboard, manage projects, and message professionals.</p>
        </div>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              className="w-full rounded-lg border border-slate-200 px-4 py-2 focus:border-brand-accent focus:outline-none"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              className="w-full rounded-lg border border-slate-200 px-4 py-2 focus:border-brand-accent focus:outline-none"
            />
          </div>
          <button type="submit" className="button-primary w-full" disabled={isLoading}>
            {isLoading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
        <p className="text-center text-sm text-slate-600">
          New to SmartWorker Connect?{' '}
          <Link href="/(auth)/register" className="text-brand-accent hover:underline">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center text-brand-muted">Loading login...</div>}>
      <LoginContent />
    </Suspense>
  );
}
