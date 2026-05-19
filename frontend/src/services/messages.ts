import { apiRequest } from './api-client';

export interface MessageData {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  imageUrl?: string;
  readAt?: string;
  createdAt: string;
  sender: { id: string; username: string; displayName?: string; avatarUrl?: string };
}

export interface ConversationData {
  user: { id: string; username: string; displayName?: string; avatarUrl?: string };
  lastMessage: { content: string; createdAt: string; senderId: string; imageUrl?: string };
  unreadCount: number;
  blocked?: boolean;
}

export const messagesApi = {
  send: (receiverId: string, content: string, imageUrl?: string): Promise<MessageData> =>
    apiRequest('/messages', { method: 'POST', body: JSON.stringify({ receiverId, content, imageUrl }) }),

  getConversations: (): Promise<ConversationData[]> =>
    apiRequest('/messages/conversations'),

  getMessages: (userId: string): Promise<MessageData[]> =>
    apiRequest(`/messages/conversations/${userId}`),

  getUnreadCount: (): Promise<{ count: number }> =>
    apiRequest('/messages/unread-count'),

  getBlocked: (): Promise<any[]> =>
    apiRequest('/messages/blocked'),

  blockUser: (userId: string): Promise<void> =>
    apiRequest(`/messages/block/${userId}`, { method: 'POST' }),

  unblockUser: (userId: string): Promise<void> =>
    apiRequest(`/messages/unblock/${userId}`, { method: 'POST' }),

  reportUser: (userId: string, reason?: string): Promise<void> =>
    apiRequest(`/messages/report/${userId}`, { method: 'POST', body: JSON.stringify({ reason }) }),
};
