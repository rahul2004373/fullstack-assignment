import React from "react";
import { BrowserRouter, useLocation } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { Navbar } from "@/components/common/Navbar";
import { AppRoutes } from "@/routes/AppRoutes";

function Layout() {
  const location = useLocation();
  const isAuthPage = location.pathname === "/login" || location.pathname === "/register";

  return (
    <div className="min-h-screen bg-[#09090b] text-foreground flex flex-col font-sans antialiased">
      {!isAuthPage && <Navbar />}
      <main className="flex-1">
        <AppRoutes />
      </main>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Layout />
      </AuthProvider>
    </BrowserRouter>
  );
}
