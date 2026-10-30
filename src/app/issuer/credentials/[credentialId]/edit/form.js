"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { updateCredential } from "../../../../../../actions/update-credential";

const initialState = { ok: false };

export default function EditForm({ credential }) {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(
    updateCredential,
    initialState
  );
  const [status, setStatus] = useState(credential.status);

  useEffect(() => {
    if (state?.ok) {
      router.push("/issuer/credentials");
      router.refresh();
    }
  }, [state, router]);

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <Link
            href="/issuer/credentials"
            className="text-sm text-blue-600 hover:underline"
          >
            ← Back to Credentials
          </Link>
          <h1 className="text-3xl font-bold text-slate-900 mt-2">
            Edit Credential
          </h1>
          <p className="text-slate-600 mt-1">
            Editing a field will re-sign the credential with a fresh SHA-256
            hash.
          </p>
        </div>

        {state?.error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
            {state.error}
          </div>
        )}

        <form
          action={formAction}
          className="bg-white border border-slate-200 rounded-xl p-6 space-y-5"
        >
          <input
            type="hidden"
            name="originalCredentialId"
            value={credential.credentialId}
          />

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Credential ID *
            </label>
            <input
              name="credentialId"
              defaultValue={credential.credentialId}
              required
              className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-slate-500 mt-1">
              Changing this changes the verify URL.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Student Name *
            </label>
            <input
              name="studentName"
              defaultValue={credential.studentName}
              required
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Enrollment No *
            </label>
            <input
              name="enrollmentNo"
              defaultValue={credential.enrollmentNo}
              required
              className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Degree *
              </label>
              <input
                name="degree"
                defaultValue={credential.degree}
                required
                className="w-full px-3 py-2 border border-slate-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Branch *
              </label>
              <input
                name="branch"
                defaultValue={credential.branch}
                required
                className="w-full px-3 py-2 border border-slate-300 rounded-lg"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Year of Passing *
              </label>
              <input
                name="yearOfPassing"
                type="number"
                defaultValue={credential.yearOfPassing}
                required
                min="1980"
                max={new Date().getFullYear() + 5}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                CGPA
              </label>
              <input
                name="cgpa"
                type="number"
                step="0.01"
                defaultValue={credential.cgpa ?? ""}
                min="0"
                max="10"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg"
              />
            </div>
          </div>

          <hr className="border-slate-200" />

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Status *
            </label>
            <select
              name="status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg"
            >
              <option value="ACTIVE">ACTIVE — Valid credential</option>
              <option value="REVOKED">REVOKED — Not accepted</option>
            </select>
            <p className="text-xs text-slate-500 mt-1">
              Setting to REVOKED makes every future verification show ❌ REVOKED.
              Setting back to ACTIVE restores validity.
            </p>
          </div>

          {status === "REVOKED" && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Revocation Reason
              </label>
              <textarea
                name="revokedReason"
                defaultValue={credential.revokedReason || ""}
                rows={2}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                placeholder="e.g. Issued in error"
              />
            </div>
          )}

          <div className="flex gap-3 pt-4 border-t border-slate-200">
            <button
              type="submit"
              disabled={isPending}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-2.5 rounded-lg font-medium"
            >
              {isPending ? "Saving..." : "Save Changes"}
            </button>
            <Link
              href="/issuer/credentials"
              className="px-6 py-2.5 rounded-lg border border-slate-300 hover:bg-slate-50 text-slate-700"
            >
              Cancel
            </Link>
          </div>

          <div className="pt-4 border-t border-slate-200 text-xs text-slate-500">
            <p>
              <strong>Note:</strong> the record hash will be automatically
              recomputed after saving, so the credential will continue to
              verify as VALID (or REVOKED if you set that status).
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}