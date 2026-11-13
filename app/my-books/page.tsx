
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
} from "lucide-react";
import Image from "next/image";

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

export default function MyBooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [deletingBook, setDeletingBook] = useState<Book | null>(null);

  const [form, setForm] = useState<BookForm>(initialForm);
  const [toast, setToast] = useState("");

  // Toast
  useEffect(() => {
    if (!toast) return;

    const timer = setTimeout(() => setToast(""), 3000);
    return () => clearTimeout(timer);
  }, [toast]);

  // Fetch logged-in user's books
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await fetch("http://localhost:8000/books", {
          cache: "no-store",
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Failed to load books");
        }

        setBooks(data);
      } catch (error) {
        setToast(
          error instanceof Error ? error.message : "Something went wrong"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  // Open Edit Modal
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

  // Form change
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

 

  return (
    <main className="min-h-screen bg-slate-50 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-10 flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-indigo-600">
              <BookOpen size={18} />
              My Collection
            </div>

            <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">
              My Books
            </h1>

            <p className="mt-2 text-slate-500">
              Manage all the books you have added.
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white px-5 py-3 font-semibold text-slate-700 shadow-sm">
            Total Books: {books.length}
          </div>
        </div>

        {/* Toast */}
        {toast && (
          <div className="fixed right-5 top-5 z-[100] flex items-center gap-3 rounded-xl bg-slate-900 px-5 py-4 text-sm font-medium text-white shadow-xl">
            <span className="text-green-400">✓</span>
            {toast}
            <button onClick={() => setToast("")}>
              <X size={17} />
            </button>
          </div>
        )}

        {/* Loading */}
        {loading ? (
          <div className="flex min-h-[300px] items-center justify-center">
            <Loader2 className="animate-spin text-indigo-600" size={40} />
          </div>
        ) : books.length === 0 ? (
          /* Empty State */
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-5 py-20 text-center">
            <BookOpen className="mx-auto mb-5 text-slate-300" size={55} />

            <h2 className="text-xl font-bold text-slate-800">
              No Books Found
            </h2>

            <p className="mt-2 text-slate-500">
              You haven't added any books yet.
            </p>

            <a
              href="/add-books"
              className="mt-6 inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-3 font-semibold text-white hover:bg-indigo-700"
            >
              <Plus size={18} />
              Add Book
            </a>
          </div>
        ) : (
          /* Books Table */
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px] text-left">
                <thead className="bg-slate-100 text-sm uppercase text-slate-600">
                  <tr>
                    <th className="px-6 py-5">Book</th>
                    <th className="px-6 py-5">Author</th>
                    <th className="px-6 py-5">Category</th>
                    <th className="px-6 py-5">Copies</th>
                    <th className="px-6 py-5 text-center">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {books.map((book) => (
                    <tr key={book._id} className="hover:bg-slate-50">
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-4">
                          <Image
                            src={book.image}
                            alt={book.title}
                            width={40}
                            height={40}
                            className="h-16 w-12 rounded-lg object-cover"
                          />

                          <span className="font-bold text-slate-800">
                            {book.title}
                          </span>
                        </div>
                      </td>

                      <td className="px-6 py-5 text-sm text-slate-600">
                        {book.author}
                      </td>

                      <td className="px-6 py-5">
                        <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-600">
                          {book.category}
                        </span>
                      </td>

                      <td className="px-6 py-5 font-semibold text-slate-700">
                        {book.totalCopies}
                      </td>

                      <td className="px-6 py-5">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => handleEdit(book)}
                            className="flex items-center gap-2 rounded-lg bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-600 hover:bg-blue-100"
                          >
                            <Pencil size={15} />
                            Edit
                          </button>

                          <button
                            onClick={() => setDeletingBook(book)}
                            className="flex items-center gap-2 rounded-lg bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-100"
                          >
                            <Trash2 size={15} />
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
        )}
      </div>

      {/* Edit Modal */}
      {editingBook && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/60 p-4 backdrop-blur-sm">
          <div className="my-8 w-full max-w-2xl rounded-2xl bg-white shadow-2xl">

            <div className="flex items-center justify-between border-b px-6 py-5">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Edit Book
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Update your book information.
                </p>
              </div>

              <button
                onClick={() => setEditingBook(null)}
                className="rounded-full p-2 hover:bg-slate-100"
                aria-label="Close"
              >
                <X size={21} />
              </button>
            </div>
{/* handle update */}
            <form className="space-y-5 p-6">
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-semibold">
                    Book Title
                  </label>
                  <input
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    required
                    className="w-full rounded-lg border px-4 py-3 outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold">
                    Author
                  </label>
                  <input
                    name="author"
                    value={form.author}
                    onChange={handleChange}
                    required
                    className="w-full rounded-lg border px-4 py-3 outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold">
                    Category
                  </label>
                  <input
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    required
                    className="w-full rounded-lg border px-4 py-3 outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold">
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
                    className="w-full rounded-lg border px-4 py-3 outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Image URL
                </label>
                <input
                  name="image"
                  type="url"
                  value={form.image}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border px-4 py-3 outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Description
                </label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={4}
                  required
                  className="w-full resize-none rounded-lg border px-4 py-3 outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => setEditingBook(null)}
                  disabled={saving}
                  className="rounded-lg border px-6 py-3 font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-6 py-3 font-semibold text-white hover:bg-indigo-700 disabled:opacity-60"
                >
                  {saving ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      
      {deletingBook && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white p-7 text-center shadow-2xl">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
              <AlertTriangle className="text-red-500" size={32} />
            </div>

            <h2 className="text-xl font-bold text-slate-900">
              Delete this book?
            </h2>

            <p className="mt-3 text-sm leading-6 text-slate-500">
              Are you sure you want to delete{" "}
              <strong className="text-slate-800">
                {deletingBook.title}
              </strong>
              ? This action cannot be undone.
            </p>

            <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-center">
              <button
                onClick={() => setDeletingBook(null)}
                disabled={deleting}
                className="rounded-lg border px-6 py-3 font-semibold text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>

              <button
                // handle delelte
                disabled={deleting}
                className="flex items-center justify-center gap-2 rounded-lg bg-red-600 px-6 py-3 font-semibold text-white hover:bg-red-700 disabled:opacity-60"
              >
                {deleting ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 size={17} />
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
