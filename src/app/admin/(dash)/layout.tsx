import Link from "next/link";
import type { ReactNode } from "react";
import LogoutButton from "@/components/admin/LogoutButton";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col">
      <header className="flex items-center justify-between border-b border-border px-6 py-3">
        <nav className="flex items-center gap-5 text-sm">
          <Link href="/admin" className="font-medium text-text-primary">
            memories
          </Link>
          <Link href="/admin/scenes" className="text-text-secondary hover:text-text-primary">
            scenes
          </Link>
          <Link href="/admin/media" className="text-text-secondary hover:text-text-primary">
            media
          </Link>
        </nav>
        <div className="flex items-center gap-4">
          <Link href="/" className="text-xs text-text-secondary hover:text-text-primary">
            view site
          </Link>
          <LogoutButton />
        </div>
      </header>
      <main className="flex-1 px-6 py-6">{children}</main>
    </div>
  );
}
