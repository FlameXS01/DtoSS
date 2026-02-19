import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { queryClient } from './lib/react-query';
import App from './App';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root')!) // ! Es para decirle al compilador que confie

root.render( // Renderiza la aplicacion 
  // StrictMode activa comprobaciones adicionales y advertencias
  // QueryClientProvider hace que el cliente de TanStack Query esté disponible para todos los componentes hijos 
  // Es como tener una sesión de base de datos
  // App componente raíz, todo lo que esté dentro de App puede usar las funcionalidades de React Query porque está envuelto por el QueryClientProvider
  <React.StrictMode>  
    <QueryClientProvider client={queryClient}>
      <App />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </React.StrictMode>
);