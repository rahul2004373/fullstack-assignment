import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

export function ProtectedRoute({ children, allowedRoles = [] }) {
  const { user, isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-zinc-800 border-t-zinc-200 rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    // Redirect to respective dashboard if authorized for a different role
    if (user?.role === "system_admin") return <Navigate to="/admin" replace />;
    if (user?.role === "store_owner") return <Navigate to="/owner/dashboard" replace />;
    return <Navigate to="/stores" replace />;
  }

  return children;
}
