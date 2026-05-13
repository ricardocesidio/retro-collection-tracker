import { apiRequest } from './api-client';
import type { GameData, PaginatedResponse } from '../types';

export interface WishlistEntry {
  id: string;
  userId: string;
  gameId: string;
  priority: number;
  notes?: string;
  addedAt: string;
  game: GameData;
}

export interface ReviewEntry {
  id: string;
  userId: string;
  gameId: string;
  rating: number;
  title?: string;
  body?: string;
  likes: number;
  createdAt: string;
  updatedAt: string;
  user: { id: string; username: string; displayName?: string; avatarUrl?: string };
  game?: GameData;
}

export interface UserProfile {
  id: string;
  email: string;
  username: string;
  displayName?: string;
  bio?: string;
  avatarUrl?: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  _count: {
    collections: number;
    wishlists: number;
    reviews: number;
    followers: number;
    following: number;
  };
}

export interface NotificationEntry {
  id: string;
  recipientId: string;
  senderId?: string;
  type: string;
  title: string;
  body?: string;
  isRead: boolean;
  link?: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
  sender?: { id: string; username: string; displayName?: string; avatarUrl?: string } | null;
}

const collectParams = (params?: Record<string, string>) =>
  params ? '?' + new URLSearchParams(params).toString() : '';

export const wishlistApi = {
  list: (params?: Record<string, string>): Promise<PaginatedResponse<WishlistEntry>> =>
    apiRequest(`/wishlist${collectParams(params)}`),
  add: (gameId: string, priority?: number, notes?: string): Promise<WishlistEntry> =>
    apiRequest('/wishlist', { method: 'POST', body: JSON.stringify({ gameId, priority, notes }) }),
  remove: (id: string): Promise<void> =>
    apiRequest(`/wishlist/${id}`, { method: 'DELETE' }),
};

export const reviewsApi = {
  getByGame: (gameId: string, params?: Record<string, string>): Promise<PaginatedResponse<ReviewEntry>> =>
    apiRequest(`/reviews/game/${gameId}${collectParams(params)}`),
  getByUser: (userId: string, params?: Record<string, string>): Promise<PaginatedResponse<ReviewEntry>> =>
    apiRequest(`/reviews/user/${userId}${collectParams(params)}`),
  create: (gameId: string, rating: number, title?: string, body?: string): Promise<ReviewEntry> =>
    apiRequest('/reviews', { method: 'POST', body: JSON.stringify({ gameId, rating, title, body }) }),
  update: (id: string, data: Record<string, any>): Promise<ReviewEntry> =>
    apiRequest(`/reviews/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string): Promise<void> =>
    apiRequest(`/reviews/${id}`, { method: 'DELETE' }),
};

export const followApi = {
  follow: (userId: string) =>
    apiRequest(`/follow/${userId}`, { method: 'POST' }),
  unfollow: (userId: string) =>
    apiRequest(`/follow/${userId}`, { method: 'DELETE' }),
  isFollowing: (userId: string): Promise<{ isFollowing: boolean }> =>
    apiRequest(`/follow/${userId}/status`),
  getFollowers: (userId: string, params?: Record<string, string>): Promise<PaginatedResponse<any>> =>
    apiRequest(`/users/${userId}/followers${collectParams(params)}`),
  getFollowing: (userId: string, params?: Record<string, string>): Promise<PaginatedResponse<any>> =>
    apiRequest(`/users/${userId}/following${collectParams(params)}`),
  getActivity: (params?: Record<string, string>): Promise<PaginatedResponse<any>> =>
    apiRequest(`/activity${collectParams(params)}`),
};

export const usersApi = {
  getByUsername: (username: string): Promise<UserProfile> =>
    apiRequest(`/users/${username}`),
};

export const notificationsApi = {
  list: (params?: Record<string, string>): Promise<PaginatedResponse<NotificationEntry>> =>
    apiRequest(`/notifications${collectParams(params)}`),
  getUnreadCount: (): Promise<{ count: number }> =>
    apiRequest('/notifications/unread-count'),
  markAsRead: (id: string): Promise<void> =>
    apiRequest(`/notifications/${id}/read`, { method: 'POST' }),
  markAllAsRead: (): Promise<void> =>
    apiRequest('/notifications/read-all', { method: 'POST' }),
};
