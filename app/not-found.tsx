
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Compass,
  Home,
  LibraryBig,
  SearchX,
  Sparkles,
} from "lucide-react";

export default function NotFound() {
  return (
    <main className="relative flex min-h-[85vh] items-center justify-center overflow-hidden bg-[#f8f9fd] px-4 py-16 sm:py-20">
      {/* Background Decorations */}
      <div className="pointer-events-none absolute -left-32 top-0 h-96 w-96 rounded-full bg-indigo-200/40 blur-3xl" />
      <div className="pointer-events-none absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-violet-200/40 blur-3xl" />

      {/* Decorative Circles */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[320px] w-[320px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-indigo-100/70 sm:h-[500px] sm:w-[500px]" />

      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[240px] w-[240px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-indigo-100/60 sm:h-[380px] sm:w-[380px]" />

      {/* Main Content */}
      <div className="relative z-10 mx-auto w-full max-w-2xl text-center">
        {/* Top Badge */}
        <div className="mb-9 inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-white px-4 py-2 shadow-sm">
          <Sparkles size={15} className="text-indigo-600" />

          <span className="text-[11px] font-extrabold uppercase tracking-[0.17em] text-indigo-600">
            Lost Between The Pages
          </span>
        </div>

        {/* Illustration */}
        <div className="relative mx-auto mb-8 flex h-32 w-32 items-center justify-center sm:h-36 sm:w-36">
          {/* Outer Glow */}
          <div className="absolute inset-0 rounded-full bg-indigo-200/40 blur-2xl" />

          {/* Outer Ring */}
          <div className="absolute inset-0 rounded-full border-2 border-dashed border-indigo-200" />

          {/* Book Icon */}
          <div className="relative flex h-24 w-24 -rotate-6 items-center justify-center rounded-[30px] bg-gradient-to-br from-indigo-600 via-indigo-600 to-violet-600 text-white shadow-2xl shadow-indigo-500/30 sm:h-28 sm:w-28">
            <BookOpen
              size={51}
              strokeWidth={1.7}
            />

            {/* Search Badge */}
            <div className="absolute -bottom-3 -right-3 flex h-12 w-12 rotate-6 items-center justify-center rounded-2xl border-4 border-[#f8f9fd] bg-white text-indigo-600 shadow-lg">
              <SearchX size={23} />
            </div>
          </div>
        </div>

        {/* 404 Text */}
        <div className="relative">
          <h1 className="bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-500 bg-clip-text text-[110px] font-black leading-none tracking-[-0.09em] text-transparent sm:text-[150px]">
            404
          </h1>
        </div>

        {/* Status Badge */}
        <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-rose-100 bg-rose-50 px-4 py-2 text-xs font-extrabold uppercase tracking-[0.15em] text-rose-500">
          <span className="h-2 w-2 rounded-full bg-rose-500" />
          Page Not Found
        </div>

        {/* Heading */}
        <h2 className="mt-7 text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl lg:text-[42px]">
          Oops! This Story{" "}
          <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
            Is Missing.
          </span>
        </h2>

        {/* Description */}
        <p className="mx-auto mt-5 max-w-lg text-sm leading-8 text-slate-500 sm:text-base">
          Looks like this page has been lost somewhere
          between the shelves. The link might be broken,
          or the page may have moved to a new chapter.
        </p>

        {/* Action Buttons */}
        <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/"
            className="group inline-flex w-full items-center justify-center gap-2.5 rounded-2xl bg-indigo-600 px-7 py-4 text-sm font-bold text-white shadow-lg shadow-indigo-500/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-indigo-700 hover:shadow-xl sm:w-auto"
          >
            <Home size={18} />
            Back to Home
            <ArrowRight
              size={17}
              className="transition-transform group-hover:translate-x-1"
            />
          </Link>

          <Link
            href="/allBooks"
            className="group inline-flex w-full items-center justify-center gap-2.5 rounded-2xl border border-indigo-200 bg-white px-7 py-4 text-sm font-bold text-indigo-600 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-indigo-400 hover:bg-indigo-50 sm:w-auto"
          >
            <Compass size={18} />
            Explore Books
            <ArrowRight
              size={17}
              className="transition-transform group-hover:translate-x-1"
            />
          </Link>
        </div>

        {/* Helpful Message */}
        <div className="mx-auto mt-12 flex max-w-md items-start gap-4 rounded-2xl border border-indigo-100 bg-white/80 p-5 text-left shadow-sm backdrop-blur-sm">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
            <LibraryBig size={23} />
          </div>

          <div>
            <h3 className="text-sm font-extrabold text-slate-900">
              Looking for a good read?
            </h3>

            <p className="mt-1.5 text-xs leading-6 text-slate-500">
              Visit our library collection and
              discover your next favorite book.
            </p>

            <Link
              href="/allBooks"
              className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 transition hover:text-indigo-800"
            >
              Browse Library
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>

        {/* Footer Text */}
        <div className="mt-12 flex items-center justify-center gap-2 text-xs font-medium text-slate-400">
          <BookOpen size={15} />
          BookNook — Every story deserves a home.
        </div>
      </div>
    </main>
  );
}
