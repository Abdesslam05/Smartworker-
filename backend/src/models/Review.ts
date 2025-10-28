import mongoose, { Document, Schema } from 'mongoose';
import { IUser } from './User';
import { IProject } from './Project';
import { IWorkerProfile } from './WorkerProfile';

export interface IReview extends Document {
  project: IProject['_id'];
  client: IUser['_id'];
  worker: IWorkerProfile['_id'];
  rating: number;
  comment: string;
  createdAt: Date;
}

const reviewSchema = new Schema<IReview>(
  {
    project: { type: Schema.Types.ObjectId, ref: 'Project', required: true },
    client: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    worker: { type: Schema.Types.ObjectId, ref: 'WorkerProfile', required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, default: '' },
  },
  { timestamps: true }
);

reviewSchema.index({ worker: 1, createdAt: -1 });

export const ReviewModel = mongoose.model<IReview>('Review', reviewSchema);
