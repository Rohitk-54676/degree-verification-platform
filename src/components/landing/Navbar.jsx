import Link from "next/link";
import { Suspense } from "react";
import { connection } from "next/server";
import { auth } from "@/lib/auth";
import AuthNav from "./AuthNav";

// Isolated Server Component to fetch session safely
async function UserSession() {
  await connection();
  const session = await auth();
  return <AuthNav user={session?.user || null} />;
}

export default function Navbar() {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 text-white rounded-lg flex items-center justify-center font-bold text-lg">
            D
          </div>
          <span className="text-xl font-bold text-slate-900 tracking-tight">
            DegreeVerify
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <Link
            href="#features"
            className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors"
          >
            Features
          </Link>
          <Link
            href="#how-it-works"
            className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors"
          >
            How it works
          </Link>
          <Link
            href="/verify"
            className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors"
          >
            Verify a Degree
          </Link>
        </nav>

        {/* Auth Buttons */}
        <div className="flex items-center gap-4">
          <Suspense
            fallback={
              <div className="h-10 w-24 bg-slate-100 rounded-lg animate-pulse" />
            }
          >
            <UserSession />
          </Suspense>
        </div>
      </div>
    </header>
  );
}