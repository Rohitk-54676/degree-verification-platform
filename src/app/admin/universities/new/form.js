"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createUniversity } from "../../../../../actions/create-university";

const initialState = { ok: false };

export default function NewUniversityForm() {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(
    createUniversity,
    initialState
  );

  useEffect(() => {
    if (state?.ok) {
      router.push("/admin");
      router.refresh();
    }
  }, [state, router]);

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <Link href="/admin" className="text-sm text-blue-600 hover:underline">
            ← Back to Admin
          </Link>
          <h1 className="text-3xl font-bold text-slate-900 mt-2">
            Add University
          </h1>
          <p className="text-slate-600 mt-1">
            Register a new institution that can issue degrees through DegreeVerify.
          </p>
        </div>

        {state?.error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
            {state.error}
          </div>
        )}

        <form
          action={formAction}
          className="bg-white border border-slate-200 rounded-xl p-6 space-y-6"
        >
          <div>
            <h2 className="text-lg font-semibold text-slate-900 mb-3">
              Basic Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  University Name *
                </label>
                <input
                  name="name"
                  required
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Lovely Professional University"
                />
                {state?.errors?.name && (
                  <p className="text-xs text-red-600 mt-1">
                    {state.errors.name[0]}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Code * <span className="text-xs text-slate-500">(2–10 uppercase)</span>
                </label>
                <input
                  name="code"
                  required
                  maxLength={10}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono uppercase"
                  placeholder="LPU"
                  style={{ textTransform: "uppercase" }}
                />
                {state?.errors?.code && (
                  <p className="text-xs text-red-600 mt-1">
                    {state.errors.code[0]}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-slate-900 mb-3">
              Certificate Theme
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Primary Color
                </label>
                <input
                  name="primaryColor"
                  type="color"
                  defaultValue="#1e3a8a"
                  className="w-full h-10 rounded-lg border border-slate-300 cursor-pointer"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Accent Color
                </label>
                <input
                  name="secondaryColor"
                  type="color"
                  defaultValue="#d4af37"
                  className="w-full h-10 rounded-lg border border-slate-300 cursor-pointer"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Font
                </label>
                <select
                  name="fontFamily"
                  defaultValue="serif"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                >
                  <option value="serif">Serif</option>
                  <option value="sans">Sans</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Border
                </label>
                <select
                  name="borderStyle"
                  defaultValue="double"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                >
                  <option value="single">Single</option>
                  <option value="double">Double</option>
                  <option value="ornate">Ornate</option>
                </select>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-slate-900 mb-3">
              Certificate Details
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Registrar Name
                </label>
                <input
                  name="registrarName"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  placeholder="Dr. Aman Mittal"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Motto
                </label>
                <input
                  name="motto"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  placeholder="Transforming Education, Transforming India"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Address
                </label>
                <input
                  name="address"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  placeholder="Jalandhar–Delhi G.T. Road, Phagwara, Punjab 144411"
                />
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-slate-900 mb-3">
              Registrar Account (Optional)
            </h2>
            <label className="flex items-center gap-2 text-sm text-slate-700 mb-3">
              <input
                type="checkbox"
                name="createRegistrar"
                className="w-4 h-4"
              />
              Create a login account for this university&apos;s registrar
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Registrar Email
                </label>
                <input
                  name="registrarEmail"
                  type="email"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  placeholder="registrar@university.edu"
                />
                {state?.errors?.registrarEmail && (
                  <p className="text-xs text-red-600 mt-1">
                    {state.errors.registrarEmail[0]}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Default Password
                </label>
                <input
                  name="registrarPassword"
                  type="text"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  placeholder="Give registrar this password"
                />
                {state?.errors?.registrarPassword && (
                  <p className="text-xs text-red-600 mt-1">
                    {state.errors.registrarPassword[0]}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-4 border-t border-slate-200">
            <button
              type="submit"
              disabled={isPending}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-2.5 rounded-lg font-medium"
            >
              {isPending ? "Creating..." : "Create University"}
            </button>
            <Link
              href="/admin"
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