
"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "react-toastify";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  CloudUpload,
  FileText,
  Hash,
  ImageIcon,
  Layers3,
  Loader2,
  LockKeyhole,
  Plus,
  ShieldCheck,
  Sparkles,
  UserRound,
  WandSparkles,
} from "lucide-react";
import { authClient } from "../lib/auth-client";
import { apiClient } from "../lib/api-client";

interface BookFormData {
  title: string;
  author: string;
  category: string;
  image: string;
  description: string;
  totalCopies: number;
}

interface ApiResponse {
  message?: string;
  insertedId?: string;
}

const categories = [
  "Fiction",
  "Science",
  "History",
  "Kids & Teens",
  "Others",
];

const initialForm: BookFormData = {
  title: "",
  author: "",
  category: "Fiction",
  image: "",
  description: "",
  totalCopies: 1,
};

const inputClass =
  "w-full rounded-2xl border border-slate-200 bg-slate-50/70 px-4 py-3.5 text-sm text-slate-900 outline-none transition-all duration-200 placeholder:text-slate-400 focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 dark:border-slate-700 dark:bg-slate-800/70 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-indigo-500 dark:focus:bg-slate-800 dark:focus:ring-indigo-500/20";

const labelClass =
  "mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300";

const cardClass =
  "overflow-hidden rounded-[28px] border border-slate-200/80 bg-white shadow-xl shadow-slate-200/40 transition-colors dark:border-slate-800 dark:bg-slate-900 dark:shadow-black/20 sm:rounded-[32px]";

const headingClass =
  "font-bold text-slate-900 dark:text-slate-100";

