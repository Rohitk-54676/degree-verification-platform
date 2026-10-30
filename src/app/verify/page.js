"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function VerifyEntryPage() {
  const router = useRouter();
  const [credentialId, setCredentialId] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    const trimmed = credentialId.trim();
    if (trimmed) {
      router.push(`/verify/${encodeURIComponent(trimmed)}`);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <Link href="/" className="text-sm text-blue-600 hover:underline">
            ← Home
          </Link>
          <h1 className="text-3xl font-bold text-slate-900 mt-2">
            Verify a Degree
          </h1>
          <p className="text-slate-600 mt-1 text-sm">
            Enter the credential ID printed on the certificate.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white border border-slate-200 rounded-xl p-6 space-y-4"
        >
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Credential ID
            </label>
            <input
              type="text"
              value={credentialId}
              onChange={(e) => setCredentialId(e.target.value)}
              placeholder="LPU-2026-000001"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
            />
            <p className="text-xs text-slate-500 mt-1">
              Found below the QR code on the certificate.
            </p>
          </div>

          <button
            type="submit"
            disabled={!credentialId.trim()}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-2.5 rounded-lg font-medium"
          >
            Verify
          </button>
        </form>

        <div className="mt-4 text-center text-xs text-slate-500">
          <p className="mb-2">Try a sample:</p>
          <div className="flex gap-2 justify-center flex-wrap">
            <Link
              href="/verify/LPU-2026-000001"
              className="text-blue-600 hover:underline font-mono"
            >
              LPU-2026-000001
            </Link>
            <span>·</span>
            <Link
              href="/verify/DU-2024-000001"
              className="text-blue-600 hover:underline font-mono"
            >
              DU-2024-000001
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}