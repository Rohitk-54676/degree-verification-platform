import { Suspense } from "react";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import CertificateTemplate from "@/components/certificate/CertificateTemplate";
import DownloadButton from "./download-button";

export const instant = false;

async function CertificateContent({ credentialId }) {
  const session = await auth();
  if (!session) {
    redirect("/login");
  }

  const credential = await prisma.credential.findUnique({
    where: { credentialId },
    include: { university: true },
  });

  if (!credential) {
    notFound();
  }

  // Access control
  const role = session.user.role;
  const isAdmin = role === "ADMIN";
  const isOwnerIssuer =
    role === "UNIVERSITY" && session.user.universityId === credential.universityId;
  const isOwnerStudent =
    role === "STUDENT" &&
    session.user.enrollmentNo === credential.enrollmentNo &&
    session.user.universityId === credential.universityId;

  if (!isAdmin && !isOwnerIssuer && !isOwnerStudent) {
    return (
      <div className="p-8 text-center">
        <h1 className="text-xl font-bold text-red-600">Access Denied</h1>
        <p className="text-slate-600 mt-2">
          You don&apos;t have permission to view this certificate.
        </p>
        <Link href="/" className="inline-block mt-4 text-blue-600 hover:underline">
          Go home
        </Link>
      </div>
    );
  }

  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const verifyUrl = `${baseUrl}/verify/${credential.credentialId}`;

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-5xl mx-auto space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <button
              onClick={undefined}
              className="text-sm text-blue-600 hover:underline"
              formAction=""
            >
                          <Link
              href={role === "STUDENT" ? "/student" : role === "UNIVERSITY" ? "/issuer" : "/admin"}
              className="text-sm text-blue-600 hover:underline"
            >
              ← Back
            </Link>
            </button>
            <h1 className="text-2xl font-bold text-slate-900 mt-1">
              Degree Certificate
            </h1>
            <p className="text-sm text-slate-600">
              {credential.studentName} — {credential.credentialId}
            </p>
          </div>
          <div className="flex gap-2">
            <DownloadButton credentialId={credential.credentialId} />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow overflow-hidden">
          <CertificateTemplate
            credential={credential}
            university={credential.university}
            verifyUrl={verifyUrl}
          />
        </div>
      </div>
    </div>
  );
}

function Skeleton() {
  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-5xl mx-auto">
        <div className="h-64 bg-white rounded-xl animate-pulse" />
      </div>
    </div>
  );
}

export default async function CertificatePage({ params }) {
  const { credentialId } = await params;
  return (
    <Suspense fallback={<Skeleton />}>
      <CertificateContent credentialId={credentialId} />
    </Suspense>
  );
}