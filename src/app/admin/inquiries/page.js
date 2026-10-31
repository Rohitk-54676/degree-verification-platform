import Link from "next/link";
import { Suspense } from "react";
import { connection } from "next/server";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const instant = false;

async function InquiriesContent() {
  await connection();
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") redirect("/");

  const inquiries = await prisma.inquiry.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <Link href="/admin" className="text-sm text-blue-600 hover:underline">
          ← Back to Admin
        </Link>
        <h1 className="text-3xl font-bold text-slate-900 mt-2">University Requests</h1>
        <p className="text-slate-600 mt-1">
          Universities requesting to join the platform.
        </p>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
            <tr>
              <th className="px-5 py-3 font-medium">Date</th>
              <th className="px-5 py-3 font-medium">University</th>
              <th className="px-5 py-3 font-medium">Contact Person</th>
              <th className="px-5 py-3 font-medium">Email</th>
              <th className="px-5 py-3 font-medium">Message</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {inquiries.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-5 py-8 text-center text-slate-500">
                  No requests yet.
                </td>
              </tr>
            ) : (
              inquiries.map((inq) => (
                <tr key={inq.id} className="hover:bg-slate-50/50">
                  <td className="px-5 py-4 text-slate-600 whitespace-nowrap text-xs">
                    {new Date(inq.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-5 py-4 font-medium text-slate-900">
                    {inq.university}
                  </td>
                  <td className="px-5 py-4 text-slate-600">{inq.contactName}</td>
                  <td className="px-5 py-4">
                    <a href={`mailto:${inq.email}`} className="text-blue-600 hover:underline">
                      {inq.email}
                    </a>
                  </td>
                  <td className="px-5 py-4 text-slate-500 text-xs max-w-xs truncate" title={inq.message}>
                    {inq.message || "-"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function InquiriesPage() {
  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-7xl mx-auto">
        <Suspense fallback={<div className="h-64 bg-slate-100 rounded-xl animate-pulse" />}>
          <InquiriesContent />
        </Suspense>
      </div>
    </div>
  );
}