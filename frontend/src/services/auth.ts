const API_URL = 'http://localhost:3000/api';

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

async function request(path: string, options: RequestInit = {}) {
  const token = localStorage.getItem('token');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...((options.headers as Record<string, string>) || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Request failed');
  }

  return data;
}

export const authApi = {
  login: (email: string, password: string): Promise<AuthResponse> =>
    request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  register: (
    email: string,
    username: string,
    password: string,
    displayName?: string,
  ): Promise<AuthResponse> =>
    request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, username, password, displayName }),
    }),

  getProfile: (): Promise<AuthResponse['user']> => request('/auth/me'),

  getUserByUsername: (username: string): Promise<AuthResponse['user']> =>
    request(`/users/${username}`),
};

export type { AuthResponse };