export default function AddBookPage() {
  const router = useRouter();

  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  const [formData, setFormData] =
    useState<BookFormData>(initialForm);

  const [loading, setLoading] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleChange = (
    e: ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;

    if (name === "totalCopies") {
      setFormData((prev) => ({
        ...prev,
        totalCopies: Number(value),
      }));
      return;
    }

    if (name === "image") {
      setImageError(false);
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (
    e: FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (loading) return;

    if (!user) {
      toast.error("Please sign in to add a book.");
      router.push("/Authentication/signin");
      return;
    }

    if (
      !Number.isInteger(formData.totalCopies) ||
      formData.totalCopies < 1
    ) {
      toast.error("Total copies must be at least 1.");
      return;
    }

    if (
      !formData.title.trim() ||
      !formData.author.trim() ||
      !formData.image.trim() ||
      !formData.description.trim()
    ) {
      toast.error("Please complete all required fields.");
      return;
    }

    setLoading(true);

    try {
      const bookData = {
        title: formData.title.trim(),
        author: formData.author.trim(),
        category: formData.category,
        image: formData.image.trim(),
        description: formData.description.trim(),
        totalCopies: formData.totalCopies,
        userName: user.name,
      };

      const result = await apiClient<ApiResponse>(
        "/books",
        {
          method: "POST",
          body: JSON.stringify(bookData),
        }
      );

      toast.success(
        result.message || "Book added successfully!"
      );

      setFormData(initialForm);
      setImageError(false);

      router.push("/allBooks");
      router.refresh();
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Something went wrong.";

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  if (isPending) {
    return (
      <div className="flex min-h-[75vh] items-center justify-center bg-slate-50 py-20 dark:bg-slate-950">
        <div className="flex flex-col items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-indigo-50 dark:bg-indigo-500/10">
            <Loader2 className="h-8 w-8 animate-spin text-indigo-600 dark:text-indigo-400" />
          </div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
            Preparing your workspace...
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <main className="flex min-h-[75vh] items-center justify-center bg-slate-50 px-4 py-20 dark:bg-slate-950">
        <div className="w-full max-w-md rounded-[32px] border border-slate-200 bg-white p-9 text-center shadow-xl shadow-slate-200/40 dark:border-slate-800 dark:bg-slate-900 dark:shadow-black/20">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-indigo-50 dark:bg-indigo-500/15">
            <LockKeyhole className="h-9 w-9 text-indigo-600 dark:text-indigo-400" />
          </div>

          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Sign in required
          </h1>

          <p className="mt-3 text-sm leading-7 text-slate-500 dark:text-slate-400">
            Join the BookNook community to share your
            favorite books with readers.
          </p>

          <Link
            href="/Authentication/signin"
            className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-6 py-4 text-sm font-semibold text-white transition hover:bg-indigo-700"
          >
            Sign In
            <ArrowRight size={17} />
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f8f9fd] text-slate-900 transition-colors duration-300 dark:bg-slate-950 dark:text-slate-100">
      <div className="pointer-events-none absolute -left-40 top-20 h-96 w-96 rounded-full bg-indigo-100/60 blur-3xl dark:bg-indigo-600/10" />
      <div className="pointer-events-none absolute -right-32 top-96 h-96 w-96 rounded-full bg-violet-100/70 blur-3xl dark:bg-violet-600/10" />

      <div className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
        <div className="mb-9 flex flex-wrap items-center justify-between gap-4">
          <Link
            href="/allBooks"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400"
          >
            <ArrowLeft size={17} />
            Back to Library
          </Link>

          <span className="inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-white px-4 py-2 text-xs font-semibold text-indigo-600 shadow-sm dark:border-indigo-500/20 dark:bg-slate-900 dark:text-indigo-400">
            <Sparkles size={14} />
            BookNook Contributor
          </span>
        </div>

        <div className="mb-10 max-w-3xl">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-indigo-50 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-400">
            <Plus size={15} />
            Grow Our Collection
          </div>

          <h1 className="text-4xl font-extrabold tracking-tight text-slate-950 dark:text-white sm:text-5xl lg:text-6xl">
            Every great story
            <span className="block bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-500 bg-clip-text text-transparent dark:from-indigo-400 dark:via-violet-400 dark:to-fuchsia-400">
              deserves a shelf.
            </span>
          </h1>

          <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-500 dark:text-slate-400 sm:text-base">
            Add a book to our growing digital library.
            Share its details and help someone discover
            their next favorite read.
          </p>
        </div>

        <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_360px] xl:gap-10">
          <section className={cardClass}>
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 px-6 py-6 dark:border-slate-800 sm:px-9">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-400">
                  <BookOpen size={23} />
                </div>

                <div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                    Book Information
                  </h2>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    Fill in the details below
                  </p>
                </div>
              </div>

              <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400">
                New Entry
              </span>
            </div>

            <form
              onSubmit={handleSubmit}
              className="space-y-8 p-6 sm:p-9"
            >
              <div>
                <div className="mb-6 flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-600 text-xs font-bold text-white">
                    01
                  </span>
                  <h3 className={headingClass}>
                    Basic Information
                  </h3>
                </div>

                <div className="grid gap-6 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="title"
                      className={labelClass}
                    >
                      Book Title
                      <span className="ml-1 text-rose-500">*</span>
                    </label>

                    <input
                      id="title"
                      name="title"
                      type="text"
                      required
                      maxLength={200}
                      value={formData.title}
                      onChange={handleChange}
                      placeholder="e.g. Atomic Habits"
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="author"
                      className={labelClass}
                    >
                      Author Name
                      <span className="ml-1 text-rose-500">*</span>
                    </label>

                    <input
                      id="author"
                      name="author"
                      type="text"
                      required
                      maxLength={150}
                      value={formData.author}
                      onChange={handleChange}
                      placeholder="e.g. James Clear"
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="category"
                      className={labelClass}
                    >
                      Book Category
                    </label>

                    <div className="relative">
                      <Layers3
                        size={17}
                        className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                      />

                      <select
                        id="category"
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        className={`${inputClass} pl-11`}
                      >
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
                  </div>

                  <div>
                    <label
                      htmlFor="totalCopies"
                      className={labelClass}
                    >
                      Available Copies
                      <span className="ml-1 text-rose-500">*</span>
                    </label>

                    <div className="relative">
                      <Hash
                        size={17}
                        className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                      />

                      <input
                        id="totalCopies"
                        name="totalCopies"
                        type="number"
                        min={1}
                        step={1}
                        required
                        value={formData.totalCopies}
                        onChange={handleChange}
                        className={`${inputClass} pl-11`}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t border-dashed border-slate-200 dark:border-slate-700" />

              <div>
                <div className="mb-6 flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-600 text-xs font-bold text-white">
                    02
                  </span>
                  <h3 className={headingClass}>
                    Cover & Description
                  </h3>
                </div>

                <div className="space-y-6">
                  <div>
                    <label
                      htmlFor="image"
                      className={labelClass}
                    >
                      Book Cover URL
                      <span className="ml-1 text-rose-500">*</span>
                    </label>

                    <div className="relative">
                      <ImageIcon
                        size={18}
                        className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                      />

                      <input
                        id="image"
                        name="image"
                        type="url"
                        required
                        value={formData.image}
                        onChange={handleChange}
                        placeholder="https://example.com/book-cover.jpg"
                        className={`${inputClass} pl-11`}
                      />
                    </div>

                    <p className="mt-2 flex items-center gap-2 text-xs text-slate-400 dark:text-slate-500">
                      <CloudUpload size={14} />
                      Paste a direct image URL from Imgbb or Postimages.
                    </p>
                  </div>

                  <div>
                    <label
                      htmlFor="description"
                      className={labelClass}
                    >
                      Book Description
                      <span className="ml-1 text-rose-500">*</span>
                    </label>

                    <div className="relative">
                      <FileText
                        size={18}
                        className="pointer-events-none absolute left-4 top-4 text-slate-400"
                      />

                      <textarea
                        id="description"
                        name="description"
                        rows={6}
                        required
                        maxLength={2000}
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Tell readers what makes this book special..."
                        className={`${inputClass} resize-y pl-11 leading-7`}
                      />
                    </div>

                    <div className="mt-2 flex justify-end">
                      <span className="text-xs text-slate-400 dark:text-slate-500">
                        {formData.description.length}/2000
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t border-dashed border-slate-200 dark:border-slate-700" />

              <div>
                <div className="mb-6 flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-600 text-xs font-bold text-white">
                    03
                  </span>

                  <h3 className={headingClass}>
                    Contributor Details
                  </h3>

                  <ShieldCheck
                    size={17}
                    className="text-emerald-500"
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/70">
                    <div className="mb-2 flex items-center gap-2 text-xs font-medium text-slate-400">
                      <UserRound size={15} />
                      Your Name
                    </div>

                    <p className="truncate text-sm font-semibold text-slate-800 dark:text-slate-200">
                      {user.name}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/70">
                    <div className="mb-2 flex items-center gap-2 text-xs font-medium text-slate-400">
                      <LockKeyhole size={15} />
                      Verified Account Email
                    </div>

                    <p className="truncate text-sm font-semibold text-slate-800 dark:text-slate-200">
                      {user.email}
                    </p>
                  </div>
                </div>

                <p className="mt-3 flex items-center gap-2 text-xs text-slate-400 dark:text-slate-500">
                  <ShieldCheck
                    size={15}
                    className="shrink-0 text-emerald-500"
                  />
                  Your account is authenticated before submission.
                </p>
              </div>

              <div className="flex flex-col gap-3 border-t border-slate-100 pt-7 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between">
                <button
                  type="button"
                  disabled={loading}
                  onClick={() => {
                    setFormData(initialForm);
                    setImageError(false);
                  }}
                  className="rounded-2xl border border-slate-200 px-6 py-4 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  Reset Form
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="group inline-flex items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 px-8 py-4 text-sm font-bold text-white shadow-lg shadow-indigo-500/20 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-indigo-500/30 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? (
                    <>
                      <Loader2
                        size={19}
                        className="animate-spin"
                      />
                      Publishing Book...
                    </>
                  ) : (
                    <>
                      <Plus size={19} />
                      Add to Library
                      <ArrowRight
                        size={18}
                        className="transition-transform group-hover:translate-x-1"
                      />
                    </>
                  )}
                </button>
              </div>
            </form>
          </section>

          <aside className="space-y-6 lg:sticky lg:top-24">
            <div className={cardClass}>
              <div className="border-b border-slate-100 px-6 py-5 dark:border-slate-800">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h3 className={headingClass}>
                      Live Preview
                    </h3>

                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                      See how your book will look
                    </p>
                  </div>

                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600 dark:bg-violet-500/15 dark:text-violet-400">
                    <WandSparkles size={19} />
                  </span>
                </div>
              </div>

              <div className="p-6">
                <div className="relative flex min-h-[280px] items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-[#eef2ff] via-[#f5f3ff] to-[#fce7f3] p-7 dark:from-slate-800 dark:via-indigo-950/50 dark:to-violet-950/50">
                  <div className="absolute -left-12 -top-12 h-40 w-40 rounded-full bg-indigo-300/20 blur-2xl dark:bg-indigo-500/20" />
                  <div className="absolute -bottom-12 -right-12 h-40 w-40 rounded-full bg-fuchsia-300/20 blur-2xl dark:bg-fuchsia-500/15" />

                  {formData.image.trim() && !imageError ? (
                    <img
                      key={formData.image}
                      src={formData.image}
                      alt="Book cover preview"
                      onError={() => setImageError(true)}
                      className="relative h-60 w-40 rounded-lg object-cover shadow-2xl shadow-indigo-950/20"
                    />
                  ) : (
                    <div className="relative flex h-60 w-40 flex-col items-center justify-center gap-4 rounded-lg border border-white/70 bg-white/75 p-5 text-center shadow-xl dark:border-slate-600 dark:bg-slate-800/80">
                      <BookOpen
                        size={45}
                        className="text-indigo-300 dark:text-indigo-400"
                      />

                      <p className="text-xs font-semibold text-slate-400 dark:text-slate-400">
                        {imageError
                          ? "Unable to load cover"
                          : "Your book cover will appear here"}
                      </p>
                    </div>
                  )}

                  <span className="absolute right-4 top-4 rounded-full bg-white/90 px-3 py-1.5 text-[10px] font-bold text-indigo-600 shadow-sm dark:bg-slate-900/90 dark:text-indigo-400">
                    PREVIEW
                  </span>
                </div>

                <div className="mt-5">
                  <span className="inline-flex rounded-full bg-indigo-50 px-3 py-1.5 text-[11px] font-bold text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-400">
                    {formData.category}
                  </span>

                  <h4 className="mt-3 line-clamp-2 text-xl font-extrabold text-slate-900 dark:text-white">
                    {formData.title.trim() ||
                      "Your Book Title"}
                  </h4>

                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    by{" "}
                    {formData.author.trim() ||
                      "Author Name"}
                  </p>

                  <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4 dark:border-slate-800">
                    <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                      Available Copies
                    </span>

                    <span className="rounded-lg bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400">
                      {formData.totalCopies || 0}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-[28px] bg-[#171b3d] p-7 text-white shadow-xl shadow-indigo-950/10 dark:border dark:border-indigo-500/20 dark:bg-[#111936]">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
                <Sparkles
                  size={23}
                  className="text-violet-300"
                />
              </div>

              <h3 className="text-xl font-bold">
                Make your book stand out.
              </h3>

              <p className="mt-3 text-sm leading-7 text-indigo-100/70">
                A beautiful cover and a thoughtful
                description help readers discover
                something amazing.
              </p>

              <div className="mt-6 space-y-4">
                {[
                  "Use a clear, high-quality cover",
                  "Write an engaging description",
                  "Double-check your book details",
                ].map((tip) => (
                  <div
                    key={tip}
                    className="flex items-start gap-3"
                  >
                    <CheckCircle2
                      size={17}
                      className="mt-0.5 shrink-0 text-emerald-400"
                    />

                    <span className="text-xs leading-6 text-indigo-100/80">
                      {tip}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-2 text-center text-xs text-slate-400 dark:text-slate-500">
          <ShieldCheck size={15} />
          Protected submission powered by Better Auth JWT
        </div>
      </div>
    </main>
  );
}
