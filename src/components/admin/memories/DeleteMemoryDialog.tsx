"use client";

import ConfirmDialog from "../ConfirmDialog";
import type { AdminMemory } from "@/types/admin";

type Props = {
  memory: AdminMemory | { title: string; _id: string };
  onConfirm: () => void;
  onCancel: () => void;
  bulk?: boolean;
};

export default function DeleteMemoryDialog({ memory, onConfirm, onCancel, bulk }: Props) {
  return (
    <ConfirmDialog
      title={bulk ? `Delete ${memory.title}?` : `Delete "${memory.title || "(untitled)"}"?`}
      description={
        bulk
          ? "This will permanently delete these memories and their Cloudinary media. This cannot be undone."
          : "This will permanently delete the memory record, its Cloudinary media, and its story assignment. This cannot be undone."
      }
      confirmLabel={bulk ? `Delete ${memory.title}` : "Delete memory"}
      cancelLabel="keep it"
      danger
      onConfirm={onConfirm}
      onCancel={onCancel}
    />
  );
}
