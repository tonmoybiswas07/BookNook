
"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  BookOpen,
  BookMarked,
  Bookmark,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Fingerprint,
  LibraryBig,
  Mail,
  ShieldCheck,
  Sparkles,
  UserRound,
  ArrowUpRight,
  LogOut,
  Loader2,
  Copy,
  Check,
} from "lucide-react";
import { toast } from "react-toastify";
import { authClient } from "@/app/lib/auth-client";

const quickActions = [
  {
    title: "My Books",
    description: "Manage your book collection",
    href: "/my-books",
    icon: BookMarked,
    iconBg: "bg-indigo-50 dark:bg-indigo-500/10",
    iconColor: "text-indigo-600 dark:text-indigo-400",
  },
  {
    title: "My Borrowings",
    description: "Track your borrowed books",
    href: "/myBorrow",
    icon: Bookmark,
    iconBg: "bg-violet-50 dark:bg-violet-500/10",
    iconColor: "text-violet-600 dark:text-violet-400",
  },
  {
    title: "Add New Book",
    description: "Share a book with readers",
    href: "/add-books",
    icon: BookOpen,
    iconBg: "bg-amber-50 dark:bg-amber-500/10",
    iconColor: "text-amber-600 dark:text-amber-400",
  },
  {
    title: "Explore Books",
    description: "Find your next favorite",
    href: "/allBooks",
    icon: LibraryBig,
    iconBg: "bg-emerald-50 dark:bg-emerald-500/10",
    iconColor: "text-emerald-600 dark:text-emerald-400",
  },
];

