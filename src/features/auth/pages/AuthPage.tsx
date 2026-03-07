import { useLocation, Link } from 'react-router-dom';
import { LoginForm } from '../components/LoginForm';
import { RegisterForm } from '../components/RegisterForm';
import Card from '../../../components/ui/Card';

export const AuthPage = () => {
  const location = useLocation();
  const isLogin = location.pathname === '/login';

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <Card padding="lg" className="max-w-md w-full shadow-xl border border-gray-100">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {isLogin ? 'Bienvenido' : 'Crear una cuenta'}
          </h1>
          <p className="text-gray-600 mt-2">
            {isLogin ? 'Inicia sesión para acceder a tu cuenta' : 'Regístrate para comenzar'}
          </p>
        </div>

        {isLogin ? <LoginForm /> : <RegisterForm />}

        <div className="mt-6 text-center text-sm text-gray-500">
          {isLogin ? (
            <>
              ¿No tienes cuenta?{' '}
              <Link to="/register" className="text-indigo-600 font-medium hover:text-indigo-800 hover:underline">
                Regístrate
              </Link>
            </>
          ) : (
            <>
              ¿Ya tienes cuenta?{' '}
              <Link to="/login" className="text-indigo-600 font-medium hover:text-indigo-800 hover:underline">
                Inicia sesión
              </Link>
            </>
          )}
        </div>
      </Card>
    </div>
  );
};