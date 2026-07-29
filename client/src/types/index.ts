export interface User {
  _id: string;
  name: string;
  email: string;
  createdAt: string;
}

export interface Chat {
  _id: string;
  userId: string;
  title: string;
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  _id: string;
  chatId: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: string;
}

export interface ApiError {
  error: string;
  message: string;
}
