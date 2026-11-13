import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function TopCategories() {
  const categories = [
    { name: "Fiction", count: "120+ Books", image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=600&auto=format&fit=crop" },
    { name: "Science", count: "85+ Books", image: "https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=600&auto=format&fit=crop" },
    { name: "History", count: "95+ Books", image: "https://images.unsplash.com/photo-1461360370896-922624d12aa1?q=80&w=600&auto=format&fit=crop" },
    { name: "Kids & Teens", count: "150+ Books", image: "https://images.unsplash.com/photo-1513001900722-370f803f498d?q=80&w=600&auto=format&fit=crop" },
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
        <div>
          <span className="text-xs font-semibold tracking-wider text-indigo-600 uppercase bg-indigo-50 px-3 py-1 rounded-full">
            Explore Genres
          </span>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 mt-3">
            Top Categories
          </h2>
        </div>
        <Link 
          href="/books" 
          className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-700 mt-4 md:mt-0 transition-colors"
        >
          Browse all categories <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.map((cat, index) => (
          <Link 
            href="/books" 
            key={index}
            className="group relative h-64 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
          >
            <div 
              className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
              style={{ backgroundImage: `url(${cat.image})` }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white space-y-1">
              <p className="text-xs font-medium text-indigo-300">{cat.count}</p>
              <h3 className="text-xl font-bold">{cat.name}</h3>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}