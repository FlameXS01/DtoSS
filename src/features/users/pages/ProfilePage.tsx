// features/users/pages/ProfilePage.tsx
import { useAuthStore } from '../../../stores/authStore';
import { useState } from 'react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Card from '../../../components/ui/Card';
import { User, Camera, Mail, Phone, Calendar, Shield, Lock, CheckCircle, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { useUpdatePassword, useUpdateUser } from '../hooks/useUsers';

export const ProfilePage = () => {
  const { user } = useAuthStore();
  const updateProfile = useUpdateUser();
  const changePassword = useUpdatePassword();
  const uploadAvatar = useUpdatePassword();

  // Estado para los datos del formulario
  const [formData, setFormData] = useState({
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
    phone: user?.phone || '',
  });

  // Estado para mostrar/ocultar el cambio de contraseña
  const [showPasswordFields, setShowPasswordFields] = useState(false);
  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile.mutate(formData);
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.new_password !== passwordData.confirm_password) {
      toast.error('Las contraseñas no coinciden');
      return;
    }
    changePassword.mutate({
      current_password: passwordData.current_password,
      new_password: passwordData.new_password,
    }, {
      onSuccess: () => {
        setPasswordData({ current_password: '', new_password: '', confirm_password: '' });
        setShowPasswordFields(false);
      }
    });
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) uploadAvatar.mutate(file);
  };

  // Determinar si el usuario está verificado
  const isVerified = user?.is_verified;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Mi Perfil</h1>

      {/* Tarjeta principal: imagen + datos personales */}
      <Card className="p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Columna de la imagen */}
          <div className="flex flex-col items-center space-y-3 md:w-1/3">
            <div className="relative w-32 h-32">
              {user?.avatar_url ? (
                <img
                  src={user.avatar_url}
                  alt="Avatar"
                  className="w-full h-full rounded-full object-cover border-4 border-indigo-100"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              ) : (
                <div className="w-full h-full rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center border-4 border-indigo-200">
                  <User className="w-12 h-12 text-indigo-600" />
                </div>
              )}
              <label
                htmlFor="avatar-upload"
                className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow cursor-pointer hover:bg-gray-100 transition-colors border border-gray-200"
              >
                <Camera className="w-5 h-5" />
                <input
                  type="file"
                  id="avatar-upload"
                  className="hidden"
                  accept="image/*"
                  onChange={handleAvatarChange}
                />
              </label>
            </div>
            <span className="text-sm font-medium text-gray-600">@{user?.username}</span>
          </div>

          {/* Columna de datos personales */}
          <div className="flex-1 space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Nombre"
                  value={formData.first_name}
                  onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                  placeholder="Tu nombre"
                />
                <Input
                  label="Apellido"
                  value={formData.last_name}
                  onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                  placeholder="Tu apellido"
                />
              </div>
              <Input
                label="Teléfono"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+34 123 456 789"
              />
              <Button type="submit" variant="primary" isLoading={updateProfile.isPending}>
                Guardar cambios
              </Button>
            </form>
          </div>
        </div>
      </Card>

      {/* Información adicional en dos columnas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Datos de contacto */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <Mail className="w-5 h-5 mr-2 text-gray-600" /> Contacto
          </h2>
          <div className="space-y-3">
            <div className="flex items-center text-gray-700">
              <Mail className="w-4 h-4 mr-3 text-gray-400" />
              <span>{user?.email}</span>
            </div>
            {user?.phone && (
              <div className="flex items-center text-gray-700">
                <Phone className="w-4 h-4 mr-3 text-gray-400" />
                <span>{user.phone}</span>
              </div>
            )}
            <div className="flex items-center text-gray-700">
              <Calendar className="w-4 h-4 mr-3 text-gray-400" />
              <span>Registrado el {new Date(user?.created_at || '').toLocaleDateString()}</span>
            </div>
          </div>
        </Card>

        {/* Estado de la cuenta */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <Shield className="w-5 h-5 mr-2 text-gray-600" /> Estado de la cuenta
          </h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Verificación:</span>
              {isVerified ? (
                <span className="flex items-center text-green-600">
                  <CheckCircle className="w-4 h-4 mr-1" /> Verificado
                </span>
              ) : (
                <span className="flex items-center text-yellow-600">
                  <XCircle className="w-4 h-4 mr-1" /> No verificado
                </span>
              )}
            </div>
            {!isVerified && (
              <Link
                to="/verify"
                className="text-sm text-indigo-600 hover:underline block mt-2"
              >
                Verificar mi cuenta
              </Link>
            )}
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Estado:</span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                user?.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {user?.is_active ? 'Activo' : 'Inactivo'}
              </span>
            </div>
            {user?.last_login && (
              <div className="text-sm text-gray-500">
                Último acceso: {new Date(user.last_login).toLocaleString()}
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Sección de seguridad: cambio de contraseña */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold flex items-center">
            <Lock className="w-5 h-5 mr-2 text-gray-600" /> Seguridad
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowPasswordFields(!showPasswordFields)}
          >
            {showPasswordFields ? 'Cancelar' : 'Cambiar contraseña'}
          </Button>
        </div>

        {showPasswordFields && (
          <form onSubmit={handlePasswordChange} className="space-y-4 border-t pt-4">
            <Input
              type="password"
              label="Contraseña actual"
              value={passwordData.current_password}
              onChange={(e) => setPasswordData({ ...passwordData, current_password: e.target.value })}
              required
            />
            <Input
              type="password"
              label="Nueva contraseña"
              value={passwordData.new_password}
              onChange={(e) => setPasswordData({ ...passwordData, new_password: e.target.value })}
              required
            />
            <Input
              type="password"
              label="Confirmar nueva contraseña"
              value={passwordData.confirm_password}
              onChange={(e) => setPasswordData({ ...passwordData, confirm_password: e.target.value })}
              required
            />
            <div className="flex justify-end space-x-2">
              <Button variant="outline" type="button" onClick={() => setShowPasswordFields(false)}>
                Cancelar
              </Button>
              <Button type="submit" variant="primary" isLoading={changePassword.isPending}>
                Actualizar contraseña
              </Button>
            </div>
          </form>
        )}
      </Card>
    </div>
  );
};