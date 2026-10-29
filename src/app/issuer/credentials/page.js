import Link from "next/link";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function CredentialsContent() {
  const session = await auth();
  if (!session.user.universityId) redirect("/login");

  const credentials = await prisma.credential.findMany({
    where: { universityId: session.user.universityId },
    orderBy: { issuedAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <Link href="/issuer" className="text-sm text-blue-600 hover:underline">
            ← Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-slate-900 mt-2">
            Issued Credentials
          </h1>
          <p className="text-slate-600 mt-1">
            {credentials.length} degree{credentials.length === 1 ? "" : "s"} issued
          </p>
        </div>
        <Link
          href="/issuer/issue"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
        >
          + Issue New Degree
        </Link>
      </div>

      {credentials.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-xl p-8 text-center">
          <p className="text-slate-600">No credentials issued yet.</p>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left text-slate-500">
              <tr>
                <th className="px-5 py-3">Student</th>
                <th className="px-5 py-3">Enrollment</th>
                <th className="px-5 py-3">Degree</th>
                <th className="px-5 py-3">Credential ID</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {credentials.map((c) => (
                <tr key={c.id} className="border-t border-slate-100">
                  <td className="px-5 py-3 font-medium text-slate-900">
                    {c.studentName}
                  </td>
                  <td className="px-5 py-3 text-slate-600 font-mono text-xs">
                    {c.enrollmentNo}
                  </td>
                  <td className="px-5 py-3 text-slate-600">{c.degree}</td>
                  <td className="px-5 py-3 text-slate-600 font-mono text-xs">
                    {c.credentialId}
                  </td>
                  <td className="px-5 py-3">
                    <StatusBadge status={c.status} />
                  </td>
                  <td className="px-5 py-3 text-right">
                    <Link
                      href={`/certificate/${c.credentialId}`}
                      className="text-blue-600 hover:underline text-xs font-medium"
                    >
                      View →
                    </Link>
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
      <div className="h-64 bg-slate-100 rounded-xl animate-pulse" />
    </div>
  );
}

export default function CredentialsPage() {
  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-6xl mx-auto">
        <Suspense fallback={<Skeleton />}>
          <CredentialsContent />
        </Suspense>
      </div>
    </div>
  );
}