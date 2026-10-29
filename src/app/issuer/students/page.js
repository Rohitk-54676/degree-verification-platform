import Link from "next/link";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function StudentsContent() {
  const session = await auth();
  if (!session.user.universityId) redirect("/login");

  const students = await prisma.user.findMany({
    where: {
      universityId: session.user.universityId,
      role: "STUDENT",
    },
    orderBy: { createdAt: "desc" },
  });

  // Fetch credential counts for each student's enrollment
  const enrollments = students.map((s) => s.enrollmentNo).filter(Boolean);
  const credentialCounts = await prisma.credential.groupBy({
    by: ["enrollmentNo"],
    where: {
      universityId: session.user.universityId,
      enrollmentNo: { in: enrollments },
    },
    _count: { _all: true },
  });
  const countMap = Object.fromEntries(
    credentialCounts.map((c) => [c.enrollmentNo, c._count._all])
  );

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <Link
            href="/issuer"
            className="text-sm text-blue-600 hover:underline"
          >
            ← Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-slate-900 mt-2">Students</h1>
          <p className="text-slate-600 mt-1">
            {students.length} student account{students.length === 1 ? "" : "s"} at your university
          </p>
        </div>
        <Link
          href="/issuer/students/new"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
        >
          + Add Student
        </Link>
      </div>

      {students.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-xl p-8 text-center">
          <p className="text-slate-600">No student accounts yet.</p>
          <p className="text-sm text-slate-500 mt-2">
            Create accounts so students can log in and see their degrees.
          </p>
          <Link
            href="/issuer/students/new"
            className="inline-block mt-3 text-blue-600 hover:underline text-sm"
          >
            Create the first student account →
          </Link>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left text-slate-500">
              <tr>
                <th className="px-5 py-3">Name</th>
                <th className="px-5 py-3">Email</th>
                <th className="px-5 py-3">Enrollment</th>
                <th className="px-5 py-3">Degrees</th>
                <th className="px-5 py-3">Created</th>
              </tr>
            </thead>
            <tbody>
              {students.map((s) => (
                <tr key={s.id} className="border-t border-slate-100">
                  <td className="px-5 py-3 font-medium text-slate-900">
                    {s.name}
                  </td>
                  <td className="px-5 py-3 text-slate-600">{s.email}</td>
                  <td className="px-5 py-3 text-slate-600 font-mono text-xs">
                    {s.enrollmentNo}
                  </td>
                  <td className="px-5 py-3 text-slate-600">
                    {countMap[s.enrollmentNo] || 0}
                  </td>
                  <td className="px-5 py-3 text-slate-600">
                    {new Date(s.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function Skeleton() {
  return (
    <div className="space-y-6">
      <div className="h-10 w-64 bg-slate-100 rounded animate-pulse" />
      <div className="h-64 bg-slate-100 rounded-xl animate-pulse" />
    </div>
  );
}

export default function StudentsPage() {
  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-5xl mx-auto">
        <Suspense fallback={<Skeleton />}>
          <StudentsContent />
        </Suspense>
      </div>
    </div>
  );
}