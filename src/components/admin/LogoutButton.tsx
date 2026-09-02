"use client";

import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();
  return (
    <button
      onClick={async () => {
        await fetch("/api/auth/logout", { method: "POST" });
        router.push("/admin/login");
        router.refresh();
      }}
      className="w-full rounded-full border border-border px-3 py-1.5 text-xs text-text-secondary transition-colors hover:border-rose/60 hover:bg-rose/5 hover:text-rose"
    >
      log out
    </button>
  );
}
