import Link from "next/link";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function StudentContent() {
  const session = await auth();

  if (!session.user.enrollmentNo || !session.user.universityId) {
    redirect("/login");
  }

  const [university, credentials] = await Promise.all([
    prisma.university.findUnique({
      where: { id: session.user.universityId },
    }),
    prisma.credential.findMany({
      where: {
        enrollmentNo: session.user.enrollmentNo,
        universityId: session.user.universityId,
      },
      orderBy: { issuedAt: "desc" },
    }),
  ]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">
          Welcome, {session.user.name}
        </h1>
        <p className="text-slate-600 mt-1">
          {university?.name} — Enrollment: {session.user.enrollmentNo}
        </p>
      </div>

      {credentials.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-xl p-8 text-center">
          <p className="text-slate-600">
            No degrees have been issued to your enrollment number yet.
          </p>
          <p className="text-sm text-slate-500 mt-2">
            If you believe this is an error, contact your university registrar.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {credentials.map((c) => (
            <div
              key={c.id}
              className="bg-white border border-slate-200 rounded-xl p-6 hover:shadow-lg transition"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">
                    {c.degree}
                  </h2>
                  <p className="text-sm text-slate-600">{c.branch}</p>
                </div>
                <StatusBadge status={c.status} />
              </div>

              <dl className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-slate-500">Year</dt>
                  <dd className="text-slate-900">{c.yearOfPassing}</dd>
                </div>
                {c.cgpa && (
                  <div className="flex justify-between">
                    <dt className="text-slate-500">CGPA</dt>
                    <dd className="text-slate-900">{c.cgpa}</dd>
                  </div>
                )}
                <div className="flex justify-between">
                  <dt className="text-slate-500">Credential ID</dt>
                  <dd className="text-slate-900 font-mono text-xs">
                    {c.credentialId}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-slate-500">Issued</dt>
                  <dd className="text-slate-900">
                    {new Date(c.issuedAt).toLocaleDateString()}
                  </dd>
                </div>
              </dl>

                            <div className="flex gap-2 mt-4">
                <Link
                  href={`/certificate/${c.credentialId}`}
                  className="flex-1 text-center bg-slate-100 hover:bg-slate-200 text-slate-800 px-3 py-2 rounded-lg text-sm font-medium"
                >
                  View Certificate
                </Link>
                <a
                  href={`/api/certificate/${c.credentialId}/pdf`}
                  className="flex-1 text-center bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm font-medium"
                >
                  Download PDF
                </a>
              </div>
            </div>
          ))}
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="h-48 bg-slate-100 rounded-xl animate-pulse" />
        <div className="h-48 bg-slate-100 rounded-xl animate-pulse" />
      </div>
    </div>
  );
}

export default function StudentPage() {
  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-5xl mx-auto">
        <Suspense fallback={<Skeleton />}>
          <StudentContent />
        </Suspense>
      </div>
    </div>
  );
}