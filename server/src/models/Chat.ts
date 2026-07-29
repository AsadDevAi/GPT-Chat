import { Schema, model, Document, Types } from 'mongoose';

export interface IChat extends Document {
  userId: Types.ObjectId;
  title: string;
  createdAt: Date;
  updatedAt: Date;
}

const chatSchema = new Schema<IChat>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, default: 'New Chat', maxlength: 200 },
  },
  { timestamps: true }
);

chatSchema.index({ userId: 1, updatedAt: -1 });

export const Chat = model<IChat>('Chat', chatSchema);
