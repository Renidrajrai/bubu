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
  slot?: number | null;
  date?: string | null;
  placement: "story" | "archive";
  order: number;
  featured: boolean;
  visibility: "public" | "hidden";
  objectPosition?: string | null;
  displayMode?: string | null;
  createdAt?: string;
  updatedAt?: string;
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

export type PaginatedResponse<T> = {
  items: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

// ── Sorting ─────────────────────────────────────────────────────────

export type MemorySortOption =
  | "newest"
  | "oldest"
  | "title-asc"
  | "title-desc"
  | "story-order"
  | "date-taken"
  | "recently-updated";
