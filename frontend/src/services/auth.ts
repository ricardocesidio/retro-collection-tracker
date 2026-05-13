import { apiRequest } from './api-client';

interface AuthResponse {
  user: {
    id: string;
    email: string;
    username: string;
    displayName?: string;
    bio?: string;
    avatarUrl?: string;
    role: string;
    createdAt: string;
    stats?: {
      collections: number;
      wishlists: number;
      reviews: number;
      followers: number;
      following: number;
    };
  };
  token: string;
}

export const authApi = {
  login: (email: string, password: string): Promise<AuthResponse> =>
    apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  register: (
    email: string,
    username: string,
    password: string,
    displayName?: string,
  ): Promise<AuthResponse> =>
    apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, username, password, displayName }),
    }),

  getProfile: (): Promise<AuthResponse['user']> => apiRequest('/auth/me'),

  getUserByUsername: (username: string): Promise<AuthResponse['user']> =>
    apiRequest(`/users/${username}`),
};

export type { AuthResponse };
