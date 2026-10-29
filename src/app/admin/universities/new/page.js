import { Suspense } from "react";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import NewUniversityForm from "./form";

async function AuthGuard() {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    redirect("/");
  }
  return <NewUniversityForm />;
}

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 p-8">
          <div className="max-w-3xl mx-auto space-y-4">
            <div className="h-10 w-64 bg-slate-100 rounded animate-pulse" />
            <div className="h-64 bg-slate-100 rounded-xl animate-pulse" />
          </div>
        </div>
      }
    >
      <AuthGuard />
    </Suspense>
  );
}