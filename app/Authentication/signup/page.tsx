
"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { toast } from "react-toastify";
import {
  UserPlus,
  Mail,
  Lock,
  User,
  Image as ImageIcon,
} from "lucide-react";

import { authClient } from "@/app/lib/auth-client";

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [image, setImage] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  // Password Validation
  const validatePassword = (
    pass: string
  ): string | null => {
    const hasUpperCase: boolean = /[A-Z]/.test(pass);
    const hasLowerCase: boolean = /[a-z]/.test(pass);
    const isValidLength: boolean = pass.length >= 6;

    if (!isValidLength) {
      return "Password must be at least 6 characters long.";
    }

    if (!hasUpperCase) {
      return "Password must contain at least one Uppercase letter.";
    }

    if (!hasLowerCase) {
      return "Password must contain at least one Lowercase letter.";
    }

    return null;
  };

  // Email Registration
  const handleRegister = async (
    e: FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();

    if (loading) return;

    const passwordError = validatePassword(password);

    if (passwordError) {
      toast.error(passwordError);
      return;
    }

    setLoading(true);

    try {
      const { error } = await authClient.signUp.email({
        email: email.trim(),
        password,
        name: name.trim(),
        ...(image.trim() ? { image: image.trim() } : {}),
      });

      if (error) {
        toast.error(
          error.message || "Registration failed!"
        );
        return;
      }

      toast.success(
        "Registration successful! Please login."
      );

      router.push("/Authentication/signin");
    } catch (err: unknown) {
      console.error("Registration Error:", err);

      toast.error(
        "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // Google Registration
  const handleGoogleLogin = async (): Promise<void> => {
    try {
      const { error } = await authClient.signIn.social({
        provider: "google",
        callbackURL: "/",
      });

      if (error) {
        toast.error(
          error.message || "Google sign up failed!"
        );
      }
    } catch (err: unknown) {
      console.error("Google Login Error:", err);

      toast.error("Google sign up failed!");
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white p-8 rounded-3xl border border-gray-100 shadow-xl shadow-gray-100">

        {/* Title & Header */}
        <div className="text-center mb-8 space-y-2">
          <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl mx-auto flex items-center justify-center">
            <UserPlus className="w-6 h-6" />
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            Create an Account
          </h1>

          <p className="text-sm text-gray-500">
            Join BookNook and start exploring books today
          </p>
        </div>

        {/* Google Sign Up */}
        <button
          onClick={handleGoogleLogin}
          type="button"
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all shadow-sm mb-6 disabled:opacity-50"
        >
          <svg
            className="w-5 h-5"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              fill="#4285F4"
              d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
            />
            <path
              fill="#34A853"
              d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.13 0-5.78-2.11-6.73-4.96H1.19v3.15C3.17 21.36 7.23 24 12 24z"
            />
            <path
              fill="#FBBC05"
              d="M5.27 14.24c-.25-.72-.38-1.49-.38-2.24s.13-1.52.38-2.24V6.6H1.19C.43 8.15 0 9.89 0 12s.43 3.85 1.19 5.4l4.08-3.16z"
            />
            <path
              fill="#EA4335"
              d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.23 0 3.17 2.64 1.19 6.6l4.08 3.15c.95-2.85 3.6-4.96 6.73-4.96z"
            />
          </svg>

          Continue with Google
        </button>

        {/* Divider */}
        <div className="flex items-center my-6 text-gray-300">
          <div className="flex-grow border-t border-gray-200" />

          <span className="px-4 text-xs uppercase text-gray-400 font-medium">
            Or with email
          </span>

          <div className="flex-grow border-t border-gray-200" />
        </div>

        {/* Register Form */}
        <form
          onSubmit={handleRegister}
          className="space-y-4"
        >

          {/* Full Name */}
          <div>
            <label
              htmlFor="register-name"
              className="block text-xs font-semibold text-gray-700 uppercase mb-1"
            >
              Full Name
            </label>

            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <User className="w-4 h-4" />
              </span>

              <input
                id="register-name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                autoComplete="name"
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all"
              />
            </div>
          </div>

          {/* Email Address */}
          <div>
            <label
              htmlFor="register-email"
              className="block text-xs font-semibold text-gray-700 uppercase mb-1"
            >
              Email Address
            </label>

            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <Mail className="w-4 h-4" />
              </span>

              <input
                id="register-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                autoComplete="email"
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all"
              />
            </div>
          </div>

          {/* Photo URL */}
          <div>
            <label
              htmlFor="register-image"
              className="block text-xs font-semibold text-gray-700 uppercase mb-1"
            >
              Photo URL (Optional)
            </label>

            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <ImageIcon className="w-4 h-4" />
              </span>

              <input
                id="register-image"
                type="url"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                placeholder="https://i.ibb.co.com/..."
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="register-password"
              className="block text-xs font-semibold text-gray-700 uppercase mb-1"
            >
              Password
            </label>

            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <Lock className="w-4 h-4" />
              </span>

              <input
                id="register-password"
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                placeholder="••••••••"
                autoComplete="new-password"
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all"
              />
            </div>

            <p className="text-[11px] text-gray-400 mt-1">
              Must have 6+ chars, 1 Uppercase & 1 Lowercase letter.
            </p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl shadow-lg shadow-indigo-600/20 transition-all disabled:opacity-50 mt-2"
          >
            {loading
              ? "Creating account..."
              : "Register"}
          </button>
        </form>

        {/* Login Link */}
        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account?{" "}

          <Link
            href="/Authentication/signin"
            className="font-semibold text-indigo-600 hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
