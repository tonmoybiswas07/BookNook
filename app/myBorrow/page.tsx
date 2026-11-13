
"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowUpRight,
  BookOpen,
  CalendarDays,
  Loader2,
  RotateCcw,
  Trash2,
  X,
  CheckCircle2,
} from "lucide-react";

import { authClient } from "../lib/auth-client";

const API_URL = "http://localhost:8000";

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

export default function MyBorrowsPage() {
  const { data: session, isPending } =
    authClient.useSession();

  const email = session?.user?.email;

  const [borrows, setBorrows] = useState<Borrow[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedBook, setSelectedBook] =
    useState<Borrow | null>(null);

  const [actionType, setActionType] =
    useState<ActionType>("return");

  const [processing, setProcessing] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // GET borrowed books
  const fetchBorrows = useCallback(async () => {
    if (!email) {
      setBorrows([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const res = await fetch(
        `${API_URL}/borrows?email=${encodeURIComponent(email)}`,
        {
          cache: "no-store",
        }
      );

      if (!res.ok) {
        throw new Error("Failed to fetch borrowed books");
      }

      const data: Borrow[] = await res.json();

      setBorrows(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  }, [email]);

  useEffect(() => {
    if (isPending) return;

    void fetchBorrows();
  }, [isPending, fetchBorrows]);

  // Open modal
  const openModal = (
    book: Borrow,
    action: ActionType
  ) => {
    setActionType(action);
    setSelectedBook(book);
    setError("");
    setSuccess("");
  };

 
const handleConfirmAction = async () => {
  if (!selectedBook || !email || processing) return;

  try {
    setProcessing(true);
    setError("");
    setSuccess("");

    const isReturn = actionType === "return";

    const url = isReturn
      ? `${API_URL}/borrows/${selectedBook._id}/return`
      : `${API_URL}/borrows/${selectedBook._id}`;

    const res = await fetch(url, {
      method: isReturn ? "PATCH" : "DELETE",
      headers: {
        "x-user-email": email,
      },
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(
        data.message ||
          (isReturn
            ? "Failed to return book"
            : "Failed to delete borrow")
      );
    }

    // Update table immediately
    setBorrows((prev) =>
      prev.filter(
        (book) => book._id !== selectedBook._id
      )
    );

    setSuccess(
      isReturn
        ? "Book returned successfully! Available copies increased by 1."
        : "Borrow record deleted successfully!"
    );

    setSelectedBook(null);
  } catch (err) {
    setError(
      err instanceof Error
        ? err.message
        : "Something went wrong"
    );
  } finally {
    setProcessing(false);
  }
};


  // Loading
  if (isPending || loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-[#f8fafc]">
        <div className="flex flex-col items-center gap-4">
          <Loader2
            size={36}
            className="animate-spin text-indigo-600"
          />

          <p className="text-sm text-slate-500">
            Loading your books...
          </p>
        </div>
      </div>
    );
  }

  // Not logged in
  if (!session?.user) {
    return (
      <main className="flex min-h-[70vh] flex-col items-center justify-center gap-4 px-4 text-center">
        <div className="rounded-2xl bg-indigo-50 p-5">
          <BookOpen
            size={40}
            className="text-indigo-600"
          />
        </div>

        <h1 className="text-2xl font-bold text-slate-900">
          Sign in to view your books
        </h1>

        <p className="text-sm text-slate-500">
          Please sign in to manage your borrowed books.
        </p>

        <Link
          href="/login"
          className="rounded-xl bg-indigo-600 px-6 py-3 font-semibold text-white transition hover:bg-indigo-700"
        >
          Sign In
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f8fafc] px-4 py-12 sm:px-6 lg:py-16">
      <div className="mx-auto max-w-6xl">

        {/* Header */}
        <Link
          href="/books"
          className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-indigo-600"
        >
          <ArrowLeft size={17} />
          Explore Library
        </Link>

        <div className="mb-9 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <div className="mb-3 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-indigo-600" />

              <span className="text-xs font-bold uppercase tracking-[0.2em] text-indigo-600">
                Personal Library
              </span>
            </div>

            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
              My{" "}
              <span className="text-indigo-600">
                Borrows.
              </span>
            </h1>

            <p className="mt-3 text-sm text-slate-500 sm:text-base">
              A little space for the books you're reading.
            </p>
          </div>

          {/* Book count */}
          <div className="flex w-fit items-center gap-3 rounded-2xl border border-indigo-100 bg-indigo-50 px-5 py-3">
            <BookOpen
              size={22}
              className="text-indigo-600"
            />

            <div>
              <p className="text-xs text-slate-500">
                Borrowed Books
              </p>

              <p className="text-xl font-bold text-slate-900">
                {borrows.length}
              </p>
            </div>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-5 flex items-center justify-between gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
            <span>{error}</span>

            <button
              type="button"
              onClick={() => setError("")}
              aria-label="Close error"
            >
              <X size={18} />
            </button>
          </div>
        )}

        {/* Success */}
        {success && (
          <div className="mb-5 flex items-center justify-between gap-3 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700">
            <span className="flex items-center gap-2">
              <CheckCircle2 size={18} />
              {success}
            </span>

            <button
              type="button"
              onClick={() => setSuccess("")}
              aria-label="Close success message"
            >
              <X size={18} />
            </button>
          </div>
        )}

        {/* Table container */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

          <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Borrowed Collection
              </h2>

              <p className="mt-1 text-xs text-slate-400">
                Your current reading shelf
              </p>
            </div>

            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
              {borrows.length} Books
            </span>
          </div>

          {/* Empty state */}
          {borrows.length === 0 ? (
            <div className="flex flex-col items-center px-5 py-20 text-center">
              <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-2xl bg-indigo-50">
                <BookOpen
                  size={35}
                  className="text-indigo-500"
                />
              </div>

              <h3 className="text-xl font-bold text-slate-900">
                Your shelf is empty
              </h3>

              <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">
                You haven't borrowed any books yet.
                Discover something interesting to read.
              </p>

              <Link
                href="/books"
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
              >
                Browse Books
                <ArrowUpRight size={17} />
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px] text-left">

                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/70 text-xs uppercase tracking-wider text-slate-400">
                    <th className="px-6 py-4 font-semibold">
                      Book
                    </th>

                    <th className="px-6 py-4 font-semibold">
                      Borrow Date
                    </th>

                    <th className="px-6 py-4 font-semibold">
                      Return Date
                    </th>

                    <th className="px-6 py-4 text-right font-semibold">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {borrows.map((borrow, index) => (
                    <tr
                      key={borrow._id}
                      className="group transition hover:bg-indigo-50/30"
                    >

                      {/* Book image and title */}
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-4">
                          <span className="hidden w-5 text-xs font-semibold text-slate-300 sm:block">
                            {String(index + 1).padStart(2, "0")}
                          </span>

                          <img
                            src={borrow.bookImage}
                            alt={borrow.bookTitle}
                            className="h-[76px] w-[54px] shrink-0 rounded-md bg-slate-100 object-cover shadow-sm"
                          />

                          <div>
                            <Link
                              href={`/books/${borrow.bookId}`}
                              className="font-bold text-slate-900 transition group-hover:text-indigo-600"
                            >
                              {borrow.bookTitle}
                            </Link>

                            <p className="mt-1 text-xs text-slate-400">
                              Borrowed book
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Borrow date */}
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <CalendarDays
                            size={16}
                            className="text-indigo-400"
                          />

                          {formatDate(borrow.borrowDate)}
                        </div>
                      </td>

                      {/* Return date */}
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <CalendarDays
                            size={16}
                            className="text-slate-400"
                          />

                          {formatDate(borrow.returnDate)}
                        </div>
                      </td>

                      {/* Return + Delete */}
                      <td className="px-6 py-5 text-right">
                        <div className="flex items-center justify-end gap-2">

                          <button
                            type="button"
                            onClick={() =>
                              openModal(borrow, "return")
                            }
                            className="inline-flex items-center gap-2 rounded-lg border border-indigo-200 bg-indigo-50 px-4 py-2.5 text-sm font-semibold text-indigo-600 transition hover:border-indigo-600 hover:bg-indigo-600 hover:text-white"
                          >
                            <RotateCcw size={16} />
                            Return
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              openModal(borrow, "delete")
                            }
                            className="inline-flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:border-red-600 hover:bg-red-600 hover:text-white"
                          >
                            <Trash2 size={16} />
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <p className="mt-5 text-center text-xs text-slate-400">
          BookNook — Every book has a story worth sharing.
        </p>
      </div>

      {/* Confirmation modal */}
      {selectedBook && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
          <div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="action-modal-title"
            className="w-full max-w-sm rounded-3xl bg-white p-7 text-center shadow-2xl"
          >

            {/* Modal icon */}
            <div
              className={`mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl ${
                actionType === "return"
                  ? "bg-indigo-50"
                  : "bg-red-50"
              }`}
            >
              {actionType === "return" ? (
                <RotateCcw
                  size={30}
                  className="text-indigo-600"
                />
              ) : (
                <Trash2
                  size={30}
                  className="text-red-600"
                />
              )}
            </div>

            {/* Modal title */}
            <h2
              id="action-modal-title"
              className="text-2xl font-bold text-slate-900"
            >
              {actionType === "return"
                ? "Return this book?"
                : "Delete this borrow?"}
            </h2>

            {/* Modal description */}
            <p className="mt-3 text-sm leading-7 text-slate-500">
              {actionType === "return"
                ? "Are you sure you want to return "
                : "Are you sure you want to delete the borrow record for "}

              <span className="font-semibold text-slate-900">
                {selectedBook.bookTitle}
              </span>

              {actionType === "return"
                ? "? This book will be removed from your borrowed collection."
                : "? This record will be removed from your borrowed collection."}
            </p>

            {/* Modal buttons */}
            <div className="mt-7 flex gap-3">
              <button
                type="button"
                disabled={processing}
                onClick={() => setSelectedBook(null)}
                className="flex-1 rounded-xl border border-slate-200 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-60"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleConfirmAction}
                disabled={processing}
                className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold text-white transition disabled:opacity-60 ${
                  actionType === "return"
                    ? "bg-indigo-600 hover:bg-indigo-700"
                    : "bg-red-600 hover:bg-red-700"
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
                    <RotateCcw size={16} />
                    Confirm Return
                  </>
                ) : (
                  <>
                    <Trash2 size={16} />
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
