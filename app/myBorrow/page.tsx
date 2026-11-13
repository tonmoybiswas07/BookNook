
"use client";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  Clock3,
  LibraryBig,
  Loader2,
  RefreshCw,
  RotateCcw,
  Search,
  Sparkles,
  Trash2,
  X,
} from "lucide-react";

import { toast } from "react-toastify";
import { authClient } from "@/app/lib/auth-client";
import { apiClient } from "@/app/lib/api-client";

interface Borrow {
  _id: string;
  bookId: string;
  bookTitle: string;
  bookImage: string;
  userEmail: string;
  borrowDate: string;
  returnDate: string;
}

type ActionType = "return" | "delete";

const formatDate = (date: string) => {
  const value = new Date(date);

  if (Number.isNaN(value.getTime())) {
    return "N/A";
  }

  return value.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const isOverdue = (date: string) => {
  const returnDate = new Date(date);

  if (Number.isNaN(returnDate.getTime())) {
    return false;
  }

  return returnDate.getTime() < Date.now();
};

export default function MyBorrowsPage() {
  const router = useRouter();

  const { data: session, isPending } =
    authClient.useSession();

  const user = session?.user;

  const [borrows, setBorrows] = useState<Borrow[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [processing, setProcessing] = useState(false);

  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const [selectedBook, setSelectedBook] =
    useState<Borrow | null>(null);

  const [actionType, setActionType] =
    useState<ActionType>("return");

  const fetchBorrows = useCallback(
    async (showRefresh = false) => {
      if (!user?.email) return;

      if (showRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      try {
        // JWT is automatically attached
        const data = await apiClient<Borrow[]>(
          "/borrows",
          { method: "GET" }
        );

        setBorrows(
          Array.isArray(data) ? data : []
        );
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to fetch borrowed books"
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [user?.email]
  );

  useEffect(() => {
    if (isPending) return;

    if (!user) {
      setLoading(false);

      router.replace(
        "/Authentication/signin?callbackUrl=/myBorrow"
      );

      return;
    }

    void fetchBorrows();
  }, [isPending, user, fetchBorrows, router]);

  const openModal = (
    borrow: Borrow,
    action: ActionType
  ) => {
    setSelectedBook(borrow);
    setActionType(action);
  };

  const closeModal = () => {
    if (processing) return;
    setSelectedBook(null);
  };

  const handleConfirmAction = async () => {
    if (!selectedBook || processing) return;

    const borrowId = selectedBook._id;
    const isReturn = actionType === "return";

    try {
      setProcessing(true);

      const endpoint = isReturn
        ? `/borrows/${borrowId}/return`
        : `/borrows/${borrowId}`;

      await apiClient(endpoint, {
        method: isReturn ? "PATCH" : "DELETE",
      });

      setBorrows((prev) =>
        prev.filter(
          (borrow) => borrow._id !== borrowId
        )
      );

      setSelectedBook(null);

      toast.success(
        isReturn
          ? "Book returned successfully!"
          : "Borrow record deleted successfully!"
      );

      router.refresh();
    } catch (err) {
      toast.error(
        err instanceof Error
          ? err.message
          : "Something went wrong"
      );
    } finally {
      setProcessing(false);
    }
  };

  const filteredBorrows = borrows.filter(
    (borrow) =>
      borrow.bookTitle
        .toLowerCase()
        .includes(search.toLowerCase().trim())
  );

  const overdueCount = borrows.filter(
    (borrow) => isOverdue(borrow.returnDate)
  ).length;

  const dueSoonCount = borrows.filter(
    (borrow) => {
      const due = new Date(
        borrow.returnDate
      ).getTime();

      const remaining = due - Date.now();

      return (
        Number.isFinite(due) &&
        remaining >= 0 &&
        remaining <= 3 * 24 * 60 * 60 * 1000
      );
    }
  ).length;

  if (isPending || (user && loading)) {
    return (
      <main className="flex min-h-[75vh] flex-col items-center justify-center gap-4 bg-[#f8f9fd]">
        <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-indigo-50">
          <Loader2
            size={36}
            className="animate-spin text-indigo-600"
          />
        </div>

        <h2 className="text-lg font-bold text-slate-900">
          Loading Your Borrows
        </h2>

        <p className="text-sm text-slate-500">
          Fetching your reading collection...
        </p>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="flex min-h-[75vh] items-center justify-center bg-[#f8f9fd] px-4">
        <div className="w-full max-w-md rounded-[28px] border border-slate-200 bg-white p-8 text-center shadow-xl shadow-slate-200/50">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
            <BookOpen size={36} />
          </div>

          <h1 className="mt-6 text-2xl font-extrabold text-slate-900">
            Sign In Required
          </h1>

          <p className="mt-3 text-sm leading-7 text-slate-500">
            Please sign in to view, manage,
            and return your borrowed books.
          </p>

          <Link
            href="/Authentication/signin?callbackUrl=/myBorrow"
            className="mt-7 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-7 py-3.5 text-sm font-bold text-white transition hover:bg-indigo-700"
          >
            Sign In
            <ArrowRight size={17} />
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f8f9fd] pb-24 pt-12">
      {/* Background decorations */}
      <div className="pointer-events-none absolute -left-32 top-24 h-80 w-80 rounded-full bg-indigo-100/50 blur-3xl" />
      <div className="pointer-events-none absolute -right-32 bottom-20 h-80 w-80 rounded-full bg-violet-100/50 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <Link
          href="/allBooks"
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-indigo-600"
        >
          <ArrowLeft size={16} />
          Explore Library
        </Link>

        <div className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-white px-4 py-2 text-xs font-bold uppercase tracking-[0.15em] text-indigo-600 shadow-sm">
              <Sparkles size={14} />
              My Reading Collection
            </span>

            <h1 className="mt-5 text-4xl font-extrabold tracking-tight text-slate-950 sm:text-5xl">
              My{" "}
              <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                Borrows
              </span>
            </h1>

            <p className="mt-4 max-w-xl text-sm leading-7 text-slate-500 sm:text-base">
              Keep track of your borrowed books,
              check return dates, and manage
              your reading journey in one place.
            </p>
          </div>

          <Link
            href="/allBooks"
            className="inline-flex w-fit items-center gap-2 rounded-2xl bg-indigo-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-indigo-500/20 transition hover:-translate-y-0.5 hover:bg-indigo-700"
          >
            <Search size={18} />
            Explore Books
            <ArrowRight size={17} />
          </Link>
        </div>

        {/* Statistics */}
        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
              <LibraryBig size={27} />
            </div>

            <div>
              <p className="text-sm font-medium text-slate-500">
                Borrowed Books
              </p>
              <p className="mt-1 text-3xl font-extrabold text-slate-900">
                {borrows.length}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
              <Clock3 size={27} />
            </div>

            <div>
              <p className="text-sm font-medium text-slate-500">
                Due Soon
              </p>
              <p className="mt-1 text-3xl font-extrabold text-slate-900">
                {dueSoonCount}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50 text-rose-600">
              <AlertTriangle size={27} />
            </div>

            <div>
              <p className="text-sm font-medium text-slate-500">
                Overdue Books
              </p>
              <p className="mt-1 text-3xl font-extrabold text-slate-900">
                {overdueCount}
              </p>
            </div>
          </div>
        </div>

        {/* Collection */}
        <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col justify-between gap-5 border-b border-slate-100 p-6 md:flex-row md:items-center">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900">
                Borrowed Collection
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                All your active borrowed books
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative flex-1 sm:w-64">
                <Search
                  size={18}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="search"
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
                  placeholder="Search borrowed books..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:bg-white"
                />
              </div>

              <button
                type="button"
                onClick={() =>
                  void fetchBorrows(true)
                }
                disabled={refreshing}
                title="Refresh borrows"
                aria-label="Refresh borrows"
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:border-indigo-300 hover:text-indigo-600 disabled:opacity-50"
              >
                <RefreshCw
                  size={18}
                  className={
                    refreshing ? "animate-spin" : ""
                  }
                />
              </button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="m-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-rose-200 bg-rose-50 p-5">
              <div className="flex items-center gap-3 text-sm text-rose-700">
                <AlertTriangle size={20} />
                {error}
              </div>

              <button
                type="button"
                onClick={() =>
                  void fetchBorrows(true)
                }
                className="text-sm font-bold text-rose-700 underline"
              >
                Try Again
              </button>
            </div>
          )}

          {/* Empty */}
          {!error && borrows.length === 0 && (
            <div className="px-6 py-20 text-center">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
                <BookOpen size={36} />
              </div>

              <h3 className="mt-6 text-2xl font-extrabold text-slate-900">
                Your Reading Shelf Is Empty
              </h3>

              <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-slate-500">
                You haven&apos;t borrowed any books
                yet. Explore our collection and
                find your next great read.
              </p>

              <Link
                href="/allBooks"
                className="mt-7 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3.5 text-sm font-bold text-white transition hover:bg-indigo-700"
              >
                Browse Books
                <ArrowRight size={17} />
              </Link>
            </div>
          )}

          {/* Search Empty */}
          {!error &&
            borrows.length > 0 &&
            filteredBorrows.length === 0 && (
              <div className="px-6 py-16 text-center">
                <Search
                  size={35}
                  className="mx-auto text-slate-300"
                />

                <h3 className="mt-4 text-lg font-bold text-slate-900">
                  No Matching Books
                </h3>

                <p className="mt-2 text-sm text-slate-500">
                  Try searching with another title.
                </p>

                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="mt-4 text-sm font-bold text-indigo-600"
                >
                  Clear Search
                </button>
              </div>
            )}

          {/* Table */}
          {filteredBorrows.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[850px] text-left">
                <thead className="bg-slate-50">
                  <tr className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    <th className="px-6 py-5">
                      Book Details
                    </th>
                    <th className="px-6 py-5">
                      Borrow Date
                    </th>
                    <th className="px-6 py-5">
                      Return Date
                    </th>
                    <th className="px-6 py-5">
                      Status
                    </th>
                    <th className="px-6 py-5 text-center">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {filteredBorrows.map(
                    (borrow, index) => {
                      const overdue = isOverdue(
                        borrow.returnDate
                      );

                      return (
                        <tr
                          key={borrow._id}
                          className="transition hover:bg-indigo-50/30"
                        >
                          <td className="px-6 py-5">
                            <div className="flex items-center gap-4">
                              <span className="hidden w-5 text-xs font-bold text-slate-300 sm:block">
                                {String(
                                  index + 1
                                ).padStart(2, "0")}
                              </span>

                              <div className="h-20 w-14 shrink-0 overflow-hidden rounded-lg bg-indigo-50 shadow-sm">
                                {borrow.bookImage ? (
                                  // eslint-disable-next-line @next/next/no-img-element
                                  <img
                                    src={
                                      borrow.bookImage
                                    }
                                    alt={
                                      borrow.bookTitle
                                    }
                                    className="h-full w-full object-cover"
                                  />
                                ) : (
                                  <div className="flex h-full w-full items-center justify-center text-indigo-400">
                                    <BookOpen size={22} />
                                  </div>
                                )}
                              </div>

                              <div className="min-w-0">
                                <Link
                                  href={`/allBooks/${borrow.bookId}`}
                                  className="block max-w-[200px] truncate text-sm font-bold text-slate-900 transition hover:text-indigo-600"
                                >
                                  {borrow.bookTitle}
                                </Link>

                                <p className="mt-2 text-xs text-slate-400">
                                  Borrowed Book
                                </p>
                              </div>
                            </div>
                          </td>

                          <td className="px-6 py-5">
                            <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
                              <CalendarDays
                                size={16}
                                className="text-indigo-400"
                              />

                              {formatDate(
                                borrow.borrowDate
                              )}
                            </div>
                          </td>

                          <td className="px-6 py-5">
                            <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
                              <CalendarDays
                                size={16}
                                className="text-slate-400"
                              />

                              {formatDate(
                                borrow.returnDate
                              )}
                            </div>
                          </td>

                          <td className="px-6 py-5">
                            <span
                              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold ${
                                overdue
                                  ? "bg-rose-50 text-rose-600"
                                  : "bg-emerald-50 text-emerald-600"
                              }`}
                            >
                              {overdue ? (
                                <AlertTriangle
                                  size={13}
                                />
                              ) : (
                                <CheckCircle2
                                  size={13}
                                />
                              )}

                              {overdue
                                ? "Overdue"
                                : "Active"}
                            </span>
                          </td>

                          <td className="px-6 py-5">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                type="button"
                                onClick={() =>
                                  openModal(
                                    borrow,
                                    "return"
                                  )
                                }
                                className="inline-flex items-center gap-2 rounded-xl bg-indigo-50 px-4 py-2.5 text-sm font-bold text-indigo-600 transition hover:bg-indigo-100"
                              >
                                <RotateCcw
                                  size={16}
                                />
                                Return
                              </button>

                              <button
                                type="button"
                                onClick={() =>
                                  openModal(
                                    borrow,
                                    "delete"
                                  )
                                }
                                className="inline-flex items-center gap-2 rounded-xl bg-rose-50 px-4 py-2.5 text-sm font-bold text-rose-600 transition hover:bg-rose-100"
                              >
                                <Trash2
                                  size={16}
                                />
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    }
                  )}
                </tbody>
              </table>
            </div>
          )}

          {borrows.length > 0 && (
            <div className="border-t border-slate-100 bg-slate-50/50 px-6 py-4 text-xs text-slate-500">
              Showing {filteredBorrows.length} of{" "}
              {borrows.length} borrowed books
            </div>
          )}
        </div>

        <p className="mt-8 text-center text-xs text-slate-400">
          BookNook — Every book has a story
          worth sharing.
        </p>
      </div>

      {/* Confirmation Modal */}
      {selectedBook && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-950/65 p-4 backdrop-blur-sm">
          <div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="borrow-action-title"
            className="w-full max-w-md rounded-[28px] bg-white p-7 text-center shadow-2xl sm:p-9"
          >
            <div
              className={`mx-auto flex h-20 w-20 items-center justify-center rounded-2xl ${
                actionType === "return"
                  ? "bg-indigo-50 text-indigo-600"
                  : "bg-rose-50 text-rose-600"
              }`}
            >
              {actionType === "return" ? (
                <RotateCcw size={35} />
              ) : (
                <Trash2 size={35} />
              )}
            </div>

            <h2
              id="borrow-action-title"
              className="mt-6 text-2xl font-extrabold text-slate-900"
            >
              {actionType === "return"
                ? "Return This Book?"
                : "Delete Borrow Record?"}
            </h2>

            <p className="mt-4 text-sm leading-7 text-slate-500">
              {actionType === "return"
                ? "Are you sure you want to return "
                : "Are you sure you want to delete the borrow record for "}

              <strong className="text-slate-900">
                {selectedBook.bookTitle}
              </strong>

              {actionType === "return"
                ? "? The book will be removed from your active borrows."
                : "? This action cannot be undone."}
            </p>

            <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row">
              <button
                type="button"
                onClick={closeModal}
                disabled={processing}
                className="flex-1 rounded-xl border border-slate-200 px-5 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleConfirmAction}
                disabled={processing}
                className={`inline-flex flex-1 items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-bold text-white transition disabled:opacity-60 ${
                  actionType === "return"
                    ? "bg-indigo-600 hover:bg-indigo-700"
                    : "bg-rose-600 hover:bg-rose-700"
                }`}
              >
                {processing ? (
                  <>
                    <Loader2
                      size={17}
                      className="animate-spin"
                    />
                    Processing...
                  </>
                ) : actionType === "return" ? (
                  <>
                    <RotateCcw size={17} />
                    Confirm Return
                  </>
                ) : (
                  <>
                    <Trash2 size={17} />
                    Confirm Delete
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
