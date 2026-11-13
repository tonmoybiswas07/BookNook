
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  UserRound,
  Sparkles,
  LibraryBig,
} from "lucide-react";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

interface Book {
  _id: string;
  title: string;
  author: string;
  category: string;
  image: string;
}

export default function NewArrivals() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLatestBooks = async () => {
      try {
        const res = await fetch("http://localhost:8000/books/latest");

        if (!res.ok) {
          throw new Error("Failed to fetch latest books");
        }

        const data: Book[] = await res.json();
        setBooks(data);
      } catch (error) {
        console.error("Latest books error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLatestBooks();
  }, []);

  return (
    <section className="relative overflow-hidden bg-slate-50 py-20 sm:py-24">

      {/* Background Decoration */}
      <div className="pointer-events-none absolute -left-32 top-20 h-72 w-72 rounded-full bg-indigo-100/60 blur-3xl" />
      <div className="pointer-events-none absolute -right-32 bottom-10 h-72 w-72 rounded-full bg-purple-100/60 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">

          <div className="max-w-2xl">

            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-white px-4 py-2 text-sm font-semibold text-indigo-600 shadow-sm">
              <Sparkles size={16} />
              Fresh From Our Library
            </div>

            <h2 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
              Discover Our
              <span className="mt-2 block text-indigo-600">
                New Arrivals
              </span>
            </h2>

            <p className="mt-5 max-w-xl text-base leading-7 text-slate-500 sm:text-lg">
              Explore the latest additions to our library.
              Find inspiring stories, fresh ideas, and your next
              favorite book.
            </p>

          </div>

          <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm">

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
              <LibraryBig size={24} />
            </div>

            <div>
              <p className="text-2xl font-extrabold text-slate-900">
                {loading ? "..." : books.length.toString().padStart(2, "0")}
              </p>
              <p className="text-xs font-medium text-slate-500">
                Latest Books
              </p>
            </div>

          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="overflow-hidden rounded-3xl border border-slate-200 bg-white"
              >
                <div className="h-64 animate-pulse bg-slate-200" />

                <div className="space-y-4 p-6">
                  <div className="h-5 w-24 animate-pulse rounded-full bg-slate-200" />
                  <div className="h-7 w-3/4 animate-pulse rounded bg-slate-200" />
                  <div className="h-4 w-1/2 animate-pulse rounded bg-slate-200" />
                  <div className="h-12 animate-pulse rounded-xl bg-slate-200" />
                </div>
              </div>
            ))}
          </div>
        ) : books.length === 0 ? (

          /* Empty State */
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-20 text-center shadow-sm">

            <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-indigo-50 text-indigo-500">
              <BookOpen size={38} />
            </div>

            <h3 className="text-2xl font-bold text-slate-800">
              No Books Available
            </h3>

            <p className="mx-auto mt-3 max-w-md text-slate-500">
              Our library is getting ready for new stories.
              Please check back soon for the latest arrivals.
            </p>

          </div>

        ) : (

          /* Books Slider */
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={24}
            slidesPerView={1}
            navigation
            pagination={{
              clickable: true,
              dynamicBullets: true,
            }}
            autoplay={{
              delay: 3500,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            loop={books.length > 3}
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
            className="new-arrivals-swiper !pb-16 !pt-2"
          >

            {books.map((book) => (
              <SwiperSlide key={book._id} className="h-auto">

                <div className="group flex h-full flex-col overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm transition-all duration-500 hover:-translate-y-2 hover:border-indigo-200 hover:shadow-2xl">

                  {/* Image */}
                  <div className="relative h-72 overflow-hidden bg-slate-100">

                    <Image
                      src={book.image}
                      alt={book.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />

                    {/* Image Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/50 via-transparent to-transparent opacity-70" />

                    {/* New Badge */}
                    <div className="absolute left-5 top-5 inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/95 px-4 py-2 text-xs font-bold text-indigo-600 shadow-lg backdrop-blur">
                      <Sparkles size={14} />
                      New Arrival
                    </div>

                    {/* Category */}
                    <div className="absolute bottom-5 left-5">
                      <span className="rounded-full bg-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-lg">
                        {book.category}
                      </span>
                    </div>

                  </div>

                  {/* Book Details */}
                  <div className="flex flex-1 flex-col p-6">

                    <div className="flex-1">

                      <h3 className="line-clamp-1 text-2xl font-bold text-slate-900 transition-colors group-hover:text-indigo-600">
                        {book.title}
                      </h3>

                      <div className="mt-4 flex items-center gap-3">

                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
                          <UserRound size={19} />
                        </div>

                        <div>
                          <p className="text-xs font-medium text-slate-400">
                            Written by
                          </p>

                          <p className="text-sm font-semibold text-slate-700">
                            {book.author}
                          </p>
                        </div>

                      </div>

                    </div>

                    <div className="my-6 border-t border-slate-100" />

                    {/* View Details */}
                    <Link
                      href={`/allBooks/${book._id}`}
                      className="flex w-full items-center justify-center gap-3 rounded-xl bg-indigo-600 px-5 py-3.5 font-semibold text-white shadow-lg shadow-indigo-100 transition-all duration-300 hover:bg-indigo-700 hover:shadow-indigo-200"
                    >
                      View Book Details
                      <ArrowRight
                        size={19}
                        className="transition-transform group-hover:translate-x-1"
                      />
                    </Link>

                  </div>

                </div>

              </SwiperSlide>
            ))}

          </Swiper>
        )}

        {/* Bottom CTA */}
        <div className="mt-8 flex flex-col items-center justify-center gap-4 text-center">

          <p className="text-sm text-slate-500">
            Looking for more books to explore?
          </p>

          <Link
            href="/allBooks"
            className="group inline-flex items-center gap-3 rounded-xl border-2 border-indigo-600 bg-white px-8 py-3.5 font-bold text-indigo-600 transition-all duration-300 hover:bg-indigo-600 hover:text-white"
          >
            Explore All Books

            <ArrowRight
              size={19}
              className="transition-transform group-hover:translate-x-1"
            />
          </Link>

        </div>

      </div>
    </section>
  );
}
