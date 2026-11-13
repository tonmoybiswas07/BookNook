
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
    <main className="flex min-h-screen items-center justify-center bg-[#f8f9fd] px-4">
      <div className="flex flex-col items-center gap-5 text-center">
        <div className="relative flex h-20 w-20 items-center justify-center rounded-3xl bg-indigo-100">
          <BookOpen
            size={36}
            className="text-indigo-600"
          />

          <div className="absolute -bottom-2 -right-2 flex h-9 w-9 items-center justify-center rounded-full border-4 border-[#f8f9fd] bg-indigo-600 text-white">
            <Loader2
              size={17}
              className="animate-spin"
            />
          </div>
        </div>

        <div>
          <h2 className="text-xl font-bold text-slate-900">
            BookNook
          </h2>

          <p className="mt-2 text-sm text-slate-500">
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
