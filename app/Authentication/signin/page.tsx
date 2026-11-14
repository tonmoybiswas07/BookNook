
import { Suspense } from "react";
import type { Metadata } from "next";
import { BookOpen, Loader2 } from "lucide-react";
import LoginForm from "./LoginForm";

export const metadata: Metadata = {
  title: "Sign In | BookNook",
  description:
    "Sign in to your BookNook account to explore, borrow, and share books.",
};

function LoginLoading() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f8f9fd] px-4 transition-colors duration-300 dark:bg-slate-950">
      <div className="flex flex-col items-center gap-5 text-center">
        <div className="relative flex h-20 w-20 items-center justify-center rounded-3xl bg-indigo-100 dark:bg-indigo-500/15">
          <BookOpen
            size={36}
            className="text-indigo-600 dark:text-indigo-400"
          />

          <div className="absolute -bottom-2 -right-2 flex h-9 w-9 items-center justify-center rounded-full border-4 border-[#f8f9fd] bg-indigo-600 text-white dark:border-slate-950 dark:bg-indigo-500">
            <Loader2
              size={17}
              className="animate-spin"
            />
          </div>
        </div>

        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            BookNook
          </h2>

          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Preparing your sign-in experience...
          </p>
        </div>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginLoading />}>
      <LoginForm />
    </Suspense>
  );
}
