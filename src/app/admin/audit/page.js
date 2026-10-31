import Link from "next/link";
import { Suspense } from "react";
import { connection } from "next/server";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const instant = false;

async function AuditContent() {
  await connection();
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") redirect("/");

  const logs = await prisma.auditLog.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
    include: {
      credential: {
        select: {
          studentName: true,
          credentialId: true,
          university: { select: { code: true } },
        },
      },
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <Link href="/admin" className="text-sm text-blue-600 hover:underline">
          ← Back to Admin
        </Link>
        <h1 className="text-3xl font-bold text-slate-900 mt-2">System Audit Log</h1>
        <p className="text-slate-600 mt-1">
          The last 50 actions performed on the platform.
        </p>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
              <tr>
                <th className="px-5 py-3 font-medium">Time</th>
                <th className="px-5 py-3 font-medium">Action</th>
                <th className="px-5 py-3 font-medium">Credential</th>
                <th className="px-5 py-3 font-medium">Actor</th>
                <th className="px-5 py-3 font-medium">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {logs.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-5 py-8 text-center text-slate-500">
                    No audit logs found.
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/50">
                    <td className="px-5 py-4 text-slate-600 whitespace-nowrap text-xs">
                      {new Date(log.createdAt).toLocaleString()}
                    </td>
                    <td className="px-5 py-4">
                      <ActionBadge action={log.action} />
                    </td>
                    <td className="px-5 py-4">
                      <p className="font-medium text-slate-900">
                        {log.credential.studentName}
                      </p>
                      <p className="text-xs font-mono text-slate-500">
                        {log.credential.university.code} - {log.credential.credentialId}
                      </p>
                    </td>
                    <td className="px-5 py-4 text-slate-600 text-xs">
                      {log.actor || "System"}
                    </td>
                    <td className="px-5 py-4 text-slate-500 text-xs max-w-[200px] truncate">
                      {log.meta ? JSON.stringify(log.meta) : "-"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function ActionBadge({ action }) {
  const styles =
    {
      ISSUED: "bg-blue-50 text-blue-700 border-blue-200",
      VERIFIED: "bg-green-50 text-green-700 border-green-200",
      REVOKED: "bg-red-50 text-red-700 border-red-200",
    }[action] || "bg-slate-50 text-slate-700 border-slate-200";

  return (
    <span
      className={`inline-block px-2.5 py-1 rounded-md border text-xs font-semibold uppercase tracking-wide ${styles}`}
    >
      {action}
    </span>
  );
}

export default function AuditPage() {
  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-7xl mx-auto">
        <Suspense
          fallback={
            <div className="space-y-4">
              <div className="h-10 w-64 bg-slate-100 rounded animate-pulse" />
              <div className="h-96 bg-slate-100 rounded-xl animate-pulse" />
            </div>
          }
        >
          <AuditContent />
        </Suspense>
      </div>
    </div>
  );
}