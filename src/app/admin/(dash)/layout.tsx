import type { ReactNode } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { ToastProvider } from "@/components/admin/Toast";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <ToastProvider>
      <div className="flex min-h-dvh bg-background">
        <AdminSidebar />
        <main className="flex-1 px-6 py-6 pt-14 lg:pl-64 lg:pt-6">{children}</main>
      </div>
    </ToastProvider>
  );
}
