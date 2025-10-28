import { IWorkerProfile } from '../models/WorkerProfile';
import { haversineDistanceKm } from './location';

interface MatchContext {
  projectBudget?: number;
  projectLocation?: {
    lat: number;
    lng: number;
  };
}

interface WorkerWithUser extends IWorkerProfile {
  user: any;
}

export interface RankedWorker {
  worker: WorkerWithUser;
  score: number;
  distanceKm: number | null;
}

export const rankWorkers = (workers: WorkerWithUser[], context: MatchContext): RankedWorker[] => {
  const ratingWeight = 0.5;
  const experienceWeight = 0.3;
  const distanceWeight = 0.2;

  return workers
    .map((worker) => {
      const rating = worker.ratingAverage || 0;
      const experience = worker.experienceYears || 0;
      let distanceScore = 0;
      let distanceKm: number | null = null;

      if (worker.user?.location?.coordinates?.coordinates && context.projectLocation) {
        const [lng, lat] = worker.user.location.coordinates.coordinates;
        distanceKm = haversineDistanceKm(
          { lat, lng },
          { lat: context.projectLocation.lat, lng: context.projectLocation.lng }
        );
        // Normalize with simple inverse distance (avoid division by zero)
        distanceScore = distanceKm > 0 ? 1 / distanceKm : 1;
      }

      const score = ratingWeight * rating + experienceWeight * experience + distanceWeight * distanceScore;
      return { worker, score, distanceKm };
    })
    .sort((a, b) => b.score - a.score);
};
