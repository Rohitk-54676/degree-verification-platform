"use client";

import { useState } from "react";
import Link from "next/link";
import { signOut } from "next-auth/react";

export default function AuthNav({ user }) {
  const [isOpen, setIsOpen] = useState(false);

  // If no user is passed (not logged in), show the Login buttons
  if (!user) {
    return (
      <div className="flex items-center gap-3">
        <Link
          href="/login"
          className="text-slate-600 hover:text-slate-900 px-4 py-2 text-sm font-medium transition-colors"
        >
          Sign In
        </Link>
        <Link
          href="/login"
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors"
        >
          Get Started
        </Link>
      </div>
    );
  }

  // If logged in, show the user dropdown
  const dashboardUrl =
    user.role === "ADMIN"
      ? "/admin"
      : user.role === "UNIVERSITY"
      ? "/issuer"
      : "/student";

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 text-sm font-medium text-slate-700 hover:text-slate-900 focus:outline-none"
      >
        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
          {user.email.charAt(0).toUpperCase()}
        </div>
        <span className="hidden sm:block max-w-[120px] truncate">
          {user.email}
        </span>
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          {/* Invisible backdrop to close dropdown when clicking outside */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          ></div>

          <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-slate-100 py-2 z-50">
            <div className="px-4 py-2 border-b border-slate-100 mb-1">
              <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">
                Logged in as
              </p>
              <p className="text-sm text-slate-900 font-bold truncate">
                {user.email}
              </p>
              <p className="text-xs text-slate-500 mt-0.5">{user.role}</p>
            </div>

            <Link
              href={dashboardUrl}
              className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Go to Dashboard
            </Link>
            <Link
              href="/account/password"
              className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Change Password
            </Link>

            <div className="border-t border-slate-100 mt-1 pt-1">
              <button
                onClick={() => {
                  setIsOpen(false);
                  signOut({ callbackUrl: "/" });
                }}
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors font-medium"
              >
                Sign Out
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}