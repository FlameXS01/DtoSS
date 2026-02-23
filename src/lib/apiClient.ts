import axios from 'axios'; 
import { useAuthStore } from '../stores/authStore';
// No podemos usar hooks fuera de componentes, necesitamos acceder al estado directamente

const baseURL = 'http://127.0.0.1:8000/eCommerce';

export const apiClient = axios.create({
    baseURL, 
    headers:{
        'Content-Type': 'application/json',
    },
});

// Interceptor para agregar token a las peticiones 
apiClient.interceptors.request.use(
    (config) => {
    // Obtener token del store (Zustand) 
        const token = useAuthStore.getState().token;
        if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        }
        return config; 
    },
    (error) => Promise.reject(error)
);

// Interceptor para manejar errores de respuesta (ej. 401)
apiClient.interceptors.response.use(
    (response) => response, 
    (error) => {
        if (error.response?.status === 401) {
            // Token inválido o expirado: limpiar token y redirigir al login
            localStorage.removeItem('access_token');
            // Podríamos disparar un evento para que el store de auth se actualice
            // Es lo q haremos posteriormente
            // Por ahora, solo redirigimos si estamos en el cliente
            if (typeof window !== 'undefined') {
                window.location.href = '/login'
            }
        }
        return Promise.reject(error);
    }
);

