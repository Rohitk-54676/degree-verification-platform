"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { changePassword } from "../../../../actions/change-password";

const initialState = { ok: false };

export default function PasswordForm() {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(
    changePassword,
    initialState
  );
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (state?.ok) {
      setSuccess(true);
    }
  }, [state]);

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-md mx-auto">
        <div className="mb-6">
          <button
            onClick={() => router.back()}
            className="text-sm text-blue-600 hover:underline"
          >
            ← Back
          </button>
          <h1 className="text-2xl font-bold text-slate-900 mt-2">
            Change Password
          </h1>
          <p className="text-slate-600 mt-1 text-sm">
            Update your account password.
          </p>
        </div>

        {success && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm">
            Password changed successfully.
          </div>
        )}

        {state?.error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
            {state.error}
          </div>
        )}

        <form
          action={formAction}
          className="bg-white border border-slate-200 rounded-xl p-6 space-y-4"
        >
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Current Password *
            </label>
            <input
              name="currentPassword"
              type="password"
              required
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {state?.errors?.currentPassword && (
              <p className="text-xs text-red-600 mt-1">
                {state.errors.currentPassword[0]}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              New Password *
            </label>
            <input
              name="newPassword"
              type="password"
              required
              minLength={6}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {state?.errors?.newPassword && (
              <p className="text-xs text-red-600 mt-1">
                {state.errors.newPassword[0]}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Confirm New Password *
            </label>
            <input
              name="confirmPassword"
              type="password"
              required
              minLength={6}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {state?.errors?.confirmPassword && (
              <p className="text-xs text-red-600 mt-1">
                {state.errors.confirmPassword[0]}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2.5 rounded-lg font-medium"
          >
            {isPending ? "Updating..." : "Change Password"}
          </button>
        </form>

        <p className="text-xs text-slate-500 mt-4 text-center">
          <Link href="/" className="hover:underline">
            Return to home
          </Link>
        </p>
      </div>
    </div>
  );
}