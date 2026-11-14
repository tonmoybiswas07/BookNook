
"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  LibraryBig,
  RefreshCw,
  Sparkles,
  UserRound,
} from "lucide-react";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";

import "swiper/css";
import "swiper/css/pagination";

interface Book {
  _id: string;
  title: string;
  author: string;
  category: string;
  image: string;
}

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:8000";

export default function NewArrivals() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const swiperRef = useRef<SwiperType | null>(null);

  const fetchLatestBooks = async (
    signal?: AbortSignal
  ) => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch(
        `${API_URL}/books/latest`,
        {
          cache: "no-store",
          signal,
        }
      );

      if (!res.ok) {
        throw new Error(
          `Failed to fetch latest books: ${res.status}`
        );
      }

      const data: Book[] = await res.json();

      if (!Array.isArray(data)) {
        throw new Error("Invalid books response");
      }

      if (!signal?.aborted) {
        setBooks(data);
      }
    } catch (err) {
      if (signal?.aborted) return;

      console.error("Latest books error:", err);

      setError(
        "Unable to load new arrivals. Please try again."
      );
    } finally {
      if (!signal?.aborted) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    const controller = new AbortController();

    fetchLatestBooks(controller.signal);

    return () => controller.abort();
  }, []);

  return (
    <section className="relative overflow-hidden bg-[#f8f9fd] py-20 transition-colors duration-300 dark:bg-slate-950 sm:py-24">
      <div className="pointer-events-none absolute -left-32 top-20 h-80 w-80 rounded-full bg-indigo-100/60 blur-3xl dark:bg-indigo-500/10" />

      <div className="pointer-events-none absolute -right-32 bottom-10 h-80 w-80 rounded-full bg-violet-100/60 blur-3xl dark:bg-violet-500/10" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-white px-4 py-2 text-xs font-bold uppercase tracking-[0.15em] text-indigo-600 shadow-sm dark:border-indigo-500/20 dark:bg-indigo-500/10 dark:text-indigo-400 dark:shadow-black/10">
              <Sparkles size={15} />
              Fresh From Our Library
            </span>

            <h2 className="mt-5 text-3xl font-extrabold tracking-tight text-slate-950 dark:text-white sm:text-4xl lg:text-5xl">
              Discover Our{" "}
              <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent dark:from-indigo-400 dark:to-violet-400">
                New Arrivals
              </span>
            </h2>

            <p className="mt-5 max-w-xl text-sm leading-7 text-slate-500 dark:text-slate-400 sm:text-base">
              Fresh stories, inspiring ideas, and
              exciting adventures are waiting for you.
              Explore the newest additions to BookNook.
            </p>
          </div>

          <div className="flex w-fit items-center gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm transition-colors duration-300 dark:border-slate-800 dark:bg-slate-900 dark:shadow-black/20">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-400">
              <LibraryBig size={23} />
            </div>

            <div>
              <p className="text-2xl font-extrabold text-slate-900 dark:text-white">
                {loading
                  ? "..."
                  : String(books.length).padStart(2, "0")}
              </p>

              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                Latest Books
              </p>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="overflow-hidden rounded-[28px] border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900"
              >
                <div className="flex h-72 animate-pulse items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-800">
                  <BookOpen
                    size={40}
                    className="text-slate-200 dark:text-slate-700"
                  />
                </div>

                <div className="space-y-4 py-6">
                  <div className="h-4 w-24 animate-pulse rounded bg-slate-100 dark:bg-slate-800" />

                  <div className="h-7 w-4/5 animate-pulse rounded bg-slate-100 dark:bg-slate-800" />

                  <div className="h-5 w-1/2 animate-pulse rounded bg-slate-100 dark:bg-slate-800" />

                  <div className="h-12 animate-pulse rounded-xl bg-slate-100 dark:bg-slate-800" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="rounded-[28px] border border-rose-100 bg-white px-6 py-16 text-center shadow-sm dark:border-rose-500/20 dark:bg-slate-900 dark:shadow-black/20">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-50 text-rose-500 dark:bg-rose-500/10 dark:text-rose-400">
              <RefreshCw size={28} />
            </div>

            <h3 className="mt-5 text-xl font-bold text-slate-900 dark:text-white">
              Something went wrong
            </h3>

            <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-slate-500 dark:text-slate-400">
              {error}
            </p>

            <button
              type="button"
              onClick={() => fetchLatestBooks()}
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600"
            >
              <RefreshCw size={16} />
              Try Again
            </button>
          </div>
        ) : books.length === 0 ? (
          <div className="rounded-[28px] border border-dashed border-slate-300 bg-white px-6 py-20 text-center dark:border-slate-700 dark:bg-slate-900">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-500 dark:bg-indigo-500/10 dark:text-indigo-400">
              <BookOpen size={36} />
            </div>

            <h3 className="mt-5 text-2xl font-extrabold text-slate-900 dark:text-white">
              No New Arrivals Yet
            </h3>

            <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-slate-500 dark:text-slate-400">
              Our collection is always growing.
              Check back soon for more exciting books.
            </p>

            <Link
              href="/allBooks"
              className="mt-6 inline-flex items-center gap-2 font-bold text-indigo-600 transition hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
            >
              Explore All Books
              <ArrowRight size={17} />
            </Link>
          </div>
        ) : (
          <div className="relative">
            <div className="mb-6 flex items-center justify-end gap-3">
              <button
                type="button"
                aria-label="Previous books"
                onClick={() =>
                  swiperRef.current?.slidePrev()
                }
                className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:border-indigo-600 hover:bg-indigo-600 hover:text-white dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-indigo-500 dark:hover:bg-indigo-500 dark:hover:text-white"
              >
                <ChevronLeft size={20} />
              </button>

              <button
                type="button"
                aria-label="Next books"
                onClick={() =>
                  swiperRef.current?.slideNext()
                }
                className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:border-indigo-600 hover:bg-indigo-600 hover:text-white dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-indigo-500 dark:hover:bg-indigo-500 dark:hover:text-white"
              >
                <ChevronRight size={20} />
              </button>
            </div>

            <Swiper
              modules={[Autoplay, Pagination]}
              onSwiper={(swiper) => {
                swiperRef.current = swiper;
              }}
              slidesPerView={1}
              spaceBetween={20}
              autoplay={
                books.length > 1
                  ? {
                      delay: 3500,
                      disableOnInteraction: false,
                      pauseOnMouseEnter: true,
                    }
                  : false
              }
              pagination={{
                clickable: true,
                dynamicBullets: true,
              }}
              breakpoints={{
                640: {
                  slidesPerView: 2,
                  spaceBetween: 20,
                },
                1024: {
                  slidesPerView: 3,
                  spaceBetween: 24,
                },
              }}
              className="!pb-14 !pt-2"
            >
              {books.map((book) => (
                <SwiperSlide
                  key={book._id}
                  className="!h-auto"
                >
                  <article className="group flex h-full flex-col overflow-hidden rounded-[28px] border border-slate-200/80 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-100/50 dark:border-slate-800 dark:bg-slate-900 dark:shadow-black/20 dark:hover:border-indigo-500/40 dark:hover:shadow-indigo-950/30">
                    <div className="relative overflow-hidden bg-gradient-to-br from-indigo-50 via-violet-50 to-slate-100 p-7 dark:from-slate-800 dark:via-indigo-950/40 dark:to-slate-900">
                      <Link
                        href={`/allBooks/${book._id}`}
                        aria-label={`View ${book.title}`}
                        className="mx-auto block aspect-[4/5] w-full max-w-[210px] overflow-hidden rounded-xl bg-white shadow-xl shadow-indigo-950/15 transition-transform duration-500 group-hover:-translate-y-1 dark:bg-slate-800 dark:shadow-black/40"
                      >
                        {book.image ? (
                          <img
                            src={book.image}
                            alt={book.title}
                            loading="lazy"
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <div className="flex h-full flex-col items-center justify-center gap-3 bg-indigo-100 text-indigo-400 dark:bg-indigo-500/10">
                            <BookOpen size={44} />
                            <span className="text-xs font-semibold">
                              No Cover
                            </span>
                          </div>
                        )}
                      </Link>

                      <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 text-[11px] font-bold text-indigo-600 shadow-sm dark:bg-slate-900/95 dark:text-indigo-400">
                        <Sparkles size={12} />
                        New Arrival
                      </span>

                      <span className="absolute bottom-4 right-4 max-w-[75%] truncate rounded-full bg-indigo-600 px-3 py-1.5 text-[11px] font-bold text-white shadow-sm dark:bg-indigo-500">
                        {book.category}
                      </span>
                    </div>

                    <div className="flex flex-1 flex-col p-6">
                      <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-indigo-500 dark:text-indigo-400">
                        BookNook Collection
                      </p>

                      <Link
                        href={`/allBooks/${book._id}`}
                        className="mt-3"
                      >
                        <h3 className="line-clamp-2 min-h-14 text-xl font-extrabold leading-7 tracking-tight text-slate-900 transition-colors group-hover:text-indigo-600 dark:text-white dark:group-hover:text-indigo-400">
                          {book.title}
                        </h3>
                      </Link>

                      <div className="mt-4 flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-400">
                          <UserRound size={19} />
                        </div>

                        <div className="min-w-0">
                          <p className="text-xs text-slate-400 dark:text-slate-500">
                            Written by
                          </p>

                          <p className="truncate text-sm font-semibold text-slate-700 dark:text-slate-200">
                            {book.author}
                          </p>
                        </div>
                      </div>

                      <div className="mt-auto border-t border-slate-100 pt-5 dark:border-slate-800">
                        <Link
                          href={`/allBooks/${book._id}`}
                          className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3.5 text-sm font-bold text-white shadow-md shadow-indigo-500/15 transition hover:bg-indigo-700 dark:bg-indigo-500 dark:shadow-indigo-950/30 dark:hover:bg-indigo-600"
                        >
                          View Book Details
                          <ArrowUpRight size={18} />
                        </Link>
                      </div>
                    </div>
                  </article>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        )}

        <div className="mt-8 flex flex-col items-center justify-center gap-4 text-center">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Looking for more books to explore?
          </p>

          <Link
            href="/allBooks"
            className="group inline-flex items-center gap-3 rounded-2xl border-2 border-indigo-600 bg-white px-8 py-3.5 text-sm font-bold text-indigo-600 transition-all duration-300 hover:bg-indigo-600 hover:text-white dark:border-indigo-400 dark:bg-slate-900 dark:text-indigo-400 dark:hover:bg-indigo-500 dark:hover:text-white"
          >
            Explore All Books

            <ArrowRight
              size={18}
              className="transition-transform group-hover:translate-x-1"
            />
          </Link>
        </div>
      </div>
    </section>
  );
}
