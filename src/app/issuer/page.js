import Link from "next/link";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function IssuerContent() {
  const session = await auth();

  if (!session.user.universityId) {
    redirect("/login");
  }

  const university = await prisma.university.findUnique({
    where: { id: session.user.universityId },
  });

  const credentials = await prisma.credential.findMany({
    where: { universityId: session.user.universityId },
    orderBy: { issuedAt: "desc" },
    take: 10,
  });

  const total = credentials.length;
  const active = credentials.filter((c) => c.status === "ACTIVE").length;
  const revoked = credentials.filter((c) => c.status === "REVOKED").length;

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            {university.name}
          </h1>
          <p className="text-slate-600 mt-1">
            Registrar Dashboard — {session.user.name}
          </p>
        </div>
        <Link
          href="/issuer/issue"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
        >
          + Issue New Degree
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard label="Total Issued" value={total} />
        <StatCard label="Active" value={active} color="text-green-700" />
        <StatCard label="Revoked" value={revoked} color="text-red-700" />
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-slate-900">
            Recent Credentials
          </h2>
          <Link
            href="/issuer/credentials"
            className="text-sm text-blue-600 hover:underline"
          >
            View all
          </Link>
        </div>

        {credentials.length === 0 ? (
          <p className="text-sm text-slate-500">
            No credentials issued yet. Click &ldquo;Issue New Degree&rdquo; to
            create one.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-slate-500 border-b border-slate-200">
                  <th className="pb-2">Student</th>
                  <th className="pb-2">Enrollment</th>
                  <th className="pb-2">Degree</th>
                  <th className="pb-2">Credential ID</th>
                  <th className="pb-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {credentials.map((c) => (
                  <tr key={c.id} className="border-b border-slate-100">
                    <td className="py-3 font-medium text-slate-900">
                      {c.studentName}
                    </td>
                    <td className="py-3 text-slate-600">{c.enrollmentNo}</td>
                    <td className="py-3 text-slate-600">{c.degree}</td>
                    <td className="py-3 text-slate-600 font-mono text-xs">
                      {c.credentialId}
                    </td>
                    <td className="py-3">
                      <StatusBadge status={c.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value, color = "text-slate-900" }) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5">
      <p className="text-sm text-slate-500">{label}</p>
      <p className={`text-3xl font-bold mt-1 ${color}`}>{value}</p>
    </div>
  );
}

function StatusBadge({ status }) {
  const styles =
    status === "ACTIVE"
      ? "bg-green-50 text-green-700 border-green-200"
      : "bg-red-50 text-red-700 border-red-200";
  return (
    <span
      className={`inline-block px-2 py-1 rounded-md border text-xs font-medium ${styles}`}
    >
      {status}
    </span>
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
      <div className="h-64 bg-slate-100 rounded-xl animate-pulse" />
    </div>
  );
}

export default function IssuerPage() {
  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-6xl mx-auto">
        <Suspense fallback={<Skeleton />}>
          <IssuerContent />
        </Suspense>
      </div>
    </div>
  );
}