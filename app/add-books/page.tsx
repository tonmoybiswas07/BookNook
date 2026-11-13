"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { toast } from "react-toastify";
import { BookOpen, PlusCircle, Image as ImageIcon, User, Layers, Hash } from "lucide-react";
import { authClient } from "../lib/auth-client";

export default function AddBookPage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    category: "Fiction",
    image: "",
    description: "",
    totalCopies: 1,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error("You must be logged in to add a book!");
      return;
    }

    setLoading(true);

    const bookData = {
      ...formData,
      totalCopies: Number(formData.totalCopies),
      userName: user.name,
      userEmail: user.email,
      addedDate: new Date().toISOString(),
    };

    try {
      
      const res = await fetch("http://localhost:8000/books", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to add book");
      }

      toast.success("Book added successfully!");
      router.push("/books"); 
      router.refresh();
    } catch (err) {
      toast.error(err.message || "Something went wrong!");
      setLoading(false);
    }
  };

  if (isPending) {
    return <div className="min-h-[70vh] flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="bg-white p-8 sm:p-10 rounded-3xl border border-gray-100 shadow-xl shadow-gray-100">
        
        {/* Header */}
        <div className="text-center mb-8 space-y-2">
          <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl mx-auto flex items-center justify-center">
            <PlusCircle className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Add a New Book</h1>
          <p className="text-sm text-gray-500">Share a book with the BookNook community library</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Book Title */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Book Title</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <BookOpen className="w-4 h-4" />
                </span>
                <input
                  type="text"
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g. Atomic Habits"
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all"
                />
              </div>
            </div>

            {/* Author Name */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Author Name</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <User className="w-4 h-4" />
                </span>
                <input
                  type="text"
                  name="author"
                  required
                  value={formData.author}
                  onChange={handleChange}
                  placeholder="e.g. James Clear"
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Category */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Category</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <Layers className="w-4 h-4" />
                </span>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all"
                >
                  <option value="Fiction">Fiction</option>
                  <option value="Science">Science</option>
                  <option value="History">History</option>
                  <option value="Kids & Teens">Kids & Teens</option>
                  <option value="Others">Others</option>
                </select>
              </div>
            </div>

            {/* Total Copies */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Total Copies</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <Hash className="w-4 h-4" />
                </span>
                <input
                  type="number"
                  name="totalCopies"
                  min="1"
                  required
                  value={formData.totalCopies}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all"
                />
              </div>
            </div>
          </div>

          {/* Book Image URL */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Book Image URL (Imgbb / Postimage)</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <ImageIcon className="w-4 h-4" />
              </span>
              <input
                type="url"
                name="image"
                required
                value={formData.image}
                onChange={handleChange}
                placeholder="https://i.ibb.co.com/..."
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all"
              />
            </div>
          </div>

          {/* Short Description */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Short Description</label>
            <textarea
              name="description"
              required
              rows="4"
              value={formData.description}
              onChange={handleChange}
              placeholder="Write a brief summary about the book..."
              className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all"
            />
          </div>

          {/* Read-only User Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-gray-50/80 rounded-2xl border border-gray-100">
            <div>
              <span className="block text-[11px] font-semibold text-gray-400 uppercase">Your Name (Read-Only)</span>
              <p className="text-sm font-medium text-gray-800 mt-0.5">{user?.name || "N/A"}</p>
            </div>
            <div>
              <span className="block text-[11px] font-semibold text-gray-400 uppercase">Your Email (Read-Only)</span>
              <p className="text-sm font-medium text-gray-800 mt-0.5">{user?.email || "N/A"}</p>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl shadow-lg shadow-indigo-600/20 transition-all disabled:opacity-50"
          >
            {loading ? "Adding Book..." : "Add Book"}
          </button>

        </form>

      </div>
    </div>
  );
}