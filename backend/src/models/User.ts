import mongoose, { Document, Schema } from 'mongoose';

export type UserRole = 'client' | 'worker' | 'admin';

export interface IUser extends Document {
  name: string;
  email: string;
  phone: string;
  password: string;
  role: UserRole;
  location: {
    address: string;
    coordinates: {
      type: 'Point';
      coordinates: [number, number];
    };
  };
  languages: string[];
  createdAt: Date;
  updatedAt: Date;
}

const locationSchema = new Schema({
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
});

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['client', 'worker', 'admin'], default: 'client' },
    location: { type: locationSchema, required: true },
    languages: { type: [String], default: [] },
  },
  { timestamps: true }
);

userSchema.index({ 'location.coordinates': '2dsphere' });

export const UserModel = mongoose.model<IUser>('User', userSchema);
