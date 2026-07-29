import Groq from 'groq-sdk';
import { Response } from 'express';
import { env } from '../config/env';
import { GroqMessage } from '../types';

const groq = new Groq({ apiKey: env.groqApiKey });

export async function streamChatCompletion(
  messages: GroqMessage[],
  res: Response,
  onComplete: (fullContent: string) => Promise<void>
): Promise<void> {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no');
  res.flushHeaders();

  const stream = await groq.chat.completions.create({
    model: env.groqModel,
    messages,
    stream: true,
    max_tokens: 4096,
    temperature: 0.7,
  });

  let fullContent = '';

  for await (const chunk of stream) {
    const delta = chunk.choices[0]?.delta?.content || '';
    if (delta) {
      fullContent += delta;
      res.write(`data: ${JSON.stringify({ content: delta })}\n\n`);
    }

    const finishReason = chunk.choices[0]?.finish_reason;
    if (finishReason) {
      res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
    }
  }

  await onComplete(fullContent);
  res.end();
}

export async function generateChatTitle(firstMessage: string): Promise<string> {
  const completion = await groq.chat.completions.create({
    model: env.groqModel,
    messages: [
      {
        role: 'system',
        content:
          'Generate a short, concise title (max 5 words) for a chat that starts with the following message. Return only the title, no quotes, no punctuation at the end.',
      },
      { role: 'user', content: firstMessage.slice(0, 500) },
    ],
    max_tokens: 20,
    temperature: 0.5,
  });

  return (
    completion.choices[0]?.message?.content?.trim() || 'New Chat'
  );
}
