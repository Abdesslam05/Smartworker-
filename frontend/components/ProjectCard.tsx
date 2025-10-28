import Link from 'next/link';
import { CurrencyDollarIcon, CalendarDaysIcon, MapPinIcon } from '@heroicons/react/24/outline';

interface ProjectCardProps {
  id: string;
  title: string;
  description: string;
  budget: number;
  location: string;
  status: string;
}

export const ProjectCard = ({ id, title, description, budget, location, status }: ProjectCardProps) => {
  return (
    <div className="card flex flex-col gap-4 p-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-brand-muted">
          {status.replace('_', ' ')}
        </span>
      </div>
      <p className="text-sm text-slate-600 line-clamp-3">{description}</p>
      <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600">
        <span className="inline-flex items-center gap-1">
          <CurrencyDollarIcon className="h-4 w-4" /> {budget.toLocaleString()} MAD
        </span>
        <span className="inline-flex items-center gap-1">
          <MapPinIcon className="h-4 w-4" /> {location}
        </span>
        <span className="inline-flex items-center gap-1">
          <CalendarDaysIcon className="h-4 w-4" /> Flexible timeline
        </span>
      </div>
      <div className="flex justify-end pt-2">
        <Link href={`/projects/${id}`} className="text-sm font-semibold text-brand-accent hover:underline">
          View details
        </Link>
      </div>
    </div>
  );
};
