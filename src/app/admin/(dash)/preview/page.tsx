"use client";

import { useState } from "react";

// §143–§145: Story preview with device frame selector.
// Shows the public site in an iframe with phone/tablet/desktop frames.

const DEVICES = [
  { label: "Phone", width: 375, height: 667, radius: "24px" },
  { label: "Tablet", width: 768, height: 1024, radius: "16px" },
  { label: "Desktop", width: 1280, height: 800, radius: "8px" },
] as const;

type DeviceLabel = (typeof DEVICES)[number]["label"];

export default function PreviewPage() {
  const [device, setDevice] = useState<DeviceLabel>("Desktop");
  const selected = DEVICES.find((d) => d.label === device)!;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-xl font-semibold text-text-primary">
          Story Preview
        </h1>
        <div className="flex gap-2">
          {DEVICES.map((d) => (
            <button
              key={d.label}
              onClick={() => setDevice(d.label)}
              className={`min-h-[44px] rounded-lg px-4 py-2 font-display text-xs uppercase tracking-wide transition-all ${
                device === d.label
                  ? "bg-cocoa text-cloud"
                  : "bg-surface-muted text-text-secondary hover:bg-surface-muted/80"
              }`}
            >
              {d.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex justify-center">
        <div
          className="overflow-hidden border-2 border-border bg-white shadow-lg"
          style={{
            width: Math.min(selected.width, 1280),
            height: Math.min(selected.height, 800),
            borderRadius: selected.radius,
          }}
        >
          <iframe
            src="/"
            title="Story preview"
            className="h-full w-full border-0"
            style={{
              width: selected.width,
              height: selected.height,
              transform: `scale(${Math.min(1, 1280 / selected.width)})`,
              transformOrigin: "top left",
            }}
          />
        </div>
      </div>

      <p className="text-center text-sm text-text-secondary">
        {selected.width} × {selected.height} — {device}
      </p>
    </div>
  );
}
