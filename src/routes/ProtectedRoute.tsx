import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';

export const ProtectedRoute = () => {
  const token = useAuthStore((state) => state.token);
  
  if (!token) {
    // Si no hay token, redirigir al login
    return <Navigate to="/login" replace />;
  }

  // Si hay token, renderizar la ruta hija
  return <Outlet />;
};

//Este componente actúa como un layout para rutas protegidas. 
// Usa el token del store para decidir si mostrar el contenido o redirigir.