
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  BookMarked,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  Clock3,
  LibraryBig,
  Loader2,
  LockKeyhole,
  ShieldCheck,
  Sparkles,
  Tag,
  UserRound,
  X,
} from "lucide-react";

import { authClient } from "../../lib/auth-client";
import { apiClient } from "../../lib/api-client";

interface Book {
  _id: string;
  title: string;
  author: string;
  category: string;
  image: string;
  description: string;
  totalCopies: number;
  userName: string;
  userEmail: string;
  addedDate: string;
}

interface BorrowResponse {
  message?: string;
  insertedId?: string;
}

const cardClass =
  "rounded-2xl border border-slate-200 bg-white transition-colors dark:border-slate-800 dark:bg-slate-900";

const textClass = "text-slate-900 dark:text-white";
const mutedClass = "text-slate-500 dark:text-slate-400";

export default function BookDetailsClient({
  book,
}: {
  book: Book;
}) {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  const [openModal, setOpenModal] = useState(false);
  const [borrowing, setBorrowing] = useState(false);
  const [error, setError] = useState("");
  const [availableCopies, setAvailableCopies] = useState(
    book.totalCopies
  );
  const [coverError, setCoverError] = useState(false);

  useEffect(() => {
    setAvailableCopies(book.totalCopies);
  }, [book.totalCopies]);

  useEffect(() => {
    if (!openModal || borrowing) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpenModal(false);
        setError("");
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, [openModal, borrowing]);

  const handleOpenModal = () => {
    if (isPending) return;

    if (!user) {
      const callbackUrl = `/allBooks/${book._id}`;

      router.push(
        `/Authentication/signin?callbackUrl=${encodeURIComponent(
          callbackUrl
        )}`
      );
      return;
    }

    if (availableCopies <= 0) {
      toast.error("This book is currently unavailable.");
      return;
    }

    setError("");
    setOpenModal(true);
  };

  const handleBorrow = async () => {
    if (borrowing) return;

    if (!user) {
      setError("Please sign in before borrowing.");
      return;
    }

    if (availableCopies <= 0) {
      setError("This book is currently unavailable.");
      return;
    }

    setBorrowing(true);
    setError("");

    try {
      const result = await apiClient<BorrowResponse>(
        "/borrows",
        {
          method: "POST",
          body: JSON.stringify({
            bookId: book._id,
          }),
        }
      );

      setAvailableCopies((prev) =>
        Math.max(0, prev - 1)
      );

      setOpenModal(false);

      toast.success(
        result.message || "Book borrowed successfully!"
      );

      router.push("/myBorrow");
      router.refresh();
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again.";

      setError(message);
      toast.error(message);
    } finally {
      setBorrowing(false);
    }
  };

  const addedDate = book.addedDate
    ? new Date(book.addedDate)
    : null;

  const formattedDate =
    addedDate && !Number.isNaN(addedDate.getTime())
      ? addedDate.toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : "Not specified";

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f8f9fd] text-slate-900 transition-colors duration-300 dark:bg-slate-950 dark:text-slate-100">
      <div className="pointer-events-none absolute -left-40 top-28 h-96 w-96 rounded-full bg-indigo-100/70 blur-3xl dark:bg-indigo-600/10" />
      <div className="pointer-events-none absolute -right-40 top-96 h-96 w-96 rounded-full bg-violet-100/70 blur-3xl dark:bg-violet-600/10" />

      <div className="relative mx-auto max-w-7xl px-4 py-9 sm:px-6 lg:px-8 lg:py-14">
        <div className="mb-9 flex flex-wrap items-center justify-between gap-4">
          <Link
            href="/allBooks"
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400"
          >
            <ArrowLeft size={18} />
            Back to Library
          </Link>

          <span className="inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-white px-4 py-2 text-xs font-bold text-indigo-600 shadow-sm dark:border-indigo-500/20 dark:bg-slate-900 dark:text-indigo-400">
            <Sparkles size={14} />
            BookNook Collection
          </span>
        </div>

        <div className="grid items-start gap-9 lg:grid-cols-[minmax(0,430px)_minmax(0,1fr)] xl:gap-14">
          <div className="lg:sticky lg:top-24">
            <div className="relative overflow-hidden rounded-[32px] border border-indigo-100 bg-gradient-to-br from-indigo-100 via-violet-100 to-pink-100 p-8 shadow-xl shadow-indigo-100/40 dark:border-indigo-500/20 dark:from-slate-800 dark:via-indigo-950/60 dark:to-violet-950/50 dark:shadow-black/20 sm:p-12">
              <div className="pointer-events-none absolute -left-16 -top-16 h-48 w-48 rounded-full bg-indigo-300/30 blur-3xl dark:bg-indigo-500/20" />
              <div className="pointer-events-none absolute -bottom-20 -right-16 h-56 w-56 rounded-full bg-pink-300/30 blur-3xl dark:bg-pink-500/10" />

              <div className="relative mx-auto flex aspect-[3/4] w-full max-w-[300px] items-center justify-center overflow-hidden rounded-2xl bg-white/80 shadow-2xl shadow-indigo-950/20 dark:bg-slate-800">
                {book.image && !coverError ? (
                  <img
                    src={book.image}
                    alt={`Cover of ${book.title}`}
                    onError={() => setCoverError(true)}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center gap-4 p-6 text-center">
                    <BookOpen
                      size={64}
                      className="text-indigo-300 dark:text-indigo-400"
                    />
                    <span className={`text-sm font-semibold ${mutedClass}`}>
                      Cover unavailable
                    </span>
                  </div>
                )}
              </div>

              <div className="absolute right-5 top-5 rounded-full border border-white/70 bg-white/90 px-4 py-2 text-xs font-bold text-indigo-600 shadow-sm dark:border-slate-700 dark:bg-slate-900/90 dark:text-indigo-400">
                {book.category}
              </div>
            </div>

            <div className={`mt-5 flex items-center justify-between gap-4 p-5 shadow-sm ${cardClass}`}>
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-400">
                  <LibraryBig size={23} />
                </div>

                <div>
                  <p className={`text-xs font-medium ${mutedClass}`}>
                    Available Copies
                  </p>
                  <p className={`mt-1 text-xl font-extrabold ${textClass}`}>
                    {availableCopies}
                  </p>
                </div>
              </div>

              <span
                className={`rounded-full px-3 py-1.5 text-xs font-bold ${
                  availableCopies > 0
                    ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400"
                    : "bg-rose-50 text-rose-600 dark:bg-rose-500/15 dark:text-rose-400"
                }`}
              >
                {availableCopies > 0
                  ? "In Stock"
                  : "Unavailable"}
              </span>
            </div>
          </div>

          <div className="space-y-7">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-4 py-2 text-xs font-bold uppercase tracking-wider text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-400">
                <Tag size={14} />
                {book.category}
              </span>

              <h1 className="mt-6 text-4xl font-extrabold leading-tight tracking-tight text-slate-950 dark:text-white sm:text-5xl">
                {book.title}
              </h1>

              <div className="mt-5 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-violet-100 text-violet-600 dark:bg-violet-500/15 dark:text-violet-400">
                  <UserRound size={20} />
                </div>

                <div>
                  <p className="text-xs text-slate-400">
                    Written by
                  </p>
                  <p className="text-base font-bold text-slate-800 dark:text-slate-200">
                    {book.author}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              <div className={`${cardClass} p-4`}>
                <BookMarked
                  size={19}
                  className="text-indigo-600 dark:text-indigo-400"
                />
                <p className="mt-3 text-xs text-slate-400">
                  Category
                </p>
                <p className="mt-1 truncate text-sm font-bold text-slate-800 dark:text-slate-200">
                  {book.category}
                </p>
              </div>

              <div className={`${cardClass} p-4`}>
                <LibraryBig
                  size={19}
                  className="text-violet-600 dark:text-violet-400"
                />
                <p className="mt-3 text-xs text-slate-400">
                  Copies Left
                </p>
                <p className="mt-1 text-sm font-bold text-slate-800 dark:text-slate-200">
                  {availableCopies}
                </p>
              </div>

              <div className={`${cardClass} col-span-2 p-4 sm:col-span-1`}>
                <CalendarDays
                  size={19}
                  className="text-emerald-600 dark:text-emerald-400"
                />
                <p className="mt-3 text-xs text-slate-400">
                  Added On
                </p>
                <p className="mt-1 text-sm font-bold text-slate-800 dark:text-slate-200">
                  {formattedDate}
                </p>
              </div>
            </div>

            <section className={`${cardClass} rounded-[28px] p-6 shadow-sm sm:p-8`}>
              <div className="mb-5 flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-400">
                  <BookOpen size={20} />
                </span>

                <h2 className={`text-xl ${textClass} font-bold`}>
                  About This Book
                </h2>
              </div>

              <p className="whitespace-pre-line text-sm leading-8 text-slate-600 dark:text-slate-300 sm:text-base">
                {book.description}
              </p>
            </section>

            <section className={`${cardClass} rounded-[28px] p-6 shadow-sm sm:p-8`}>
              <div className="mb-5 flex items-center justify-between gap-3">
                <h2 className={`text-lg font-bold ${textClass}`}>
                  Shared by Our Community
                </h2>

                <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400">
                  Contributor
                </span>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white">
                  <UserRound size={26} />
                </div>

                <div className="min-w-0">
                  <p className={`truncate font-bold ${textClass}`}>
                    {book.userName || "BookNook Member"}
                  </p>

                  <p className={`mt-1 text-xs ${mutedClass}`}>
                    Added to the BookNook library
                  </p>
                </div>
              </div>
            </section>

            <section className="overflow-hidden rounded-[28px] bg-[#171b3d] p-6 text-white shadow-xl shadow-indigo-950/10 dark:border dark:border-indigo-500/20 dark:bg-[#111936] sm:p-8">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-indigo-300">
                    <Sparkles size={14} />
                    Your Next Read
                  </span>

                  <h2 className="mt-3 text-2xl font-bold">
                    Ready to start reading?
                  </h2>

                  <p className="mt-3 max-w-md text-sm leading-7 text-indigo-100/75">
                    Borrow this book from our community
                    library and enjoy your next literary
                    adventure.
                  </p>
                </div>

                <div className="hidden rounded-2xl bg-white/10 p-3 sm:block">
                  <BookOpen
                    size={26}
                    className="text-indigo-200"
                  />
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-4 border-t border-white/10 pt-5 text-xs text-indigo-100/80">
                <span className="inline-flex items-center gap-2">
                  <Clock3 size={16} />
                  7-day borrowing period
                </span>

                <span className="inline-flex items-center gap-2">
                  <ShieldCheck size={16} />
                  Secure borrowing
                </span>
              </div>

              <button
                type="button"
                onClick={handleOpenModal}
                disabled={
                  availableCopies <= 0 ||
                  isPending ||
                  borrowing
                }
                className="group mt-7 inline-flex w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-indigo-500 to-violet-500 px-6 py-4 text-sm font-bold text-white shadow-lg shadow-indigo-950/20 transition-all hover:from-indigo-400 hover:to-violet-400 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isPending ? (
                  <>
                    <Loader2
                      size={19}
                      className="animate-spin"
                    />
                    Checking Session...
                  </>
                ) : availableCopies <= 0 ? (
                  <>
                    <AlertCircle size={19} />
                    Currently Unavailable
                  </>
                ) : (
                  <>
                    <BookOpen size={19} />
                    Borrow This Book
                    <ArrowRight
                      size={18}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  </>
                )}
              </button>

              {!user && !isPending && (
                <p className="mt-4 flex items-center justify-center gap-2 text-center text-xs text-indigo-200/80">
                  <LockKeyhole size={14} />
                  Sign in required to borrow
                </p>
              )}
            </section>
          </div>
        </div>
      </div>

      {openModal && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-slate-950/70 p-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (
              event.target === event.currentTarget &&
              !borrowing
            ) {
              setOpenModal(false);
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="borrow-modal-title"
            className="my-auto w-full max-w-lg overflow-hidden rounded-[28px] bg-white text-slate-900 shadow-2xl dark:border dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
          >
            <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-6 py-6 dark:border-slate-800 sm:px-8">
              <div>
                <span className="text-xs font-bold uppercase tracking-[0.15em] text-indigo-600 dark:text-indigo-400">
                  BookNook Library
                </span>

                <h2
                  id="borrow-modal-title"
                  className="mt-2 text-2xl font-extrabold text-slate-900 dark:text-white"
                >
                  Confirm Borrowing
                </h2>

                <p className={`mt-2 text-sm ${mutedClass}`}>
                  Review your details before continuing.
                </p>
              </div>

              <button
                type="button"
                aria-label="Close modal"
                onClick={() => setOpenModal(false)}
                disabled={borrowing}
                className="rounded-xl p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50 dark:hover:bg-slate-800 dark:hover:text-white"
              >
                <X size={21} />
              </button>
            </div>

            <div className="space-y-6 p-6 sm:p-8">
              <div className="flex items-center gap-4 rounded-2xl bg-indigo-50 p-4 dark:bg-indigo-500/10">
                <div className="h-24 w-16 shrink-0 overflow-hidden rounded-lg bg-indigo-100 shadow-sm dark:bg-slate-800">
                  {book.image && !coverError ? (
                    <img
                      src={book.image}
                      alt={book.title}
                      onError={() => setCoverError(true)}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <BookOpen
                        size={25}
                        className="text-indigo-300 dark:text-indigo-400"
                      />
                    </div>
                  )}
                </div>

                <div className="min-w-0">
                  <p className={`line-clamp-2 font-bold ${textClass}`}>
                    {book.title}
                  </p>

                  <p className={`mt-1 text-sm ${mutedClass}`}>
                    By {book.author}
                  </p>

                  <span className="mt-3 inline-flex rounded-full bg-white px-3 py-1 text-[11px] font-bold text-indigo-600 dark:bg-slate-800 dark:text-indigo-400">
                    {book.category}
                  </span>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Borrower Name
                  </label>

                  <input
                    readOnly
                    value={user?.name || ""}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Email Address
                  </label>

                  <input
                    readOnly
                    value={user?.email || ""}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                  />
                </div>
              </div>

              <div className="rounded-2xl border border-indigo-100 bg-indigo-50/50 p-4 dark:border-indigo-500/20 dark:bg-indigo-500/10">
                <div className="flex items-start gap-3">
                  <CalendarDays
                    size={20}
                    className="mt-0.5 shrink-0 text-indigo-600 dark:text-indigo-400"
                  />

                  <div>
                    <p className={`text-sm font-bold ${textClass}`}>
                      Borrowing Period
                    </p>

                    <p className="mt-1 text-xs leading-6 text-slate-600 dark:text-slate-300">
                      Your borrow date and return deadline
                      will be recorded automatically.
                      Please return the book within 7 days.
                    </p>
                  </div>
                </div>
              </div>

              {error && (
                <div
                  role="alert"
                  className="flex items-start gap-3 rounded-xl border border-rose-100 bg-rose-50 p-4 text-sm text-rose-700 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-400"
                >
                  <AlertCircle
                    size={19}
                    className="mt-0.5 shrink-0"
                  />
                  <span>{error}</span>
                </div>
              )}

              <div className="flex flex-col-reverse gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={() => setOpenModal(false)}
                  disabled={borrowing}
                  className="flex-1 rounded-2xl border border-slate-200 px-5 py-3.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleBorrow}
                  disabled={borrowing}
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-5 py-3.5 text-sm font-bold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {borrowing ? (
                    <>
                      <Loader2
                        size={18}
                        className="animate-spin"
                      />
                      Borrowing...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 size={18} />
                      Confirm Borrow
                    </>
                  )}
                </button>
              </div>

              <p className="flex items-center justify-center gap-2 text-center text-[11px] text-slate-400">
                <ShieldCheck size={14} />
                Protected by JWT authentication
              </p>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
