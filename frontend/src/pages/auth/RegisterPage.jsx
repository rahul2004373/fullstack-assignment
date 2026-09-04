import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { AlertCircle, CheckCircle2, Loader2, Sparkles } from "lucide-react";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    address: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const isNameValid = formData.name.trim().length >= 20 && formData.name.trim().length <= 60;
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim());
  const isPasswordValid = /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,16}$/.test(formData.password);
  const isAddressValid = formData.address.trim().length > 0 && formData.address.trim().length <= 400;

  const validateForm = () => {
    const { name, email, password, address } = formData;
    if (!name || !email || !password || !address) {
      return "All fields are required";
    }
    if (name.trim().length < 20 || name.trim().length > 60) {
      return `Full name must be between 20 and 60 characters long (currently ${name.trim().length} chars)`;
    }
    if (!isEmailValid) {
      return "Please enter a valid email address";
    }
    if (!isPasswordValid) {
      return "Password must be 8-16 characters and contain at least one uppercase letter and one special character";
    }
    if (address.trim().length > 400) {
      return "Address cannot exceed 400 characters";
    }
    return null;
  };

  const handleFillSample = () => {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    setFormData({
      name: "Jonathan Alexander Vance",
      email: `user.${randomSuffix}@example.com`,
      password: "User@12345",
      address: "450 Silicon Avenue, Suite 100, San Francisco, CA 94107",
    });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setLoading(true);
      await register({
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
        address: formData.address.trim(),
      });
      navigate("/stores", { replace: true });
    } catch (err) {
      const msg =
        err.response?.data?.errors?.[0]?.message ||
        err.response?.data?.message ||
        err.message ||
        "Registration failed. Please check your details.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-[#09090b] font-sans antialiased selection:bg-zinc-800 selection:text-white py-12">
      <div className="w-full max-w-[480px] bg-[#141416]/95 border border-zinc-800/80 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-[18px] font-semibold text-white tracking-tight">
            Create an account
          </h2>
          <Link
            to="/login"
            className="text-sm font-normal text-zinc-400 hover:text-white transition-colors hover:underline"
          >
            Sign in
          </Link>
        </div>

        <p className="text-sm text-zinc-400 font-normal mb-5">
          Sign up to rate and review registered stores
        </p>

        {/* Demo Fill Quick Action */}
        <div className="mb-5 flex justify-end">
          <button
            type="button"
            onClick={handleFillSample}
            className="text-xs text-zinc-400 hover:text-white inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-zinc-800/60 hover:bg-zinc-800 border border-zinc-700/60 transition-colors"
          >
            <Sparkles className="w-3 h-3 text-amber-400" />
            Fill valid sample data
          </button>
        </div>

        {error && (
          <div className="flex items-start gap-2.5 p-3 mb-5 rounded-lg bg-red-950/40 border border-red-800/50 text-red-300 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span className="leading-relaxed">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name Field */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label htmlFor="name" className="text-sm font-medium text-white block">
                Full Name
              </label>
              <span className={`text-[11px] font-mono ${
                formData.name.trim().length === 0
                  ? "text-zinc-500"
                  : isNameValid
                  ? "text-emerald-400 font-semibold"
                  : "text-amber-400"
              }`}>
                {formData.name.trim().length}/20-60 chars
              </span>
            </div>
            <input
              id="name"
              name="name"
              type="text"
              placeholder="e.g. Jonathan Alexander Vance"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full h-10 px-3.5 bg-[#1e1e22]/70 border border-zinc-700/60 rounded-lg text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-zinc-400 focus:ring-2 focus:ring-zinc-400/20 transition-all"
            />
          </div>

          {/* Email Field */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label htmlFor="email" className="text-sm font-medium text-white block">
                Email Address
              </label>
              {formData.email && (
                <span className={`text-[11px] ${isEmailValid ? "text-emerald-400" : "text-zinc-500"}`}>
                  {isEmailValid ? "Valid format" : ""}
                </span>
              )}
            </div>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="m@example.com"
              value={formData.email}
              onChange={handleChange}
              autoComplete="email"
              required
              className="w-full h-10 px-3.5 bg-[#1e1e22]/70 border border-zinc-700/60 rounded-lg text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-zinc-400 focus:ring-2 focus:ring-zinc-400/20 transition-all"
            />
          </div>

          {/* Password Field */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label htmlFor="password" className="text-sm font-medium text-white block">
                Password
              </label>
              <span className={`text-[11px] ${
                formData.password.length === 0
                  ? "text-zinc-500"
                  : isPasswordValid
                  ? "text-emerald-400 font-semibold"
                  : "text-amber-400"
              }`}>
                8-16 chars, 1 uppercase, 1 special
              </span>
            </div>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              autoComplete="new-password"
              required
              className="w-full h-10 px-3.5 bg-[#1e1e22]/70 border border-zinc-700/60 rounded-lg text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-zinc-400 focus:ring-2 focus:ring-zinc-400/20 transition-all"
            />
          </div>

          {/* Address Field */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label htmlFor="address" className="text-sm font-medium text-white block">
                Address
              </label>
              <span className="text-[11px] text-zinc-500 font-mono">
                {formData.address.trim().length}/400 max
              </span>
            </div>
            <textarea
              id="address"
              name="address"
              rows={2}
              placeholder="123 Main Street, Suite 100, Cityville"
              value={formData.address}
              onChange={handleChange}
              required
              className="w-full px-3.5 py-2.5 bg-[#1e1e22]/70 border border-zinc-700/60 rounded-lg text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-zinc-400 focus:ring-2 focus:ring-zinc-400/20 transition-all resize-none"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full h-10 bg-white hover:bg-zinc-200 text-zinc-950 font-medium text-sm rounded-lg transition-all flex items-center justify-center shadow-sm active:scale-[0.99] disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" /> Creating account...
                </span>
              ) : (
                "Create Account"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
