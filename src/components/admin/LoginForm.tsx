"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const form = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: form.get("username"),
          password: form.get("password"),
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Login failed");
      }
      router.push(searchParams.get("next") ?? "/admin");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-64 flex-col gap-3">
      <input
        name="username"
        placeholder="username"
        autoComplete="username"
        required
        className="rounded-lg border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-text-secondary"
      />
      <input
        name="password"
        type="password"
        placeholder="password"
        autoComplete="current-password"
        required
        className="rounded-lg border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-text-secondary"
      />
      {error && <p className="text-xs text-rose">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="rounded-full bg-cocoa px-4 py-2 text-sm font-medium text-cream disabled:opacity-50"
      >
        {loading ? "checking…" : "come in"}
      </button>
    </form>
  );
}
