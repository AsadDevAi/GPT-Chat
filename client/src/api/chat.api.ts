import api from './client';
import type { Chat, Message } from '../types';

export const chatApi = {
  getChats: () =>
    api.get<{ chats: Chat[] }>('/api/chats'),

  createChat: (title?: string) =>
    api.post<{ chat: Chat }>('/api/chats', { title }),

  deleteChat: (id: string) =>
    api.delete<{ message: string }>(`/api/chats/${id}`),

  updateChat: (id: string, title: string) =>
    api.patch<{ chat: Chat }>(`/api/chats/${id}`, { title }),

  getMessages: (chatId: string) =>
    api.get<{ messages: Message[] }>(`/api/chats/${chatId}/messages`),
};

export function getStreamUrl(chatId: string): string {
  return `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/chats/${chatId}/messages`;
}

export function getRegenerateUrl(chatId: string): string {
  return `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/chats/${chatId}/regenerate`;
}
