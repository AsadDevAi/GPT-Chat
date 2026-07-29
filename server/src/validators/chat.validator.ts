import { z } from 'zod';

export const createChatSchema = z.object({
  title: z.string().max(200).optional(),
});

export const updateChatSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
});

export const sendMessageSchema = z.object({
  content: z.string().min(1, 'Message content is required').max(32000),
});
