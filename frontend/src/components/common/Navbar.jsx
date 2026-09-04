import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Store,
  ShieldCheck,
  LogOut,
  KeyRound,
  User,
  LayoutDashboard,
  Star,
} from "lucide-react";

export function Navbar() {
  const { user, logout, isAdmin, isStoreOwner, isNormalUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const getRoleBadge = (role) => {
    switch (role) {
      case "system_admin":
        return (
          <Badge variant="outline" className="border-red-900/50 bg-red-950/40 text-red-300 gap-1 text-[11px]">
            <ShieldCheck className="w-3 h-3" /> System Admin
          </Badge>
        );
      case "store_owner":
        return (
          <Badge variant="outline" className="border-amber-900/50 bg-amber-950/40 text-amber-300 gap-1 text-[11px]">
            <Store className="w-3 h-3" /> Store Owner
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="border-emerald-900/50 bg-emerald-950/40 text-emerald-300 gap-1 text-[11px]">
            <Star className="w-3 h-3" /> Normal User
          </Badge>
        );
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto flex h-14 items-center justify-between px-4 sm:px-8">
        {/* Brand Logo */}
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2 font-bold tracking-tight text-foreground hover:opacity-90 transition-opacity">
            <div className="w-7 h-7 rounded-lg bg-zinc-100 text-zinc-900 flex items-center justify-center font-black text-sm">
              S
            </div>
            <span className="text-base font-semibold">StoreRate</span>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-4 text-sm font-medium text-muted-foreground">
            {isAdmin && (
              <Link to="/admin" className="hover:text-foreground transition-colors flex items-center gap-1.5">
                <LayoutDashboard className="w-4 h-4" /> Admin Console
              </Link>
            )}
            {isStoreOwner && (
              <Link to="/owner/dashboard" className="hover:text-foreground transition-colors flex items-center gap-1.5">
                <Store className="w-4 h-4" /> My Store Dashboard
              </Link>
            )}
            <Link to="/stores" className="hover:text-foreground transition-colors flex items-center gap-1.5">
              <Star className="w-4 h-4" /> Store Directory
            </Link>
          </nav>
        </div>

        {/* User Status & Actions */}
        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              {getRoleBadge(user.role)}
              <div className="hidden sm:flex flex-col text-right">
                <span className="text-xs font-medium text-zinc-200">{user.name}</span>
                <span className="text-[10px] text-zinc-500 font-mono truncate max-w-[150px]">{user.email}</span>
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/profile/password")}
                className="text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 text-xs gap-1.5 px-2.5 h-8"
                title="Change Password"
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Password</span>
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="border-zinc-800 text-zinc-400 hover:text-red-400 hover:bg-red-950/20 hover:border-red-900/40 text-xs gap-1.5 px-2.5 h-8"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login">
                <Button variant="ghost" size="sm" className="text-xs">
                  Sign In
                </Button>
              </Link>
              <Link to="/register">
                <Button size="sm" className="bg-zinc-100 text-zinc-900 hover:bg-zinc-200 text-xs font-medium">
                  Sign Up
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
