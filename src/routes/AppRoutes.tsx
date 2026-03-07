import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import { UsersPage } from '../features/users/pages/UsersPage';
import { UserDetailPage } from '../features/users/pages/UserDetailPage';
import { Layout } from '../components/layouts/Layout';
import { BusinessPage } from '../features/business/pages/BusinessPage';
import { BusinessDetailPage } from '../features/business/pages/BusinessDetailPage';
import { DashboardPage } from '../features/dashboard/pages/DashboardPage';
import { ProductsPage } from '../features/products/pages/ProductsPage';
import { ProductDetailPage } from '../features/products/pages/ProductDetailPage';
import { AuthPage } from '../features/auth/pages/AuthPage';
import { ProfilePage } from '../features/users/pages/ProfilePage';



export const AppRoutes = () => {
  return (
    <Routes>
      {/* Ruta pública */}
      <Route path="/login" element={<AuthPage />} />
      <Route path="/register" element={<AuthPage />} />
      
      {/* Rutas protegidas */}
      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/users" element={<UsersPage />} />
          <Route path="/users/:id" element={<UserDetailPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/business" element={<BusinessPage />} />
          <Route path="/business/:id" element={<BusinessDetailPage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/products/:id" element={<ProductDetailPage />} />
        </Route>
      </Route>

      {/* Redirección por defecto */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};