
import {
  BookOpen,
  Sparkles,
  LibraryBig,
} from "lucide-react";

export default function Loading() {
  return (
    <main
      role="status"
      aria-live="polite"
      className="relative flex min-h-[85vh] items-center justify-center overflow-hidden bg-[#f8f9fd] px-4 py-16"
    >
      {/* Background Decorations */}
      <div className="pointer-events-none absolute -left-24 top-10 h-80 w-80 rounded-full bg-indigo-200/30 blur-3xl" />

      <div className="pointer-events-none absolute -right-24 bottom-10 h-80 w-80 rounded-full bg-violet-200/30 blur-3xl" />

      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-indigo-100/60" />

      {/* Main Loading Content */}
      <div className="relative z-10 flex w-full max-w-md flex-col items-center text-center">
        {/* Small Badge */}
        <div className="mb-10 inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-white px-4 py-2 shadow-sm">
          <Sparkles className="h-4 w-4 text-indigo-600" />

          <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-indigo-600">
            Your Digital Library
          </span>
        </div>

        {/* Animated Loader */}
        <div className="relative flex h-36 w-36 items-center justify-center sm:h-40 sm:w-40">
          {/* Outer Ring */}
          <div className="absolute inset-0 animate-spin rounded-full border-[3px] border-indigo-100 border-t-indigo-600 border-r-violet-500" />

          {/* Middle Ring */}
          <div className="absolute inset-3 animate-[spin_3s_linear_infinite_reverse] rounded-full border-2 border-dashed border-indigo-200" />

          {/* Inner Glow */}
          <div className="absolute inset-7 rounded-full bg-indigo-200/40 blur-xl" />

          {/* Icon Container */}
          <div className="relative flex h-24 w-24 items-center justify-center rounded-[28px] bg-gradient-to-br from-indigo-600 via-indigo-600 to-violet-600 shadow-2xl shadow-indigo-500/30">
            <BookOpen
              className="h-11 w-11 text-white"
              strokeWidth={1.8}
            />

            {/* Floating Sparkle */}
            <div className="absolute -right-2 -top-2 flex h-9 w-9 animate-bounce items-center justify-center rounded-xl border-4 border-[#f8f9fd] bg-amber-400 text-white">
              <Sparkles className="h-4 w-4" />
            </div>
          </div>
        </div>

        {/* Branding */}
        <div className="mt-10 flex items-center gap-2">
          <LibraryBig className="h-6 w-6 text-indigo-600" />

          <h1 className="text-3xl font-extrabold tracking-tight text-slate-950">
            Book
            <span className="text-indigo-600">
              Nook
            </span>
          </h1>
        </div>

        {/* Loading Message */}
        <h2 className="mt-6 text-xl font-bold text-slate-900 sm:text-2xl">
          Preparing Your Library
        </h2>

        <p className="mt-3 max-w-xs text-sm leading-7 text-slate-500">
          Gathering wonderful stories and
          getting everything ready for you.
        </p>

        {/* Animated Dots */}
        <div className="mt-7 flex items-center gap-2">
          <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-indigo-600 [animation-delay:-0.3s]" />

          <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-violet-500 [animation-delay:-0.15s]" />

          <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-indigo-400" />
        </div>

        {/* Loading Progress */}
        <div className="mt-9 w-full max-w-[240px]">
          <div className="mb-3 flex items-center justify-between text-[11px] font-semibold text-slate-400">
            <span>Loading resources</span>
            <span className="text-indigo-600">
              Please wait
            </span>
          </div>

          <div className="h-1.5 w-full overflow-hidden rounded-full bg-indigo-100">
            <div className="h-full w-1/2 animate-pulse rounded-full bg-gradient-to-r from-indigo-600 to-violet-500" />
          </div>
        </div>

        {/* Bottom Text */}
        <p className="mt-10 text-xs font-medium tracking-wide text-slate-400">
          Every great story begins with a page.
        </p>
      </div>
    </main>
  );
}
