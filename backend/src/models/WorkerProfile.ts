import mongoose, { Document, Schema } from 'mongoose';
import { IUser } from './User';

export interface IPortfolioItem {
  title: string;
  description: string;
  mediaUrl: string;
  tags: string[];
}

export interface IWorkerProfile extends Document {
  user: IUser['_id'];
  specialization: string[];
  experienceYears: number;
  certifications: string[];
  hourlyRate?: number;
  availabilityStatus: 'available' | 'busy' | 'on_leave';
  ratingAverage: number;
  ratingCount: number;
  portfolio: IPortfolioItem[];
  bio: string;
}

const portfolioItemSchema = new Schema<IPortfolioItem>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  mediaUrl: { type: String, required: true },
  tags: { type: [String], default: [] },
});

const workerProfileSchema = new Schema<IWorkerProfile>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    specialization: { type: [String], default: [] },
    experienceYears: { type: Number, default: 0 },
    certifications: { type: [String], default: [] },
    hourlyRate: { type: Number },
    availabilityStatus: {
      type: String,
      enum: ['available', 'busy', 'on_leave'],
      default: 'available',
    },
    ratingAverage: { type: Number, default: 0 },
    ratingCount: { type: Number, default: 0 },
    portfolio: { type: [portfolioItemSchema], default: [] },
    bio: { type: String, default: '' },
  },
  { timestamps: true }
);

export const WorkerProfileModel = mongoose.model<IWorkerProfile>('WorkerProfile', workerProfileSchema);
