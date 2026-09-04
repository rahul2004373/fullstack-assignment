import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { ProtectedRoute } from "@/components/common/ProtectedRoute";

// Pages
import LoginPage from "@/pages/auth/LoginPage";
import RegisterPage from "@/pages/auth/RegisterPage";
import StoreListPage from "@/pages/user/StoreListPage";
import AdminDashboardPage from "@/pages/admin/AdminDashboardPage";
import OwnerDashboardPage from "@/pages/owner/OwnerDashboardPage";
import UpdatePasswordPage from "@/pages/profile/UpdatePasswordPage";
import NotFoundPage from "@/pages/NotFoundPage";

// Default Home component redirecting to proper view based on role
function RootRedirect() {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-4 border-zinc-800 border-t-zinc-200 rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role === "system_admin") {
    return <Navigate to="/admin" replace />;
  }

  if (user?.role === "store_owner") {
    return <Navigate to="/owner/dashboard" replace />;
  }

  return <Navigate to="/stores" replace />;
}

export function AppRoutes() {
  return (
    <Routes>
      {/* Root redirect */}
      <Route path="/" element={<RootRedirect />} />

      {/* Public Auth Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Authenticated Common Routes */}
      <Route
        path="/stores"
        element={
          <ProtectedRoute>
            <StoreListPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/profile/password"
        element={
          <ProtectedRoute>
            <UpdatePasswordPage />
          </ProtectedRoute>
        }
      />

      {/* System Admin Routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={["system_admin"]}>
            <AdminDashboardPage />
          </ProtectedRoute>
        }
      />

      {/* Store Owner Routes */}
      <Route
        path="/owner/dashboard"
        element={
          <ProtectedRoute allowedRoles={["store_owner", "system_admin"]}>
            <OwnerDashboardPage />
          </ProtectedRoute>
        }
      />

      {/* 404 Route */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
