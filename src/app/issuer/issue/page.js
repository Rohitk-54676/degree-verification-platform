"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { issueCredential } from "../../../../actions/issue-credential";

const initialState = { ok: false };

export default function IssuePage() {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(
    issueCredential,
    initialState
  );

  useEffect(() => {
    if (state?.ok) {
      router.push("/issuer");
      router.refresh();
    }
  }, [state, router]);

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <Link href="/issuer" className="text-sm text-blue-600 hover:underline">
            ← Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-slate-900 mt-2">
            Issue New Degree
          </h1>
          <p className="text-slate-600 mt-1">
            Create a tamper-proof credential for a student.
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
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Student Name *
            </label>
            <input
              name="studentName"
              required
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Rohit Kumar"
            />
            {state?.errors?.studentName && (
              <p className="text-xs text-red-600 mt-1">
                {state.errors.studentName[0]}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Enrollment / Registration Number *
            </label>
            <input
              name="enrollmentNo"
              required
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="12400388"
            />
            <p className="text-xs text-slate-500 mt-1">
              Must match the student&apos;s account enrollment number for them
              to see this degree.
            </p>
            {state?.errors?.enrollmentNo && (
              <p className="text-xs text-red-600 mt-1">
                {state.errors.enrollmentNo[0]}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Degree *
              </label>
              <input
                name="degree"
                required
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Bachelor of Technology"
              />
              {state?.errors?.degree && (
                <p className="text-xs text-red-600 mt-1">
                  {state.errors.degree[0]}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Branch / Specialization *
              </label>
              <input
                name="branch"
                required
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Computer Science and Engineering"
              />
              {state?.errors?.branch && (
                <p className="text-xs text-red-600 mt-1">
                  {state.errors.branch[0]}
                </p>
              )}
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
                required
                min="1980"
                max={new Date().getFullYear() + 5}
                defaultValue={new Date().getFullYear()}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {state?.errors?.yearOfPassing && (
                <p className="text-xs text-red-600 mt-1">
                  {state.errors.yearOfPassing[0]}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                CGPA (optional)
              </label>
              <input
                name="cgpa"
                type="number"
                step="0.01"
                min="0"
                max="10"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="8.6"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4 border-t border-slate-200">
            <button
              type="submit"
              disabled={isPending}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-2.5 rounded-lg font-medium"
            >
              {isPending ? "Issuing..." : "Issue Degree"}
            </button>
            <Link
              href="/issuer"
              className="px-6 py-2.5 rounded-lg border border-slate-300 hover:bg-slate-50 text-slate-700"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}