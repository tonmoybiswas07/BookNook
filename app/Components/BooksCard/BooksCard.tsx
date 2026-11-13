import Link from "next/link";
import Image from "next/image";
import { User, ArrowRight } from "lucide-react";

export default function BooksCard({ book }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden group">
      
      {/* Book Image */}
      <div className="relative h-64 w-full bg-gray-100 overflow-hidden">
        <Image 
          src={book.image || "https://placehold.co/600x400"} 
          alt={book.title} 
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <span className="absolute top-3 right-3 px-3 py-1 bg-white/90 backdrop-blur-md text-xs font-semibold text-indigo-600 rounded-full shadow-sm">
          {book.category}
        </span>
      </div>

      {/* Book Content */}
      <div className="p-6 flex flex-col flex-grow justify-between space-y-4">
        <div className="space-y-2">
          <h3 className="text-lg font-bold text-gray-900 line-clamp-1 group-hover:text-indigo-600 transition-colors">
            {book.title}
          </h3>
          
          <div className="flex items-center gap-2 text-xs text-gray-500 font-medium">
            <User className="w-3.5 h-3.5 text-indigo-500" />
            <span>{book.author}</span>
          </div>

          <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed pt-1">
            {book.description}
          </p>
        </div>

        {/* Card Footer: View Details Button */}
        <div className="pt-4 border-t border-gray-50 flex items-center justify-between">
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg ${book.totalCopies > 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
            {book.totalCopies > 0 ? `${book.totalCopies} Copies Left` : 'Not Available'}
          </span>

          <Link
            href={`/allBooks/${book._id}`}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 px-4 py-2.5 rounded-xl shadow-sm shadow-indigo-100 transition-all"
          >
            View Details <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

      </div>
    </div>
  );
}