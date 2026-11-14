
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Clock3,
  Search,
  Sparkles,
  ShieldCheck,
} from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Explore & Discover",
    description:
      "Browse our collection of books across different genres. Find stories, ideas, and knowledge that inspire your next reading adventure.",
    icon: Search,
    label: "Discover Books",
  },
  {
    number: "02",
    title: "Borrow Instantly",
    description:
      "Choose your favorite book, sign in to your account, and confirm your borrowing request in just a few simple clicks.",
    icon: BookOpen,
    label: "Borrow with Ease",
  },
  {
    number: "03",
    title: "Read & Return",
    description:
      "Enjoy your book, manage your borrowed collection, and return it when you're finished so another reader can enjoy it.",
    icon: CheckCircle2,
    label: "Happy Reading",
  },
];

export default function HowBorrowingWorks() {
  const iconStyles = [
    "bg-indigo-600 shadow-indigo-200 dark:bg-indigo-500 dark:shadow-indigo-950/40",
    "bg-violet-600 shadow-violet-200 dark:bg-violet-500 dark:shadow-violet-950/40",
    "bg-emerald-600 shadow-emerald-200 dark:bg-emerald-500 dark:shadow-emerald-950/40",
  ];

  const tagStyles = [
    "bg-indigo-50 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-400",
    "bg-violet-50 text-violet-600 dark:bg-violet-500/15 dark:text-violet-400",
    "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400",
  ];

  return (
    <section className="relative overflow-hidden bg-[#f8f9fd] py-20 transition-colors duration-300 dark:bg-slate-950 sm:py-24">
      <div className="pointer-events-none absolute -left-40 top-10 h-96 w-96 rounded-full bg-indigo-100/60 blur-3xl dark:bg-indigo-500/10" />

      <div className="pointer-events-none absolute -right-40 bottom-0 h-96 w-96 rounded-full bg-violet-100/60 blur-3xl dark:bg-violet-500/10" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-14 max-w-2xl text-center sm:mb-16">
          <span className="inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-indigo-600 dark:border-indigo-500/20 dark:bg-indigo-500/10 dark:text-indigo-400">
            <Sparkles size={14} />
            Simple & Seamless
          </span>

          <h2 className="mt-5 text-3xl font-extrabold tracking-tight text-slate-950 dark:text-white sm:text-4xl lg:text-5xl">
            How Borrowing{" "}
            <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent dark:from-indigo-400 dark:to-violet-400">
              Works
            </span>
          </h2>

          <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-slate-500 dark:text-slate-400 sm:text-base">
            Your next favorite book is just three steps
            away. Discover, borrow, and enjoy a world
            of stories with BookNook.
          </p>
        </div>

        <div className="relative grid gap-6 md:grid-cols-3 lg:gap-8">
          <div className="pointer-events-none absolute left-[16%] right-[16%] top-[54px] hidden border-t-2 border-dashed border-indigo-200 dark:border-indigo-500/30 md:block" />

          {steps.map((step, index) => {
            const Icon = step.icon;

            return (
              <div
                key={step.number}
                className="group relative flex flex-col"
              >
                <div className="relative z-10 mx-auto mb-7 flex h-[108px] w-[108px] items-center justify-center rounded-[30px] border-[8px] border-[#f8f9fd] bg-white transition-colors duration-300 dark:border-slate-950 dark:bg-slate-900">
                  <div
                    className={`flex h-[86px] w-[86px] items-center justify-center rounded-[24px] text-white shadow-xl transition-all duration-300 group-hover:-translate-y-1 group-hover:rotate-3 ${iconStyles[index]}`}
                  >
                    <Icon
                      size={34}
                      strokeWidth={1.8}
                    />
                  </div>
                </div>

                <div className="relative flex flex-1 flex-col overflow-hidden rounded-[28px] border border-slate-200/80 bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-100/50 dark:border-slate-800 dark:bg-slate-900 dark:shadow-black/20 dark:hover:border-indigo-500/40 dark:hover:shadow-indigo-950/30 sm:p-8">
                  <span className="absolute right-6 top-5 text-5xl font-black tracking-tight text-slate-100 transition-colors group-hover:text-indigo-100 dark:text-slate-800 dark:group-hover:text-indigo-500/15">
                    {step.number}
                  </span>

                  <span
                    className={`relative mb-5 inline-flex w-fit items-center rounded-full px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider ${tagStyles[index]}`}
                  >
                    Step {step.number}
                  </span>

                  <h3 className="relative text-xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-2xl">
                    {step.title}
                  </h3>

                  <p className="relative mt-4 flex-1 text-sm leading-7 text-slate-500 dark:text-slate-400">
                    {step.description}
                  </p>

                  <div className="relative mt-7 flex items-center gap-2 border-t border-slate-100 pt-5 text-xs font-bold text-indigo-600 dark:border-slate-800 dark:text-indigo-400">
                    <CheckCircle2 size={16} />
                    {step.label}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-16 flex flex-col items-center justify-center gap-5 text-center">
          <div className="flex flex-wrap items-center justify-center gap-5 text-xs font-medium text-slate-500 dark:text-slate-400">
            <span className="inline-flex items-center gap-2">
              <ShieldCheck
                size={16}
                className="text-indigo-600 dark:text-indigo-400"
              />
              Secure Borrowing
            </span>

            <span className="inline-flex items-center gap-2">
              <Clock3
                size={16}
                className="text-indigo-600 dark:text-indigo-400"
              />
              Easy Returns
            </span>
          </div>

          <Link
            href="/allBooks"
            className="group inline-flex items-center justify-center gap-3 rounded-2xl bg-indigo-600 px-8 py-4 text-sm font-bold text-white shadow-lg shadow-indigo-500/20 transition-all duration-300 hover:-translate-y-1 hover:bg-indigo-700 hover:shadow-xl hover:shadow-indigo-500/30 dark:bg-indigo-500 dark:shadow-indigo-950/30 dark:hover:bg-indigo-600"
          >
            Explore Our Library

            <ArrowRight
              size={19}
              className="transition-transform group-hover:translate-x-1"
            />
          </Link>

          <p className="text-xs text-slate-400 dark:text-slate-500">
            Discover your next great read today
          </p>
        </div>
      </div>
    </section>
  );
}
