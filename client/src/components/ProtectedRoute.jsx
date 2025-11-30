import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  // Obtener usuario de sessionStorage
  const userStr = sessionStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;

  // Si no hay usuario, redirigir a home
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // Si hay roles permitidos y el usuario no tiene el rol correcto
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  // Si todo está bien, mostrar el componente
  return children;
};

export default ProtectedRoute;