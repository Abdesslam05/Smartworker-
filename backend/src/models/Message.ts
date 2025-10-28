import mongoose, { Document, Schema } from 'mongoose';
import { IUser } from './User';
import { IProject } from './Project';

export interface IMessage extends Document {
  chatId: string;
  project?: IProject['_id'];
  sender: IUser['_id'];
  recipient: IUser['_id'];
  content: string;
  createdAt: Date;
  readAt?: Date;
}

const messageSchema = new Schema<IMessage>(
  {
    chatId: { type: String, required: true, index: true },
    project: { type: Schema.Types.ObjectId, ref: 'Project' },
    sender: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    recipient: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true },
    readAt: { type: Date },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

messageSchema.index({ chatId: 1, createdAt: -1 });

export const MessageModel = mongoose.model<IMessage>('Message', messageSchema);
