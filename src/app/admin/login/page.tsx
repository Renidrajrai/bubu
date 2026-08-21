import { Suspense } from "react";
import LoginForm from "@/components/admin/LoginForm";

export const metadata = { title: "admin · login" };

export default function AdminLoginPage() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-6">
      <div className="text-center">
        <h1 className="text-xl font-medium text-text-primary">backstage</h1>
        <p className="mt-1 font-mono text-xs uppercase tracking-[0.25em] text-text-secondary">
          memories admin
        </p>
      </div>
      <Suspense>
        <LoginForm />
      </Suspense>
    </main>
  );
}
