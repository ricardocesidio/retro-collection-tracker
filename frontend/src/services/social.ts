import type { GameData } from './collections';

const API = 'http://localhost:3000/api';

async function request(path: string, options: RequestInit = {}) {
  const token = localStorage.getItem('token');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...((options.headers as Record<string, string>) || {}),
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(`${API}${path}`, { ...options, headers });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Request failed');
  return data;
}

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
  _count: { collections: number; wishlists: number; reviews: number; followers: number; following: number };
}

export const wishlistApi = {
  list: (params?: Record<string, string>) => {
    const qs = params ? '?' + new URLSearchParams(params).toString() : '';
    return request(`/wishlist${qs}`);
  },
  add: (gameId: string, priority?: number, notes?: string): Promise<WishlistEntry> =>
    request('/wishlist', { method: 'POST', body: JSON.stringify({ gameId, priority, notes }) }),
  remove: (id: string): Promise<void> =>
    request(`/wishlist/${id}`, { method: 'DELETE' }),
};

export const reviewsApi = {
  getByGame: (gameId: string, params?: Record<string, string>) => {
    const qs = params ? '?' + new URLSearchParams(params).toString() : '';
    return request(`/reviews/game/${gameId}${qs}`);
  },
  create: (gameId: string, rating: number, title?: string, body?: string): Promise<ReviewEntry> =>
    request('/reviews', { method: 'POST', body: JSON.stringify({ gameId, rating, title, body }) }),
  update: (id: string, data: Record<string, any>): Promise<ReviewEntry> =>
    request(`/reviews/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string): Promise<void> =>
    request(`/reviews/${id}`, { method: 'DELETE' }),
};

export const followApi = {
  follow: (userId: string) =>
    request(`/follow/${userId}`, { method: 'POST' }),
  unfollow: (userId: string) =>
    request(`/follow/${userId}`, { method: 'DELETE' }),
  isFollowing: (userId: string): Promise<{ isFollowing: boolean }> =>
    request(`/follow/${userId}/status`),
  getFollowers: (userId: string, params?: Record<string, string>) => {
    const qs = params ? '?' + new URLSearchParams(params).toString() : '';
    return request(`/users/${userId}/followers${qs}`);
  },
  getFollowing: (userId: string, params?: Record<string, string>) => {
    const qs = params ? '?' + new URLSearchParams(params).toString() : '';
    return request(`/users/${userId}/following${qs}`);
  },
  getActivity: (params?: Record<string, string>) => {
    const qs = params ? '?' + new URLSearchParams(params).toString() : '';
    return request(`/activity${qs}`);
  },
};

export const usersApi = {
  getByUsername: (username: string): Promise<UserProfile> =>
    request(`/users/${username}`),
};

export interface NotificationEntry {
  id: string;
  recipientId: string;
  senderId?: string;
  type: string;
  title: string;
  body?: string;
  isRead: boolean;
  link?: string;
  metadata?: any;
  createdAt: string;
  sender?: { id: string; username: string; displayName?: string; avatarUrl?: string } | null;
}

export const notificationsApi = {
  list: (params?: Record<string, string>) => {
    const qs = params ? '?' + new URLSearchParams(params).toString() : '';
    return request(`/notifications${qs}`);
  },
  getUnreadCount: (): Promise<{ count: number }> =>
    request('/notifications/unread-count'),
  markAsRead: (id: string): Promise<void> =>
    request(`/notifications/${id}/read`, { method: 'POST' }),
  markAllAsRead: (): Promise<void> =>
    request('/notifications/read-all', { method: 'POST' }),
};
