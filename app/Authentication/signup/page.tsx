
"use client";

import { useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { toast } from "react-toastify";
import {
  ArrowRight,
  BookOpen,
  Check,
  CheckCircle2,
  Eye,
  EyeOff,
  Image as ImageIcon,
  Loader2,
  LockKeyhole,
  Mail,
  ShieldCheck,
  Sparkles,
  UserRound,
  UserPlus,
} from "lucide-react";

import { authClient } from "@/app/lib/auth-client";

export default function RegisterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [image, setImage] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] =
    useState(false);

  const requestedCallback =
    searchParams.get("callbackUrl") || "/";

  const callbackUrl =
    requestedCallback.startsWith("/") &&
    !requestedCallback.startsWith("//") &&
    !requestedCallback.includes("\\") &&
    !/[\r\n]/.test(requestedCallback)
      ? requestedCallback
      : "/";

  const signinUrl =
    `/Authentication/signin?callbackUrl=${encodeURIComponent(
      callbackUrl
    )}`;

  const passwordRules = [
    {
      label: "At least 6 characters",
      valid: password.length >= 6,
    },
    {
      label: "One uppercase letter",
      valid: /[A-Z]/.test(password),
    },
    {
      label: "One lowercase letter",
      valid: /[a-z]/.test(password),
    },
  ];

  const isPasswordValid = passwordRules.every(
    (rule) => rule.valid
  );

  const passwordsMatch =
    confirmPassword.length > 0 &&
    password === confirmPassword;

  const inputClass =
    "w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-500/10";

  // Email Registration
  
