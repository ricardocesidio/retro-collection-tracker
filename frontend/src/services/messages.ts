import { apiRequest } from './api-client';

export interface MessageData {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  readAt?: string;
  createdAt: string;
  sender: { id: string; username: string; displayName?: string; avatarUrl?: string };
}

export interface ConversationData {
  user: { id: string; username: string; displayName?: string; avatarUrl?: string };
  lastMessage: { content: string; createdAt: string; senderId: string };
  unreadCount: number;
}

export const messagesApi = {
  send: (receiverId: string, content: string): Promise<MessageData> =>
    apiRequest('/messages', { method: 'POST', body: JSON.stringify({ receiverId, content }) }),

  getConversations: (): Promise<ConversationData[]> =>
    apiRequest('/messages/conversations'),

  getMessages: (userId: string): Promise<MessageData[]> =>
    apiRequest(`/messages/conversations/${userId}`),

  getUnreadCount: (): Promise<{ count: number }> =>
    apiRequest('/messages/unread-count'),
};
