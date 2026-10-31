import Link from "next/link";
import { verifyCredentialById } from "@/lib/verify";
import StatusCard from "./status-card";
import VerifyAnother from "./verify-another";

export const instant = false;

export default async function VerifyPage({ params }) {
  const { credentialId } = await params;

  const { status, credential, university } = await verifyCredentialById(
    credentialId,
    { logAudit: true }
  );

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center">
          <Link href="/" className="text-sm text-blue-600 hover:underline">
            ← DegreeVerify Home
          </Link>
          <h1 className="text-2xl font-bold text-slate-900 mt-2">
            Degree Verification
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Credential ID:{" "}
            <span className="font-mono">{credentialId}</span>
          </p>
        </div>

        {/* Status card */}
        <StatusCard status={status} />

        {/* Certificate details (if found) */}
        {credential && status !== "NOT_FOUND" && (
          <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div
                className="w-14 h-14 rounded-lg flex items-center justify-center text-white font-bold text-lg flex-shrink-0"
                style={{ backgroundColor: university.primaryColor }}
              >
                {university.code}
              </div>
              <div>
                <p className="font-semibold text-slate-900">
                  {university.name}
                </p>
                {university.address && (
                  <p className="text-xs text-slate-500">{university.address}</p>
                )}
              </div>
            </div>

            <hr className="border-slate-100" />

            <dl className="space-y-2 text-sm">
              <Row label="Student Name" value={credential.studentName} />
              <Row label="Enrollment No" value={credential.enrollmentNo} mono />
              <Row label="Degree" value={credential.degree} />
              <Row label="Branch" value={credential.branch} />
              <Row label="Year of Passing" value={credential.yearOfPassing} />
              {credential.cgpa && <Row label="CGPA" value={credential.cgpa} />}
              <Row
                label="Issued On"
                value={new Date(credential.issuedAt).toLocaleDateString()}
              />
              {credential.status === "REVOKED" && credential.revokedAt && (
                <Row
                  label="Revoked On"
                  value={new Date(credential.revokedAt).toLocaleDateString()}
                />
              )}
              {credential.status === "REVOKED" && credential.revokedReason && (
                <Row label="Revocation Reason" value={credential.revokedReason} />
              )}
            </dl>

            <hr className="border-slate-100" />

            <div className="text-xs text-slate-500 space-y-1">
              <p>
                <span className="font-medium">SHA-256 Hash:</span>
              </p>
              <p className="font-mono break-all text-[10px]">
                {credential.recordHash}
              </p>
            </div>
          </div>
        )}

        {/* Verify Another Component */}
        <VerifyAnother />

        {/* Footer */}
        <div className="text-center text-xs text-slate-500 pt-4">
          <p>
            Verification is logged in our audit trail. Every scan recomputes
            the credential&apos;s SHA-256 hash to detect tampering.
          </p>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value, mono = false }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-slate-500">{label}</dt>
      <dd
        className={`text-slate-900 text-right ${mono ? "font-mono text-xs" : ""}`}
      >
        {value}
      </dd>
    </div>
  );
}