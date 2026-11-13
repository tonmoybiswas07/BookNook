
"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  BookOpen,
  User,
  UserRound,
  Tag,
  X,
  Loader2,
  CalendarDays,
  CheckCircle2,
  LibraryBig,
  AlertCircle,
} from "lucide-react";

import { authClient } from "../../lib/auth-client";

// CHANGE YOUR API HERE
const API_URL = "http://localhost:8000";

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

export default function BookDetailsClient({
  book,
}: {
  book: Book;
}) {
  const router = useRouter();

  const { data: session, isPending } =
    authClient.useSession();

  const [openModal, setOpenModal] = useState(false);
  const [borrowing, setBorrowing] = useState(false);
  const [availableCopies, setAvailableCopies] =
    useState(book.totalCopies);

  const [toast, setToast] = useState("");
  const [error, setError] = useState("");

  const user = session?.user;

  // Open Borrow Modal
  const handleOpenModal = () => {
    if (isPending) return;

    if (!user) {
      router.push(
        `/login?callbackUrl=${encodeURIComponent(
          `/books/${book._id}`
        )}`
      );
      return;
    }

    if (availableCopies <= 0) return;

    setError("");
    setOpenModal(true);
  };

  // Confirm Borrow
  const handleBorrow = async () => {
    if (!user?.email || borrowing) return;

    try {
      setBorrowing(true);
      setError("");

      const borrowData = {
        bookId: book._id,
        bookTitle: book.title,
        bookImage: book.image,
        userEmail: user.email,
        borrowDate: new Date().toISOString(),
        returnDate: new Date(
          Date.now() + 7 * 24 * 60 * 60 * 1000
        ).toISOString(),
      };

      const res = await fetch(`${API_URL}/borrows`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(borrowData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.message || "Failed to borrow book"
        );
      }

      setAvailableCopies((prev) =>
        Math.max(0, prev - 1)
      );

      setOpenModal(false);
      setToast("Book borrowed successfully!");

      router.refresh();

      setTimeout(() => {
        router.push("/myBorrow");
      }, 1200);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong"
      );
    } finally {
      setBorrowing(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-12">
      <div className="mx-auto max-w-6xl">

        {/* Back Button */}
        <Link
          href="/books"
          className="mb-8 inline-flex items-center gap-2 font-medium text-gray-600 transition hover:text-indigo-600"
        >
          <ArrowLeft size={18} />
          Back to Books
        </Link>

        <div className="grid overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-xl md:grid-cols-2">

          {/* Book Image */}
          <div className="relative min-h-[400px] bg-gray-100">
            <Image
              src={book.image}
              alt={book.title}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>

          {/* Book Information */}
          <div className="flex flex-col justify-center p-6 md:p-10">

            {/* Category */}
            <span className="mb-4 flex w-fit items-center gap-2 rounded-full bg-indigo-50 px-4 py-2 text-sm font-semibold text-indigo-600">
              <Tag size={15} />
              {book.category}
            </span>

            {/* Title */}
            <h1 className="mb-4 text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">
              {book.title}
            </h1>

            {/* Author */}
            <div className="mb-6 flex items-center gap-2 text-gray-600">
              <User size={20} />
              <span>By {book.author}</span>
            </div>

            {/* Available Copies */}
            <div className="mb-7 flex items-center gap-3">
              <div className="rounded-xl bg-indigo-50 p-3 text-indigo-600">
                <LibraryBig size={23} />
              </div>

              <div>
                <p className="text-sm text-gray-500">
                  Available Copies
                </p>

                <p className="text-xl font-bold text-gray-900">
                  {availableCopies}
                </p>
              </div>

              <span
                className={`ml-auto rounded-full px-3 py-1 text-xs font-bold ${
                  availableCopies > 0
                    ? "bg-green-50 text-green-600"
                    : "bg-red-50 text-red-600"
                }`}
              >
                {availableCopies > 0
                  ? "Available"
                  : "Not Available"}
              </span>
            </div>

            {/* Description */}
            <div className="mb-8">
              <h2 className="mb-3 text-xl font-semibold text-gray-900">
                Book Description
              </h2>

              <p className="text-sm leading-8 text-gray-600">
                {book.description}
              </p>
            </div>

            {/* Added By */}
            <div className="mb-8 rounded-xl border border-gray-100 bg-gray-50 p-5">
              <h2 className="mb-4 text-lg font-semibold text-gray-900">
                Added By
              </h2>

              <div className="flex items-center gap-3">
                <div className="rounded-full bg-indigo-100 p-3 text-indigo-600">
                  <UserRound size={22} />
                </div>

                <div>
                  <p className="font-semibold capitalize text-gray-900">
                    {book.userName || "Unknown User"}
                  </p>

                  <p className="text-sm text-gray-500">
                    {book.userEmail || "No email available"}
                  </p>
                </div>
              </div>
            </div>

            {/* Borrow Button */}
            <button
              type="button"
              onClick={handleOpenModal}
              disabled={availableCopies <= 0 || isPending}
              className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-4 font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-gray-300"
            >
              <BookOpen size={20} />
              {isPending
                ? "Checking Session..."
                : availableCopies <= 0
                ? "Not Available"
                : "Borrow This Book"}
            </button>
          </div>
        </div>
      </div>

      {/* Borrow Modal */}
      {openModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="borrow-modal-title"
            className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">
              <div>
                <h2
                  id="borrow-modal-title"
                  className="text-xl font-bold text-gray-900"
                >
                  Borrow This Book
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Confirm your borrowing details.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setOpenModal(false)}
                disabled={borrowing}
                className="rounded-full p-2 text-gray-500 hover:bg-gray-100"
              >
                <X size={22} />
              </button>
            </div>

            <div className="space-y-5 p-6">

              {/* Book Preview */}
              <div className="flex items-center gap-4 rounded-xl bg-indigo-50 p-4">
                <div className="relative h-20 w-14 shrink-0 overflow-hidden rounded-lg">
                  <Image
                    src={book.image}
                    alt={book.title}
                    fill
                    className="object-cover"
                    sizes="56px"
                  />
                </div>

                <div>
                  <p className="font-bold text-gray-900">
                    {book.title}
                  </p>

                  <p className="mt-1 text-sm text-gray-500">
                    By {book.author}
                  </p>
                </div>
              </div>

              {/* User Name */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  User Name
                </label>

                <input
                  type="text"
                  value={user?.name || ""}
                  readOnly
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-600 outline-none"
                />
              </div>

              {/* Email */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Email Address
                </label>

                <input
                  type="email"
                  value={user?.email || ""}
                  readOnly
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-600 outline-none"
                />
              </div>

              {/* Dates */}
              <div className="flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50 p-4">
                <CalendarDays
                  size={21}
                  className="text-indigo-600"
                />

                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    Borrow Date
                  </p>

                  <p className="text-xs text-gray-500">
                    Recorded automatically
                  </p>
                </div>
              </div>

              {/* Error */}
              {error && (
                <div className="flex items-start gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-600">
                  <AlertCircle
                    size={18}
                    className="shrink-0"
                  />
                  {error}
                </div>
              )}

              {/* Buttons */}
              <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row">
                <button
                  type="button"
                  onClick={() => setOpenModal(false)}
                  disabled={borrowing}
                  className="flex-1 rounded-xl border border-gray-200 px-5 py-3 font-semibold text-gray-700 transition hover:bg-gray-50"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleBorrow}
                  disabled={borrowing}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white transition hover:bg-indigo-700 disabled:opacity-60"
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
            </div>
          </div>
        </div>
      )}

      {/* Success Toast */}
      {toast && (
        <div
          role="status"
          className="fixed right-5 top-5 z-[110] flex items-center gap-3 rounded-xl bg-gray-900 px-5 py-4 text-sm font-medium text-white shadow-xl"
        >
          <CheckCircle2
            size={20}
            className="text-green-400"
          />

          {toast}

          <button
            type="button"
            onClick={() => setToast("")}
            aria-label="Close notification"
          >
            <X size={18} />
          </button>
        </div>
      )}
    </main>
  );
}
