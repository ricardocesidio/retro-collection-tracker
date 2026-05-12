export interface User {
  id: string;
  email: string;
  username: string;
  bio?: string;
  avatarUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Game {
  id: string;
  title: string;
  platform: string;
  genre: string;
  releaseYear: number;
  developer?: string;
  publisher?: string;
  description?: string;
  coverImageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Collection {
  id: string;
  userId: string;
  gameId: string;
  condition: Condition;
  region: Region;
  notes?: string;
  personalRating?: number;
  estimatedValue?: number;
  ownershipStatus: OwnershipStatus;
  coverImage?: string;
  acquiredAt?: string;
  createdAt: string;
  updatedAt: string;
  user?: User;
  game?: Game;
}

export interface Wishlist {
  id: string;
  userId: string;
  gameId: string;
  priority: number;
  notes?: string;
  addedAt: string;
  game?: Game;
}

export interface Review {
  id: string;
  userId: string;
  gameId: string;
  rating: number;
  title?: string;
  body?: string;
  createdAt: string;
  updatedAt: string;
  user?: User;
  game?: Game;
}

export interface Follow {
  id: string;
  followerId: string;
  followingId: string;
  createdAt: string;
}

export type OwnershipStatus = 'OWNED' | 'WISHLIST' | 'FOR_SALE' | 'TRADED';

export type Condition =
  | 'MINT'
  | 'NEAR_MINT'
  | 'VERY_GOOD'
  | 'GOOD'
  | 'ACCEPTABLE'
  | 'POOR'
  | 'MISSING_PARTS';

export type Region = 'NTSC' | 'PAL' | 'NTSC_J' | 'REGION_FREE';
