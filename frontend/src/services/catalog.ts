const API = 'http://localhost:3000/api';

export interface Platform {
  id: string;
  name: string;
  slug: string;
  manufacturer?: string;
}

export interface Genre {
  id: string;
  name: string;
  slug: string;
}

async function request(path: string) {
  const res = await fetch(`${API}${path}`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Request failed');
  return data;
}

export const catalogApi = {
  getPlatforms: (): Promise<Platform[]> => request('/games/platforms'),
  getGenres: (): Promise<Genre[]> => request('/games/genres'),
};
