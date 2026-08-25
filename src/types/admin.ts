import type { StoryScene } from "@/config/scenes";

// ── Memory ──────────────────────────────────────────────────────────

export type AdminMemory = {
  _id: string;
  title: string;
  caption: string;
  mediaType: "image" | "video";
  thumbnailUrl: string;
  cloudinaryPublicId: string;
  cloudinaryUrl: string;
  category: string;
  date?: string | null;
  location: string | null;
  sceneId: string | null;
  slotId: string | null;
  placement: "story" | "archive";
  order: number;
  featured: boolean;
  visibility: "public" | "hidden";
  objectPosition?: string | null;
  displayMode?: string | null;
  createdAt?: string;
  updatedAt?: string;
};

// ── Scene ───────────────────────────────────────────────────────────

export type AdminScene = {
  _id: string;
  slug: string;
  title: string;
  order: number;
  enabled: boolean;
  background: string;
  createdAt?: string;
};

// ── Media Asset ─────────────────────────────────────────────────────

export type AdminMediaAsset = {
  _id: string;
  mediaType: "image" | "video";
  publicId: string;
  url: string;
  thumbnailUrl: string;
  width?: number;
  height?: number;
  format: string;
  bytes?: number;
  duration?: number;
  createdAt?: string;
};

// ── API Responses ───────────────────────────────────────────────────

export type ApiResponse<T> =
  | { success: true; data: T }
  | { success: false; error: { code: string; message: string } };

export type PaginatedResponse<T> = {
  items: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

// ── Filters & Sorting ───────────────────────────────────────────────

export type MemoryVisibility = "public" | "hidden";
export type MemoryPlacement = "story" | "archive";
export type MediaType = "image" | "video";

export type MemorySortOption =
  | "newest"
  | "oldest"
  | "title-asc"
  | "title-desc"
  | "story-order"
  | "date-taken"
  | "recently-updated";

export type MemoryFilters = {
  search?: string;
  visibility?: MemoryVisibility | "all";
  placement?: MemoryPlacement | "all";
  mediaType?: MediaType | "all";
  category?: string;
  sceneId?: string;
  featured?: boolean;
  sort?: MemorySortOption;
  page?: number;
  limit?: number;
};

// ── Story ───────────────────────────────────────────────────────────

export type StoryHealthStatus = {
  scene: StoryScene;
  configured: boolean;
  assignedCount: number;
  emptyCount: number;
  conflictCount: number;
  dbSceneEnabled: boolean;
};

export type SlotAssignment = {
  sceneSlug: string;
  slotId: string;
  memory?: AdminMemory;
  status: "assigned" | "empty" | "conflict";
};
