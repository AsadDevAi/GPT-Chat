import { Types } from 'mongoose';
import { Chat, IChat } from '../models/Chat';
import { Message, IMessage } from '../models/Message';
import { ApiError } from '../types';

function createApiError(message: string, statusCode: number): ApiError {
  const error: ApiError = new Error(message);
  error.statusCode = statusCode;
  return error;
}

export async function getUserChats(userId: string): Promise<IChat[]> {
  return Chat.find({ userId }).sort({ updatedAt: -1 }).lean();
}

export async function createChat(userId: string, title?: string): Promise<IChat> {
  return Chat.create({ userId, title: title || 'New Chat' });
}

export async function getChatById(chatId: string, userId: string): Promise<IChat> {
  if (!Types.ObjectId.isValid(chatId)) {
    throw createApiError('Invalid chat ID', 400);
  }

  const chat = await Chat.findOne({ _id: chatId, userId });
  if (!chat) {
    throw createApiError('Chat not found', 404);
  }

  return chat;
}

export async function updateChatTitle(
  chatId: string,
  userId: string,
  title: string
): Promise<IChat> {
  const chat = await Chat.findOneAndUpdate(
    { _id: chatId, userId },
    { title },
    { new: true }
  );

  if (!chat) {
    throw createApiError('Chat not found', 404);
  }

  return chat;
}

export async function deleteChat(chatId: string, userId: string): Promise<void> {
  const chat = await Chat.findOneAndDelete({ _id: chatId, userId });
  if (!chat) {
    throw createApiError('Chat not found', 404);
  }

  await Message.deleteMany({ chatId });
}

export async function getChatMessages(
  chatId: string,
  userId: string
): Promise<IMessage[]> {
  await getChatById(chatId, userId);
  return Message.find({ chatId }).sort({ createdAt: 1 }).lean();
}

export async function saveMessage(
  chatId: string,
  role: 'user' | 'assistant',
  content: string
): Promise<IMessage> {
  return Message.create({ chatId, role, content });
}

export async function deleteLastAssistantMessage(chatId: string): Promise<void> {
  const lastMessage = await Message.findOne({ chatId, role: 'assistant' }).sort({
    createdAt: -1,
  });

  if (lastMessage) {
    await Message.deleteOne({ _id: lastMessage._id });
  }
}
