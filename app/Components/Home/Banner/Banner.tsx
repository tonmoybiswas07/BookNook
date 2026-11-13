"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, EffectFade } from "swiper/modules";
import Link from "next/link";


import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

export default function Banner() {
  const slides = [
    {
      id: 1,
      title: "Discover Your Next Favorite Book",
      description: "Explore our curated collection of fiction, science, history, and more. Borrow effortlessly and dive into new worlds.",
      image: "https://images.unsplash.com/photo-1507842267340-02553b34b679?q=80&w=1920&auto=format&fit=crop",
    },
    {
      id: 2,
      title: "Expand Your Mind with Science & History",
      description: "Uncover the secrets of the universe and the events that shaped our world. Knowledge is just a click away.",
      image: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?q=80&w=1920&auto=format&fit=crop",
    },
    {
      id: 3,
      title: "Magical Adventures for Kids & Teens",
      description: "Spark imagination and a lifelong love for reading with our wonderful collection of children's literature.",
      image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=1920&auto=format&fit=crop",
    },
  ];

  return (
    <div className="w-full h-[500px] sm:h-[600px] relative">
      <Swiper
        modules={[Autoplay, Pagination, EffectFade]}
        effect={"fade"}
        autoplay={{ delay: 4000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        loop={true}
        className="w-full h-full"
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id} className="relative w-full h-full">
           
            <div 
              className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 scale-105"
              style={{ backgroundImage: `url(${slide.image})` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
            </div>

           
            <div className="relative max-w-7xl mx-auto h-full flex items-center px-4 sm:px-6 lg:px-8">
              <div className="max-w-xl space-y-6 text-white">
                <span className="inline-block px-3.5 py-1 text-xs font-semibold tracking-wider uppercase bg-indigo-600/90 backdrop-blur-md rounded-full text-white">
                  BookNook Library
                </span>
                <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
                  {slide.title}
                </h1>
                <p className="text-base sm:text-lg text-gray-200 font-light">
                  {slide.description}
                </p>
                <div>
                  <Link
                    href="/books"
                    className="inline-flex items-center justify-center px-6 py-3 text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-lg shadow-indigo-600/30 transition-all duration-300 transform hover:-translate-y-0.5"
                  >
                    Browse Books
                  </Link>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}