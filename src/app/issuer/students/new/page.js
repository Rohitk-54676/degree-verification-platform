"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createStudent } from "../../../../../actions/create-student";

const initialState = { ok: false };

export default function NewStudentPage() {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(
    createStudent,
    initialState
  );

  useEffect(() => {
    if (state?.ok) {
      router.push("/issuer/students");
      router.refresh();
    }
  }, [state, router]);

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <Link
            href="/issuer/students"
            className="text-sm text-blue-600 hover:underline"
          >
            ← Back to Students
          </Link>
          <h1 className="text-3xl font-bold text-slate-900 mt-2">
            Create Student Account
          </h1>
          <p className="text-slate-600 mt-1">
            Give a student login access. They&apos;ll use this email and
            password to log in and see their degrees.
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
              Full Name *
            </label>
            <input
              name="name"
              required
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Priya Sharma"
            />
            {state?.errors?.name && (
              <p className="text-xs text-red-600 mt-1">
                {state.errors.name[0]}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Email *
            </label>
            <input
              name="email"
              type="email"
              required
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="priya@lpu.co.in"
            />
            <p className="text-xs text-slate-500 mt-1">
              Student will use this email to log in.
            </p>
            {state?.errors?.email && (
              <p className="text-xs text-red-600 mt-1">
                {state.errors.email[0]}
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
              placeholder="LPU2021CS0456"
            />
            <p className="text-xs text-slate-500 mt-1">
              This must match the enrollment number used when degrees are
              issued to this student.
            </p>
            {state?.errors?.enrollmentNo && (
              <p className="text-xs text-red-600 mt-1">
                {state.errors.enrollmentNo[0]}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Default Password *
            </label>
            <input
              name="password"
              type="text"
              required
              minLength={6}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
              placeholder="Password@123"
            />
            <p className="text-xs text-slate-500 mt-1">
              Give this password to the student. They can change it after first
              login.
            </p>
            {state?.errors?.password && (
              <p className="text-xs text-red-600 mt-1">
                {state.errors.password[0]}
              </p>
            )}
          </div>

          <div className="flex gap-3 pt-4 border-t border-slate-200">
            <button
              type="submit"
              disabled={isPending}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-2.5 rounded-lg font-medium"
            >
              {isPending ? "Creating..." : "Create Student"}
            </button>
            <Link
              href="/issuer/students"
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