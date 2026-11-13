"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";

import { toast } from "react-toastify";
import { authClient } from "@/app/lib/auth-client";

export default function Navbar() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  // Fetch real-time session using BetterAuth
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  const isActive = (path) => pathname === path;

 
  const handleLogout = async () => {
    try {
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            toast.success("Logged out successfully!");
            setDropdownOpen(false);
            router.push("/Authentication/signin");
            router.refresh();
          },
        },
      });
    } catch (err) {
      toast.error("Logout failed! Please try again.");
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/85 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          
          {/* Logo & Name */}
          <Link href="/" className="flex items-center gap-2">
            <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <span className="text-xl font-bold tracking-tight text-gray-900">BookNook</span>
          </Link>

          {/* Nav Links */}
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
            <Link href="/" className={`transition-colors hover:text-indigo-600 ${isActive('/') ? 'text-indigo-600 font-semibold' : ''}`}>Home</Link>
            <Link href="/books" className={`transition-colors hover:text-indigo-600 ${isActive('/books') ? 'text-indigo-600 font-semibold' : ''}`}>All Books</Link>
            
            
            {user && (
              <>
                <Link href="/add-book" className={`transition-colors hover:text-indigo-600 ${isActive('/add-book') ? 'text-indigo-600 font-semibold' : ''}`}>Add Book</Link>
                <Link href="/my-books" className={`transition-colors hover:text-indigo-600 ${isActive('/my-books') ? 'text-indigo-600 font-semibold' : ''}`}>My Books</Link>
                <Link href="/my-borrows" className={`transition-colors hover:text-indigo-600 ${isActive('/my-borrows') ? 'text-indigo-600 font-semibold' : ''}`}>My Borrows</Link>
              </>
            )}
          </div>

          
          <div className="flex items-center gap-4">
            {isPending ? (
              <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse" />
            ) : user ? (
              <div className="relative">
                {/* User Photo */}
                <button 
                  onClick={() => setDropdownOpen(!dropdownOpen)} 
                  className="flex items-center focus:outline-none ring-2 ring-indigo-500/20 rounded-full"
                >
                  <Image 
                    src={user.image || "https://placehold.co/150"} 
                    alt={user.name || "User"} 
                    width={36}
                    height={36}
                    className="w-9 h-9 rounded-full object-cover"
                  />
                </button>

                {/* Dropdown Menu */}
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 rounded-xl shadow-lg py-1 text-sm text-gray-700 animate-in fade-in zoom-in-95 z-50">
                    <div className="px-4 py-2 border-b border-gray-100 font-medium text-gray-900 truncate">
                      {user.name || "User"}
                    </div>
                    <Link 
                      href="/my-profile" 
                      onClick={() => setDropdownOpen(false)}
                      className="block px-4 py-2 hover:bg-gray-50 transition-colors"
                    >
                      My Profile
                    </Link>
                    <button 
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 transition-colors"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link 
                  href="/Authentication/signin" 
                  className="text-sm font-medium text-gray-700 hover:text-indigo-600 px-4 py-2 transition-colors"
                >
                  Login
                </Link>
                <Link 
                  href="/Authentication/signup" 
                  className="text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-xl transition-all shadow-sm shadow-indigo-100"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

        </div>
      </div>
    </nav>
  );
}