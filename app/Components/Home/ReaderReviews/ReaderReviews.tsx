"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import { Star, Quote } from "lucide-react";
import Image from "next/image";

// Swiper styles
import "swiper/css";
import "swiper/css/pagination";

export default function ReaderReviews() {
  const reviews = [
    {
      id: 1,
      name: "Sarah Jenkins",
      role: "Avid Reader",
      comment: "BookNook has completely changed how I find and read books. The borrowing system is so seamless and fast!",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop",
    },
    {
      id: 2,
      name: "Michael Chen",
      role: "Science Enthusiast",
      comment: "Finding science and history books used to be a hassle. With BookNook, I can browse and borrow within seconds.",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop",
    },
    {
      id: 3,
      name: "Jessica Taylor",
      role: "Fiction Lover",
      comment: "The UI is so minimalistic and clean! I love tracking my borrowed books and returning them without any stress.",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop",
    },
    {
      id: 4,
      name: "David Miller",
      role: "History Researcher",
      comment: "An incredible collection of historical literature. The interface is clean, fast, and very user-friendly.",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop",
    },
    {
      id: 5,
      name: "Emma Watson",
      role: "Student & Bookworm",
      comment: "Being able to see total available copies and borrow instantly makes studying and reading so much easier!",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200&auto=format&fit=crop",
    },
    {
      id: 6,
      name: "Liam O'Connor",
      role: "Fantasy Fanatic",
      comment: "Simply the best online library project. The navigation and book detail pages are brilliantly designed.",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200&auto=format&fit=crop",
    },
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto mb-16">
        <span className="text-xs font-semibold tracking-wider text-indigo-600 uppercase bg-indigo-50 px-3 py-1 rounded-full">
          Testimonials
        </span>
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 mt-3">
          What Our Readers Say
        </h2>
        <p className="text-gray-500 mt-2 text-sm sm:text-base">
          Hear from members of our community who love discovering and sharing books through BookNook.
        </p>
      </div>

      {/* Reviews Slider */}
      <Swiper
        modules={[Autoplay, Pagination]}
        spaceBetween={24}
        slidesPerView={1}
        breakpoints={{
          640: { slidesPerView: 1 },
          768: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        }}
        autoplay={{
          delay: 3500,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
        }}
        loop={true}
        className="pb-14"
      >
        {reviews.map((review) => (
          <SwiperSlide key={review.id} className="h-auto">
            <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow relative flex flex-col justify-between h-full min-h-[240px]">
              <div className="absolute top-6 right-6 text-indigo-100">
                <Quote className="w-10 h-10 rotate-180 opacity-50" />
              </div>

              <div className="space-y-4">
                {/* Rating Stars */}
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>

                {/* Comment */}
                <p className="text-gray-600 text-sm leading-relaxed">
                  "{review.comment}"
                </p>
              </div>

              {/* User Info */}
              <div className="flex items-center gap-4 pt-6 mt-6 border-t border-gray-50">
                <div className="relative w-11 h-11 rounded-full overflow-hidden ring-2 ring-indigo-50 flex-shrink-0">
                  <Image 
                    src={review.avatar} 
                    alt={review.name} 
                    width={44}
                    height={44}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-900">{review.name}</h4>
                  <p className="text-xs text-indigo-600 font-medium">{review.role}</p>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}