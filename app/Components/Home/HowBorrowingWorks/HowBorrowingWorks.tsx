
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Clock3,
  Search,
  Sparkles,
  ShieldCheck,
  ChevronRight,
} from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Explore & Discover",
    description:
      "Browse our collection of books across different genres. Find stories, ideas, and knowledge that inspire your next reading adventure.",
    icon: Search,
    label: "Discover Books",
    color: "indigo",
  },
  {
    number: "02",
    title: "Borrow Instantly",
    description:
      "Choose your favorite book, sign in to your account, and confirm your borrowing request in just a few simple clicks.",
    icon: BookOpen,
    label: "Borrow with Ease",
    color: "violet",
  },
  {
    number: "03",
    title: "Read & Return",
    description:
      "Enjoy your book, manage your borrowed collection, and return it when you're finished so another reader can enjoy it.",
    icon: CheckCircle2,
    label: "Happy Reading",
    color: "emerald",
  },
];

export default function HowBorrowingWorks() {
  return (
    <section className="relative overflow-hidden bg-[#f8f9fd] py-20 sm:py-24">
      {/* Background Decoration */}
      <div className="pointer-events-none absolute -left-40 top-10 h-96 w-96 rounded-full bg-indigo-100/60 blur-3xl" />
      <div className="pointer-events-none absolute -right-40 bottom-0 h-96 w-96 rounded-full bg-violet-100/60 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto mb-14 max-w-2xl text-center sm:mb-16">
          <span className="inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-indigo-600">
            <Sparkles size={14} />
            Simple & Seamless
          </span>

          <h2 className="mt-5 text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">
            How Borrowing{" "}
            <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
              Works
            </span>
          </h2>

          <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-slate-500 sm:text-base">
            Your next favorite book is just three steps
            away. Discover, borrow, and enjoy a world
            of stories with BookNook.
          </p>
        </div>

        {/* Steps */}
        <div className="relative grid gap-6 md:grid-cols-3 lg:gap-8">
          {/* Desktop Connecting Line */}
          <div className="pointer-events-none absolute left-[16%] right-[16%] top-[54px] hidden border-t-2 border-dashed border-indigo-200 md:block" />

          {steps.map((step, index) => {
            const Icon = step.icon;

            const iconStyles = [
              "bg-indigo-600 shadow-indigo-200",
              "bg-violet-600 shadow-violet-200",
              "bg-emerald-600 shadow-emerald-200",
            ];

            const tagStyles = [
              "bg-indigo-50 text-indigo-600",
              "bg-violet-50 text-violet-600",
              "bg-emerald-50 text-emerald-600",
            ];

            return (
              <div
                key={step.number}
                className="group relative"
              >
                {/* Icon */}
                <div className="relative z-10 mx-auto mb-7 flex h-[108px] w-[108px] items-center justify-center rounded-[30px] border-[8px] border-[#f8f9fd] bg-white">
                  <div
                    className={`flex h-[86px] w-[86px] items-center justify-center rounded-[24px] text-white shadow-xl transition-all duration-300 group-hover:-translate-y-1 group-hover:rotate-3 ${iconStyles[index]}`}
                  >
                    <Icon size={34} strokeWidth={1.8} />
                  </div>
                </div>

                {/* Card */}
                <div className="relative flex h-full flex-col overflow-hidden rounded-[28px] border border-slate-200/80 bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-100/50 sm:p-8">
                  {/* Number */}
                  <span className="absolute right-6 top-5 text-5xl font-black tracking-tight text-slate-100 transition-colors group-hover:text-indigo-100">
                    {step.number}
                  </span>

                  <span
                    className={`relative mb-5 inline-flex w-fit items-center rounded-full px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider ${tagStyles[index]}`}
                  >
                    Step {step.number}
                  </span>

                  <h3 className="relative text-xl font-extrabold tracking-tight text-slate-900 sm:text-2xl">
                    {step.title}
                  </h3>

                  <p className="relative mt-4 flex-1 text-sm leading-7 text-slate-500">
                    {step.description}
                  </p>

                  <div className="relative mt-7 flex items-center gap-2 border-t border-slate-100 pt-5 text-xs font-bold text-indigo-600">
                    <CheckCircle2 size={16} />
                    {step.label}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="mt-16 flex flex-col items-center justify-center gap-5 text-center">
          <div className="flex flex-wrap items-center justify-center gap-5 text-xs font-medium text-slate-500">
            <span className="inline-flex items-center gap-2">
              <ShieldCheck
                size={16}
                className="text-indigo-600"
              />
              Secure Borrowing
            </span>

            <span className="inline-flex items-center gap-2">
              <Clock3
                size={16}
                className="text-indigo-600"
              />
              Easy Returns
            </span>
          </div>

          <Link
            href="/allBooks"
            className="group inline-flex items-center justify-center gap-3 rounded-2xl bg-indigo-600 px-8 py-4 text-sm font-bold text-white shadow-lg shadow-indigo-500/20 transition-all duration-300 hover:-translate-y-1 hover:bg-indigo-700 hover:shadow-xl hover:shadow-indigo-500/30"
          >
            Explore Our Library
            <ArrowRight
              size={19}
              className="transition-transform group-hover:translate-x-1"
            />
          </Link>

          <p className="text-xs text-slate-400">
            Discover your next great read today
          </p>
        </div>
      </div>
    </section>
  );
}
