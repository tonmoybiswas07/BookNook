
import { BookOpen } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex min-h-[75vh] flex-col items-center justify-center bg-white px-4">
      <div className="relative flex h-20 w-20 items-center justify-center">
        <div className="absolute inset-0 animate-spin rounded-full border-4 border-indigo-100 border-t-indigo-600" />
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-indigo-50">
          <BookOpen className="h-7 w-7 text-indigo-600" />
        </div>
      </div>

      <h2 className="mt-7 text-xl font-bold text-gray-900">
        BookNook
      </h2>

      <p className="mt-2 text-sm text-gray-500">
        Loading your library...
      </p>

      <div className="mt-5 flex items-center gap-1.5">
        {[0, 1, 2].map((item) => (
          <span
            key={item}
            className="h-2 w-2 animate-pulse rounded-full bg-indigo-400"
          />
        ))}
      </div>
    </div>
  );
}
