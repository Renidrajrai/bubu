export type AdminNavItem = {
  label: string;
  href: string;
  icon: string;
  section?: "main" | "media" | "system" | "bottom";
};

export const ADMIN_NAV: AdminNavItem[] = [
  { label: "Dashboard", href: "/admin", icon: "grid", section: "main" },
  { label: "Memories", href: "/admin/memories", icon: "image", section: "main" },
  { label: "Story", href: "/admin/story", icon: "book", section: "main" },
  { label: "Preview", href: "/admin/preview", icon: "preview", section: "main" },
  { label: "Media Library", href: "/admin/media", icon: "film", section: "media" },
  { label: "Settings", href: "/admin/settings", icon: "settings", section: "system" },
  { label: "View Website", href: "/", icon: "external", section: "bottom" },
];
