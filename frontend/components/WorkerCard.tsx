import Image from 'next/image';
import { StarIcon, MapPinIcon } from '@heroicons/react/24/solid';
import Link from 'next/link';

export interface WorkerCardProps {
  id: string;
  name: string;
  specialization: string[];
  rating: number;
  reviewCount: number;
  experienceYears: number;
  location: string;
  photoUrl?: string;
}

export const WorkerCard = ({
  id,
  name,
  specialization,
  rating,
  reviewCount,
  experienceYears,
  location,
  photoUrl,
}: WorkerCardProps) => {
  return (
    <div className="card flex flex-col gap-4 p-6">
      <div className="flex items-center gap-4">
        <div className="relative h-16 w-16 overflow-hidden rounded-full bg-slate-200">
          {photoUrl ? (
            <Image src={photoUrl} fill alt={name} className="object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-2xl font-semibold text-brand">
              {name.charAt(0)}
            </div>
          )}
        </div>
        <div>
          <h3 className="text-lg font-semibold text-slate-900">{name}</h3>
          <p className="text-sm text-brand-muted">{specialization.join(' • ')}</p>
          <div className="mt-2 flex items-center gap-3 text-sm text-slate-600">
            <span className="inline-flex items-center gap-1">
              <StarIcon className="h-4 w-4 text-yellow-400" />
              {rating.toFixed(1)} ({reviewCount})
            </span>
            <span>{experienceYears}+ yrs exp.</span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2 text-sm text-brand-muted">
        <MapPinIcon className="h-4 w-4" /> {location}
      </div>
      <div className="flex items-center justify-between pt-2">
        <Link href={`/workers/${id}`} className="text-sm font-semibold text-brand-accent hover:underline">
          View profile
        </Link>
        <Link href={`/(dashboard)/client?worker=${id}`} className="button-primary text-sm">
          Hire now
        </Link>
      </div>
    </div>
  );
};
