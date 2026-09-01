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

const STORY_TEXT_FIELDS: { key: string; label: string; hint: string }[] = [
  { key: "heroName", label: "name", hint: "the big name — e.g. Aayush Rajbhandari" },
  { key: "heroTag", label: "name tag", hint: "small line under the name — e.g. ✦ aka pattu" },
  { key: "heroKicker", label: "hero line", hint: "line under the name" },
  { key: "heroStrap", label: "hero strap", hint: "bottom line, before the accent" },
  { key: "heroStrapAccent", label: "hero strap accent", hint: "italic part of the strap" },
  { key: "eyesPoetic", label: "eyes — poetic line", hint: "line under the eye collage" },
  { key: "eyesLoveNote", label: "eyes — love note", hint: "the handwritten note" },
  { key: "cameraSub", label: "camera roll sub", hint: "line under MY BABY" },
  { key: "candidSub", label: "candid sub", hint: "line under CANDID & UNPOSED" },
  { key: "videoSub", label: "videos sub", hint: "line under GLIMPSE OF MY BABIES" },
  { key: "finalButton", label: "final button", hint: "button on the love-letter page" },
  { key: "finalLetter", label: "the letter", hint: "paragraphs of the love letter (blank line = new paragraph)" },
];

export default function SettingsForm({
  settings,
  storyText,
}: {
  settings: Settings;
  storyText: Record<string, string>;
}) {
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [savingText, setSavingText] = useState(false);

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

  async function saveStoryText() {
    setSavingText(true);
    const payload: Record<string, string> = {};
    for (const f of STORY_TEXT_FIELDS) {
      const el = document.querySelector<HTMLInputElement | HTMLTextAreaElement>(
        `[name="${f.key}"]`
      );
      payload[f.key] = el?.value ?? "";
    }
    const res = await fetch("/api/admin/storytext", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    setSavingText(false);
    if (res.ok) toast("Story text saved", "success");
    else toast("Failed to save story text", "error");
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
          Changing your password will generate a new hash for your .env.local file.
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
            const form = document.querySelector("form")!;
            const fd = new FormData(form);
            const currentPassword = fd.get("currentPassword") as string;
            const newPassword = fd.get("newPassword") as string;
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
              toast("Password verified. Update your .env.local with the new hash.", "success");
            } else {
              toast(data.error || "Failed to change password", "error");
            }
          }}
          className="rounded-full bg-surface-muted px-3 py-1.5 text-xs text-text-secondary hover:text-text-primary"
        >
          change password
        </button>
      </section>

      {/* About him — editable story text */}
      <section
        id="story-text-form"
        className="rounded-xl border border-border bg-surface p-4 space-y-3"
      >
        <div className="flex items-center justify-between">
          <h2 className="font-display text-sm font-medium">about him — all editable text</h2>
          <button
            type="button"
            onClick={saveStoryText}
            disabled={savingText}
            className="rounded-full bg-cocoa px-4 py-1.5 text-xs font-medium text-cream disabled:opacity-40"
          >
            {savingText ? "saving…" : "save story text"}
          </button>
        </div>
        <p className="text-[10px] text-text-secondary">
          Every word the visitor sees on the public page. Edit here, it updates live — no code changes.
        </p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {STORY_TEXT_FIELDS.map((f) => (
            <label key={f.key} className={labelCls} title={f.hint}>
              {f.label}
              {f.key === "finalLetter" ? (
                <textarea
                  name={f.key}
                  defaultValue={storyText[f.key] ?? ""}
                  className={`${inputCls} min-h-28 resize-y`}
                  placeholder={f.hint}
                />
              ) : (
                <input
                  name={f.key}
                  defaultValue={storyText[f.key] ?? ""}
                  className={inputCls}
                  placeholder={f.hint}
                />
              )}
            </label>
          ))}
        </div>
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
