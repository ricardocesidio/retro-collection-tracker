import { apiRequest, uploadFile } from './api-client';
import type { Platform, GameData, CollectionEntry, PaginatedResponse } from '../types';

const collectParams = (params?: Record<string, string>) =>
  params ? '?' + new URLSearchParams(params).toString() : '';

export const collectionApi = {
  getStats: (): Promise<any> => apiRequest('/collections/stats'),

  getValueHistory: (): Promise<Array<{month:string;value:number}>> =>
    apiRequest('/collections/value-history'),

  list: (params?: Record<string, string>): Promise<PaginatedResponse<CollectionEntry>> =>
    apiRequest(`/collections${collectParams(params)}`),

  getPublicCollection: (userId: string, params?: Record<string, string>): Promise<PaginatedResponse<CollectionEntry>> =>
    apiRequest(`/collections/user/${userId}${collectParams(params)}`),

  getById: (id: string): Promise<CollectionEntry> =>
    apiRequest(`/collections/${id}`),

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
    apiRequest('/collections', { method: 'POST', body: JSON.stringify(data) }),

  update: (id: string, data: Record<string, any>): Promise<CollectionEntry> =>
    apiRequest(`/collections/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

  delete: (id: string): Promise<void> =>
    apiRequest(`/collections/${id}`, { method: 'DELETE' }),

  exportCollection: (format: 'csv' | 'json'): Promise<void> => {
    const token = localStorage.getItem('token');
    return fetch(`/collections/export?format=${format}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
      .then((res) => {
        if (!res.ok) throw new Error('Export failed');
        const disposition = res.headers.get('Content-Disposition') || '';
        const match = disposition.match(/filename="?(.+?)"?$/);
        const filename = match ? match[1] : `collection.${format}`;
        return res.blob().then((blob) => {
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = filename;
          document.body.appendChild(a);
          a.click();
          a.remove();
          URL.revokeObjectURL(url);
        });
      });
  },
};

export const gamesApi = {
  list: (params?: Record<string, string>): Promise<PaginatedResponse<GameData>> =>
    apiRequest(`/games${collectParams(params)}`),

  getById: (id: string): Promise<GameData> => apiRequest(`/games/${id}`),

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
    apiRequest('/games', { method: 'POST', body: JSON.stringify(data) }),

  update: (id: string, data: Record<string, any>): Promise<GameData> =>
    apiRequest(`/games/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

  delete: (id: string): Promise<void> =>
    apiRequest(`/games/${id}`, { method: 'DELETE' }),
};

export type { Genre } from '../types';

export const catalogApi = {
  getPlatforms: (): Promise<Platform[]> => apiRequest('/games/platforms'),
  getGenres: (): Promise<Genre[]> => apiRequest('/games/genres'),
};

export const uploadApi = {
  gameCover: (gameId: string, file: File): Promise<{ url: string }> =>
    uploadFile(`/upload/cover/${gameId}`, file),

  collectionCover: (colId: string, file: File): Promise<{ url: string }> =>
    uploadFile(`/upload/collection-cover/${colId}`, file),

  avatar: (file: File): Promise<{ url: string }> =>
    uploadFile('/upload/avatar', file),
};

export type { Platform, Genre, GameData, CollectionEntry, PaginatedResponse };
