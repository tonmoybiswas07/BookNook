
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
      className="relative flex min-h-[85vh] items-center justify-center overflow-hidden bg-[#f8f9fd] px-4 py-16 transition-colors duration-300 dark:bg-slate-950"
    >
      <div className="pointer-events-none absolute -left-24 top-10 h-80 w-80 rounded-full bg-indigo-200/30 blur-3xl dark:bg-indigo-500/10" />

      <div className="pointer-events-none absolute -right-24 bottom-10 h-80 w-80 rounded-full bg-violet-200/30 blur-3xl dark:bg-violet-500/10" />

      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-indigo-100/60 dark:border-indigo-500/10" />

      <div className="relative z-10 flex w-full max-w-md flex-col items-center text-center">
        <div className="mb-10 inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-white px-4 py-2 shadow-sm dark:border-indigo-500/20 dark:bg-slate-900 dark:shadow-black/20">
          <Sparkles className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />

          <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-indigo-600 dark:text-indigo-400">
            Your Digital Library
          </span>
        </div>

        <div className="relative flex h-36 w-36 items-center justify-center sm:h-40 sm:w-40">
          <div className="absolute inset-0 animate-spin rounded-full border-[3px] border-indigo-100 border-r-violet-500 border-t-indigo-600 dark:border-indigo-500/20 dark:border-r-violet-400 dark:border-t-indigo-400" />

          <div className="absolute inset-3 animate-[spin_3s_linear_infinite_reverse] rounded-full border-2 border-dashed border-indigo-200 dark:border-indigo-400/30" />

          <div className="absolute inset-7 rounded-full bg-indigo-200/40 blur-xl dark:bg-indigo-500/20" />

          <div className="relative flex h-24 w-24 items-center justify-center rounded-[28px] bg-gradient-to-br from-indigo-600 via-indigo-600 to-violet-600 shadow-2xl shadow-indigo-500/30 dark:from-indigo-500 dark:via-indigo-600 dark:to-violet-700 dark:shadow-indigo-950/40">
            <BookOpen
              className="h-11 w-11 text-white"
              strokeWidth={1.8}
            />

            <div className="absolute -right-2 -top-2 flex h-9 w-9 animate-bounce items-center justify-center rounded-xl border-4 border-[#f8f9fd] bg-amber-400 text-white dark:border-slate-950 dark:bg-amber-500">
              <Sparkles className="h-4 w-4" />
            </div>
          </div>
        </div>

        <div className="mt-10 flex items-center gap-2">
          <LibraryBig className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />

          <h1 className="text-3xl font-extrabold tracking-tight text-slate-950 dark:text-white">
            Book
            <span className="text-indigo-600 dark:text-indigo-400">
              Nook
            </span>
          </h1>
        </div>

        <h2 className="mt-6 text-xl font-bold text-slate-900 dark:text-slate-100 sm:text-2xl">
          Preparing Your Library
        </h2>

        <p className="mt-3 max-w-xs text-sm leading-7 text-slate-500 dark:text-slate-400">
          Gathering wonderful stories and getting everything ready for you.
        </p>

        <div className="mt-7 flex items-center gap-2">
          <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-indigo-600 dark:bg-indigo-400 [animation-delay:-0.3s]" />

          <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-violet-500 dark:bg-violet-400 [animation-delay:-0.15s]" />

          <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-indigo-400 dark:bg-indigo-300" />
        </div>

        <div className="mt-9 w-full max-w-[240px]">
          <div className="mb-3 flex items-center justify-between text-[11px] font-semibold text-slate-400 dark:text-slate-500">
            <span>Loading resources</span>

            <span className="text-indigo-600 dark:text-indigo-400">
              Please wait
            </span>
          </div>

          <div className="h-1.5 w-full overflow-hidden rounded-full bg-indigo-100 dark:bg-slate-800">
            <div className="h-full w-1/2 animate-pulse rounded-full bg-gradient-to-r from-indigo-600 to-violet-500 dark:from-indigo-400 dark:to-violet-400" />
          </div>
        </div>

        <p className="mt-10 text-xs font-medium tracking-wide text-slate-400 dark:text-slate-500">
          Every great story begins with a page.
        </p>
      </div>
    </main>
  );
}
