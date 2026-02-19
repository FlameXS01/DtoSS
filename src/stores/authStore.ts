import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { apiClient } from '../lib/apiClient';

// Definimos el tipo de usuario(basado en mi api)
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

// Tipo respuesta del login 
interface LoginResponse {
    access_token: string;
    token_type: string;
}

// Estado y acciones del store 
interface AuthState {
    token: string | null;
    user: User| null;
    isLoading: boolean;
    error: string | null;
    login:(username: string, password: string) => Promise<void>;
    logout: () => void;
}

export const useAuthStore = create<AuthState>()(    //<tipo de storage>  () esto es que zustand retorna otra funcion
    persist( // persist(...) es el middleware  (estado inicial, configuracion)
        (set) => ({  // set es una función que proporciona Zustand para actualizar el estado (Estado inicial)
            token: null, 
            user:null, 
            isLoading: false,
            error: null,

            login: async (username, password) => {  // Acciones
                set({ isLoading: true, error: null}); // actualiza el estado: pone isLoading en true y limpia errores previos
                try {
                    // La API de login espera application/x-www-form-urlencoded con grant_type, username, password
                    // Construir los datos en formato form-urlencoded
                    const params = new URLSearchParams();  // clase nativa del navegador para crear cadenas application/x-www-form-urlencoded
                    params.append('grant_type', 'password');
                    params.append('username', username);
                    params.append('password', password);
                    params.append('scope', '');
                    params.append('client_id', 'string');
                    params.append('client_secret', 'string');
                    
                    const response = await apiClient.post<LoginResponse>('/auth/login', params, {
                        // Peticion (como esta <LoginResponse> le dice a typescript que la respuesta es en LoginResponse)
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded',
                        },

                    });
                    const { access_token } = response.data;
                
                    // Guardamos el token en el store
                    set({ token: access_token })
                    // Implementar  => Obtener datos del usuario con otro endpoint
                    // llamamos a /users/me
                    // Que seria mejor y mas seguro, llamar a /me o decodificar aqui ? 
                    set ({ isLoading: false });
                } catch ( error: any ) {
                    set ({
                        error: error.response?.data?.detail || 'Error al iniciar sesión',
                        isLoading: false,
                    });
                    throw error;
                }
            },
            logout: () => {
                set({ token: null, user: null});
                // También limpiamos el token del localStorage (aunque persist lo maneja)
                localStorage.removeItem('access_token');
            },
        }), // El objeto devuelto es el estado inicial más las acciones
        {
            name: 'auth-storage', // nombre en localStorage
            partialize: (state) => ({ token: state.token, user: state.user }), // solo persistimos token y user
            // partialize: una función que recibe el estado completo y devuelve solo las partes que queremos persistir
        }
    )
);
