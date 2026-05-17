import { apiRequest } from './api-client';
import type { User, GameData } from '../types';

const adminParams = (params?: Record<string, string>) =>
  params ? '?' + new URLSearchParams(params).toString() : '';

export const adminApi = {
  listUsers: (params?: {
    page?: number;
    limit?: number;
    search?: string;
  }) => {
    const p = {
      page: params?.page?.toString(),
      limit: params?.limit?.toString(),
      search: params?.search,
    };
    return apiRequest(`/admin/users${adminParams(p)}`);
  },

  updateUserRole: (id: string, role: string) =>
    apiRequest(`/admin/users/${id}/role`, {
      method: 'PUT',
      body: JSON.stringify({ role }),
    }),

  toggleUserActive: (id: string) =>
    apiRequest(`/admin/users/${id}/toggle-active`, { method: 'PUT' }),

  listGames: (params?: {
    page?: number;
    limit?: number;
    search?: string;
  }) => {
    const p = {
      page: params?.page?.toString(),
      limit: params?.limit?.toString(),
      search: params?.search,
    };
    return apiRequest(`/admin/games${adminParams(p)}`);
  },
};