
import { BookOpen } from "lucide-react";
import AllBooksClient from "./AllBooksClient";


export const instant = false;

export const metadata = {
  title: "Explore All Books | BookNook",
  description:
    "Explore the BookNook library and discover your next favorite book.",
};

export interface Book {
  _id: string;
  title: string;
  author: string;
  category: string;
  image: string;
  description: string;
  totalCopies: number;
}

async function getBooks(): Promise<Book[]> {
  try {
    const API_URL =
      process.env.API_URL ||
      process.env.NEXT_PUBLIC_API_URL ||
      "http://localhost:8000";

    const res = await fetch(`${API_URL}/books`, {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error(
        `Failed to fetch books: ${res.status}`
      );
    }

    const data: unknown = await res.json();

    if (!Array.isArray(data)) {
      throw new Error("Invalid books response");
    }

    return data as Book[];
  } catch (error) {
    console.error("Failed to fetch books:", error);
    return [];
  }
}

export default async function AllBooksPage() {
  const books = await getBooks();

  return (
    <main className="min-h-screen bg-[#f8f9fd]">
      <AllBooksClient books={books} />
    </main>
  );
}
