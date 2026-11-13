import { BookOpen } from "lucide-react";
import BooksCard from "../Components/BooksCard/BooksCard";


export default async function AllBooksPage() {
  let books = [];
  try {
    const res = await fetch("http://localhost:8000/books", {
      cache: "no-store",
    });
    if (res.ok) {
      books = await res.json();
    }
  } catch (err) {
    console.error("Failed to fetch books:", err);
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      
      {/* Page Header */}
      <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
        <span className="text-xs font-semibold tracking-wider text-indigo-600 uppercase bg-indigo-50 px-3 py-1 rounded-full">
          Library Collection
        </span>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900">
          Explore All Books
        </h1>
        <p className="text-sm sm:text-base text-gray-500">
          Discover thousands of stories, educational reads, and exciting adventures. Borrow your favorite today.
        </p>
      </div>

      {/* Books Grid (3 cards per row on desktop) */}
      {books.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-3xl border border-gray-100">
          <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-gray-700">No books found</h3>
          <p className="text-sm text-gray-400 mt-1">Please make sure your backend server is running.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {books.map((book) => (
            <BooksCard key={book._id} book={book} />
          ))}
        </div>
      )}

    </div>
  );
}