// types/userTypes.ts

import type { Business } from "../../business/types/businessTypes";


export type UserRole = 'customer' | 'vendor' | 'admin';

export interface UserBase {
  username?: string | null;
  email: string;
  first_name?: string | null;
  last_name?: string | null;
  phone?: string | null;
  avatar_url?: string | null;
}

export interface UserRegister {
  username: string;
  email: string;
  password: string;
  role?: UserRole; 
}

export interface UserCreate extends UserBase {
  username?: string | null;
  password: string;
  role?: UserRole;
  is_verified?: boolean;
  phone?: string | null;
}

export interface UserUpdate {
  first_name?: string | null;
  last_name?: string | null;
  phone?: string | null;
  avatar_url?: string | null;
}

export interface UserResponse extends UserBase {
  id: number;
  role: UserRole;
  is_verified: boolean;
  is_active: boolean;
  last_login?: string | null; // datetime en ISO string
  created_at?: string | null;
  updated_at?: string | null;
}

export interface UserDetailResponse extends UserResponse {
  statistics?: Record<string, any> | null;
}

export interface UserPasswordUpdate {
  current_password: string;
  new_password: string;
}

export interface UserLoginResponse {
  user: UserResponse;
  access_token: string;
  token_type: string;
}

export interface UserWithBusinesses {
  id: number;
  username: string;
  email: string;
  first_name?: string | null;
  last_name?: string | null;
  businesses: Business[]; 
}

// Para paginación
export interface PaginationParams {
  skip?: number;
  limit?: number;
}

export interface UsersResponse {
  items: UserResponse[];
  total: number;
}