import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1, // Reintentar una vez si falla
      refetchOnWindowFocus: false, // No recargar al enfocar la ventana 
      staleTime: 1000 * 60 * 5, // Los datos se consideran frescos por 5 minutos
    },
  },
});