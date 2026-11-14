
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  FlaskConical,
  History,
  Sparkles,
  WandSparkles,
} from "lucide-react";

const categories = [
  {
    id: 1,
    name: "Fiction",
    subtitle: "Stories beyond imagination",
    description: "Discover unforgettable stories",
    image:
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=800&auto=format&fit=crop",
    icon: WandSparkles,
  },
  {
    id: 2,
    name: "Science",
    subtitle: "Explore the unknown",
    description: "Uncover the wonders of science",
    image:
      "https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=800&auto=format&fit=crop",
    icon: FlaskConical,
  },
  {
    id: 3,
    name: "History",
    subtitle: "Journey through time",
    description: "Discover stories of the past",
    image:
      "https://images.unsplash.com/photo-1461360370896-922624d12aa1?q=80&w=800&auto=format&fit=crop",
    icon: History,
  },
  {
    id: 4,
    name: "Kids & Teens",
    subtitle: "Little readers, big dreams",
    description: "Inspire young imaginations",
    image:
      "https://images.unsplash.com/photo-1513001900722-370f803f498d?q=80&w=800&auto=format&fit=crop",
    icon: BookOpen,
  },
];

export default function TopCategories() {
  return (
    <section className="relative overflow-hidden bg-white py-20 transition-colors duration-300 dark:bg-slate-950 sm:py-24">
      <div className="pointer-events-none absolute -left-32 top-10 h-80 w-80 rounded-full bg-indigo-100/40 blur-3xl dark:bg-indigo-500/10" />

      <div className="pointer-events-none absolute -right-32 bottom-0 h-80 w-80 rounded-full bg-violet-100/40 blur-3xl dark:bg-violet-500/10" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-indigo-600 dark:border-indigo-500/20 dark:bg-indigo-500/10 dark:text-indigo-400">
              <Sparkles size={15} />
              Explore Genres
            </span>

            <h2 className="mt-5 text-3xl font-extrabold tracking-tight text-slate-950 dark:text-white sm:text-4xl lg:text-5xl">
              Explore Our{" "}
              <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent dark:from-indigo-400 dark:to-violet-400">
                Top Categories
              </span>
            </h2>

            <p className="mt-5 max-w-xl text-sm leading-7 text-slate-500 dark:text-slate-400 sm:text-base">
              Every reader has a favorite genre.
              Explore our carefully selected categories
              and discover books that match your
              interests.
            </p>
          </div>

          <Link
            href="/allBooks"
            className="group inline-flex w-fit items-center gap-2 rounded-xl border border-indigo-200 bg-indigo-50 px-5 py-3 text-sm font-bold text-indigo-600 transition-all hover:border-indigo-600 hover:bg-indigo-600 hover:text-white dark:border-indigo-500/30 dark:bg-indigo-500/10 dark:text-indigo-400 dark:hover:border-indigo-500 dark:hover:bg-indigo-500 dark:hover:text-white"
          >
            Browse All Books

            <ArrowRight
              size={17}
              className="transition-transform group-hover:translate-x-1"
            />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category) => {
            const Icon = category.icon;

            return (
              <Link
                key={category.id}
                href={`/allBooks?category=${encodeURIComponent(
                  category.name
                )}`}
                className="group relative block h-[340px] overflow-hidden rounded-[28px] bg-slate-900 shadow-md shadow-slate-200 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-indigo-200/50 dark:bg-slate-800 dark:shadow-black/30 dark:hover:shadow-indigo-950/40 sm:h-[370px]"
              >
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                  style={{
                    backgroundImage: `url("${category.image}")`,
                  }}
                />

                <div className="absolute inset-0 bg-gradient-to-t from-[#0b1029]/95 via-[#0b1029]/45 to-[#0b1029]/10 dark:from-[#050918]/98 dark:via-[#050918]/65 dark:to-[#050918]/25" />

                <div className="pointer-events-none absolute inset-0 rounded-[28px] border border-white/10 transition-colors group-hover:border-indigo-300/50 dark:border-slate-700/50 dark:group-hover:border-indigo-400/50" />

                <div className="absolute left-6 top-6 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/20 bg-white/15 text-white backdrop-blur-md transition-all duration-300 group-hover:bg-indigo-600 dark:border-indigo-300/20 dark:bg-slate-900/40 dark:group-hover:bg-indigo-500">
                  <Icon
                    size={23}
                    strokeWidth={1.8}
                  />
                </div>

                <div className="absolute right-6 top-6 flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-md transition-all duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:bg-indigo-600 dark:border-indigo-300/20 dark:bg-slate-900/40 dark:group-hover:bg-indigo-500">
                  <ArrowUpRight size={19} />
                </div>

                <div className="absolute inset-x-0 bottom-0 p-6">
                  <span className="inline-flex items-center gap-2 rounded-full border border-indigo-300/30 bg-indigo-500/25 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-indigo-100 backdrop-blur-md dark:border-indigo-400/30 dark:bg-indigo-500/20 dark:text-indigo-200">
                    <Sparkles size={12} />
                    {category.subtitle}
                  </span>

                  <h3 className="mt-4 text-2xl font-extrabold tracking-tight text-white">
                    {category.name}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-slate-200/85 dark:text-slate-300">
                    {category.description}
                  </p>

                  <div className="mt-5 flex items-center gap-2 border-t border-white/20 pt-4 text-xs font-bold text-indigo-200 transition-colors group-hover:text-white dark:border-slate-500/30 dark:text-indigo-300 dark:group-hover:text-white">
                    Explore Category

                    <ArrowRight
                      size={15}
                      className="transition-transform duration-300 group-hover:translate-x-1"
                    />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="mt-12 flex flex-col items-center justify-center gap-4 rounded-2xl border border-indigo-100 bg-indigo-50/60 px-6 py-7 text-center transition-colors duration-300 dark:border-indigo-500/20 dark:bg-indigo-500/5 sm:flex-row sm:justify-between sm:text-left">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white text-indigo-600 shadow-sm dark:bg-slate-800 dark:text-indigo-400 dark:shadow-black/20">
              <BookOpen size={24} />
            </div>

            <div>
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
                Can&apos;t find your favorite genre?
              </h3>

              <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
                Explore our complete library and
                discover something new.
              </p>
            </div>
          </div>

          <Link
            href="/allBooks"
            className="inline-flex shrink-0 items-center gap-2 text-sm font-bold text-indigo-600 transition hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300"
          >
            View All Books
            <ArrowRight size={17} />
          </Link>
        </div>
      </div>
    </section>
  );
}
