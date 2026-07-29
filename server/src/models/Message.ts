import { Schema, model, Document, Types } from 'mongoose';

export type MessageRole = 'user' | 'assistant';

export interface IMessage extends Document {
  chatId: Types.ObjectId;
  role: MessageRole;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

const messageSchema = new Schema<IMessage>(
  {
    chatId: { type: Schema.Types.ObjectId, ref: 'Chat', required: true },
    role: { type: String, enum: ['user', 'assistant'], required: true },
    content: { type: String, required: true },
  },
  { timestamps: true }
);

messageSchema.index({ chatId: 1, createdAt: 1 });

export const Message = model<IMessage>('Message', messageSchema);
