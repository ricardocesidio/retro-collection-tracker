// ─── Shared Types ─────────────────────────────────────

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
  rawgRating?: number;
  rawgMetacritic?: number;
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

export interface User {
  id: string;
  email: string;
  username: string;
  displayName?: string;
  bio?: string;
  avatarUrl?: string;
  role: string;
  isActive: boolean;
  isEmailVerified: boolean;
  createdAt: string;
  lastLoginAt?: string;
  _count?: {
    collections: number;
    wishlists: number;
    reviews: number;
    followers: number;
    following: number;
  };
}
