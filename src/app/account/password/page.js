import { Suspense } from "react";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import PasswordForm from "./form";

async function AuthGuard() {
  const session = await auth();
  if (!session) {
    redirect("/login");
  }
  return <PasswordForm />;
}

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 p-8 flex items-center justify-center">
          <div className="w-full max-w-md bg-white border border-slate-200 rounded-xl p-6 space-y-3">
            <div className="h-6 w-40 bg-slate-100 rounded animate-pulse" />
            <div className="h-10 bg-slate-100 rounded animate-pulse" />
            <div className="h-10 bg-slate-100 rounded animate-pulse" />
            <div className="h-10 bg-slate-100 rounded animate-pulse" />
          </div>
        </div>
      }
    >
      <AuthGuard />
    </Suspense>
  );
}