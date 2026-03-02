import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { loginSchema, type LoginFormData } from '../types/authTypes';
import { useAuthStore } from '../../../stores/authStore';
import Card from '../../../components/ui/Card';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import Modal from '../../../components/ui/Modal'; // <-- Importamos Modal

export const LoginForm = () => {
  const { login, isLoading, error: storeError } = useAuthStore();
  const navigate = useNavigate();
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data.username, data.password);
      navigate('/dashboard');
    } catch (error) {
      // El mensaje de error puede venir del store o podemos poner uno genérico
      const message = storeError || 'Credenciales incorrectas';
      setModalMessage(message);
      setShowErrorModal(true);
    }
  };

  const handleCloseModal = () => {
    setShowErrorModal(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <Card padding="lg" className="max-w-md w-full shadow-xl border border-gray-100">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Bienvenido</h1>
          <p className="text-gray-600 mt-2">Inicia sesión para acceder a tu cuenta</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <Input
            label="Usuario"
            type="text"
            placeholder="juan.perez"
            {...register('username')}
            error={errors.username?.message}
            fullWidth
            className="bg-white/50 backdrop-blur-sm focus:bg-white transition-colors"
          />

          <Input
            label="Contraseña"
            type="password"
            placeholder="••••••••"
            {...register('password')}
            error={errors.password?.message}
            fullWidth
            className="bg-white/50 backdrop-blur-sm focus:bg-white transition-colors"
          />

          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={isLoading}
            fullWidth
            className="mt-2 hover:shadow-lg transition-shadow"
          >
            Iniciar Sesión
          </Button>

          <div className="flex items-center justify-center mt-4 text-sm">
            <a href="#" className="text-indigo-600 hover:text-indigo-800 hover:underline">
              ¿Olvidaste tu contraseña?
            </a>
          </div>
        </form>

        <div className="mt-6 text-center text-sm text-gray-500">
          ¿No tienes cuenta?{' '}
          <a href="#" className="text-indigo-600 font-medium hover:text-indigo-800 hover:underline">
            Regístrate
          </a>
        </div>
      </Card>

      {/* Modal de error */}
      <Modal
        isOpen={showErrorModal}
        onClose={handleCloseModal}
        title="Error de autenticación"
      >
        <div className="py-4">
          <p className="text-gray-700">{modalMessage}</p>
        </div>
      </Modal>
    </div>
  );
};