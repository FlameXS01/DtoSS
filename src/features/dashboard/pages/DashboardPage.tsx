import React from 'react';
import Card from '../../../components/ui/Card';
import { useAuthStore } from '../../../stores/authStore';

// Ejemplo de estadísticas (podrías obtenerlas de un store o servicio)
const stats = [
  { label: 'Usuarios activos', value: '1,234', change: '+12%', icon: '👥' },
  { label: 'Negocios registrados', value: '567', change: '+5%', icon: '🏢' },
  { label: 'Ventas del mes', value: '$89,432', change: '+8%', icon: '💰' },
  { label: 'Tickets abiertos', value: '23', change: '-2%', icon: '🎫' },
];

export const DashboardPage = () => {
  const { user } = useAuthStore();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">
          Bienvenido de vuelta, {user?.username || 'Usuario'}
        </p>
      </div>

      {/* Tarjetas de estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} padding="md" className="hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{stat.label}</p>
                <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                <p className={`text-sm ${stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                  {stat.change} vs mes anterior
                </p>
              </div>
              <span className="text-4xl">{stat.icon}</span>
            </div>
          </Card>
        ))}
      </div>

      {/* Sección de actividad reciente (ejemplo) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card padding="md">
          <h2 className="text-lg font-semibold mb-4">Actividad reciente</h2>
          <ul className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <li key={i} className="flex items-center text-sm text-gray-600 border-b pb-2 last:border-0">
                <span className="w-2 h-2 bg-indigo-500 rounded-full mr-3"></span>
                Usuario {i} realizó una acción
              </li>
            ))}
          </ul>
        </Card>

        <Card padding="md">
          <h2 className="text-lg font-semibold mb-4">Próximos eventos</h2>
          <ul className="space-y-3">
            {[1, 2, 3].map((i) => (
              <li key={i} className="text-sm text-gray-600 border-b pb-2 last:border-0">
                <span className="font-medium">Reunión con equipo</span>
                <span className="block text-xs text-gray-400">Hoy 4:00 PM</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
};