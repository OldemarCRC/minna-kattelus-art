'use client';

import { useContext, useEffect, useState } from 'react';
import { AuthContext } from "@/context/AuthContext";
import { notFound } from 'next/navigation';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, loading: authLoading } = useContext(AuthContext);

  if (authLoading) {
    return null;
  }

  if (!user || (allowedRoles.length > 0 && !allowedRoles.includes(user.role))) {
    return notFound();
  }

  return <>{children}</>;
};

export default ProtectedRoute;