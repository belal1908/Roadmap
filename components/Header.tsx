"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState } from "react";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">RA</span>
            </div>
            <span className="text-xl font-bold text-gray-900 hidden sm:inline">
              RoadmapAI
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="/explore"
              className="text-gray-600 hover:text-gray-900 font-medium"
            >
              Explore
            </Link>
            <Link
              href="/dashboard"
              className="text-gray-600 hover:text-gray-900 font-medium"
            >
              Dashboard
            </Link>
            <a
              href="#"
              className="text-gray-600 hover:text-gray-900 font-medium"
            >
              Guides
            </a>
          </nav>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/auth"
              className="px-4 py-2 text-gray-600 hover:text-gray-900 font-medium"
            >
              Log in
            </Link>
            <Link
              href="/auth"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
            >
              Sign up
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button onClick={() => setIsOpen(!isOpen)} className="md:hidden p-2">
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden border-t border-gray-200 py-4 space-y-3">
            <Link
              href="/explore"
              className="block px-4 py-2 text-gray-600 hover:bg-gray-50"
            >
              Explore
            </Link>
            <Link
              href="/dashboard"
              className="block px-4 py-2 text-gray-600 hover:bg-gray-50"
            >
              Dashboard
            </Link>
            <a
              href="#"
              className="block px-4 py-2 text-gray-600 hover:bg-gray-50"
            >
              Guides
            </a>
            <div className="border-t border-gray-200 pt-3 px-4 space-y-2">
              <Link href="/auth" className="block py-2 text-gray-600">
                Log in
              </Link>
              <Link
                href="/auth"
                className="block py-2 bg-blue-600 text-white rounded-lg text-center font-medium"
              >
                Sign up
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
