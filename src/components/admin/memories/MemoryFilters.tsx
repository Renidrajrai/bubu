"use client";

import { CATEGORIES, STORY_SCENES } from "@/config/scenes";

type FilterState = {
  search: string;
  visibility: string;
  placement: string;
  mediaType: string;
  category: string;
  sceneId: string;
  featured: string;
  sort: string;
};

type Props = {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
};

export default function MemoryFilters({ filters, onChange }: Props) {
  function update(patch: Partial<FilterState>) {
    onChange({ ...filters, ...patch });
  }

  return (
    <div className="flex flex-col gap-2">
      {/* Search */}
      <input
        type="text"
        placeholder="search memories…"
        value={filters.search}
        onChange={(e) => update({ search: e.target.value })}
        className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text-primary outline-none placeholder:text-text-secondary/50 focus:border-text-secondary"
      />

      {/* Filter row */}
      <div className="flex flex-wrap items-center gap-2">
        <select
          value={filters.visibility}
          onChange={(e) => update({ visibility: e.target.value })}
          className="rounded-lg border border-border bg-surface px-2 py-1.5 text-xs text-text-primary outline-none"
        >
          <option value="all">all visibility</option>
          <option value="public">public</option>
          <option value="hidden">hidden</option>
        </select>

        <select
          value={filters.placement}
          onChange={(e) => update({ placement: e.target.value })}
          className="rounded-lg border border-border bg-surface px-2 py-1.5 text-xs text-text-primary outline-none"
        >
          <option value="all">all placement</option>
          <option value="story">in story</option>
          <option value="archive">archive only</option>
        </select>

        <select
          value={filters.mediaType}
          onChange={(e) => update({ mediaType: e.target.value })}
          className="rounded-lg border border-border bg-surface px-2 py-1.5 text-xs text-text-primary outline-none"
        >
          <option value="all">all types</option>
          <option value="image">images</option>
          <option value="video">videos</option>
        </select>

        <select
          value={filters.category}
          onChange={(e) => update({ category: e.target.value })}
          className="rounded-lg border border-border bg-surface px-2 py-1.5 text-xs text-text-primary outline-none"
        >
          <option value="">all categories</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        <select
          value={filters.sceneId}
          onChange={(e) => update({ sceneId: e.target.value })}
          className="rounded-lg border border-border bg-surface px-2 py-1.5 text-xs text-text-primary outline-none"
        >
          <option value="">all scenes</option>
          {STORY_SCENES.map((s) => (
            <option key={s.slug} value={s.slug}>{s.title}</option>
          ))}
        </select>

        <select
          value={filters.featured}
          onChange={(e) => update({ featured: e.target.value })}
          className="rounded-lg border border-border bg-surface px-2 py-1.5 text-xs text-text-primary outline-none"
        >
          <option value="">all featured</option>
          <option value="true">featured</option>
          <option value="false">not featured</option>
        </select>

        <div className="ml-auto">
          <select
            value={filters.sort}
            onChange={(e) => update({ sort: e.target.value })}
            className="rounded-lg border border-border bg-surface px-2 py-1.5 text-xs text-text-primary outline-none"
          >
            <option value="newest">newest</option>
            <option value="oldest">oldest</option>
            <option value="title-asc">title A–Z</option>
            <option value="title-desc">title Z–A</option>
            <option value="story-order">story order</option>
            <option value="date-taken">date taken</option>
            <option value="recently-updated">recently updated</option>
          </select>
        </div>
      </div>
    </div>
  );
}
