
"use client";

import { useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { toast } from "react-toastify";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Eye,
  EyeOff,
  Loader2,
  LockKeyhole,
  Mail,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import { authClient } from "@/app/lib/auth-client";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const requestedCallback =
    searchParams.get("callbackUrl") || "/";

  const callbackUrl =
    requestedCallback.startsWith("/") &&
    !requestedCallback.startsWith("//") &&
    !requestedCallback.includes("\\") &&
    !/[\r\n]/.test(requestedCallback)
      ? requestedCallback
      : "/";

  const signupUrl =
    `/Authentication/signup?callbackUrl=${encodeURIComponent(
      callbackUrl
    )}`;

  const handleLogin = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (loading || googleLoading) return;

    if (!email.trim() || !password) {
      toast.error("Please enter your email and password.");
      return;
    }

    setLoading(true);

    try {
      const { error } = await authClient.signIn.email({
        email: email.trim().toLowerCase(),
        password,
      });

      if (error) {
        toast.error(
          error.message || "Invalid email or password."
        );
        return;
      }

      toast.success("Welcome back to BookNook!");

      router.replace(callbackUrl);
      router.refresh();
    } catch (error) {
      console.error("Login error:", error);

      toast.error(
        "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    if (loading || googleLoading) return;

    setGoogleLoading(true);

    try {
      const { error } = await authClient.signIn.social({
        provider: "google",
        callbackURL: callbackUrl,
      });

      if (error) {
        toast.error(
          error.message || "Google login failed."
        );
        setGoogleLoading(false);
      }
    } catch (error) {
      console.error("Google login error:", error);
      toast.error("Google login failed.");
      setGoogleLoading(false);
    }
  };

  const inputClass =
    "w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-indigo-500 dark:focus:bg-slate-800 dark:focus:ring-indigo-500/20";

  return (
    <main className="min-h-screen bg-[#f8f9fd] transition-colors duration-300 dark:bg-slate-950">
      <div className="grid min-h-screen lg:grid-cols-2">
        <div className="relative hidden min-h-screen overflow-hidden bg-[#171b3d] p-12 text-white lg:flex lg:flex-col lg:justify-between dark:bg-[#0b1028] xl:p-16">
          <div className="pointer-events-none absolute -left-40 top-20 h-[450px] w-[450px] rounded-full bg-indigo-500/20 blur-[110px]" />
          <div className="pointer-events-none absolute -bottom-40 -right-32 h-[450px] w-[450px] rounded-full bg-violet-500/20 blur-[110px]" />

          <Link
            href="/"
            className="relative z-10 inline-flex w-fit items-center gap-3"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
              <BookOpen
                size={25}
                className="text-indigo-200"
              />
            </span>

            <span className="text-2xl font-extrabold tracking-tight">
              Book
              <span className="text-indigo-300">
                Nook
              </span>
            </span>
          </Link>

          <div className="relative z-10 max-w-xl py-16">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-indigo-200">
              <Sparkles size={15} />
              Your Reading Journey
            </span>

            <h1 className="mt-8 text-5xl font-extrabold leading-[1.12] tracking-tight xl:text-6xl">
              A world of books.
              <span className="mt-2 block bg-gradient-to-r from-indigo-300 via-violet-300 to-pink-300 bg-clip-text text-transparent">
                One place to belong.
              </span>
            </h1>

            <p className="mt-7 max-w-md text-base leading-8 text-indigo-100/70">
              Discover inspiring stories, explore
              remarkable collections, and connect
              with a community that loves reading
              just as much as you do.
            </p>

            <div className="mt-12 space-y-5">
              {[
                "Discover books across every genre",
                "Borrow and manage your favorite reads",
                "Share books with our reading community",
              ].map((feature) => (
                <div
                  key={feature}
                  className="flex items-center gap-3"
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10">
                    <CheckCircle2
                      size={19}
                      className="text-emerald-300"
                    />
                  </span>

                  <span className="text-sm font-medium text-indigo-100/90">
                    {feature}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="relative z-10 flex items-center gap-2 text-xs text-indigo-200/50">
            <ShieldCheck size={16} />
            Secure authentication powered by Better Auth
          </div>

          <BookOpen
            size={260}
            strokeWidth={0.6}
            className="pointer-events-none absolute -bottom-14 -right-14 rotate-[-20deg] text-white/[0.04]"
          />
        </div>

        <div className="relative flex min-h-screen items-center justify-center px-4 py-12 sm:px-8 lg:px-12">
          <div className="w-full max-w-[440px]">
            <Link
              href="/"
              className="mb-10 inline-flex items-center gap-3 lg:hidden"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-600 text-white">
                <BookOpen size={22} />
              </span>

              <span className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                Book
                <span className="text-indigo-600 dark:text-indigo-400">
                  Nook
                </span>
              </span>
            </Link>

            <div className="mb-9">
              <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-400">
                <LockKeyhole size={26} />
              </div>

              <h2 className="text-3xl font-extrabold tracking-tight text-slate-950 dark:text-white sm:text-4xl">
                Welcome back!
              </h2>

              <p className="mt-3 text-sm leading-7 text-slate-500 dark:text-slate-400">
                Sign in to continue your BookNook
                reading journey.
              </p>
            </div>

            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={loading || googleLoading}
              className="flex w-full items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-indigo-200 hover:bg-indigo-50/50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-indigo-500/40 dark:hover:bg-slate-800"
            >
              {googleLoading ? (
                <Loader2
                  size={20}
                  className="animate-spin text-indigo-600 dark:text-indigo-400"
                />
              ) : (
                <svg
                  width="21"
                  height="21"
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
              )}

              {googleLoading
                ? "Connecting to Google..."
                : "Continue with Google"}
            </button>

            <div className="my-8 flex items-center gap-4">
              <div className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Or with email
              </span>
              <div className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />
            </div>

            <form
              onSubmit={handleLogin}
              className="space-y-5"
            >
              <div>
                <label
                  htmlFor="login-email"
                  className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300"
                >
                  Email Address
                </label>

                <div className="relative">
                  <Mail
                    size={19}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500"
                  />

                  <input
                    id="login-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) =>
                      setEmail(e.target.value)
                    }
                    placeholder="name@example.com"
                    autoComplete="email"
                    className={`${inputClass} pl-12`}
                  />
                </div>
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between gap-3">
                  <label
                    htmlFor="login-password"
                    className="text-sm font-semibold text-slate-700 dark:text-slate-300"
                  >
                    Password
                  </label>

                  <Link
                    href="/forgot-password"
                    className="text-xs font-semibold text-indigo-600 transition hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
                  >
                    Forgot Password?
                  </Link>
                </div>

                <div className="relative">
                  <LockKeyhole
                    size={19}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500"
                  />

                  <input
                    id="login-password"
                    type={
                      showPassword ? "text" : "password"
                    }
                    required
                    value={password}
                    onChange={(e) =>
                      setPassword(e.target.value)
                    }
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    className={`${inputClass} pl-12 pr-12`}
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword((prev) => !prev)
                    }
                    aria-label={
                      showPassword
                        ? "Hide password"
                        : "Show password"
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-indigo-600 dark:text-slate-500 dark:hover:text-indigo-400"
                  >
                    {showPassword ? (
                      <EyeOff size={19} />
                    ) : (
                      <Eye size={19} />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || googleLoading}
                className="group mt-2 flex w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-4 text-sm font-bold text-white shadow-lg shadow-indigo-500/20 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-indigo-500/30 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <Loader2
                      size={19}
                      className="animate-spin"
                    />
                    Signing In...
                  </>
                ) : (
                  <>
                    Sign In to BookNook
                    <ArrowRight
                      size={19}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  </>
                )}
              </button>
            </form>

            <p className="mt-8 text-center text-sm text-slate-500 dark:text-slate-400">
              New to BookNook?{" "}
              <Link
                href={signupUrl}
                className="font-bold text-indigo-600 transition hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
              >
                Create an account
              </Link>
            </p>

            <div className="mt-9 flex items-center justify-center gap-2 border-t border-slate-200 pt-6 text-center text-xs text-slate-400 dark:border-slate-800 dark:text-slate-500">
              <ShieldCheck size={16} />
              Your account is protected with secure authentication
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
