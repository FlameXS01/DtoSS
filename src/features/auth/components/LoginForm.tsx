import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema } from '../types/authTypes';
import { useAuthStore } from '../../../stores/authStore';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import type { LoginFormData } from '../types/authTypes';

export const LoginForm = () => {  // Componente de react 
  // Hooks 
  const { login, isLoading, error } = useAuthStore();
  const navigate = useNavigate();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {             // Configuración de React Hook Form
    register,         // Es una función que enlaza cada input con el formulario 
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({ // useform es un hook gen que recibe un typo para tipar el formulario
    resolver: zodResolver(loginSchema), //Le pasamos un objeto de configuración con resolver: zodResolver(loginSchema), 
                                        // lo que significa que usará el esquema Zod para validar los campos.
  });

  const onSubmit = async (data: LoginFormData) => {  // Recibe los datos del form ya validados
    try {
      setSubmitError(null); // limpia cualquier error local anterior 
      await login(data.username, data.password); //Llama a login con username y password
      // Si el login es exitoso, redirigir al dashboard 
      navigate('/dashboard');
    } catch (err) {
      // El error ya está en el store, pero podemos manejarlo localmente
      setSubmitError('Credenciales incorrectas');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow">
        <h2 className="text-3xl font-bold text-center">Iniciar Sesión</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
              Usuario
            </label>
            <input
              id="username"
              type="text"
              {...register('username')}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
            {errors.username && (
              <p className="mt-1 text-sm text-red-600">{errors.username.message}</p>
            )}
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              {...register('password')}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
            )}
          </div>
          {(submitError || error) && (
            <p className="text-sm text-red-600">{submitError || error}</p>
          )}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {isLoading ? 'Iniciando...' : 'Iniciar Sesión'}
          </button>
        </form>
      </div>
    </div>
  );
};