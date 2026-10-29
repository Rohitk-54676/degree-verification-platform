import Link from "next/link";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function UniversitiesContent() {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    redirect("/");
  }

  const universities = await prisma.university.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { credentials: true, users: true } },
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <Link href="/admin" className="text-sm text-blue-600 hover:underline">
            ← Back to Admin
          </Link>
          <h1 className="text-3xl font-bold text-slate-900 mt-2">
            All Universities
          </h1>
          <p className="text-slate-600 mt-1">
            {universities.length} registered institution{universities.length === 1 ? "" : "s"}
          </p>
        </div>
        <Link
          href="/admin/universities/new"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
        >
          + Add University
        </Link>
      </div>

      {universities.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-xl p-8 text-center">
          <p className="text-slate-600">No universities yet.</p>
          <Link
            href="/admin/universities/new"
            className="inline-block mt-3 text-blue-600 hover:underline text-sm"
          >
            Create the first one →
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {universities.map((u) => (
            <div
              key={u.id}
              className="bg-white border border-slate-200 rounded-xl p-5"
            >
              <div className="flex items-start gap-4">
                <div
                  className="w-14 h-14 rounded-lg flex-shrink-0 flex items-center justify-center text-white font-bold text-lg"
                  style={{ backgroundColor: u.primaryColor }}
                >
                  {u.code}
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="font-semibold text-slate-900 truncate">
                    {u.name}
                  </h2>
                  <p className="text-xs text-slate-500">
                    Code: {u.code} · {u._count.credentials} credentials ·{" "}
                    {u._count.users} users
                  </p>
                  {u.address && (
                    <p className="text-xs text-slate-500 mt-1 truncate">
                      {u.address}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Skeleton() {
  return (
    <div className="space-y-6">
      <div className="h-10 w-64 bg-slate-100 rounded animate-pulse" />
      <div className="grid grid-cols-2 gap-4">
        <div className="h-24 bg-slate-100 rounded-xl animate-pulse" />
        <div className="h-24 bg-slate-100 rounded-xl animate-pulse" />
      </div>
    </div>
  );
}

export default function UniversitiesPage() {
  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-4xl mx-auto">
        <Suspense fallback={<Skeleton />}>
          <UniversitiesContent />
        </Suspense>
      </div>
    </div>
  );
}