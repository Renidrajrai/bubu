"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ADMIN_NAV, type AdminNavItem } from "@/config/admin-nav";
import LogoutButton from "./LogoutButton";

// Simple inline SVG icons — no dependency needed
const icons: Record<string, React.ReactNode> = {
  grid: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="1" y="1" width="5.5" height="5.5" rx="1" />
      <rect x="9.5" y="1" width="5.5" height="5.5" rx="1" />
      <rect x="1" y="9.5" width="5.5" height="5.5" rx="1" />
      <rect x="9.5" y="9.5" width="5.5" height="5.5" rx="1" />
    </svg>
  ),
  image: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="1.5" y="2.5" width="13" height="11" rx="1.5" />
      <circle cx="5.5" cy="6.5" r="1.5" />
      <path d="M1.5 11l3.5-3 2.5 2 3-2.5L14.5 11" />
    </svg>
  ),
  book: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M2 2.5h4.5c.83 0 1.5.67 1.5 1.5v9c0-.83-.67-1.5-1.5-1.5H2V2.5z" />
      <path d="M14 2.5H9.5C8.67 2.5 8 3.17 8 4v9c0-.83.67-1.5 1.5-1.5H14V2.5z" />
    </svg>
  ),
  film: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="1.5" y="2.5" width="13" height="11" rx="1.5" />
      <path d="M5 2v11M11 2v11M1.5 6h13M1.5 10h13" />
    </svg>
  ),
  settings: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="8" cy="8" r="2.5" />
      <path d="M13.5 8a5.5 5.5 0 01-.3 1.8l1.3.8-.9 1.6-1.4-.5a5.5 5.5 0 01-1.5 1l.2 1.5h-1.8l.2-1.5a5.5 5.5 0 01-1.5-1l-1.4.5-.9-1.6 1.3-.8A5.5 5.5 0 015.5 8a5.5 5.5 0 01.3-1.8L4.5 5.4l.9-1.6 1.4.5a5.5 5.5 0 011.5-1L8 1.8h1.8l-.2 1.5a5.5 5.5 0 011.5 1l1.4-.5.9 1.6-1.3.8c.2.6.3 1.2.3 1.8z" />
    </svg>
  ),
  external: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M6 2H3.5A1.5 1.5 0 002 3.5v9A1.5 1.5 0 003.5 14h9a1.5 1.5 0 001.5-1.5V10" />
      <path d="M9 2h5v5M14 2L7 9" />
    </svg>
  ),
  menu: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M3 5h14M3 10h14M3 15h14" />
    </svg>
  ),
  preview: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="1.5" y="2.5" width="13" height="11" rx="1.5" />
      <circle cx="8" cy="8" r="2.5" />
    </svg>
  ),
  close: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M5 5l10 10M15 5L5 15" />
    </svg>
  ),
};

function NavItem({ item, active, onClick }: { item: AdminNavItem; active: boolean; onClick?: () => void }) {
  return (
    <Link
      href={item.href}
      onClick={onClick}
      className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors ${
        active
          ? "bg-surface-muted font-medium text-text-primary"
          : "text-text-secondary hover:bg-surface-muted/50 hover:text-text-primary"
      }`}
    >
      <span className="shrink-0">{icons[item.icon]}</span>
      {item.label}
    </Link>
  );
}

export default function AdminSidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const closeMobile = useCallback(() => setMobileOpen(false), []);

  // Close on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const isActive = (href: string) =>
    href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

  const sections = {
    main: ADMIN_NAV.filter((n) => n.section === "main"),
    media: ADMIN_NAV.filter((n) => n.section === "media"),
    system: ADMIN_NAV.filter((n) => n.section === "system"),
    bottom: ADMIN_NAV.filter((n) => n.section === "bottom"),
  };

  function renderNav() {
    return (
      <div className="flex h-full flex-col">
        <nav className="flex-1 space-y-6 px-3 py-4">
          {(["main", "media", "system"] as const).map((section) => (
            <div key={section}>
              <p className="mb-1 px-3 text-[10px] font-medium uppercase tracking-widest text-text-secondary/60">
                {section}
              </p>
              <div className="space-y-0.5">
                {sections[section].map((item) => (
                  <NavItem key={item.href} item={item} active={isActive(item.href)} onClick={closeMobile} />
                ))}
              </div>
            </div>
          ))}
        </nav>

        <div className="border-t border-border px-3 py-3 space-y-0.5">
          {sections.bottom.map((item) => (
            <NavItem key={item.href} item={item} active={isActive(item.href)} onClick={closeMobile} />
          ))}
          <div className="px-3 pt-1">
            <LogoutButton />
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Mobile hamburger */}
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed left-4 top-3 z-40 rounded-lg p-1.5 text-text-secondary hover:text-text-primary lg:hidden"
        aria-label="Open menu"
      >
        {icons.menu}
      </button>

      {/* Desktop sidebar */}
      <aside className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-30 lg:flex lg:w-56 lg:flex-col lg:border-r lg:border-border lg:bg-surface/80 lg:backdrop-blur">
        <div className="px-4 py-4">
          <Link href="/admin" className="font-display text-base font-medium text-text-primary">
            bubu admin
          </Link>
        </div>
        {renderNav()}
      </aside>

      {/* Mobile drawer overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/30" onClick={closeMobile} />
          <aside className="absolute inset-y-0 left-0 z-50 w-64 bg-surface shadow-[var(--shadow-lift)]">
            <div className="flex items-center justify-between px-4 py-4">
              <span className="font-display text-base font-medium text-text-primary">bubu admin</span>
              <button onClick={closeMobile} className="rounded-lg p-1 text-text-secondary hover:text-text-primary" aria-label="Close menu">
                {icons.close}
              </button>
            </div>
            {renderNav()}
          </aside>
        </div>
      )}
    </>
  );
}
