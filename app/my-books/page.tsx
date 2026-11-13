"use client";

import { useEffect, useState, type FormEvent, type ChangeEvent } from "react";

import {
  BookOpen,
  Pencil,
  Trash2,
  X,
  Loader2,
  AlertTriangle,
  Plus,
  CheckCircle2,
  ArrowLeft,
  RefreshCw,
} from "lucide-react";

import Link from "next/link";
import { authClient } from "../lib/auth-client";
import Image from "next/image";

const API_URL = "http://localhost:8000";

interface Book {
  _id: string;
  title: string;
  author: string;
  category: string;
  image: string;
  description: string;
  totalCopies: number;
  userName?: string;
  userEmail?: string;
}

interface BookForm {
  title: string;
  author: string;
  category: string;
  image: string;
  description: string;
  totalCopies: string;
}

const initialForm: BookForm = {
  title: "",
  author: "",
  category: "",
  image: "",
  description: "",
  totalCopies: "1",
};

const categories = ["Fiction", "Science", "History", "Kids", "Others"];

export default function MyBooksPage() {
  const { data: session, isPending } = authClient.useSession();

  const email = session?.user?.email;

  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [editingBook, setEditingBook] = useState<Book | null>(null);

  const [deletingBook, setDeletingBook] = useState<Book | null>(null);

  const [form, setForm] = useState<BookForm>(initialForm);

  const [toast, setToast] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!toast) return;

    const timer = setTimeout(() => {
      setToast("");
    }, 3000);

    return () => clearTimeout(timer);
  }, [toast]);

  const fetchMyBooks = async () => {
    if (!email) {
      setBooks([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      // GET API
      const res = await fetch(`${API_URL}/my-books`, {
        method: "GET",
        headers: {
          "x-user-email": email,
        },
        cache: "no-store",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to fetch books");
      }

      setBooks(Array.isArray(data) ? data : []);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Something went wrong";

      setError(message);
      setBooks([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isPending) return;

    if (!email) {
      setBooks([]);
      setLoading(false);
      return;
    }

    void fetchMyBooks();
  }, [email, isPending]);

  const handleEdit = (book: Book) => {
    setEditingBook(book);

    setForm({
      title: book.title,
      author: book.author,
      category: book.category,
      image: book.image,
      description: book.description,
      totalCopies: String(book.totalCopies),
    });
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdate = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!editingBook || !email || saving) return;

    const updatedBook = {
      title: form.title.trim(),
      author: form.author.trim(),
      category: form.category,
      image: form.image.trim(),
      description: form.description.trim(),
      totalCopies: Number(form.totalCopies),
    };

    if (
      !updatedBook.title ||
      !updatedBook.author ||
      !updatedBook.category ||
      !updatedBook.image ||
      !updatedBook.description ||
      form.totalCopies.trim() === "" ||
      !Number.isInteger(updatedBook.totalCopies) ||
      updatedBook.totalCopies < 0
    ) {
      setToast("Please provide valid book information");
      return;
    }

    try {
      setSaving(true);

      // PATCH API
      const res = await fetch(`${API_URL}/books/${editingBook._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-user-email": email,
        },
        body: JSON.stringify(updatedBook),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to update book");
      }

      setBooks((prev) =>
        prev.map((book) =>
          book._id === editingBook._id ? { ...book, ...updatedBook } : book,
        ),
      );

      setEditingBook(null);
      setForm(initialForm);
      setToast("Book updated successfully!");
    } catch (err) {
      setToast(err instanceof Error ? err.message : "Failed to update book");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingBook || !email || deleting) return;

    try {
      setDeleting(true);

      // DELETE API
      const res = await fetch(`${API_URL}/books/${deletingBook._id}`, {
        method: "DELETE",
        headers: {
          "x-user-email": email,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to delete book");
      }

      setBooks((prev) => prev.filter((book) => book._id !== deletingBook._id));

      setDeletingBook(null);
      setToast("Book deleted successfully!");
    } catch (err) {
      setToast(err instanceof Error ? err.message : "Failed to delete book");
    } finally {
      setDeleting(false);
    }
  };

  if (isPending || loading) {
    return (
      <main className="flex min-h-[75vh] flex-col items-center justify-center gap-4 bg-slate-50">
        <Loader2 size={42} className="animate-spin text-indigo-600" />
        <p className="text-sm font-medium text-slate-500">
          Loading your collection...
        </p>
      </main>
    );
  }

  if (!session?.user) {
    return (
      <main className="flex min-h-[75vh] flex-col items-center justify-center bg-slate-50 px-4 text-center">
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-indigo-100">
          <BookOpen size={38} className="text-indigo-600" />
        </div>

        <h1 className="text-3xl font-bold text-slate-900">Please Sign In</h1>

        <p className="mt-3 max-w-md text-slate-500">
          Sign in to view, edit and manage the books you have added to BookNook.
        </p>

        <Link
          href="/login"
          className="mt-7 rounded-xl bg-indigo-600 px-7 py-3 font-semibold text-white transition hover:bg-indigo-700"
        >
          Sign In
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 pb-24 pt-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* HEADER */}

        <div className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <Link
              href="/"
              className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-indigo-600"
            >
              <ArrowLeft size={16} />
              Back to Home
            </Link>

            <div className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-indigo-600">
              <BookOpen size={18} />
              My Collection
            </div>

            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
              My <span className="text-indigo-600">Books</span>
            </h1>

            <p className="mt-4 max-w-lg text-slate-500">
              Manage, update and organize the books you have shared with the
              BookNook community.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="rounded-xl border border-slate-200 bg-white px-5 py-3 shadow-sm">
              <p className="text-xs font-medium text-slate-400">Total Books</p>
              <p className="text-2xl font-bold text-slate-900">
                {books.length}
              </p>
            </div>

            <button
              type="button"
              onClick={fetchMyBooks}
              className="flex h-12 w-12 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:border-indigo-300 hover:text-indigo-600"
              title="Refresh Books"
            >
              <RefreshCw size={19} />
            </button>

            <Link
              href="/add-books"
              className="inline-flex h-12 items-center gap-2 rounded-xl bg-indigo-600 px-5 font-semibold text-white shadow-lg shadow-indigo-200 transition hover:bg-indigo-700"
            >
              <Plus size={19} />
              Add Book
            </Link>
          </div>
        </div>

        {/* TOAST */}

        {toast && (
          <div
            role="status"
            className="fixed right-5 top-5 z-[100] flex max-w-sm items-center gap-3 rounded-xl bg-slate-900 px-5 py-4 text-sm font-medium text-white shadow-xl"
          >
            <CheckCircle2 size={19} className="shrink-0 text-green-400" />

            <span>{toast}</span>

            <button
              type="button"
              onClick={() => setToast("")}
              aria-label="Close notification"
            >
              <X size={17} />
            </button>
          </div>
        )}

        {/* ERROR */}

        {error && (
          <div className="mb-7 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-red-200 bg-red-50 p-5">
            <div className="flex items-center gap-3 text-sm text-red-700">
              <AlertTriangle size={20} />
              {error}
            </div>

            <button
              onClick={fetchMyBooks}
              className="text-sm font-bold text-red-700 underline"
            >
              Try Again
            </button>
          </div>
        )}

        {/* EMPTY STATE */}

        {books.length === 0 && !error ? (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-24 text-center shadow-sm">
            <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-indigo-50">
              <BookOpen size={44} className="text-indigo-400" />
            </div>

            <h2 className="text-2xl font-bold text-slate-900">
              No Books Found
            </h2>

            <p className="mx-auto mt-3 max-w-md text-slate-500">
              You haven't added any books yet. Start building your personal
              collection by sharing your first book.
            </p>

            <Link
              href="/add-books"
              className="mt-7 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 font-semibold text-white transition hover:bg-indigo-700"
            >
              <Plus size={19} />
              Add Your First Book
            </Link>
          </div>
        ) : books.length > 0 ? (
          /* BOOKS TABLE */

          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 px-6 py-5">
              <h2 className="text-lg font-bold text-slate-900">Your Library</h2>
              <p className="mt-1 text-sm text-slate-500">
                All the books you have added
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[850px] text-left">
                <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
                  <tr>
                    <th className="px-6 py-5 font-semibold">Book</th>
                    <th className="px-6 py-5 font-semibold">Author</th>
                    <th className="px-6 py-5 font-semibold">Category</th>
                    <th className="px-6 py-5 font-semibold">Copies</th>
                    <th className="px-6 py-5 text-center font-semibold">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {books.map((book) => (
                    <tr
                      key={book._id}
                      className="transition hover:bg-slate-50/80"
                    >
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-4">
                          <Image
                            src={book.image}
                            alt={book.title}
                            height={40}
                            width={40}
                            className="h-20 w-14 shrink-0 rounded-lg bg-slate-100 object-cover shadow-sm"
                          />

                          <div>
                            <p className="max-w-[220px] font-bold text-slate-900">
                              {book.title}
                            </p>

                            <p className="mt-1 text-xs text-slate-400">
                              Book ID: {book._id.slice(-6)}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-5 text-sm text-slate-600">
                        {book.author}
                      </td>

                      <td className="px-6 py-5">
                        <span className="inline-flex rounded-full bg-indigo-50 px-3 py-1.5 text-xs font-bold text-indigo-600">
                          {book.category}
                        </span>
                      </td>

                      <td className="px-6 py-5">
                        <span
                          className={`inline-flex rounded-lg px-3 py-1.5 text-sm font-bold ${
                            book.totalCopies > 0
                              ? "bg-emerald-50 text-emerald-600"
                              : "bg-red-50 text-red-600"
                          }`}
                        >
                          {book.totalCopies}
                        </span>
                      </td>

                      <td className="px-6 py-5">
                        <div className="flex justify-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleEdit(book)}
                            className="inline-flex items-center gap-2 rounded-lg bg-blue-50 px-4 py-2.5 text-sm font-semibold text-blue-600 transition hover:bg-blue-100"
                          >
                            <Pencil size={16} />
                            Edit
                          </button>

                          <button
                            type="button"
                            onClick={() => setDeletingBook(book)}
                            className="inline-flex items-center gap-2 rounded-lg bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-100"
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
          </div>
        ) : null}
      </div>

      {editingBook && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/60 p-4 backdrop-blur-sm">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="edit-book-title"
            className="my-8 w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
              <div>
                <h2
                  id="edit-book-title"
                  className="text-xl font-bold text-slate-900"
                >
                  Edit Book
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Update your book information below.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setEditingBook(null)}
                disabled={saving}
                className="rounded-full p-2 text-slate-500 transition hover:bg-slate-100"
              >
                <X size={22} />
              </button>
            </div>

            <form
              onSubmit={handleUpdate}
              className="max-h-[75vh] space-y-5 overflow-y-auto p-6"
            >
              <div className="grid gap-5 sm:grid-cols-2">
                {/* TITLE */}

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Book Title
                  </label>

                  <input
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-slate-900 outline-none transition focus:border-indigo-500"
                  />
                </div>

                {/* AUTHOR */}

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Author Name
                  </label>

                  <input
                    name="author"
                    value={form.author}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-slate-900 outline-none transition focus:border-indigo-500"
                  />
                </div>

                {/* CATEGORY */}

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Category
                  </label>

                  <select
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-indigo-500"
                  >
                    {!categories.includes(form.category) && form.category && (
                      <option value={form.category}>{form.category}</option>
                    )}

                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                {/* COPIES */}

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Total Copies
                  </label>

                  <input
                    name="totalCopies"
                    type="number"
                    min="0"
                    step="1"
                    value={form.totalCopies}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-slate-900 outline-none transition focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* IMAGE */}

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Book Image URL
                </label>

                <input
                  name="image"
                  type="url"
                  value={form.image}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-slate-900 outline-none transition focus:border-indigo-500"
                />
              </div>

              {/* DESCRIPTION */}

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Description
                </label>

                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={4}
                  required
                  className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-slate-900 outline-none transition focus:border-indigo-500"
                />
              </div>

              {/* BUTTONS */}

              <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => setEditingBook(null)}
                  disabled={saving}
                  className="rounded-xl border border-slate-200 px-6 py-3 font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 font-semibold text-white transition hover:bg-indigo-700 disabled:opacity-60"
                >
                  {saving ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 size={18} />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deletingBook && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="delete-book-title"
            className="w-full max-w-md rounded-2xl bg-white p-7 text-center shadow-2xl"
          >
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
              <AlertTriangle size={32} className="text-red-500" />
            </div>

            <h2
              id="delete-book-title"
              className="text-2xl font-bold text-slate-900"
            >
              Delete this book?
            </h2>

            <p className="mt-3 text-sm leading-6 text-slate-500">
              Are you sure you want to delete{" "}
              <strong className="text-slate-900">{deletingBook.title}</strong>?
              This action cannot be undone.
            </p>

            <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-center">
              <button
                type="button"
                onClick={() => setDeletingBook(null)}
                disabled={deleting}
                className="rounded-xl border border-slate-200 px-6 py-3 font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-6 py-3 font-semibold text-white transition hover:bg-red-700 disabled:opacity-60"
              >
                {deleting ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 size={18} />
                    Yes, Delete
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
