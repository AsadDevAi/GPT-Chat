import { Response, NextFunction } from 'express';
import { AuthRequest, GroqMessage } from '../types';
import * as chatService from '../services/chat.service';
import { streamChatCompletion, generateChatTitle } from '../services/groq.service';
import { createChatSchema, updateChatSchema, sendMessageSchema } from '../validators/chat.validator';

export async function getChats(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const chats = await chatService.getUserChats(req.user!.userId);
    res.json({ chats });
  } catch (err) {
    next(err);
  }
}

export async function createChat(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const body = createChatSchema.parse(req.body);
    const chat = await chatService.createChat(req.user!.userId, body.title);
    res.status(201).json({ chat });
  } catch (err) {
    next(err);
  }
}

export async function deleteChat(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    await chatService.deleteChat(req.params.id as string, req.user!.userId);
    res.json({ message: 'Chat deleted successfully' });
  } catch (err) {
    next(err);
  }
}

export async function updateChat(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { title } = updateChatSchema.parse(req.body);
    const chat = await chatService.updateChatTitle(
      req.params.id as string,
      req.user!.userId,
      title
    );
    res.json({ chat });
  } catch (err) {
    next(err);
  }
}

export async function getMessages(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const messages = await chatService.getChatMessages(
      req.params.id as string,
      req.user!.userId
    );
    res.json({ messages });
  } catch (err) {
    next(err);
  }
}

export async function sendMessage(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { content } = sendMessageSchema.parse(req.body);
    const chatId = req.params.id as string;
    const userId = req.user!.userId;

    await chatService.getChatById(chatId, userId);

    await chatService.saveMessage(chatId, 'user', content);

    const allMessages = await chatService.getChatMessages(chatId, userId);
    const isFirstMessage = allMessages.filter((m) => m.role === 'user').length === 1;

    const groqMessages: GroqMessage[] = [
      {
        role: 'system',
        content:
          'You are a helpful, knowledgeable, and friendly AI assistant. Provide clear, accurate, and well-structured responses.',
      },
      ...allMessages.map((m) => ({ role: m.role as 'user' | 'assistant', content: m.content })),
    ];

    await streamChatCompletion(groqMessages, res, async (fullContent) => {
      await chatService.saveMessage(chatId, 'assistant', fullContent);

      if (isFirstMessage && fullContent) {
        const title = await generateChatTitle(content);
        await chatService.updateChatTitle(chatId, userId, title);
      }
    });
  } catch (err) {
    if (!res.headersSent) {
      next(err);
    }
  }
}

export async function regenerateMessage(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const chatId = req.params.id as string;
    const userId = req.user!.userId;

    await chatService.getChatById(chatId, userId);
    await chatService.deleteLastAssistantMessage(chatId);

    const allMessages = await chatService.getChatMessages(chatId, userId);
    const groqMessages: GroqMessage[] = [
      {
        role: 'system',
        content:
          'You are a helpful, knowledgeable, and friendly AI assistant. Provide clear, accurate, and well-structured responses.',
      },
      ...allMessages.map((m) => ({ role: m.role as 'user' | 'assistant', content: m.content })),
    ];

    await streamChatCompletion(groqMessages, res, async (fullContent) => {
      await chatService.saveMessage(chatId, 'assistant', fullContent);
    });
  } catch (err) {
    if (!res.headersSent) {
      next(err);
    }
  }
}