const handleRegister = async (
  event: FormEvent<HTMLFormElement>
) => {
  event.preventDefault();

  if (loading || googleLoading) return;

  if (!name.trim()) {
    toast.error("Please enter your full name.");
    return;
  }

  if (!isPasswordValid) {
    toast.error(
      "Password must have at least 6 characters, one uppercase and one lowercase letter."
    );
    return;
  }

  if (password !== confirmPassword) {
    toast.error("Passwords do not match.");
    return;
  }

  setLoading(true);

  try {
    const { error } = await authClient.signUp.email({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password,
    });

    if (error) {
      toast.error(
        error.message || "Registration failed."
      );
      return;
    }

    toast.success("Account created successfully!");

    router.push(signinUrl);
    router.refresh();
  } catch (error) {
    console.error("Registration error:", error);

    toast.error(
      "Something went wrong. Please try again."
    );
  } finally {
    setLoading(false);
  }
};


  // Google Registration
  const handleGoogleSignup = async () => {
    if (loading || googleLoading) return;

    setGoogleLoading(true);

    try {
      const { error } =
        await authClient.signIn.social({
          provider: "google",
          callbackURL: callbackUrl,
        });

      if (error) {
        toast.error(
          error.message || "Google signup failed."
        );
        setGoogleLoading(false);
      }
    } catch (error) {
      console.error("Google signup error:", error);
      toast.error("Google signup failed.");
      setGoogleLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f8f9fd]">
      <div className="grid min-h-screen lg:grid-cols-2">
        {/* Left Branding Section */}
        <section className="relative hidden min-h-screen flex-col justify-between overflow-hidden bg-[#171b3d] p-12 text-white lg:flex xl:p-16">
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
              Join Our Community
            </span>

            <h1 className="mt-8 text-5xl font-extrabold leading-[1.12] tracking-tight xl:text-6xl">
              Every reader
              <span className="mt-2 block bg-gradient-to-r from-indigo-300 via-violet-300 to-pink-300 bg-clip-text text-transparent">
                has a story.
              </span>
            </h1>

            <p className="mt-7 max-w-md text-base leading-8 text-indigo-100/70">
              Create your BookNook account and
              discover a world of stories, knowledge,
              and imagination. Your next great
              adventure starts here.
            </p>

            <div className="mt-12 space-y-5">
              {[
                "Explore our growing book collection",
                "Borrow books from the community",
                "Share your favorite reads",
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
            Secure registration with Better Auth
          </div>

          <BookOpen
            size={260}
            strokeWidth={0.6}
            className="pointer-events-none absolute -bottom-14 -right-14 rotate-[-20deg] text-white/[0.04]"
          />
        </section>

        {/* Right Signup Form */}
        <section className="flex min-h-screen items-center justify-center px-4 py-12 sm:px-8 lg:px-12">
          <div className="w-full max-w-[460px]">
            {/* Mobile Logo */}
            <Link
              href="/"
              className="mb-10 inline-flex items-center gap-3 lg:hidden"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-600 text-white">
                <BookOpen size={22} />
              </span>

              <span className="text-2xl font-extrabold tracking-tight text-slate-900">
                Book
                <span className="text-indigo-600">
                  Nook
                </span>
              </span>
            </Link>

            {/* Header */}
            <div className="mb-8">
              <div className="mb-5 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
                <UserPlus size={26} />
              </div>

              <h1 className="text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">
                Create your account
              </h1>

              <p className="mt-3 text-sm leading-7 text-slate-500">
                Join the BookNook community and
                begin your reading journey.
              </p>
            </div>

            {/* Google Signup */}
            <button
              type="button"
              onClick={handleGoogleSignup}
              disabled={loading || googleLoading}
              className="flex w-full items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-indigo-200 hover:bg-indigo-50/50 disabled:opacity-60"
            >
              {googleLoading ? (
                <Loader2
                  size={20}
                  className="animate-spin text-indigo-600"
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
                    d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45-1.16-4.05 1.16-3.13 0-5.78-2.11-6.73-4.96H1.19v3.15C3.17 21.36 7.23 24 12 24z"
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

            {/* Divider */}
            <div className="my-7 flex items-center gap-4">
              <div className="h-px flex-1 bg-slate-200" />
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Or with email
              </span>
              <div className="h-px flex-1 bg-slate-200" />
            </div>

            {/* Signup Form */}
            <form
              onSubmit={handleRegister}
              className="space-y-5"
            >
              {/* Full Name */}
              <div>
                <label
                  htmlFor="register-name"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Full Name
                </label>

                <div className="relative">
                  <UserRound
                    size={18}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    id="register-name"
                    type="text"
                    required
                    maxLength={100}
                    autoComplete="name"
                    value={name}
                    onChange={(e) =>
                      setName(e.target.value)
                    }
                    placeholder="Enter your full name"
                    className={`${inputClass} pl-12`}
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="register-email"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Email Address
                </label>

                <div className="relative">
                  <Mail
                    size={18}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    id="register-email"
                    type="email"
                    required
                    autoComplete="email"
                    value={email}
                    onChange={(e) =>
                      setEmail(e.target.value)
                    }
                    placeholder="name@example.com"
                    className={`${inputClass} pl-12`}
                  />
                </div>
              </div>

              {/* Photo URL */}
              <div>
                <label
                  htmlFor="register-image"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Profile Photo URL
                  <span className="ml-2 text-xs font-normal text-slate-400">
                    Optional
                  </span>
                </label>

                <div className="relative">
                  <ImageIcon
                    size={18}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    id="register-image"
                    type="url"
                    value={image}
                    onChange={(e) =>
                      setImage(e.target.value)
                    }
                    placeholder="https://example.com/photo.jpg"
                    className={`${inputClass} pl-12`}
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="register-password"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Password
                </label>

                <div className="relative">
                  <LockKeyhole
                    size={18}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    id="register-password"
                    type={showPassword ? "text" : "password"}
                    required
                    minLength={6}
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) =>
                      setPassword(e.target.value)
                    }
                    placeholder="Create a strong password"
                    className={`${inputClass} pl-12 pr-12`}
                  />

                  <button
                    type="button"
                    aria-label={
                      showPassword
                        ? "Hide password"
                        : "Show password"
                    }
                    onClick={() =>
                      setShowPassword((prev) => !prev)
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600"
                  >
                    {showPassword ? (
                      <EyeOff size={19} />
                    ) : (
                      <Eye size={19} />
                    )}
                  </button>
                </div>

                {/* Password Rules */}
                <div className="mt-3 space-y-2">
                  {passwordRules.map((rule) => (
                    <div
                      key={rule.label}
                      className={`flex items-center gap-2 text-xs ${
                        rule.valid
                          ? "text-emerald-600"
                          : "text-slate-400"
                      }`}
                    >
                      <span
                        className={`flex h-4 w-4 items-center justify-center rounded-full ${
                          rule.valid
                            ? "bg-emerald-100"
                            : "bg-slate-100"
                        }`}
                      >
                        <Check size={11} />
                      </span>
                      {rule.label}
                    </div>
                  ))}
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label
                  htmlFor="confirm-password"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Confirm Password
                </label>

                <div className="relative">
                  <LockKeyhole
                    size={18}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    id="confirm-password"
                    type={
                      showConfirmPassword
                        ? "text"
                        : "password"
                    }
                    required
                    minLength={6}
                    autoComplete="new-password"
                    value={confirmPassword}
                    onChange={(e) =>
                      setConfirmPassword(e.target.value)
                    }
                    placeholder="Re-enter your password"
                    className={`${inputClass} pl-12 pr-12`}
                  />

                  <button
                    type="button"
                    aria-label={
                      showConfirmPassword
                        ? "Hide confirm password"
                        : "Show confirm password"
                    }
                    onClick={() =>
                      setShowConfirmPassword(
                        (prev) => !prev
                      )
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600"
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={19} />
                    ) : (
                      <Eye size={19} />
                    )}
                  </button>
                </div>

                {confirmPassword && (
                  <p
                    className={`mt-2 text-xs font-medium ${
                      passwordsMatch
                        ? "text-emerald-600"
                        : "text-rose-500"
                    }`}
                  >
                    {passwordsMatch
                      ? "Passwords match"
                      : "Passwords do not match"}
                  </p>
                )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading || googleLoading}
                className="group flex w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-4 text-sm font-bold text-white shadow-lg shadow-indigo-500/20 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-indigo-500/30 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <Loader2
                      size={19}
                      className="animate-spin"
                    />
                    Creating Account...
                  </>
                ) : (
                  <>
                    Create Account
                    <ArrowRight
                      size={19}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  </>
                )}
              </button>
            </form>

            {/* Sign In */}
            <p className="mt-8 text-center text-sm text-slate-500">
              Already have an account?{" "}
              <Link
                href={signinUrl}
                className="font-bold text-indigo-600 hover:text-indigo-700"
              >
                Sign In
              </Link>
            </p>

            {/* Security */}
            <div className="mt-8 flex items-center justify-center gap-2 border-t border-slate-200 pt-6 text-center text-xs text-slate-400">
              <ShieldCheck size={16} />
              Your account is protected by Better Auth
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
