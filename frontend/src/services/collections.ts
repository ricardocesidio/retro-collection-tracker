const API = 'http://localhost:3000/api';

export interface Platform {
  id: string;
  name: string;
  slug: string;
  manufacturer?: string;
  releaseYear?: number;
}

export interface Genre {
  id: string;
  name: string;
  slug: string;
}

export interface GameData {
  id: string;
  title: string;
  releaseYear: number;
  developer?: string;
  publisher?: string;
  description?: string;
  coverImageUrl?: string;
  platform: Platform;
  genre: Genre;
  _count?: { collections: number; wishlists: number; reviews: number };
}

export interface CollectionEntry {
  id: string;
  userId: string;
  gameId: string;
  condition: string;
  region: string;
  notes?: string;
  personalRating?: number;
  estimatedValue?: number;
  ownershipStatus: string;
  coverImage?: string;
  acquiredAt?: string;
  createdAt: string;
  updatedAt: string;
  game: GameData;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  totalValue?: number;
}

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

export const collectionApi = {
  getStats: (): Promise<any> => request('/collections/stats'),

  list: (params?: Record<string, string>): Promise<PaginatedResponse<CollectionEntry>> => {
    const qs = params ? '?' + new URLSearchParams(params).toString() : '';
    return request(`/collections${qs}`);
  },

  getById: (id: string): Promise<CollectionEntry> =>
    request(`/collections/${id}`),

  create: (data: {
    gameId: string;
    condition?: string;
    region?: string;
    notes?: string;
    personalRating?: number;
    estimatedValue?: number;
    ownershipStatus?: string;
    coverImage?: string;
  }): Promise<CollectionEntry> =>
    request('/collections', { method: 'POST', body: JSON.stringify(data) }),

  update: (id: string, data: Record<string, any>): Promise<CollectionEntry> =>
    request(`/collections/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

  delete: (id: string): Promise<void> =>
    request(`/collections/${id}`, { method: 'DELETE' }),
};

export const gamesApi = {
  list: (params?: Record<string, string>): Promise<PaginatedResponse<GameData>> => {
    const qs = params ? '?' + new URLSearchParams(params).toString() : '';
    return request(`/games${qs}`);
  },

  getById: (id: string): Promise<GameData> => request(`/games/${id}`),

  create: (data: {
    title: string;
    platformId: string;
    genreId: string;
    releaseYear: number;
    developer?: string;
    publisher?: string;
    description?: string;
    coverImageUrl?: string;
  }): Promise<GameData> =>
    request('/games', { method: 'POST', body: JSON.stringify(data) }),

  update: (id: string, data: Record<string, any>): Promise<GameData> =>
    request(`/games/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
};
