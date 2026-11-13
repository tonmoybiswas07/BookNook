
"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  LibraryBig,
  Sparkles,
} from "lucide-react";

import { Swiper, SwiperSlide } from "swiper/react";
import {
  Autoplay,
  EffectFade,
  Pagination,
  Navigation,
} from "swiper/modules";

import type { Swiper as SwiperType } from "swiper";

import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/pagination";
import "swiper/css/navigation";

const slides = [
  {
    id: 1,
    eyebrow: "WELCOME TO BOOKNOOK",
    title: "Discover Your Next",
    highlight: "Favorite Book.",
    description:
      "Explore unforgettable stories, inspiring ideas, and timeless knowledge. Your next great reading adventure begins here.",
    image:
      "https://images.unsplash.com/photo-1507842267340-02553b34b679?q=80&w=1920&auto=format&fit=crop",
    label: "Explore the Collection",
  },
  {
    id: 2,
    eyebrow: "READ. LEARN. GROW.",
    title: "Unlock a World of",
    highlight: "Knowledge.",
    description:
      "From fascinating science to remarkable history, discover books that challenge your thinking and expand your imagination.",
    image:
      "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?q=80&w=1920&auto=format&fit=crop",
    label: "Discover Books",
  },
  {
    id: 3,
    eyebrow: "STORIES FOR EVERYONE",
    title: "Every Great Journey",
    highlight: "Starts Here.",
    description:
      "Step into magical worlds, meet extraordinary characters, and create beautiful memories through the power of reading.",
    image:
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=1920&auto=format&fit=crop",
    label: "Start Exploring",
  },
];

export default function Banner() {
  const swiperRef = useRef<SwiperType | null>(null);
  const [activeSlide, setActiveSlide] = useState(0);

  return (
    <section
      aria-label="BookNook featured books"
      className="relative w-full overflow-hidden bg-[#11152e]"
    >
      <Swiper
        modules={[
          Autoplay,
          EffectFade,
          Pagination,
          Navigation,
        ]}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        speed={1000}
        loop
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        pagination={{
          clickable: true,
          el: ".booknook-banner-pagination",
          bulletClass:
            "inline-block h-1.5 w-6 rounded-full bg-white/35 cursor-pointer transition-all duration-300",
          bulletActiveClass:
            "!w-10 !bg-indigo-400",
        }}
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
        }}
        onSlideChange={(swiper) => {
          setActiveSlide(swiper.realIndex);
        }}
        className="h-[580px] w-full sm:h-[650px] lg:h-[710px]"
      >
        {slides.map((slide) => (
          <SwiperSlide
            key={slide.id}
            className="relative h-full w-full"
          >
            {/* Background Image */}
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: `url("${slide.image}")`,
              }}
            />

            {/* Overlays */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#0b1029]/95 via-[#10152f]/85 to-[#10152f]/35" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0b1029]/75 via-transparent to-[#0b1029]/20" />

            {/* Decorative Glow */}
            <div className="pointer-events-none absolute -left-32 top-1/3 h-80 w-80 rounded-full bg-indigo-500/20 blur-[110px]" />
            <div className="pointer-events-none absolute right-0 top-0 h-80 w-80 rounded-full bg-violet-500/10 blur-[110px]" />

            {/* Slide Content */}
            <div className="relative z-10 mx-auto flex h-full max-w-7xl items-center px-4 pb-20 pt-12 sm:px-6 lg:px-8">
              <div className="max-w-3xl text-white">
                {/* Eyebrow */}
                <div className="mb-7 inline-flex items-center gap-2.5 rounded-full border border-white/20 bg-white/10 px-4 py-2.5 backdrop-blur-md">
                  <Sparkles
                    size={15}
                    className="text-indigo-300"
                  />
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-100 sm:text-xs">
                    {slide.eyebrow}
                  </span>
                </div>

                {/* Title */}
                <h1 className="max-w-3xl text-4xl font-extrabold leading-[1.12] tracking-tight sm:text-5xl lg:text-6xl xl:text-7xl">
                  {slide.title}
                  <span className="mt-2 block bg-gradient-to-r from-indigo-300 via-violet-300 to-pink-300 bg-clip-text text-transparent">
                    {slide.highlight}
                  </span>
                </h1>

                {/* Description */}
                <p className="mt-7 max-w-xl text-sm leading-7 text-slate-200/90 sm:text-base sm:leading-8 lg:text-lg">
                  {slide.description}
                </p>

                {/* CTA Buttons */}
                <div className="mt-9 flex flex-wrap items-center gap-4">
                  <Link
                    href="/allBooks"
                    className="group inline-flex items-center justify-center gap-3 rounded-2xl bg-indigo-600 px-6 py-4 text-sm font-bold text-white shadow-xl shadow-indigo-950/30 transition-all duration-300 hover:-translate-y-0.5 hover:bg-indigo-500 sm:px-7"
                  >
                    {slide.label}
                    <ArrowRight
                      size={18}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  </Link>

                  <Link
                    href="/add-books"
                    className="group inline-flex items-center justify-center gap-2 rounded-2xl border border-white/25 bg-white/10 px-6 py-4 text-sm font-semibold text-white backdrop-blur-md transition-all duration-300 hover:border-white/50 hover:bg-white/20 sm:px-7"
                  >
                    <BookOpen size={18} />
                    Share a Book
                    <ArrowUpRight
                      size={16}
                      className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    />
                  </Link>
                </div>

                {/* Feature Tags */}
                <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 text-xs font-medium text-slate-300/90">
                  <span className="inline-flex items-center gap-2">
                    <BookOpen
                      size={16}
                      className="text-indigo-300"
                    />
                    Discover Stories
                  </span>

                  <span className="inline-flex items-center gap-2">
                    <LibraryBig
                      size={16}
                      className="text-indigo-300"
                    />
                    Borrow Books
                  </span>

                  <span className="inline-flex items-center gap-2">
                    <Sparkles
                      size={16}
                      className="text-indigo-300"
                    />
                    Keep Learning
                  </span>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Bottom Navigation */}
      <div className="pointer-events-none absolute bottom-0 left-0 z-20 w-full">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 pb-7 sm:px-6 lg:px-8 lg:pb-10">
          {/* Slide Count */}
          <div className="pointer-events-auto flex items-center gap-3 text-white">
            <span className="text-lg font-extrabold tabular-nums">
              {String(activeSlide + 1).padStart(2, "0")}
            </span>

            <span className="h-px w-9 bg-white/40" />

            <span className="text-sm font-medium tabular-nums text-white/50">
              {String(slides.length).padStart(2, "0")}
            </span>
          </div>

          {/* Pagination */}
          <div className="booknook-banner-pagination pointer-events-auto flex items-center justify-center gap-2" />

          {/* Arrows */}
          <div className="pointer-events-auto flex items-center gap-2">
            <button
              type="button"
              aria-label="Previous slide"
              onClick={() => swiperRef.current?.slidePrev()}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/25 bg-white/10 text-white backdrop-blur-md transition hover:border-indigo-400 hover:bg-indigo-600"
            >
              <ChevronLeft size={20} />
            </button>

            <button
              type="button"
              aria-label="Next slide"
              onClick={() => swiperRef.current?.slideNext()}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/25 bg-white/10 text-white backdrop-blur-md transition hover:border-indigo-400 hover:bg-indigo-600"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
