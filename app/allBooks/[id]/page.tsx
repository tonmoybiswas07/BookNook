import type { Metadata } from "next";
import { notFound } from "next/navigation";
import BookDetailsClient from "./BookDetailsClient";

export const instant = false;

interface Book {
  _id: string;
  title: string;
  author: string;
  category: string;
  image: string;
  description: string;
  totalCopies: number;
  userName: string;
  userEmail: string;
  addedDate: string;
}

interface PageProps {
  params: Promise<{ id: string }>;
}

const API_URL =
  process.env.API_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:8000";

// Fetch a single book
async function getBook(id: string): Promise<Book | null> {
  const res = await fetch(`${API_URL}/books/${encodeURIComponent(id)}`, {
    cache: "no-store",
  });

  if (res.status === 404) {
    return null;
  }

  if (!res.ok) {
    throw new Error(`Failed to fetch book details: ${res.status}`);
  }

  return (await res.json()) as Book;
}

// Dynamic page metadata
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  const book = await getBook(id);

  if (!book) {
    return {
      title: "Book Not Found | BookNook",
    };
  }

  return {
    title: `${book.title} | BookNook`,
    description:
      book.description?.slice(0, 160) ||
      `Explore ${book.title} by ${book.author} on BookNook.`,
  };
}

// Book Details Page
export default async function BookDetailsPage({ params }: PageProps) {
  const { id } = await params;

  const book = await getBook(id);

  if (!book) {
    notFound();
  }

  return <BookDetailsClient book={book} />;
}
