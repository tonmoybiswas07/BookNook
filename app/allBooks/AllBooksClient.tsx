
"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  LibraryBig,
  Plus,
  Search,
  SlidersHorizontal,
  Sparkles,
  X,
} from "lucide-react";

import BooksCard from "../Components/BooksCard/BooksCard";
import type { Book } from "./page";

interface Props {
  books: Book[];
}

export default function AllBooksClient({ books }: Props) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All Books");
  const [sort, setSort] = useState("default");

  const categories = useMemo(() => {
    return [
      "All Books",
      ...Array.from(
        new Set(books.map((book) => book.category))
      ).sort(),
    ];
  }, [books]);

  const totalCopies = books.reduce(
    (sum, book) => sum + Math.max(0, book.totalCopies),
    0
  );

  const availableBooks = books.filter(
    (book) => book.totalCopies > 0
  ).length;

  const filteredBooks = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    const result = books.filter((book) => {
      const matchesSearch =
        book.title.toLowerCase().includes(keyword) ||
        book.author.toLowerCase().includes(keyword) ||
        book.category.toLowerCase().includes(keyword);

      const matchesCategory =
        category === "All Books" ||
        book.category === category;

      return matchesSearch && matchesCategory;
    });

    if (sort === "title-asc") {
      result.sort((a, b) =>
        a.title.localeCompare(b.title)
      );
    }

    if (sort === "title-desc") {
      result.sort((a, b) =>
        b.title.localeCompare(a.title)
      );
    }

    if (sort === "copies") {
      result.sort(
        (a, b) => b.totalCopies - a.totalCopies
      );
    }

    return result;
  }, [books, search, category, sort]);

  const clearFilters = () => {
    setSearch("");
    setCategory("All Books");
    setSort("default");
  };

  const inputClass =
    "w-full appearance-none rounded-2xl border border-slate-200 bg-slate-50 py-3.5 text-sm text-slate-900 outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-indigo-500 dark:focus:bg-slate-800 dark:focus:ring-indigo-500/20";

  return (
    <>
      <section className="relative overflow-hidden bg-[#111633] text-white dark:bg-[#080d20]">
        <div className="pointer-events-none absolute -left-32 -top-40 h-[420px] w-[420px] rounded-full bg-indigo-600/20 blur-[100px]" />
        <div className="pointer-events-none absolute -bottom-48 right-0 h-[420px] w-[420px] rounded-full bg-violet-600/20 blur-[100px]" />

        <div className="pointer-events-none absolute right-[12%] top-14 hidden rotate-[-15deg] text-white/[0.04] lg:block">
          <BookOpen size={280} strokeWidth={0.8} />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-indigo-200">
              <Sparkles size={14} />
              The BookNook Collection
            </span>

            <h1 className="mt-7 text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              Your next great read
              <span className="block bg-gradient-to-r from-indigo-300 via-violet-300 to-pink-300 bg-clip-text text-transparent">
                starts right here.
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-sm leading-8 text-slate-300 sm:text-base">
              Discover captivating stories, timeless
              classics, and inspiring ideas. Explore
              our growing collection and find the
              perfect book for every chapter of life.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#collection"
                className="inline-flex items-center gap-2 rounded-2xl bg-white px-6 py-3.5 text-sm font-bold text-indigo-950 transition hover:bg-indigo-50"
              >
                Explore Collection
                <ArrowRight size={17} />
              </a>

              <Link
                href="/add-books"
                className="inline-flex items-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-white/15"
              >
                <Plus size={17} />
                Contribute a Book
              </Link>
            </div>
          </div>

          <div className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:max-w-2xl">
            {[
              {
                icon: LibraryBig,
                value: books.length,
                label: "Total Titles",
              },
              {
                icon: BookOpen,
                value: totalCopies,
                label: "Total Copies",
              },
              {
                icon: CheckCircle2,
                value: availableBooks,
                label: "Available Titles",
              },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border border-white/10 bg-white/[0.06] p-5 backdrop-blur-sm dark:border-indigo-400/10 dark:bg-white/[0.04]"
              >
                <stat.icon
                  size={20}
                  className="mb-3 text-indigo-300"
                />

                <p className="text-3xl font-extrabold">
                  {stat.value}
                </p>

                <p className="mt-1 text-xs text-slate-300">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        id="collection"
        className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20"
      >
        <div className="mb-9 flex flex-wrap items-end justify-between gap-5">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.18em] text-indigo-600 dark:text-indigo-400">
              Browse the Shelves
            </span>

            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-950 dark:text-white sm:text-4xl">
              Explore Our Library
            </h2>

            <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
              A world of knowledge, one book at a time.
            </p>
          </div>

          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-4 py-2 text-xs font-bold text-indigo-600 dark:border-indigo-500/20 dark:bg-indigo-500/10 dark:text-indigo-400">
            <BookOpen size={15} />
            {filteredBooks.length} Books Found
          </div>
        </div>

        <div className="mb-8 rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900 dark:shadow-black/20 sm:p-6">
          <div className="grid gap-4 lg:grid-cols-[1fr_220px_200px]">
            <div className="relative">
              <Search
                size={19}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="search"
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                placeholder="Search books, authors, categories..."
                aria-label="Search books"
                className={`${inputClass} pl-12 pr-4 placeholder:text-slate-400 dark:placeholder:text-slate-500`}
              />
            </div>

            <div className="relative">
              <SlidersHorizontal
                size={17}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <select
                value={category}
                onChange={(e) =>
                  setCategory(e.target.value)
                }
                aria-label="Filter by category"
                className={`${inputClass} pl-11 pr-10 font-medium`}
              >
                {categories.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>

              <ChevronDown
                size={17}
                className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
              />
            </div>

            <div className="relative">
              <select
                value={sort}
                onChange={(e) =>
                  setSort(e.target.value)
                }
                aria-label="Sort books"
                className={`${inputClass} px-4 pr-10 font-medium`}
              >
                <option value="default">
                  Default Order
                </option>
                <option value="title-asc">
                  Title: A to Z
                </option>
                <option value="title-desc">
                  Title: Z to A
                </option>
                <option value="copies">
                  Most Available
                </option>
              </select>

              <ChevronDown
                size={17}
                className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
              />
            </div>
          </div>
        </div>

        <div className="mb-9 flex flex-wrap gap-2">
          {categories.map((item) => {
            const active = category === item;

            return (
              <button
                key={item}
                type="button"
                onClick={() => setCategory(item)}
                className={`rounded-full border px-5 py-2.5 text-xs font-semibold transition-all duration-200 ${
                  active
                    ? "border-indigo-600 bg-indigo-600 text-white shadow-md shadow-indigo-500/20"
                    : "border-slate-200 bg-white text-slate-600 hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-indigo-500/40 dark:hover:bg-indigo-500/10 dark:hover:text-indigo-400"
                }`}
              >
                {item}
              </button>
            );
          })}
        </div>

        {filteredBooks.length > 0 ? (
          <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3 xl:gap-8">
            {filteredBooks.map((book) => (
              <BooksCard
                key={book._id}
                book={book}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-[32px] border border-dashed border-slate-200 bg-white px-6 py-20 text-center shadow-sm dark:border-slate-700 dark:bg-slate-900 dark:shadow-black/20">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-indigo-50 dark:bg-indigo-500/10">
              <BookOpen
                size={35}
                className="text-indigo-300 dark:text-indigo-400"
              />
            </div>

            <h3 className="mt-6 text-xl font-bold text-slate-900 dark:text-white">
              No books found
            </h3>

            <p className="mx-auto mt-3 max-w-sm text-sm leading-7 text-slate-500 dark:text-slate-400">
              {books.length === 0
                ? "Our library is currently empty. Be the first to contribute a book!"
                : "We couldn't find any books matching your search. Try another keyword or category."}
            </p>

            {books.length > 0 ? (
              <button
                type="button"
                onClick={clearFilters}
                className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
              >
                <X size={17} />
                Clear Filters
              </button>
            ) : (
              <Link
                href="/add-books"
                className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
              >
                <Plus size={17} />
                Add a Book
              </Link>
            )}
          </div>
        )}

        {books.length > 0 && (
          <div className="mt-16 flex flex-col items-start justify-between gap-6 rounded-[28px] bg-gradient-to-r from-indigo-600 to-violet-600 p-8 text-white sm:flex-row sm:items-center sm:p-10">
            <div>
              <h3 className="text-2xl font-bold">
                Have a book worth sharing?
              </h3>

              <p className="mt-2 max-w-lg text-sm leading-7 text-indigo-100">
                Every contribution makes our community
                library a little more extraordinary.
              </p>
            </div>

            <Link
              href="/add-books"
              className="inline-flex shrink-0 items-center gap-2 rounded-2xl bg-white px-6 py-3.5 text-sm font-bold text-indigo-700 transition hover:bg-indigo-50"
            >
              Contribute a Book
              <ArrowRight size={17} />
            </Link>
          </div>
        )}
      </section>
    </>
  );
}
