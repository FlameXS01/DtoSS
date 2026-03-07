import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import { useRegisterUser } from '../../users/hooks/useUsers';

const registerSchema = z.object({
  username: z.string().min(3, 'El nombre de usuario debe tener al menos 3 caracteres'),
  email: z.string().email('Correo electrónico inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
});

type RegisterFormData = z.infer<typeof registerSchema>;

export const RegisterForm = () => {
  const { mutate, isPending } = useRegisterUser();
  const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = (data: RegisterFormData) => {
    mutate(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <Input
        label="Nombre de usuario"
        type="text"
        placeholder="juan.perez"
        {...register('username')}
        error={errors.username?.message}
        fullWidth
        className="bg-white/50 backdrop-blur-sm focus:bg-white transition-colors"
      />

      <Input
        label="Correo electrónico"
        type="email"
        placeholder="juan@ejemplo.com"
        {...register('email')}
        error={errors.email?.message}
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
        isLoading={isPending}
        fullWidth
        className="mt-2 hover:shadow-lg transition-shadow"
      >
        {isPending ? 'Registrando...' : 'Registrarse'}
      </Button>
    </form>
  );
};