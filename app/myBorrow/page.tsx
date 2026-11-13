
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
  const [returningId, setReturningId] = useState<string | null>(
    null
  );
  const [selectedBook, setSelectedBook] =
    useState<Borrow | null>(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Fetch borrowed books
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

      const data = await res.json();

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

  // Return borrowed book
  const handleReturn = async () => {
    if (!selectedBook || !email || returningId) return;

    try {
      setReturningId(selectedBook._id);
      setError("");
      setSuccess("");

      const res = await fetch(
        `${API_URL}/borrows/${selectedBook._id}`,
        {
          method: "DELETE",
          headers: {
            "x-user-email": email,
          },
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.message || "Failed to return book"
        );
      }

      setBorrows((prev) =>
        prev.filter(
          (book) => book._id !== selectedBook._id
        )
      );

      setSelectedBook(null);
      setSuccess("Book returned successfully!");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to return book"
      );
    } finally {
      setReturningId(null);
    }
  };

  if (isPending || loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-[#f8fafc]">
        <Loader2
          size={36}
          className="animate-spin text-indigo-600"
        />
      </div>
    );
  }

  if (!session?.user) {
    return (
      <main className="flex min-h-[70vh] flex-col items-center justify-center gap-4 px-4 text-center">
        <BookOpen size={44} className="text-indigo-600" />

        <h1 className="text-2xl font-bold text-slate-900">
          Sign in to view your books
        </h1>

        <Link
          href="/login"
          className="rounded-xl bg-indigo-600 px-6 py-3 font-semibold text-white"
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
              My <span className="text-indigo-600">Borrows.</span>
            </h1>

            <p className="mt-3 text-sm text-slate-500 sm:text-base">
              A little space for the books you're reading.
            </p>
          </div>

          <div className="flex w-fit items-center gap-3 rounded-2xl border border-indigo-100 bg-indigo-50 px-5 py-3">
            <BookOpen size={22} className="text-indigo-600" />

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

        {/* Messages */}
        {error && (
          <div className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-5 flex items-center justify-between gap-3 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700">
            <span className="flex items-center gap-2">
              <CheckCircle2 size={18} />
              {success}
            </span>

            <button
              onClick={() => setSuccess("")}
              aria-label="Dismiss message"
            >
              <X size={17} />
            </button>
          </div>
        )}

        {/* Table */}
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
              <table className="w-full min-w-[700px] text-left">

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

                      {/* Book */}
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

                      {/* Borrow Date */}
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <CalendarDays
                            size={16}
                            className="text-indigo-400"
                          />
                          {formatDate(borrow.borrowDate)}
                        </div>
                      </td>

                      {/* Return Date */}
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <CalendarDays
                            size={16}
                            className="text-slate-400"
                          />
                          {formatDate(borrow.returnDate)}
                        </div>
                      </td>

                      {/* Return Button */}
                      <td className="px-6 py-5 text-right">
                        <button
                          type="button"
                          onClick={() => setSelectedBook(borrow)}
                          className="inline-flex items-center gap-2 rounded-xl border border-indigo-200 bg-indigo-50 px-4 py-2.5 text-sm font-semibold text-indigo-600 transition hover:border-indigo-600 hover:bg-indigo-600 hover:text-white"
                        >
                          <RotateCcw size={16} />
                          Return Book
                        </button>
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

      {/* Return Confirmation Modal */}
      {selectedBook && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
          <div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="return-title"
            className="w-full max-w-sm rounded-3xl bg-white p-7 text-center shadow-2xl"
          >
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50">
              <RotateCcw
                size={30}
                className="text-indigo-600"
              />
            </div>

            <h2
              id="return-title"
              className="text-2xl font-bold text-slate-900"
            >
              Return this book?
            </h2>

            <p className="mt-3 text-sm leading-7 text-slate-500">
              You're about to return{" "}
              <span className="font-semibold text-slate-900">
                {selectedBook.bookTitle}
              </span>
              . It will be removed from your borrowed
              collection.
            </p>

            <div className="mt-7 flex gap-3">
              <button
                type="button"
                disabled={Boolean(returningId)}
                onClick={() => setSelectedBook(null)}
                className="flex-1 rounded-xl border border-slate-200 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleReturn}
                disabled={Boolean(returningId)}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:opacity-60"
              >
                {returningId ? (
                  <>
                    <Loader2
                      size={17}
                      className="animate-spin"
                    />
                    Returning
                  </>
                ) : (
                  "Confirm Return"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