export default function ProfilePage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  const [copied, setCopied] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const user = session?.user;

  const initials = (user?.name || "Book Reader")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0].toUpperCase())
    .join("");

  const joinedDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      })
    : "BookNook Member";

  const copyEmail = async () => {
    if (!user?.email) return;

    try {
      await navigator.clipboard.writeText(user.email);
      setCopied(true);
      toast.success("Email copied!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Unable to copy email");
    }
  };

  const handleLogout = async () => {
    setLoggingOut(true);

    try {
      const { error } = await authClient.signOut();

      if (error) {
        toast.error(error.message || "Failed to sign out");
        return;
      }

      toast.success("Signed out successfully");
      router.replace("/Authentication/signin");
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoggingOut(false);
    }
  };

  if (isPending) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center bg-[#f7f8fc] dark:bg-slate-950">
        <Loader2 className="h-9 w-9 animate-spin text-indigo-600 dark:text-indigo-400" />
      </div>
    );
  }

  if (!user) {
    return (
      <main className="flex min-h-[75vh] flex-col items-center justify-center bg-[#f7f8fc] px-4 text-center dark:bg-slate-950">
        <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-3xl bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
          <UserRound className="h-9 w-9" />
        </div>

        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          Your library awaits
        </h1>

        <p className="mt-2 max-w-sm text-sm text-slate-500 dark:text-slate-400">
          Sign in to view your profile and manage your reading journey.
        </p>

        <Link
          href="/Authentication/signin?callbackUrl=%2Fprofile"
          className="mt-6 rounded-xl bg-indigo-600 px-7 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 dark:hover:bg-indigo-500"
        >
          Sign In to Continue
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f7f8fc] pb-20 text-slate-900 transition-colors duration-300 dark:bg-slate-950 dark:text-slate-100">
      <div className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
        <div className="mb-7 flex items-center gap-2 text-xs font-medium text-slate-400 dark:text-slate-500">
          <Link
            href="/"
            className="transition hover:text-indigo-600 dark:hover:text-indigo-400"
          >
            Home
          </Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-slate-700 dark:text-slate-300">
            My Profile
          </span>
        </div>

        <div className="relative overflow-hidden rounded-[30px] bg-[#101b3d] text-white shadow-xl shadow-indigo-950/10 dark:bg-[#0b122b] dark:shadow-black/30">
          <div className="pointer-events-none absolute -right-20 -top-36 h-96 w-96 rounded-full bg-violet-500/25 blur-3xl" />
          <div className="pointer-events-none absolute bottom-[-180px] left-1/3 h-80 w-80 rounded-full bg-indigo-500/30 blur-3xl" />

          <div className="pointer-events-none absolute right-10 top-8 hidden rotate-[-20deg] opacity-[0.07] md:block">
            <BookOpen className="h-64 w-64" strokeWidth={0.8} />
          </div>

          <div className="relative z-10 px-6 pb-8 pt-8 sm:px-10 sm:pb-10 sm:pt-10">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-indigo-100 backdrop-blur">
                <Sparkles className="h-3.5 w-3.5 text-amber-300" />
                The Reader&apos;s Corner
              </div>

              <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1.5 text-xs font-medium text-emerald-200">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                Active Member
              </span>
            </div>

            <div className="mt-10 flex flex-col gap-6 sm:flex-row sm:items-end">
              <div className="relative shrink-0">
                <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-[28px] border-4 border-white/20 bg-gradient-to-br from-indigo-400 to-violet-600 shadow-2xl sm:h-32 sm:w-32">
                  {user.image ? (
                    <Image
                      src={user.image}
                      alt={user.name || "Profile"}
                      width={128}
                      height={128}
                      unoptimized
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="text-4xl font-bold text-white">
                      {initials}
                    </span>
                  )}
                </div>

                <span className="absolute -bottom-2 -right-2 flex h-10 w-10 items-center justify-center rounded-2xl border-4 border-[#101b3d] bg-indigo-500 shadow-lg dark:border-[#0b122b]">
                  <BookOpen className="h-4 w-4 text-white" />
                </span>
              </div>

              <div className="min-w-0 flex-1 pb-1">
                <p className="mb-2 text-xs font-medium uppercase tracking-[0.2em] text-indigo-200">
                  Your personal library space
                </p>

                <h1 className="break-words text-3xl font-extrabold tracking-tight sm:text-4xl">
                  {user.name || "Book Reader"}
                </h1>

                <p className="mt-2 flex items-center gap-2 break-all text-sm text-slate-300">
                  <Mail className="h-4 w-4 shrink-0" />
                  {user.email}
                </p>

                <div className="mt-5 flex flex-wrap items-center gap-3">
                  <span className="inline-flex items-center gap-2 rounded-lg bg-white/10 px-3 py-2 text-xs text-indigo-100">
                    <CalendarDays className="h-3.5 w-3.5" />
                    Joined {joinedDate}
                  </span>

                  <span className="inline-flex items-center gap-2 rounded-lg bg-white/10 px-3 py-2 text-xs text-indigo-100">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    BookNook Reader
                  </span>
                </div>
              </div>

              <Link
                href="/allBooks"
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-indigo-700 transition hover:bg-indigo-50"
              >
                Explore Library
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-7 lg:grid-cols-12">
          <div className="space-y-7 lg:col-span-8">
            <div className="relative overflow-hidden rounded-3xl border border-indigo-100 bg-gradient-to-r from-indigo-50 via-white to-violet-50 p-7 dark:border-indigo-500/20 dark:from-indigo-500/10 dark:via-slate-900 dark:to-violet-500/10 sm:p-8">
              <div className="absolute -bottom-8 -right-6 text-indigo-100 dark:text-indigo-500/10">
                <LibraryBig className="h-44 w-44" strokeWidth={1} />
              </div>

              <div className="relative z-10 max-w-lg">
                <span className="mb-3 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
                  <Sparkles className="h-4 w-4" />
                  Your Reading Journey
                </span>

                <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                  Every great story starts with a page.
                </h2>

                <p className="mt-3 text-sm leading-7 text-slate-500 dark:text-slate-400">
                  Discover new worlds, revisit your favorites, and keep
                  your personal collection organized with BookNook.
                </p>

                <Link
                  href="/allBooks"
                  className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-indigo-600 transition hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300"
                >
                  Find your next read
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:shadow-black/10 sm:p-8">
              <div className="mb-7 flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                    Personal Information
                  </h2>
                  <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
                    Your BookNook account details
                  </p>
                </div>

                <div className="rounded-xl bg-indigo-50 p-3 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
                  <UserRound className="h-5 w-5" />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-5 dark:border-slate-700/70 dark:bg-slate-800/60">
                  <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    <UserRound className="h-4 w-4" />
                    Full Name
                  </div>
                  <p className="break-words text-sm font-semibold text-slate-800 dark:text-slate-100">
                    {user.name || "Not provided"}
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-5 dark:border-slate-700/70 dark:bg-slate-800/60">
                  <div className="mb-3 flex items-center justify-between gap-2">
                    <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                      <Mail className="h-4 w-4" />
                      Email Address
                    </span>

                    <button
                      type="button"
                      onClick={copyEmail}
                      aria-label="Copy email"
                      className="text-slate-400 transition hover:text-indigo-600 dark:text-slate-500 dark:hover:text-indigo-400"
                    >
                      {copied ? (
                        <Check className="h-4 w-4 text-emerald-500" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </button>
                  </div>

                  <p className="break-all text-sm font-semibold text-slate-800 dark:text-slate-100">
                    {user.email}
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-5 dark:border-slate-700/70 dark:bg-slate-800/60">
                  <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    <CalendarDays className="h-4 w-4" />
                    Member Since
                  </div>
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                    {joinedDate}
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-5 dark:border-slate-700/70 dark:bg-slate-800/60">
                  <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    <Fingerprint className="h-4 w-4" />
                    Account Status
                  </div>
                  <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 className="h-4 w-4" />
                    Active
                  </span>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:shadow-black/10 sm:p-8">
              <div className="mb-6">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  Your Library Hub
                </h2>
                <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
                  Everything you need, all in one place
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {quickActions.map((item) => {
                  const Icon = item.icon;

                  return (
                    <Link
                      key={item.title}
                      href={item.href}
                      className="group flex items-center gap-4 rounded-2xl border border-slate-100 p-4 transition-all hover:border-indigo-200 hover:bg-indigo-50/30 hover:shadow-sm dark:border-slate-700 dark:bg-slate-800/30 dark:hover:border-indigo-500/30 dark:hover:bg-indigo-500/10"
                    >
                      <div
                        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${item.iconBg} ${item.iconColor}`}
                      >
                        <Icon className="h-5 w-5" />
                      </div>

                      <div className="min-w-0 flex-1">
                        <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                          {item.title}
                        </h3>

                        <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
                          {item.description}
                        </p>
                      </div>

                      <ChevronRight className="h-4 w-4 shrink-0 text-slate-300 transition group-hover:translate-x-1 group-hover:text-indigo-600 dark:text-slate-500 dark:group-hover:text-indigo-400" />
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="space-y-7 lg:col-span-4">
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-800 p-7 text-white shadow-xl shadow-indigo-200/50 dark:from-indigo-700 dark:via-indigo-900 dark:to-violet-950 dark:shadow-black/30">
              <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full border-[28px] border-white/5" />
              <div className="absolute -bottom-16 -left-10 h-40 w-40 rounded-full bg-violet-400/20 blur-2xl" />

              <div className="relative z-10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-6 w-6" />
                    <span className="text-lg font-black tracking-tight">
                      BookNook
                    </span>
                  </div>
                  <Sparkles className="h-5 w-5 text-amber-300" />
                </div>

                <p className="mt-9 text-[10px] font-semibold uppercase tracking-[0.25em] text-indigo-200">
                  Digital Library Pass
                </p>

                <p className="mt-2 break-words text-xl font-bold">
                  {user.name || "Book Reader"}
                </p>

                <div className="mt-8 flex items-end justify-between">
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-indigo-200">
                      Membership
                    </p>
                    <p className="mt-1 text-sm font-bold">Reader</p>
                  </div>

                  <div className="rounded-lg border border-white/20 bg-white/10 p-2.5">
                    <BookOpen className="h-7 w-7" />
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:shadow-black/10">
              <div className="mb-5 flex items-center gap-3">
                <div className="rounded-xl bg-emerald-50 p-2.5 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
                  <ShieldCheck className="h-5 w-5" />
                </div>

                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    Account Overview
                  </h3>
                  <p className="text-xs text-slate-400 dark:text-slate-500">
                    Your membership details
                  </p>
                </div>
              </div>

              <div className="space-y-4 border-t border-slate-100 pt-5 dark:border-slate-800">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    Account
                  </span>
                  <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                    Active
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    Member since
                  </span>
                  <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                    {joinedDate}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    Platform
                  </span>
                  <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                    BookNook
                  </span>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-amber-100 bg-[#fffaf0] p-7 dark:border-amber-500/20 dark:bg-amber-500/5">
              <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-100 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400">
                <Sparkles className="h-5 w-5" />
              </div>

              <p className="text-lg font-semibold italic leading-8 text-slate-800 dark:text-slate-200">
                “A reader lives a thousand lives before they die.”
              </p>

              <p className="mt-4 text-xs font-semibold text-amber-700 dark:text-amber-400">
                — George R. R. Martin
              </p>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              disabled={loggingOut}
              className="flex w-full items-center justify-center gap-2 rounded-2xl border border-rose-100 bg-white px-5 py-4 text-sm font-bold text-rose-600 transition hover:border-rose-200 hover:bg-rose-50 disabled:opacity-50 dark:border-rose-500/20 dark:bg-slate-900 dark:text-rose-400 dark:hover:border-rose-500/40 dark:hover:bg-rose-500/10"
            >
              {loggingOut ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <LogOut className="h-4 w-4" />
              )}
              {loggingOut ? "Signing Out..." : "Sign Out"}
            </button>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-slate-200 pt-6 text-xs text-slate-400 dark:border-slate-800 dark:text-slate-500 sm:flex-row">
          <span>Your stories. Your space. Your BookNook.</span>
          <span className="flex items-center gap-2">
            <Clock3 className="h-3.5 w-3.5" />
            Happy reading!
          </span>
        </div>
      </div>
    </main>
  );
}
