import Link from "next/link";

import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaGithub,
} from "react-icons/fa";
import {
  ArrowRight,
  BookMarked,
  BookOpen,
  Heart,
  LibraryBig,
  Mail,
  Sparkles,
} from "lucide-react";

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "All Books", href: "/allBooks" },
  { label: "Add a Book", href: "/add-books" },
  { label: "My Books", href: "/my-books" },
];

const accountLinks = [
  { label: "Sign In", href: "/Authentication/signin" },
  { label: "Create Account", href: "/Authentication/signup" },
  { label: "My Borrowed Books", href: "/myBorrow" },
  { label: "My Profile", href: "/profile" },
];

const socialLinks = [
  {
    label: "Facebook",
    href: "https://facebook.com",
    icon: FaFacebookF,
  },
  {
    label: "Instagram",
    href: "https://instagram.com",
    icon: FaInstagram,
  },
  {
    label: "LinkedIn",
    href: "https://linkedin.com",
    icon: FaLinkedinIn,
  },
  {
    label: "GitHub",
    href: "https://github.com",
    icon: FaGithub,
  },
];

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-[#11152e] text-slate-300">
      {/* Background Glow */}
      <div className="pointer-events-none absolute -left-40 top-0 h-96 w-96 rounded-full bg-indigo-600/10 blur-[110px]" />
      <div className="pointer-events-none absolute -right-40 bottom-0 h-96 w-96 rounded-full bg-violet-600/10 blur-[110px]" />

      {/* Top CTA */}
      <div className="relative border-b border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 px-4 py-10 sm:px-6 md:flex-row md:items-center lg:px-8">
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-indigo-500/15 text-indigo-300">
              <BookOpen size={27} />
            </div>

            <div>
              <h2 className="text-xl font-extrabold tracking-tight text-white sm:text-2xl">
                Your next great story awaits.
              </h2>

              <p className="mt-2 max-w-lg text-sm leading-6 text-slate-400">
                Explore a world of books, discover new perspectives, and find
                your next favorite read with BookNook.
              </p>
            </div>
          </div>

          <Link
            href="/allBooks"
            className="group inline-flex shrink-0 items-center gap-3 rounded-2xl bg-indigo-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-indigo-950/30 transition-all duration-300 hover:-translate-y-0.5 hover:bg-indigo-500"
          >
            Explore Books
            <ArrowRight
              size={18}
              className="transition-transform group-hover:translate-x-1"
            />
          </Link>
        </div>
      </div>

      {/* Main Footer */}
      <div className="relative mx-auto max-w-7xl px-4 pb-12 pt-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <Link href="/" className="inline-flex items-center gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-950/30">
                <BookOpen size={25} />
              </span>

              <span className="text-2xl font-extrabold tracking-tight text-white">
                Book
                <span className="text-indigo-400">Nook</span>
              </span>
            </Link>

            <p className="mt-6 max-w-sm text-sm leading-7 text-slate-400">
              Your gateway to endless stories. Discover, borrow, and share books
              effortlessly in one welcoming online library community.
            </p>

            <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-indigo-400/20 bg-indigo-500/10 px-4 py-2 text-xs font-semibold text-indigo-200">
              <Sparkles size={14} />
              Read More. Discover More.
            </div>

            {/* Social Links */}
            <div className="mt-7 flex items-center gap-3">
              {socialLinks.map((social) => {
                const Icon = social.icon;

                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-400 transition-all duration-300 hover:-translate-y-1 hover:border-indigo-400/50 hover:bg-indigo-600 hover:text-white"
                  >
                    <Icon size={18} />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-extrabold uppercase tracking-[0.14em] text-white">
              Quick Links
            </h3>

            <div className="mt-4 h-1 w-10 rounded-full bg-indigo-500" />

            <ul className="mt-7 space-y-4">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="group inline-flex items-center gap-2 text-sm text-slate-400 transition-colors hover:text-white"
                  >
                    <ArrowRight
                      size={14}
                      className="text-indigo-400 transition-transform group-hover:translate-x-1"
                    />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Account Links */}
          <div>
            <h3 className="text-sm font-extrabold uppercase tracking-[0.14em] text-white">
              My Account
            </h3>

            <div className="mt-4 h-1 w-10 rounded-full bg-violet-500" />

            <ul className="mt-7 space-y-4">
              {accountLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="group inline-flex items-center gap-2 text-sm text-slate-400 transition-colors hover:text-white"
                  >
                    <ArrowRight
                      size={14}
                      className="text-violet-400 transition-transform group-hover:translate-x-1"
                    />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact / About */}
          <div>
            <h3 className="text-sm font-extrabold uppercase tracking-[0.14em] text-white">
              Get In Touch
            </h3>

            <div className="mt-4 h-1 w-10 rounded-full bg-indigo-500" />

            <div className="mt-7 space-y-5">
              <div className="flex items-start gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/5 text-indigo-300">
                  <Mail size={18} />
                </span>

                <div>
                  <p className="text-xs font-semibold text-white">
                    Email Support
                  </p>

                  <p className="mt-1 text-sm text-slate-400">
                    Contact information coming soon
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/5 text-indigo-300">
                  <LibraryBig size={18} />
                </span>

                <div>
                  <p className="text-xs font-semibold text-white">
                    Online Library
                  </p>

                  <p className="mt-1 text-sm leading-6 text-slate-400">
                    Explore and borrow books anytime, from anywhere.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/5 text-indigo-300">
                  <BookMarked size={18} />
                </span>

                <div>
                  <p className="text-xs font-semibold text-white">Community</p>

                  <p className="mt-1 text-sm leading-6 text-slate-400">
                    A space for readers to share and discover stories.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="mt-16 flex flex-col items-center justify-between gap-5 border-t border-white/10 pt-8 text-center sm:flex-row sm:text-left">
          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} BookNook. All rights reserved.
          </p>

          <p className="flex items-center gap-1.5 text-xs text-slate-500">
            Made with
            <Heart size={13} className="fill-rose-500 text-rose-500" />
            for book lovers everywhere
          </p>
        </div>
      </div>
    </footer>
  );
}
