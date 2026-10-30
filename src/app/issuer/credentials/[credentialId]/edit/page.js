import { Suspense } from "react";
import { connection } from "next/server";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import EditForm from "./form";


export const instant = false;

async function EditContent({ credentialId }) {
  await connection();
  const session = await auth();
  if (!session || session.user.role !== "UNIVERSITY" || !session.user.universityId) {
    redirect("/login");
  }

  const credential = await prisma.credential.findUnique({
    where: { credentialId },
    include: { university: true },
  });

  if (!credential) notFound();

  if (credential.universityId !== session.user.universityId) {
    redirect("/issuer/credentials");
  }

  return <EditForm credential={credential} />;
}

function Skeleton() {
  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-2xl mx-auto space-y-4">
        <div className="h-10 w-64 bg-slate-100 rounded animate-pulse" />
        <div className="h-96 bg-slate-100 rounded-xl animate-pulse" />
      </div>
    </div>
  );
}

export default async function Page({ params }) {
  const { credentialId } = await params;
  return (
    <Suspense fallback={<Skeleton />}>
      <EditContent credentialId={credentialId} />
    </Suspense>
  );
}