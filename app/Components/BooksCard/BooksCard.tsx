
import Link from "next/link";
import {
  ArrowUpRight,
  BookOpen,
  CheckCircle2,
  Layers3,
  UserRound,
  XCircle,
} from "lucide-react";

interface Book {
  _id: string;
  title: string;
  author: string;
  category: string;
  image: string;
  description: string;
  totalCopies: number;
}

interface BooksCardProps {
  book: Book;
}

export default function BooksCard({
  book,
}: BooksCardProps) {
  const isAvailable = book.totalCopies > 0;

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-[26px] border border-slate-200/80 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-100/60">
      {/* Book Cover */}
      <div className="relative overflow-hidden bg-gradient-to-br from-indigo-50 via-violet-50 to-slate-100 p-6 sm:p-7">
        <div className="pointer-events-none absolute -left-12 -top-12 h-36 w-36 rounded-full bg-indigo-200/30 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-12 -right-12 h-36 w-36 rounded-full bg-violet-200/40 blur-3xl" />

        <Link
          href={`/allBooks/${book._id}`}
          aria-label={`View details of ${book.title}`}
          className="relative mx-auto block aspect-[4/5] w-full max-w-[210px] overflow-hidden rounded-xl bg-white shadow-xl shadow-indigo-950/15 transition-all duration-500 group-hover:-translate-y-1 group-hover:rotate-1"
        >
          {book.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={book.image}
              alt={`Cover of ${book.title}`}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-indigo-100 p-5 text-center">
              <BookOpen
                size={44}
                className="text-indigo-300"
              />
              <span className="text-xs font-semibold text-indigo-500">
                No Cover Available
              </span>
            </div>
          )}
        </Link>

        {/* Category */}
        <span className="absolute left-4 top-4 inline-flex max-w-[65%] items-center gap-1.5 truncate rounded-full border border-white/80 bg-white/90 px-3 py-1.5 text-[11px] font-bold text-indigo-600 shadow-sm backdrop-blur-md">
          <Layers3 size={12} className="shrink-0" />
          <span className="truncate">
            {book.category}
          </span>
        </span>

        {/* Availability */}
        <span
          className={`absolute right-4 top-4 inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-[11px] font-bold shadow-sm ${
            isAvailable
              ? "bg-emerald-500 text-white"
              : "bg-rose-500 text-white"
          }`}
        >
          {isAvailable ? (
            <CheckCircle2 size={12} />
          ) : (
            <XCircle size={12} />
          )}
          {isAvailable ? "Available" : "Out of Stock"}
        </span>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-6">
        <div className="flex-1">
          <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.14em] text-indigo-500">
            BookNook Collection
          </p>

          <Link href={`/allBooks/${book._id}`}>
            <h3 className="line-clamp-2 min-h-[56px] text-xl font-extrabold leading-7 tracking-tight text-slate-900 transition-colors group-hover:text-indigo-600">
              {book.title}
            </h3>
          </Link>

          <div className="mt-3 flex items-center gap-2 text-sm text-slate-500">
            <UserRound
              size={16}
              className="shrink-0 text-indigo-500"
            />
            <span className="truncate">
              By {book.author}
            </span>
          </div>

          <p className="mt-4 line-clamp-3 min-h-[66px] text-sm leading-[22px] text-slate-500">
            {book.description ||
              "Discover this wonderful book in the BookNook collection."}
          </p>
        </div>

        {/* Footer */}
        <div className="mt-6 flex items-center justify-between gap-3 border-t border-slate-100 pt-5">
          <div>
            <p className="text-[11px] font-medium text-slate-400">
              Available Copies
            </p>

            <p
              className={`mt-1 flex items-center gap-1.5 text-sm font-extrabold ${
                isAvailable
                  ? "text-emerald-600"
                  : "text-rose-600"
              }`}
            >
              <BookOpen size={15} />
              {isAvailable
                ? `${book.totalCopies} Copies`
                : "Unavailable"}
            </p>
          </div>

          <Link
            href={`/allBooks/${book._id}`}
            className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-xs font-bold text-white shadow-md shadow-indigo-500/15 transition-all duration-200 hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-500/25"
          >
            View Details
            <ArrowUpRight size={16} />
          </Link>
        </div>
      </div>
    </article>
  );
}
