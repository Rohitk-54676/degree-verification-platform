import Link from "next/link";
import { Suspense } from "react";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function AdminContent() {
  const session = await auth();

  const [universityCount, userCount, credentialCount, recentUniversities] =
    await Promise.all([
      prisma.university.count(),
      prisma.user.count(),
      prisma.credential.count(),
      prisma.university.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: { _count: { select: { credentials: true, users: true } } },
      }),
    ]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Admin Dashboard</h1>
        <p className="text-slate-600 mt-1">
          Welcome, {session.user.name} ({session.user.email})
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard label="Universities" value={universityCount} />
        <StatCard label="Users" value={userCount} />
        <StatCard label="Credentials" value={credentialCount} />
      </div>

      {/* Quick actions */}
      <div className="bg-white border border-slate-200 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">
          Quick Actions
        </h2>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/admin/universities/new"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm"
          >
            + Add University
          </Link>
          <Link
            href="/admin/universities"
            className="bg-slate-100 hover:bg-slate-200 text-slate-800 px-4 py-2 rounded-lg text-sm"
          >
            View All Universities
          </Link>
          <Link
            href="/admin/audit"
            className="bg-slate-100 hover:bg-slate-200 text-slate-800 px-4 py-2 rounded-lg text-sm"
          >
            Audit Log
          </Link>
        </div>
      </div>

      {/* Recent universities */}
      <div className="bg-white border border-slate-200 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">
          Recent Universities
        </h2>
        {recentUniversities.length === 0 ? (
          <p className="text-sm text-slate-500">
            No universities yet. Click &ldquo;Add University&rdquo; to create one.
          </p>
        ) : (
          <div className="space-y-3">
            {recentUniversities.map((u) => (
              <div
                key={u.id}
                className="flex items-center justify-between border-b border-slate-100 pb-3 last:border-0 last:pb-0"
              >
                <div>
                  <p className="font-medium text-slate-900">{u.name}</p>
                  <p className="text-xs text-slate-500">
                    Code: {u.code} · {u._count.credentials} credentials ·{" "}
                    {u._count.users} users
                  </p>
                </div>
                <div
                  className="w-10 h-10 rounded-lg"
                  style={{
                    backgroundColor: u.primaryColor,
                    border: `2px solid ${u.secondaryColor}`,
                  }}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="text-3xl font-bold text-slate-900 mt-1">{value}</p>
    </div>
  );
}

function Skeleton() {
  return (
    <div className="space-y-6">
      <div className="h-10 w-64 bg-slate-100 rounded animate-pulse" />
      <div className="grid grid-cols-3 gap-4">
        <div className="h-24 bg-slate-100 rounded-xl animate-pulse" />
        <div className="h-24 bg-slate-100 rounded-xl animate-pulse" />
        <div className="h-24 bg-slate-100 rounded-xl animate-pulse" />
      </div>
      <div className="h-32 bg-slate-100 rounded-xl animate-pulse" />
    </div>
  );
}

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-5xl mx-auto">
        <Suspense fallback={<Skeleton />}>
          <AdminContent />
        </Suspense>
      </div>
    </div>
  );
}