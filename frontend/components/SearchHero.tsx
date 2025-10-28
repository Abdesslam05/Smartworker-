'use client';

import { useState } from 'react';
import { MagnifyingGlassIcon, AdjustmentsHorizontalIcon } from '@heroicons/react/24/solid';
import { useRouter } from 'next/navigation';

export const SearchHero = () => {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [location, setLocation] = useState('');

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const params = new URLSearchParams();
    if (query) params.append('q', query);
    if (location) params.append('location', location);
    router.push(`/workers?${params.toString()}`);
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-24 text-white">
      <div className="absolute inset-0 opacity-40" style={{ backgroundImage: 'radial-gradient(circle at top, #38BDF8, transparent 40%)' }}></div>
      <div className="relative mx-auto flex max-w-6xl flex-col gap-10 px-6">
        <div className="max-w-3xl space-y-6">
          <span className="rounded-full bg-white/10 px-4 py-1 text-sm uppercase tracking-[0.3em] text-sky-300">
            Electrical &amp; Smart Home Experts
          </span>
          <h1 className="text-4xl font-bold leading-tight sm:text-5xl">
            Hire vetted electricians and smart-home professionals in minutes.
          </h1>
          <p className="text-lg text-slate-200">
            Post your project, match with certified experts, and manage the entire journey from consultation to review—all in one
            place.
          </p>
        </div>
        <form onSubmit={onSubmit} className="grid gap-4 rounded-2xl bg-white/10 p-6 backdrop-blur-lg sm:grid-cols-[2fr_1.2fr_auto]">
          <div className="flex items-center gap-3 rounded-xl bg-white/10 px-4 py-3">
            <MagnifyingGlassIcon className="h-6 w-6 text-sky-300" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="What do you need help with?"
              className="w-full bg-transparent text-white placeholder-slate-300 focus:outline-none"
            />
          </div>
          <div className="flex items-center gap-3 rounded-xl bg-white/10 px-4 py-3">
            <AdjustmentsHorizontalIcon className="h-6 w-6 text-sky-300" />
            <input
              value={location}
              onChange={(event) => setLocation(event.target.value)}
              placeholder="Where are you located?"
              className="w-full bg-transparent text-white placeholder-slate-300 focus:outline-none"
            />
          </div>
          <button type="submit" className="button-primary h-full w-full sm:w-auto">
            Search workers
          </button>
        </form>
      </div>
    </section>
  );
};
