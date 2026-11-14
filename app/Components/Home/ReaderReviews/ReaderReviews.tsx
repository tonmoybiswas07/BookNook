
"use client";

import { useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Quote,
  Sparkles,
  Star,
  UserRound,
} from "lucide-react";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";

import "swiper/css";
import "swiper/css/pagination";

const reviews = [
  {
    id: 1,
    name: "Sarah Jenkins",
    role: "Avid Reader",
    comment:
      "BookNook has completely changed how I find and read books. The borrowing system is so seamless and fast!",
    rating: 5,
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop",
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "Science Enthusiast",
    comment:
      "Finding science and history books used to be a hassle. With BookNook, I can browse and borrow within seconds.",
    rating: 5,
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop",
  },
  {
    id: 3,
    name: "Jessica Taylor",
    role: "Fiction Lover",
    comment:
      "The UI is so minimalistic and clean! I love tracking my borrowed books and returning them without any stress.",
    rating: 5,
    avatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop",
  },
  {
    id: 4,
    name: "David Miller",
    role: "History Researcher",
    comment:
      "An incredible collection of historical literature. The interface is clean, fast, and very user-friendly.",
    rating: 5,
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop",
  },
  {
    id: 5,
    name: "Emma Watson",
    role: "Student & Bookworm",
    comment:
      "Being able to see total available copies and borrow instantly makes studying and reading so much easier!",
    rating: 5,
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200&auto=format&fit=crop",
  },
  {
    id: 6,
    name: "Liam O'Connor",
    role: "Fantasy Fanatic",
    comment:
      "Simply the best online library project. The navigation and book detail pages are brilliantly designed.",
    rating: 5,
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200&auto=format&fit=crop",
  },
];

