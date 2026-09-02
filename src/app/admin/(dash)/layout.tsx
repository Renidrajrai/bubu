import type { ReactNode } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { ToastProvider } from "@/components/admin/Toast";
import { getSiteTitle } from "@/lib/zine-data";

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const siteTitle = await getSiteTitle();
  return (
    <ToastProvider>
      <div className="flex min-h-dvh bg-background">
        <AdminSidebar siteTitle={siteTitle} />
        <main className="flex-1 px-6 py-6 pt-14 lg:pl-64 lg:pt-6">{children}</main>
      </div>
    </ToastProvider>
  );
}
