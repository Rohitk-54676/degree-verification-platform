import { connection } from "next/server";
import { prisma } from "@/lib/prisma";

export default async function TrustStats() {
  await connection();
  
  const [universities, credentials, users] = await Promise.all([
    prisma.university.count(),
    prisma.credential.count(),
    prisma.user.count(),
  ]);

  const stats = [
    { label: "Universities Onboarded", value: universities },
    { label: "Degrees Issued", value: credentials },
    { label: "Active Users", value: users },
    { label: "Tamper-Proof", value: "100%" },
  ];

  return (
    <div className="border-y border-slate-200 bg-slate-50">
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
        {stats.map((stat, i) => (
          <div key={i} className="text-center">
            <p className="text-4xl font-extrabold text-slate-900 mb-1">
              {stat.value}
            </p>
            <p className="text-sm text-slate-500 font-medium uppercase tracking-wide">
              {stat.label}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}