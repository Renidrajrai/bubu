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
      className="text-xs text-text-secondary transition-colors hover:text-rose"
    >
      log out
    </button>
  );
}
