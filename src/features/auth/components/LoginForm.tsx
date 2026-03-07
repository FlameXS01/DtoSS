import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { loginSchema, type LoginFormData } from '../types/authTypes';
import { useAuthStore } from '../../../stores/authStore';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import Modal from '../../../components/ui/Modal';

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
      const message = storeError || 'Credenciales incorrectas';
      setModalMessage(message);
      setShowErrorModal(true);
    }
  };

  const handleCloseModal = () => {
    setShowErrorModal(false);
  };

  return (
    <>
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

      <Modal
        isOpen={showErrorModal}
        onClose={handleCloseModal}
        title="Error de autenticación"
      >
        <div className="py-4">
          <p className="text-gray-700">{modalMessage}</p>
        </div>
      </Modal>
    </>
  );
};