import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { apiClient } from '../lib/apiClient';

// Tipos
export interface User {
    id: number;
    username: string;
    email: string;
    first_name: string | null;
    last_name: string | null;
    phone: string | null;
    avatar_url: string | null;
    role: string;
    is_verified: boolean;
    is_active: boolean;
    last_login: string | null;
    created_at: string;
    updated_at: string | null;
}

interface LoginResponse {
    access_token: string;
    token_type: string;
}

interface AuthState {
    token: string | null;
    user: User | null;
    isLoading: boolean;
    error: string | null;
    login: (username: string, password: string) => Promise<void>;
    logout: () => void;
    fetchUser: () => Promise<void>; // 👈 nueva función
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({  // añadimos get para acceder al estado actual
            token: null,
            user: null,
            isLoading: false,
            error: null,

            // función para obtener datos del usuario
            fetchUser: async () => {
                try {
                    const response = await apiClient.get<User>('/auth/me');
                    set({ user: response.data });
                } catch (error) {
                    console.error('Error al obtener usuario:', error);
                    // Si hay error, el token probablemente no es válido → limpiamos
                    set({ user: null, token: null });
                }
            },

            login: async (username, password) => {
                set({ isLoading: true, error: null });
                try {
                    const params = new URLSearchParams();
                    params.append('grant_type', 'password');
                    params.append('username', username);
                    params.append('password', password);
                    params.append('scope', '');
                    params.append('client_id', 'string');
                    params.append('client_secret', 'string');

                    const response = await apiClient.post<LoginResponse>('/auth/login', params, {
                        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    });
                    const { access_token } = response.data;

                    // 1. Guardamos el token
                    set({ token: access_token });

                    // 2. Obtenemos los datos del usuario (ahora el interceptor ya usará el token)
                    await get().fetchUser();

                    set({ isLoading: false });
                } catch (error: any) {
                    set({
                        error: error.response?.data?.detail || 'Error al iniciar sesión',
                        isLoading: false,
                    });
                    throw error;
                }
            },

            logout: () => {
                set({ token: null, user: null });
                localStorage.removeItem('access_token');
            },
        }),
        {
            name: 'auth-storage',
            partialize: (state) => ({ token: state.token, user: state.user }),
        }
    )
);