"use client";

import { useState } from "react";
import { useToast } from "../Toast";
import { inputCls, labelCls } from "../formCls";

type Settings = {
  siteTitle: string;
  introText: string;
  archiveEnabled: boolean;
  storyEnabled: boolean;
  defaultDisplayMode: string;
  defaultObjectPosition: string;
};

export default function SettingsForm({
  settings,
}: {
  settings: Settings;
}) {
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);

  async function handleSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    const form = new FormData(e.currentTarget);

    const res = await fetch("/api/admin/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        siteTitle: form.get("siteTitle"),
        introText: form.get("introText"),
        archiveEnabled: form.get("archiveEnabled") === "on",
        storyEnabled: form.get("storyEnabled") === "on",
        defaultDisplayMode: form.get("defaultDisplayMode"),
        defaultObjectPosition: form.get("defaultObjectPosition"),
      }),
    });

    setSaving(false);
    if (res.ok) {
      toast("Settings saved", "success");
    } else {
      toast("Failed to save settings", "error");
    }
  }

  return (
    <form onSubmit={handleSave} className="space-y-6">
      {/* Website */}
      <section className="rounded-xl border border-border bg-surface p-4 space-y-3">
        <h2 className="font-display text-sm font-medium">website</h2>
        <label className={labelCls}>
          site title
          <input name="siteTitle" defaultValue={settings.siteTitle} className={inputCls} />
        </label>
        <label className={labelCls}>
          intro text
          <input name="introText" defaultValue={settings.introText} className={inputCls} />
        </label>
        <div className="flex gap-4">
          <span className="flex items-center gap-1.5 text-xs text-text-secondary">
            <input type="checkbox" name="storyEnabled" defaultChecked={settings.storyEnabled} id="se-story" className="accent-[var(--cocoa)]" />
            <label htmlFor="se-story">story enabled</label>
          </span>
          <span className="flex items-center gap-1.5 text-xs text-text-secondary">
            <input type="checkbox" name="archiveEnabled" defaultChecked={settings.archiveEnabled} id="se-archive" className="accent-[var(--cocoa)]" />
            <label htmlFor="se-archive">archive enabled</label>
          </span>
        </div>
      </section>

      {/* Display defaults */}
      <section className="rounded-xl border border-border bg-surface p-4 space-y-3">
        <h2 className="font-display text-sm font-medium">display defaults</h2>
        <div className="grid grid-cols-2 gap-3">
          <label className={labelCls}>
            default display mode
            <select name="defaultDisplayMode" defaultValue={settings.defaultDisplayMode} className={inputCls}>
              {["inline", "portrait", "landscape", "square", "floating", "polaroid", "collage", "cinematic"].map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </label>
          <label className={labelCls}>
            default crop position
            <input name="defaultObjectPosition" defaultValue={settings.defaultObjectPosition} className={inputCls} />
          </label>
        </div>
      </section>

      {/* Password change */}
      <section className="rounded-xl border border-border bg-surface p-4 space-y-3">
        <h2 className="font-display text-sm font-medium">change password</h2>
        <p className="text-[10px] text-text-secondary">
          Change your admin password. Takes effect immediately.
        </p>
        <label className={labelCls}>
          current password
          <input type="password" name="currentPassword" className={inputCls} />
        </label>
        <label className={labelCls}>
          new password
          <input type="password" name="newPassword" minLength={8} className={inputCls} />
        </label>
        <button
          type="button"
          onClick={async () => {
            const currentPassword = (
              document.querySelector<HTMLInputElement>('input[name="currentPassword"]')?.value ?? ""
            ).trim();
            const newPassword = (
              document.querySelector<HTMLInputElement>('input[name="newPassword"]')?.value ?? ""
            ).trim();
            if (!currentPassword || !newPassword) {
              toast("Fill in both password fields", "error");
              return;
            }
            const res = await fetch("/api/admin/settings/password", {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ currentPassword, newPassword }),
            });
            const data = await res.json();
            if (res.ok) {
              toast("Password changed", "success");
              const cur = document.querySelector<HTMLInputElement>('input[name="currentPassword"]');
              const nw = document.querySelector<HTMLInputElement>('input[name="newPassword"]');
              if (cur) cur.value = "";
              if (nw) nw.value = "";
            } else {
              toast(data.error || "Failed to change password", "error");
            }
          }}
          className="rounded-full bg-surface-muted px-3 py-1.5 text-xs text-text-secondary hover:text-text-primary"
        >
          change password
        </button>
      </section>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={saving}
          className="rounded-full bg-cocoa px-4 py-2 text-sm font-medium text-cream disabled:opacity-40"
        >
          {saving ? "saving…" : "save settings"}
        </button>
      </div>
    </form>
  );
}
