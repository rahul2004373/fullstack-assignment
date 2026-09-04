import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { AlertCircle, Loader2 } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill in both email and password");
      return;
    }

    try {
      setLoading(true);
      const user = await login(email.trim(), password);

      const from = location.state?.from?.pathname;
      if (from) {
        navigate(from, { replace: true });
      } else if (user.role === "system_admin") {
        navigate("/admin", { replace: true });
      } else if (user.role === "store_owner") {
        navigate("/owner/dashboard", { replace: true });
      } else {
        navigate("/stores", { replace: true });
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-[#09090b] font-sans antialiased selection:bg-zinc-800 selection:text-white">
      {/* Outer Preview Container matching shadcn docs viewport */}
      <div className="w-full max-w-[440px] bg-[#141416]/90 border border-zinc-800/80 rounded-2xl p-6 sm:p-7 shadow-2xl backdrop-blur-xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-[17px] font-semibold text-white tracking-tight">
            Login to your account
          </h2>
          <Link
            to="/register"
            className="text-sm font-normal text-zinc-300 hover:text-white transition-colors hover:underline"
          >
            Sign Up
          </Link>
        </div>
        
        <p className="text-sm text-zinc-400 font-normal mb-6">
          Enter your email below to login to your account
        </p>

        {error && (
          <div className="flex items-center gap-2 p-2.5 mb-5 rounded-lg bg-red-950/40 border border-red-800/40 text-red-300 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email Field */}
          <div className="space-y-1.5">
            <label
              htmlFor="email"
              className="text-sm font-medium text-white block"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="m@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
              className="w-full h-10 px-3.5 bg-[#1e1e22]/70 border border-zinc-700/60 rounded-lg text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-zinc-400 focus:ring-2 focus:ring-zinc-400/20 transition-all"
            />
          </div>

          {/* Password Field */}
          <div className="space-y-1.5 pt-1">
            <div className="flex items-center justify-between">
              <label
                htmlFor="password"
                className="text-sm font-medium text-white"
              >
                Password
              </label>
              <button
                type="button"
                onClick={() => alert("Please contact administrator or sign in with demo accounts (Admin@12345, Owner@12345, User@12345).")}
                className="text-sm text-zinc-400 hover:text-zinc-200 transition-colors hover:underline font-normal"
              >
                Forgot your password?
              </button>
            </div>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
              className="w-full h-10 px-3.5 bg-[#1e1e22]/70 border border-zinc-700/60 rounded-lg text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-zinc-400 focus:ring-2 focus:ring-zinc-400/20 transition-all"
            />
          </div>

          {/* Buttons */}
          <div className="pt-3 space-y-2.5">
            {/* Primary Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-10 bg-white hover:bg-zinc-200 text-zinc-950 font-medium text-sm rounded-lg transition-all flex items-center justify-center shadow-sm active:scale-[0.99] disabled:opacity-50"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" /> Logging in...
                </span>
              ) : (
                "Login"
              )}
            </button>

            {/* Secondary Google Login Button */}
            
          </div>
        </form>
      </div>
    </div>
  );
}
