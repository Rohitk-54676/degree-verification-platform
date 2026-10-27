import Link from "next/link";
import { Suspense } from "react";
import { auth } from "@/lib/auth";

// This is a Server Component that reads the session.
// It's wrapped in <Suspense> below so the static shell can prerender.
async function SessionInfo() {
  const session = await auth();

  if (!session) {
    return (
      <div className="space-y-3">
        <p className="text-slate-700">You are not logged in.</p>
        <Link
          href="/login"
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
        >
          Go to Login
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <p className="font-medium text-green-800">
          Logged in as: {session.user.email}
        </p>
        <p className="text-sm text-green-700">Role: {session.user.role}</p>
        {session.user.enrollmentNo && (
          <p className="text-sm text-green-700">
            Enrollment: {session.user.enrollmentNo}
          </p>
        )}
      </div>
      <Link
        href="/api/auth/signout"
        className="inline-block bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
      >
        Sign Out
      </Link>
    </div>
  );
}

function SessionSkeleton() {
  return (
    <div className="space-y-3">
      <div className="h-20 bg-slate-100 rounded-lg animate-pulse" />
      <div className="h-10 w-32 bg-slate-100 rounded-lg animate-pulse" />
    </div>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow p-8">
        <h1 className="text-2xl font-bold text-slate-900 mb-4">
          DegreeVerify — Temporary Home
        </h1>

        <Suspense fallback={<SessionSkeleton />}>
          <SessionInfo />
        </Suspense>
      </div>
    </div>
  );
}