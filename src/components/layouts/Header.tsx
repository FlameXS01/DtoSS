import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import {
  Menu,
  LayoutDashboard,
  Users,
  Building2,
  Package,
  LogOut,
  User,
  Settings,
  ChevronDown
} from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

export const Header = () => {
  const { token, user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!token) return null;

  const navLinks = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/users', label: 'Usuarios', icon: Users },
    { to: '/business', label: 'Negocios', icon: Building2 },
    { to: '/products', label: 'Productos', icon: Package },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getInitials = () => {
    if (user?.first_name) return user.first_name[0].toUpperCase();
    if (user?.username) return user.username[0].toUpperCase();
    if (user?.email) return user.email[0].toUpperCase();
    return 'U';
  };

  const fullName = user?.first_name
    ? `${user.first_name} ${user.last_name || ''}`
    : user?.username || user?.email || 'Usuario';

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <nav className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <div className="text-xl font-bold text-indigo-600">D'TOSS</div>

        {/* Enlaces desktop */}
        <div className="hidden md:flex space-x-4">
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.to}
                to={link.to}
                className="flex items-center space-x-1 text-gray-700 hover:text-indigo-600 transition-colors"
              >
                <Icon className="w-5 h-5" />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </div>

        {/* Perfil de usuario y menú móvil */}
        <div className="flex items-center space-x-2">
          {/* Avatar con menú desplegable */}
          <div className="relative" ref={profileMenuRef}>
            <button
              onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              className="flex items-center space-x-2 focus:outline-none"
            >
              {user?.avatar_url ? (
                <img
                  src={user.avatar_url}
                  alt={fullName}
                  className="w-8 h-8 rounded-full object-cover border border-gray-200"
                  onError={(e) => {
                    e.currentTarget.src = ''; // Si falla, mostramos iniciales
                    e.currentTarget.style.display = 'none';
                  }}
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-semibold text-sm">
                  {getInitials()}
                </div>
              )}
              <ChevronDown className="w-4 h-4 text-gray-600" />
            </button>

            {isProfileMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 border border-gray-200 z-50">
                <div className="px-4 py-2 border-b border-gray-100">
                  <p className="text-sm font-medium text-gray-900 truncate">{fullName}</p>
                  <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                </div>
                <Link
                  to="/profile"
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => setIsProfileMenuOpen(false)}
                >
                  <User className="w-4 h-4 mr-2" />
                  Mi Perfil 
                </Link>
                <button
                  onClick={() => {
                    setIsProfileMenuOpen(false);
                    handleLogout();
                  }}
                  className="flex items-center w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Cerrar sesión
                </button>
              </div>
            )}
          </div>

          {/* Botón menú móvil (hamburguesa) */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded hover:bg-gray-100"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </nav>

      {/* Menú móvil desplegable */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 py-2">
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.to}
                to={link.to}
                className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-100"
                onClick={() => setIsMenuOpen(false)}
              >
                <Icon className="w-5 h-5" />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
};