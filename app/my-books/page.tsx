
"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

import {
  FiAlertTriangle,
  FiArrowLeft,
  FiArrowRight,
  FiBook,
  FiCheckCircle,
  FiEdit2,
  FiEye,
  FiLoader,
  FiPlus,
  FiRefreshCw,
  FiSearch,
  FiTrash2,
  FiUser,
  FiX,
} from "react-icons/fi";

import { authClient } from "@/app/lib/auth-client";
import { apiClient } from "@/app/lib/api-client";

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

const categories = [
  "Fiction",
  "Science",
  "History",
  "Kids & Teens",
  "Kids",
  "Others",
];

const initialForm: BookForm = {
  title: "",
  author: "",
  category: "",
  image: "",
  description: "",
  totalCopies: "1",
};

const inputClassName =
  "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-indigo-400 dark:focus:ring-indigo-500/20";

const labelClassName =
  "mb-2 block text-sm font-bold text-slate-700 dark:text-slate-300";

export default function MyBooksPage() {
  const router = useRouter();

  const { data: session, isPending } = authClient.useSession();

  const user = session?.user;
  const userEmail = user?.email;

  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [deletingBook, setDeletingBook] = useState<Book | null>(null);
  const [form, setForm] = useState<BookForm>(initialForm);

  const fetchMyBooks = useCallback(
    async (showRefresh = false) => {
      if (!userEmail) {
        setLoading(false);
        return;
      }

      if (showRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      try {
        console.log("Fetching books for:", userEmail);

        const data = await apiClient<Book[]>("/my-books", {
          method: "GET",
        });

        console.log("My Books API Response:", data);

        if (!Array.isArray(data)) {
          throw new Error("Invalid API response: Expected an array");
        }

        setBooks(data);
      } catch (err) {
        console.error("My Books Fetch Error:", err);

        const message =
          err instanceof Error
            ? err.message
            : "Failed to fetch your books";

        setError(message);

        if (!showRefresh) {
          setBooks([]);
        }
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [userEmail]
  );

  useEffect(() => {
    if (isPending) return;

    if (!userEmail) {
      setLoading(false);
      router.replace(
        "/Authentication/signin?callbackUrl=%2Fmy-books"
      );
      return;
    }

    void fetchMyBooks();
  }, [isPending, userEmail, fetchMyBooks, router]);

  const filteredBooks = useMemo(() => {
    const query = search.toLowerCase().trim();

    if (!query) return books;

    return books.filter((book) =>
      [book.title, book.author, book.category].some((value) =>
        String(value || "").toLowerCase().includes(query)
      )
    );
  }, [books, search]);

  const totalCopies = useMemo(
    () =>
      books.reduce(
        (sum, book) => sum + Number(book.totalCopies || 0),
        0
      ),
    [books]
  );

  const openEditModal = (book: Book) => {
    setEditingBook(book);

    setForm({
      title: book.title || "",
      author: book.author || "",
      category: book.category || "",
      image: book.image || "",
      description: book.description || "",
      totalCopies: String(book.totalCopies ?? 0),
    });
  };

  const closeEditModal = () => {
    if (saving) return;

    setEditingBook(null);
    setForm(initialForm);
  };

  const handleChange = (
    e: ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdate = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!editingBook || saving) return;

    const updatedBook = {
      title: form.title.trim(),
      author: form.author.trim(),
      category: form.category.trim(),
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
      toast.error("Please enter valid book details");
      return;
    }

    setSaving(true);

    try {
      await apiClient(`/books/${editingBook._id}`, {
        method: "PATCH",
        body: JSON.stringify(updatedBook),
      });

      setBooks((prev) =>
        prev.map((book) =>
          book._id === editingBook._id
            ? { ...book, ...updatedBook }
            : book
        )
      );

      setEditingBook(null);
      setForm(initialForm);

      toast.success("Book updated successfully!");

      router.refresh();
    } catch (err) {
      console.error("Update Error:", err);

      toast.error(
        err instanceof Error
          ? err.message
          : "Failed to update book"
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingBook || deleting) return;

    setDeleting(true);

    try {
      await apiClient(`/books/${deletingBook._id}`, {
        method: "DELETE",
      });

      setBooks((prev) =>
        prev.filter((book) => book._id !== deletingBook._id)
      );

      setDeletingBook(null);

      toast.success("Book deleted successfully!");

      router.refresh();
    } catch (err) {
      console.error("Delete Error:", err);

      toast.error(
        err instanceof Error
          ? err.message
          : "Failed to delete book"
      );
    } finally {
      setDeleting(false);
    }
  };

  if (isPending || (userEmail && loading)) {
    return (
      <main className="flex min-h-[75vh] flex-col items-center justify-center bg-[#f8f9fd] px-4 text-center transition-colors dark:bg-slate-950">
        <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-indigo-50 dark:bg-indigo-500/10">
          <FiLoader className="h-9 w-9 animate-spin text-indigo-600 dark:text-indigo-400" />
        </div>

        <h2 className="mt-6 text-xl font-extrabold text-slate-900 dark:text-white">
          Loading Your Collection
        </h2>

        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Fetching your books securely...
        </p>
      </main>
    );
  }

  if (!userEmail) {
    return (
      <main className="flex min-h-[75vh] items-center justify-center bg-[#f8f9fd] px-4 transition-colors dark:bg-slate-950">
        <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-xl shadow-slate-200/50 dark:border-slate-800 dark:bg-slate-900 dark:shadow-black/20">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
            <FiBook size={36} />
          </div>

          <h1 className="mt-6 text-2xl font-extrabold text-slate-900 dark:text-white">
            Sign In Required
          </h1>

          <p className="mt-3 text-sm leading-7 text-slate-500 dark:text-slate-400">
            Please sign in to manage the books you have added to BookNook.
          </p>

          <Link
            href="/Authentication/signin?callbackUrl=%2Fmy-books"
            className="mt-7 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-7 py-3.5 text-sm font-bold text-white transition hover:bg-indigo-700 dark:hover:bg-indigo-500"
          >
            Sign In
            <FiArrowRight />
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f8f9fd] pb-24 pt-12 transition-colors duration-300 dark:bg-slate-950">
      <div className="pointer-events-none absolute -left-32 top-20 h-80 w-80 rounded-full bg-indigo-100/50 blur-3xl dark:bg-indigo-500/10" />

      <div className="pointer-events-none absolute -right-32 bottom-20 h-80 w-80 rounded-full bg-violet-100/50 blur-3xl dark:bg-violet-500/10" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <Link
            href="/"
            className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400"
          >
            <FiArrowLeft size={16} />
            Back to Home
          </Link>

          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div className="max-w-2xl">
              <span className="inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-white px-4 py-2 text-xs font-bold uppercase tracking-widest text-indigo-600 shadow-sm dark:border-indigo-500/20 dark:bg-indigo-500/10 dark:text-indigo-400 dark:shadow-black/10">
                <FiBook />
                My Library Collection
              </span>

              <h1 className="mt-5 text-4xl font-extrabold tracking-tight text-slate-950 dark:text-white sm:text-5xl">
                My{" "}
                <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent dark:from-indigo-400 dark:to-violet-400">
                  Books
                </span>
              </h1>

              <p className="mt-4 max-w-xl text-sm leading-7 text-slate-500 dark:text-slate-400 sm:text-base">
                Manage, update, and organize the books you have shared with the
                BookNook community.
              </p>
            </div>

            <Link
              href="/add-books"
              className="inline-flex w-fit items-center gap-2 rounded-2xl bg-indigo-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-indigo-500/20 transition hover:-translate-y-0.5 hover:bg-indigo-700 dark:shadow-indigo-950/30 dark:hover:bg-indigo-500"
            >
              <FiPlus size={19} />
              Add New Book
            </Link>
          </div>
        </div>

        <div className="mb-8 grid gap-4 sm:grid-cols-2">
          <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:shadow-black/10">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
              <FiBook size={27} />
            </div>

            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                Total Books Added
              </p>

              <p className="mt-1 text-3xl font-extrabold text-slate-900 dark:text-white">
                {books.length}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:shadow-black/10">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
              <FiBook size={27} />
            </div>

            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                Available Copies
              </p>

              <p className="mt-1 text-3xl font-extrabold text-slate-900 dark:text-white">
                {totalCopies}
              </p>
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:shadow-black/10">
          <div className="flex flex-col justify-between gap-5 border-b border-slate-100 p-6 dark:border-slate-800 md:flex-row md:items-center">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
                Your Book Collection
              </h2>

              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                View and manage all your added books
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative flex-1 sm:w-64">
                <FiSearch
                  size={18}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500"
                />

                <input
                  type="search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search books..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-indigo-400 dark:focus:bg-slate-800"
                />
              </div>

              <button
                type="button"
                onClick={() => void fetchMyBooks(true)}
                disabled={refreshing}
                aria-label="Refresh books"
                title="Refresh books"
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:border-indigo-300 hover:text-indigo-600 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-indigo-500 dark:hover:text-indigo-400"
              >
                <FiRefreshCw
                  size={18}
                  className={refreshing ? "animate-spin" : ""}
                />
              </button>
            </div>
          </div>

          {error && (
            <div className="m-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-rose-200 bg-rose-50 p-5 dark:border-rose-500/20 dark:bg-rose-500/10">
              <div className="flex items-start gap-3 text-sm text-rose-700 dark:text-rose-400">
                <FiAlertTriangle
                  size={20}
                  className="mt-0.5 shrink-0"
                />

                <div>
                  <p className="font-bold">Failed to fetch books</p>

                  <p className="mt-1 break-words">{error}</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => void fetchMyBooks(true)}
                disabled={refreshing}
                className="text-sm font-bold text-rose-700 underline disabled:opacity-50 dark:text-rose-400"
              >
                Try Again
              </button>
            </div>
          )}

          {!error && books.length === 0 && (
            <div className="px-6 py-20 text-center">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
                <FiBook size={36} />
              </div>

              <h3 className="mt-6 text-2xl font-extrabold text-slate-900 dark:text-white">
                No Books Added Yet
              </h3>

              <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-slate-500 dark:text-slate-400">
                Your personal collection is empty. Start sharing your favorite
                books with the BookNook community.
              </p>

              <Link
                href="/add-books"
                className="mt-7 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3.5 text-sm font-bold text-white transition hover:bg-indigo-700 dark:hover:bg-indigo-500"
              >
                <FiPlus size={18} />
                Add Your First Book
              </Link>
            </div>
          )}

          {!error &&
            books.length > 0 &&
            filteredBooks.length === 0 && (
              <div className="px-6 py-16 text-center">
                <FiSearch
                  size={35}
                  className="mx-auto text-slate-300 dark:text-slate-600"
                />

                <h3 className="mt-4 text-lg font-bold text-slate-900 dark:text-white">
                  No Matching Books
                </h3>

                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                  Try searching with another keyword.
                </p>

                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="mt-4 text-sm font-bold text-indigo-600 dark:text-indigo-400"
                >
                  Clear Search
                </button>
              </div>
            )}

          {filteredBooks.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[850px] text-left">
                <thead className="bg-slate-50 dark:bg-slate-800/70">
                  <tr className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    <th className="px-6 py-5">Book Details</th>
                    <th className="px-6 py-5">Author</th>
                    <th className="px-6 py-5">Category</th>
                    <th className="px-6 py-5">Copies</th>
                    <th className="px-6 py-5 text-center">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredBooks.map((book) => (
                    <tr
                      key={book._id}
                      className="transition hover:bg-indigo-50/30 dark:hover:bg-indigo-500/5"
                    >
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-4">
                          <div className="h-20 w-14 shrink-0 overflow-hidden rounded-lg bg-indigo-50 shadow-sm dark:bg-slate-800">
                            {book.image ? (
                              <img
                                src={book.image}
                                alt={book.title}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center text-indigo-400">
                                <FiBook size={22} />
                              </div>
                            )}
                          </div>

                          <div className="min-w-0">
                            <Link
                              href={`/allBooks/${book._id}`}
                              className="block max-w-[220px] truncate text-sm font-bold text-slate-900 hover:text-indigo-600 dark:text-slate-100 dark:hover:text-indigo-400"
                            >
                              {book.title}
                            </Link>

                            <p className="mt-2 text-xs text-slate-400 dark:text-slate-500">
                              ID: {book._id.slice(-6)}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                          <FiUser
                            size={16}
                            className="text-slate-400 dark:text-slate-500"
                          />
                          {book.author}
                        </div>
                      </td>

                      <td className="px-6 py-5">
                        <span className="inline-flex rounded-full bg-indigo-50 px-3 py-1.5 text-xs font-bold text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
                          {book.category}
                        </span>
                      </td>

                      <td className="px-6 py-5">
                        <span
                          className={`inline-flex rounded-lg px-3 py-1.5 text-sm font-bold ${
                            Number(book.totalCopies) > 0
                              ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400"
                              : "bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400"
                          }`}
                        >
                          {book.totalCopies}
                        </span>
                      </td>

                      <td className="px-6 py-5">
                        <div className="flex items-center justify-center gap-2">
                          <Link
                            href={`/allBooks/${book._id}`}
                            title="View details"
                            className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600 transition hover:bg-indigo-50 hover:text-indigo-600 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-indigo-500/10 dark:hover:text-indigo-400"
                          >
                            <FiEye size={17} />
                          </Link>

                          <button
                            type="button"
                            onClick={() => openEditModal(book)}
                            className="inline-flex items-center gap-2 rounded-xl bg-indigo-50 px-4 py-2.5 text-sm font-bold text-indigo-600 transition hover:bg-indigo-100 dark:bg-indigo-500/10 dark:text-indigo-400 dark:hover:bg-indigo-500/20"
                          >
                            <FiEdit2 size={16} />
                            Edit
                          </button>

                          <button
                            type="button"
                            onClick={() => setDeletingBook(book)}
                            className="inline-flex items-center gap-2 rounded-xl bg-rose-50 px-4 py-2.5 text-sm font-bold text-rose-600 transition hover:bg-rose-100 dark:bg-rose-500/10 dark:text-rose-400 dark:hover:bg-rose-500/20"
                          >
                            <FiTrash2 size={16} />
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

          {books.length > 0 && (
            <div className="border-t border-slate-100 bg-slate-50/50 px-6 py-4 text-xs text-slate-500 dark:border-slate-800 dark:bg-slate-800/40 dark:text-slate-400">
              Showing {filteredBooks.length} of {books.length} books
            </div>
          )}
        </div>
      </div>

      {editingBook && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/65 p-4 backdrop-blur-sm dark:bg-black/75">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="edit-book-title"
            className="w-full max-w-2xl overflow-hidden rounded-[28px] bg-white shadow-2xl dark:border dark:border-slate-700 dark:bg-slate-900 dark:shadow-black/50"
          >
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5 dark:border-slate-800 sm:px-8">
              <div>
                <h2
                  id="edit-book-title"
                  className="text-xl font-extrabold text-slate-900 dark:text-white"
                >
                  Edit Book Details
                </h2>

                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Update your book information.
                </p>
              </div>

              <button
                type="button"
                onClick={closeEditModal}
                disabled={saving}
                aria-label="Close modal"
                className="rounded-xl p-2 text-slate-500 transition hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
              >
                <FiX size={22} />
              </button>
            </div>

            <form
              onSubmit={handleUpdate}
              className="max-h-[75vh] space-y-5 overflow-y-auto p-6 sm:p-8"
            >
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="edit-title"
                    className={labelClassName}
                  >
                    Book Title
                  </label>

                  <input
                    id="edit-title"
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    required
                    className={inputClassName}
                  />
                </div>

                <div>
                  <label
                    htmlFor="edit-author"
                    className={labelClassName}
                  >
                    Author Name
                  </label>

                  <input
                    id="edit-author"
                    name="author"
                    value={form.author}
                    onChange={handleChange}
                    required
                    className={inputClassName}
                  />
                </div>

                <div>
                  <label
                    htmlFor="edit-category"
                    className={labelClassName}
                  >
                    Category
                  </label>

                  <select
                    id="edit-category"
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    required
                    className={inputClassName}
                  >
                    <option value="" disabled>
                      Select category
                    </option>

                    {form.category &&
                      !categories.includes(form.category) && (
                        <option value={form.category}>
                          {form.category}
                        </option>
                      )}

                    {categories.map((category) => (
                      <option
                        key={category}
                        value={category}
                      >
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="edit-copies"
                    className={labelClassName}
                  >
                    Available Copies
                  </label>

                  <input
                    id="edit-copies"
                    name="totalCopies"
                    type="number"
                    min="0"
                    step="1"
                    value={form.totalCopies}
                    onChange={handleChange}
                    required
                    className={inputClassName}
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="edit-image"
                  className={labelClassName}
                >
                  Book Cover URL
                </label>

                <input
                  id="edit-image"
                  name="image"
                  type="url"
                  value={form.image}
                  onChange={handleChange}
                  required
                  className={inputClassName}
                />
              </div>

              <div>
                <label
                  htmlFor="edit-description"
                  className={labelClassName}
                >
                  Description
                </label>

                <textarea
                  id="edit-description"
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={4}
                  required
                  className={`${inputClassName} resize-none`}
                />
              </div>

              <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 dark:border-slate-800 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeEditModal}
                  disabled={saving}
                  className="rounded-xl border border-slate-200 px-6 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50 disabled:opacity-60 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-indigo-700 disabled:opacity-60 dark:hover:bg-indigo-500"
                >
                  {saving ? (
                    <>
                      <FiLoader className="animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <FiCheckCircle />
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
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-950/65 p-4 backdrop-blur-sm dark:bg-black/75">
          <div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="delete-book-title"
            className="w-full max-w-md rounded-[28px] bg-white p-7 text-center shadow-2xl dark:border dark:border-slate-700 dark:bg-slate-900 dark:shadow-black/50 sm:p-9"
          >
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400">
              <FiAlertTriangle size={36} />
            </div>

            <h2
              id="delete-book-title"
              className="mt-6 text-2xl font-extrabold text-slate-900 dark:text-white"
            >
              Delete This Book?
            </h2>

            <p className="mt-4 text-sm leading-7 text-slate-500 dark:text-slate-400">
              Are you sure you want to delete{" "}
              <strong className="text-slate-900 dark:text-white">
                {deletingBook.title}
              </strong>
              ? This action cannot be undone.
            </p>

            <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => setDeletingBook(null)}
                disabled={deleting}
                className="flex-1 rounded-xl border border-slate-200 px-5 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50 disabled:opacity-60 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-rose-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-rose-700 disabled:opacity-60 dark:hover:bg-rose-500"
              >
                {deleting ? (
                  <>
                    <FiLoader className="animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <FiTrash2 />
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
