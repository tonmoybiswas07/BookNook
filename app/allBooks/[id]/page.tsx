
export const instant = false;

import { notFound } from "next/navigation";
import BookDetailsClient from "./BookDetailsClient";


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

async function getBook(id: string): Promise<Book | null> {
  const res = await fetch(
    `http://localhost:8000/books/${id}`,
    {
      cache: "no-store",
    }
  );

  if (res.status === 404) return null;

  if (!res.ok) {
    throw new Error("Failed to fetch book details");
  }

  return res.json();
}

export default async function BookDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const book = await getBook(id);

  if (!book) {
    notFound();
  }

  return <BookDetailsClient book={book} />;
}
