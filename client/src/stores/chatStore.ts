import { create } from 'zustand';
import type { Chat, Message } from '../types';

interface ChatState {
  chats: Chat[];
  activeChatId: string | null;
  messages: Message[];
  isStreaming: boolean;
  streamingContent: string;
  isLoadingChats: boolean;
  isLoadingMessages: boolean;

  setChats: (chats: Chat[]) => void;
  addChat: (chat: Chat) => void;
  updateChat: (id: string, data: Partial<Chat>) => void;
  removeChat: (id: string) => void;
  setActiveChatId: (id: string | null) => void;
  setMessages: (messages: Message[]) => void;
  addMessage: (message: Message) => void;
  updateLastAssistantMessage: (content: string) => void;
  setIsStreaming: (value: boolean) => void;
  setStreamingContent: (content: string) => void;
  appendStreamingContent: (chunk: string) => void;
  setIsLoadingChats: (value: boolean) => void;
  setIsLoadingMessages: (value: boolean) => void;
  clearMessages: () => void;
}

export const useChatStore = create<ChatState>()((set) => ({
  chats: [],
  activeChatId: null,
  messages: [],
  isStreaming: false,
  streamingContent: '',
  isLoadingChats: false,
  isLoadingMessages: false,

  setChats: (chats) => set({ chats }),

  addChat: (chat) =>
    set((state) => ({ chats: [chat, ...state.chats] })),

  updateChat: (id, data) =>
    set((state) => ({
      chats: state.chats.map((c) => (c._id === id ? { ...c, ...data } : c)),
    })),

  removeChat: (id) =>
    set((state) => ({
      chats: state.chats.filter((c) => c._id !== id),
      activeChatId: state.activeChatId === id ? null : state.activeChatId,
      messages: state.activeChatId === id ? [] : state.messages,
    })),

  setActiveChatId: (id) => set({ activeChatId: id }),

  setMessages: (messages) => set({ messages }),

  addMessage: (message) =>
    set((state) => ({ messages: [...state.messages, message] })),

  updateLastAssistantMessage: (content) =>
    set((state) => {
      const messages = [...state.messages];
      for (let i = messages.length - 1; i >= 0; i--) {
        if (messages[i].role === 'assistant') {
          messages[i] = { ...messages[i], content };
          break;
        }
      }
      return { messages };
    }),

  setIsStreaming: (isStreaming) => set({ isStreaming }),

  setStreamingContent: (streamingContent) => set({ streamingContent }),

  appendStreamingContent: (chunk) =>
    set((state) => ({ streamingContent: state.streamingContent + chunk })),

  setIsLoadingChats: (isLoadingChats) => set({ isLoadingChats }),

  setIsLoadingMessages: (isLoadingMessages) => set({ isLoadingMessages }),

  clearMessages: () => set({ messages: [], streamingContent: '' }),
}));
