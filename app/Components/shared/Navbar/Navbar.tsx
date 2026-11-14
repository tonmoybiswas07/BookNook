
"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ArrowRight,
  BookOpen,
  BookPlus,
  BookmarkCheck,
  ChevronDown,
  Home,
  LibraryBig,
  Loader2,
  LogOut,
  Menu,
  Sparkles,
  UserRound,
  X,
} from "lucide-react";
import { toast } from "react-toastify";
import { authClient } from "@/app/lib/auth-client";
import ThemeToggle from "./ThemeToggle";


const publicLinks = [
  { label: "Home", href: "/", icon: Home },
  { label: "All Books", href: "/allBooks", icon: LibraryBig },
];

const privateLinks = [
  { label: "Add Book", href: "/add-books", icon: BookPlus },
  { label: "My Books", href: "/my-books", icon: BookOpen },
  { label: "My Borrows", href: "/myBorrow", icon: BookmarkCheck },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  const isActive = (href: string) =>
    href === "/"
      ? pathname === "/"
      : pathname === href || pathname.startsWith(`${href}/`);

  const navLinks = user
    ? [...publicLinks, ...privateLinks]
    : publicLinks;

  useEffect(() => {
    setDropdownOpen(false);
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    setImageFailed(false);
  }, [user?.image]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setDropdownOpen(false);
        setMobileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const handleLogout = async () => {
    if (loggingOut) return;

    setLoggingOut(true);

    try {
      const result = await authClient.signOut();

      if (result.error) {
        throw new Error(
          result.error.message || "Failed to sign out"
        );
      }

      setDropdownOpen(false);
      setMobileOpen(false);

      toast.success("Logged out successfully!");

      router.replace("/Authentication/signin");
      router.refresh();
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Logout failed! Please try again.");
    } finally {
      setLoggingOut(false);
    }
  };

  const navItemClass = (active: boolean) =>
    active
      ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-300"
      : "text-slate-600 hover:bg-slate-50 hover:text-indigo-600 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-indigo-300";

  const dropdownLinkClass =
    "flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-slate-700 transition hover:bg-indigo-50 hover:text-indigo-600 dark:text-slate-300 dark:hover:bg-indigo-500/15 dark:hover:text-indigo-300";

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-slate-200/70 bg-white/95 shadow-sm backdrop-blur-xl transition-colors dark:border-slate-800 dark:bg-slate-950/95">
        <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-[74px] items-center justify-between gap-4">
            {/* Logo */}
            <Link
              href="/"
              className="group flex shrink-0 items-center gap-2.5"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-500/20 transition-transform duration-300 group-hover:-rotate-6">
                <BookOpen size={23} />
              </span>

              <span className="text-xl font-extrabold tracking-tight text-slate-950 dark:text-white sm:text-2xl">
                Book
                <span className="text-indigo-600 dark:text-indigo-400">
                  Nook
                </span>
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden items-center gap-1 lg:flex">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const active = isActive(link.href);

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    aria-current={active ? "page" : undefined}
                    className={`group relative inline-flex items-center gap-2 rounded-xl px-3.5 py-2.5 text-[13px] font-semibold transition-all duration-200 ${navItemClass(active)}`}
                  >
                    <Icon size={16} />
                    {link.label}

                    {active && (
                      <span className="absolute bottom-0 left-1/2 h-0.5 w-7 -translate-x-1/2 rounded-full bg-indigo-600 dark:bg-indigo-400" />
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Right Side */}
            <div className="flex shrink-0 items-center gap-2 sm:gap-3">
              {isPending ? (
                <div className="flex items-center gap-3">
                  <div className="hidden h-4 w-20 animate-pulse rounded bg-slate-100 dark:bg-slate-800 sm:block" />
                  <div className="h-10 w-10 animate-pulse rounded-full bg-slate-100 dark:bg-slate-800" />
                </div>
              ) : user ? (
                <div className="relative" ref={dropdownRef}>
                  {/* User Button */}
                  <button
                    type="button"
                    onClick={() =>
                      setDropdownOpen((prev) => !prev)
                    }
                    aria-label="Open account menu"
                    aria-expanded={dropdownOpen}
                    aria-haspopup="menu"
                    className="flex items-center gap-2 rounded-full border border-slate-200 bg-white p-1 pr-2 shadow-sm transition-all hover:border-indigo-200 hover:shadow-md dark:border-slate-700 dark:bg-slate-900 sm:pr-3"
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-indigo-100 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400">
                      {user.image && !imageFailed ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={user.image}
                          alt={user.name || "User"}
                          className="h-full w-full object-cover"
                          onError={() => setImageFailed(true)}
                        />
                      ) : (
                        <UserRound size={20} />
                      )}
                    </span>

                    <span className="hidden max-w-[115px] truncate text-left text-xs font-bold text-slate-800 dark:text-slate-200 sm:block">
                      {user.name || "My Account"}
                    </span>

                    <ChevronDown
                      size={15}
                      className={`text-slate-400 transition-transform ${
                        dropdownOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {/* Account Dropdown */}
                  {dropdownOpen && (
                    <div
                      role="menu"
                      className="absolute right-0 top-full z-[70] mt-3 w-[280px] overflow-hidden rounded-2xl border border-slate-200 bg-white p-2 shadow-2xl shadow-slate-900/10 dark:border-slate-700 dark:bg-slate-900"
                    >
                      {/* User Information */}
                      <div className="rounded-xl bg-gradient-to-br from-indigo-50 to-violet-50 p-4 dark:from-indigo-500/15 dark:to-violet-500/10">
                        <p className="text-xs font-medium text-indigo-500 dark:text-indigo-400">
                          Signed in as
                        </p>

                        <p className="mt-1 truncate text-sm font-extrabold text-slate-900 dark:text-white">
                          {user.name || "BookNook Reader"}
                        </p>

                        <p className="mt-1 truncate text-xs text-slate-500 dark:text-slate-400">
                          {user.email}
                        </p>
                      </div>

                      {/* Dropdown Links */}
                      <div className="mt-2 space-y-1">
                        <Link
                          href="/myProfile"
                          role="menuitem"
                          onClick={() => setDropdownOpen(false)}
                          className={dropdownLinkClass}
                        >
                          <UserRound size={18} />
                          My Profile
                        </Link>

                        <Link
                          href="/my-books"
                          role="menuitem"
                          onClick={() => setDropdownOpen(false)}
                          className={dropdownLinkClass}
                        >
                          <BookOpen size={18} />
                          My Books
                        </Link>

                        <Link
                          href="/myBorrow"
                          role="menuitem"
                          onClick={() => setDropdownOpen(false)}
                          className={dropdownLinkClass}
                        >
                          <BookmarkCheck size={18} />
                          My Borrows
                        </Link>
                      </div>

                      {/* Logout */}
                      <div className="mt-2 border-t border-slate-100 pt-2 dark:border-slate-800">
                        <button
                          type="button"
                          role="menuitem"
                          onClick={handleLogout}
                          disabled={loggingOut}
                          className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-semibold text-rose-600 transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-60 dark:text-rose-400 dark:hover:bg-rose-500/10"
                        >
                          {loggingOut ? (
                            <Loader2
                              size={18}
                              className="animate-spin"
                            />
                          ) : (
                            <LogOut size={18} />
                          )}

                          {loggingOut
                            ? "Signing Out..."
                            : "Sign Out"}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                /* Guest Actions */
                <div className="hidden items-center gap-2 sm:flex">
                  <Link
                    href="/Authentication/signin"
                    className="rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-indigo-50 hover:text-indigo-600 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-indigo-300"
                  >
                    Sign In
                  </Link>

                  <Link
                    href="/Authentication/signup"
                    className="group inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-indigo-500/15 transition hover:bg-indigo-700"
                  >
                    Get Started
                    <ArrowRight
                      size={16}
                      className="transition-transform group-hover:translate-x-0.5"
                    />
                  </Link>
                </div>
              )}

              {/* Global Dark / Light Theme Toggle */}
              <ThemeToggle />

              {/* Mobile Menu Button */}
              <button
                type="button"
                onClick={() =>
                  setMobileOpen((prev) => !prev)
                }
                aria-label={
                  mobileOpen
                    ? "Close navigation menu"
                    : "Open navigation menu"
                }
                aria-expanded={mobileOpen}
                className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 lg:hidden"
              >
                {mobileOpen ? (
                  <X size={22} />
                ) : (
                  <Menu size={22} />
                )}
              </button>
            </div>
          </div>
        </nav>
      </header>

      {/* Mobile Navigation */}
      {mobileOpen && (
        <div className="fixed inset-0 top-[74px] z-40 bg-slate-950/40 backdrop-blur-sm lg:hidden">
          <button
            type="button"
            aria-label="Close mobile menu"
            onClick={() => setMobileOpen(false)}
            className="absolute inset-0 h-full w-full cursor-default"
          />

          <div className="relative max-h-[calc(100dvh-74px)] overflow-y-auto border-b border-slate-200 bg-white px-4 pb-6 pt-4 shadow-2xl dark:border-slate-700 dark:bg-slate-900 sm:px-6">
            {/* Mobile Heading */}
            <div className="mb-4 flex items-center gap-2 px-2 text-xs font-bold uppercase tracking-[0.15em] text-indigo-500 dark:text-indigo-400">
              <Sparkles size={14} />
              Explore BookNook
            </div>

            {/* Mobile Links */}
            <div className="space-y-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const active = isActive(link.href);

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    aria-current={active ? "page" : undefined}
                    className={`flex items-center gap-3 rounded-xl px-4 py-3.5 text-sm font-semibold transition ${navItemClass(active)}`}
                  >
                    <Icon size={19} />
                    {link.label}

                    {active && (
                      <span className="ml-auto h-2 w-2 rounded-full bg-indigo-600 dark:bg-indigo-400" />
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Mobile Guest Actions */}
            {!isPending && !user && (
              <div className="mt-5 grid grid-cols-2 gap-3 border-t border-slate-100 pt-5 dark:border-slate-800">
                <Link
                  href="/Authentication/signin"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-center rounded-xl border border-indigo-200 bg-indigo-50 px-4 py-3 text-sm font-bold text-indigo-600 dark:border-indigo-500/30 dark:bg-indigo-500/15 dark:text-indigo-300"
                >
                  Sign In
                </Link>

                <Link
                  href="/Authentication/signup"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-center rounded-xl bg-indigo-600 px-4 py-3 text-sm font-bold text-white hover:bg-indigo-700"
                >
                  Register
                </Link>
              </div>
            )}

            {/* Mobile Account */}
            {!isPending && user && (
              <div className="mt-5 border-t border-slate-100 pt-5 dark:border-slate-800">
                <Link
                  href="/myProfile"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 rounded-xl bg-indigo-50 p-4 dark:bg-indigo-500/15"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400">
                    <UserRound size={20} />
                  </span>

                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-bold text-slate-900 dark:text-white">
                      {user.name}
                    </span>

                    <span className="block truncate text-xs text-slate-500 dark:text-slate-400">
                      {user.email}
                    </span>
                  </span>

                  <ArrowRight
                    size={17}
                    className="text-indigo-500"
                  />
                </Link>

                <button
                  type="button"
                  onClick={handleLogout}
                  disabled={loggingOut}
                  className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm font-bold text-rose-600 disabled:opacity-60 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-400"
                >
                  {loggingOut ? (
                    <Loader2
                      size={17}
                      className="animate-spin"
                    />
                  ) : (
                    <LogOut size={17} />
                  )}

                  {loggingOut
                    ? "Signing Out..."
                    : "Sign Out"}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
