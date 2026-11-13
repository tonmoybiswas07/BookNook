
import Link from "next/link";
import {
  BookOpen,
  ArrowLeft,
  Home,
  SearchX,
} from "lucide-react";

export default function NotFound() {
  return (
    <main className="relative flex min-h-[85vh] items-center justify-center overflow-hidden bg-slate-50 px-4 py-16">
      <div className="absolute -left-20 top-10 h-72 w-72 rounded-full bg-indigo-100/60 blur-3xl" />
      <div className="absolute -right-20 bottom-10 h-72 w-72 rounded-full bg-purple-100/60 blur-3xl" />

      <div className="relative z-10 mx-auto w-full max-w-xl text-center">
        <div className="mb-8 flex justify-center">
          <div className="relative flex h-24 w-24 items-center justify-center rounded-3xl border border-indigo-100 bg-white shadow-xl shadow-indigo-100/50">
            <BookOpen className="h-12 w-12 text-indigo-600" />

            <div className="absolute -bottom-2 -right-2 flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-lg">
              <SearchX className="h-5 w-5" />
            </div>
          </div>
        </div>

        <div className="mb-4 text-7xl font-black tracking-tight text-indigo-600 sm:text-8xl">
          404
        </div>

        <div className="mb-4 inline-flex items-center rounded-full border border-indigo-100 bg-indigo-50 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-indigo-600">
          Page Not Found
        </div>

        <h1 className="mb-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Oops! This page is missing.
        </h1>

        <p className="mx-auto mb-9 max-w-md text-sm leading-7 text-gray-500 sm:text-base">
          Looks like this page has been lost between the shelves.
          The link may be broken, or the page may have been moved.
        </p>

        <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/"
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-200 transition-all hover:-translate-y-0.5 hover:bg-indigo-700 sm:w-auto"
          >
            <Home className="h-4 w-4" />
            Back to Home
          </Link>

          <Link
            href="/allBooks"
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-7 py-3.5 text-sm font-semibold text-gray-700 transition-all hover:border-indigo-200 hover:text-indigo-600 sm:w-auto"
          >
            <ArrowLeft className="h-4 w-4" />
            Explore Books
          </Link>
        </div>

        <p className="mt-12 text-xs text-gray-400">
          © BookNook — Every story deserves a home.
        </p>
      </div>
    </main>
  );
}