export default function ReaderReviews() {
  const swiperRef = useRef<SwiperType | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section className="relative overflow-hidden bg-white py-20 transition-colors duration-300 dark:bg-slate-950 sm:py-24">
      <div className="pointer-events-none absolute -left-32 top-10 h-80 w-80 rounded-full bg-indigo-100/50 blur-3xl dark:bg-indigo-500/10" />

      <div className="pointer-events-none absolute -right-32 bottom-0 h-80 w-80 rounded-full bg-violet-100/50 blur-3xl dark:bg-violet-500/10" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-indigo-600 dark:border-indigo-500/20 dark:bg-indigo-500/10 dark:text-indigo-400">
              <Sparkles size={15} />
              Reader Testimonials
            </span>

            <h2 className="mt-5 text-3xl font-extrabold tracking-tight text-slate-950 dark:text-white sm:text-4xl lg:text-5xl">
              What Our{" "}
              <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent dark:from-indigo-400 dark:to-violet-400">
                Readers Say
              </span>
            </h2>

            <p className="mt-5 max-w-xl text-sm leading-7 text-slate-500 dark:text-slate-400 sm:text-base">
              Discover what makes BookNook special
              through the experiences and stories
              shared by our reading community.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              aria-label="Previous review"
              onClick={() =>
                swiperRef.current?.slidePrev()
              }
              className="flex h-12 w-12 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition-all hover:border-indigo-600 hover:bg-indigo-600 hover:text-white dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-indigo-500 dark:hover:bg-indigo-500 dark:hover:text-white"
            >
              <ArrowLeft size={19} />
            </button>

            <button
              type="button"
              aria-label="Next review"
              onClick={() =>
                swiperRef.current?.slideNext()
              }
              className="flex h-12 w-12 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition-all hover:border-indigo-600 hover:bg-indigo-600 hover:text-white dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-indigo-500 dark:hover:bg-indigo-500 dark:hover:text-white"
            >
              <ArrowRight size={19} />
            </button>
          </div>
        </div>

        <Swiper
          modules={[Autoplay, Pagination]}
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
          }}
          onSlideChange={(swiper) => {
            setActiveIndex(swiper.realIndex);
          }}
          spaceBetween={24}
          slidesPerView={1}
          breakpoints={{
            640: {
              slidesPerView: 1,
              spaceBetween: 20,
            },
            768: {
              slidesPerView: 2,
              spaceBetween: 24,
            },
            1024: {
              slidesPerView: 3,
              spaceBetween: 24,
            },
          }}
          autoplay={{
            delay: 4000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          pagination={{
            clickable: true,
            dynamicBullets: true,
          }}
          loop={true}
          className="!pb-16 !pt-3"
        >
          {reviews.map((review) => (
            <SwiperSlide
              key={review.id}
              className="!h-auto"
            >
              <article className="group relative flex h-full min-h-[310px] flex-col overflow-hidden rounded-[28px] border border-slate-200/80 bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-100/50 dark:border-slate-800 dark:bg-slate-900 dark:shadow-black/20 dark:hover:border-indigo-500/40 dark:hover:shadow-indigo-950/30 sm:p-8">
                <Quote
                  size={58}
                  strokeWidth={1.2}
                  className="pointer-events-none absolute right-6 top-6 rotate-180 text-indigo-100 transition-colors group-hover:text-indigo-200 dark:text-indigo-500/10 dark:group-hover:text-indigo-500/20"
                />

                <div className="relative z-10 flex items-center gap-1">
                  {Array.from(
                    { length: 5 },
                    (_, index) => (
                      <Star
                        key={index}
                        size={17}
                        className={
                          index < review.rating
                            ? "fill-amber-400 text-amber-400"
                            : "fill-slate-100 text-slate-200 dark:fill-slate-800 dark:text-slate-700"
                        }
                      />
                    )
                  )}

                  <span className="ml-2 text-xs font-bold text-slate-500 dark:text-slate-400">
                    {review.rating}.0
                  </span>
                </div>

                <div className="relative z-10 mt-7 flex-1">
                  <p className="text-sm leading-8 text-slate-600 dark:text-slate-300 sm:text-[15px]">
                    &ldquo;{review.comment}&rdquo;
                  </p>
                </div>

                <div className="relative z-10 mt-8 flex items-center gap-3 border-t border-slate-100 pt-6 dark:border-slate-800">
                  <div className="h-12 w-12 shrink-0 overflow-hidden rounded-full border-2 border-indigo-100 bg-indigo-50 dark:border-indigo-500/30 dark:bg-indigo-500/10">
                    {review.avatar ? (
                      <img
                        src={review.avatar}
                        alt={`${review.name} avatar`}
                        loading="lazy"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-indigo-500 dark:text-indigo-400">
                        <UserRound size={22} />
                      </div>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3 className="truncate text-sm font-extrabold text-slate-900 dark:text-white">
                      {review.name}
                    </h3>

                    <p className="mt-1 truncate text-xs font-medium text-indigo-600 dark:text-indigo-400">
                      {review.role}
                    </p>
                  </div>

                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-400">
                    <BookOpen size={17} />
                  </span>
                </div>
              </article>
            </SwiperSlide>
          ))}
        </Swiper>

        <div className="mt-2 flex flex-col items-center justify-between gap-5 border-t border-slate-100 pt-8 dark:border-slate-800 sm:flex-row">
          <div className="flex items-center gap-3">
            <div className="flex -space-x-3">
              {reviews.slice(0, 4).map((review) => (
                <div
                  key={review.id}
                  className="h-10 w-10 overflow-hidden rounded-full border-[3px] border-white bg-indigo-50 dark:border-slate-950 dark:bg-indigo-500/10"
                >
                  <img
                    src={review.avatar}
                    alt={review.name}
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                </div>
              ))}
            </div>

            <div>
              <p className="text-sm font-bold text-slate-900 dark:text-white">
                Reader Experiences
              </p>

              <p className="text-xs text-slate-500 dark:text-slate-400">
                Stories from our book community
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-sm font-extrabold tabular-nums text-indigo-600 dark:text-indigo-400">
              {String(activeIndex + 1).padStart(2, "0")}
            </span>

            <span className="h-px w-10 bg-slate-300 dark:bg-slate-700" />

            <span className="text-sm font-medium tabular-nums text-slate-400 dark:text-slate-500">
              {String(reviews.length).padStart(2, "0")}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
