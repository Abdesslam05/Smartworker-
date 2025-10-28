import mongoose, { Document, Schema } from 'mongoose';
import { IUser } from './User';
import { IWorkerProfile } from './WorkerProfile';

export type ProjectStatus = 'draft' | 'published' | 'in_progress' | 'completed' | 'cancelled';

export interface IProject extends Document {
  title: string;
  description: string;
  budget: number;
  location: {
    address: string;
    coordinates: {
      type: 'Point';
      coordinates: [number, number];
    };
  };
  client: IUser['_id'];
  assignedWorker?: IWorkerProfile['_id'];
  status: ProjectStatus;
  photos: string[];
  preferredStartDate?: Date;
  preferredCompletionDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const projectSchema = new Schema<IProject>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    budget: { type: Number, required: true },
    location: {
      address: { type: String, required: true },
      coordinates: {
        type: {
          type: String,
          enum: ['Point'],
          default: 'Point',
        },
        coordinates: {
          type: [Number],
          required: true,
          default: [0, 0],
        },
      },
    },
    client: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    assignedWorker: { type: Schema.Types.ObjectId, ref: 'WorkerProfile' },
    status: {
      type: String,
      enum: ['draft', 'published', 'in_progress', 'completed', 'cancelled'],
      default: 'published',
    },
    photos: { type: [String], default: [] },
    preferredStartDate: { type: Date },
    preferredCompletionDate: { type: Date },
  },
  { timestamps: true }
);

projectSchema.index({ 'location.coordinates': '2dsphere' });

export const ProjectModel = mongoose.model<IProject>('Project', projectSchema);
