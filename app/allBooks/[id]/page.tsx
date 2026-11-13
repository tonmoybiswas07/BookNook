export const instant = false;
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  BookOpen,
  User,
  UserRound,
  Tag,
} from "lucide-react";
import { notFound } from "next/navigation";

interface Book {
  _id: string;
  title: string;
  author: string;
  category: string;
  image: string;
  description: string;
  totalCopies: number;
  userName: string;
  userEmail: string;
  addedDate: string;
}

async function getBook(id: string): Promise<Book | null> {
  const res = await fetch(`http://localhost:8000/books/${id}`, {
    cache: "no-store",
  });

  if (res.status === 404) {
    return null;
  }

  if (!res.ok) {
    throw new Error("Failed to fetch book details");
  }

  return res.json();
}

export default async function BookDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const book = await getBook(id);

  if (!book) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-12">
      <div className="mx-auto max-w-6xl">

        {/* Back Button */}
        <Link
          href="/books"
          className="mb-8 inline-flex items-center gap-2 font-medium text-gray-600 transition hover:text-indigo-600"
        >
          <ArrowLeft size={18} />
          Back to Books
        </Link>

        <div className="grid overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-xl md:grid-cols-2">

          {/* Book Image */}
          <div className="relative min-h-[400px] bg-gray-100">
            <Image
              src={book.image}
              alt={book.title}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>

          {/* Book Information */}
          <div className="flex flex-col justify-center p-6 md:p-10">

            {/* Category */}
            <span className="mb-4 flex w-fit items-center gap-2 rounded-full bg-indigo-50 px-4 py-2 text-sm font-semibold text-indigo-600">
              <Tag size={15} />
              {book.category}
            </span>

            {/* Title */}
            <h1 className="mb-4 text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">
              {book.title}
            </h1>

            {/* Author */}
            <div className="mb-6 flex items-center gap-2 text-gray-600">
              <User size={20} />
              <span>By {book.author}</span>
            </div>

            {/* Description */}
            <div className="mb-8">
              <h2 className="mb-3 text-xl font-semibold text-gray-900">
                Book Description
              </h2>

              <p className="text-sm leading-8 text-gray-600">
                {book.description}
              </p>
            </div>

           
{/* Added By */}
<div className="mb-8 rounded-xl border border-gray-100 bg-gray-50 p-5">
  <h2 className="mb-4 text-lg font-semibold text-gray-900">
    Added By
  </h2>

  <div className="flex items-center gap-3">
    <div className="rounded-full bg-indigo-100 p-3 text-indigo-600">
      <UserRound size={22} />
    </div>

    <div>
      <p className="font-semibold capitalize text-gray-900">
        {book.userName || "Unknown User"}
      </p>

      <p className="text-sm text-gray-500">
        {book.userEmail || "No email available"}
      </p>
    </div>
  </div>
</div>

            {/* Borrow Button */}
            <Link
              href={`/borrow/${book._id}`}
              className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-4 font-semibold text-white transition hover:bg-indigo-700"
            >
              <BookOpen size={20} />
              Borrow This Book
            </Link>

          </div>
        </div>
      </div>
    </main>
  );
}
