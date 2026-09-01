// The live zine page's sections — each maps to a photo category.
// Stories are managed by tagging photos to one of these sections.

export type ZineSection = {
  category: string;
  label: string;
  slots: number;
  note: string;
};

export const ZINE_SECTIONS: ZineSection[] = [
  { category: "hero", label: "hero", slots: 2, note: "the name portrait + side photo" },
  { category: "eyes", label: "those eyes", slots: 5, note: "eye collage" },
  { category: "cameraroll", label: "camera roll", slots: 4, note: "my baby spread" },
  { category: "poster", label: "pretty boy archive", slots: 4, note: "poster mosaic" },
  { category: "candid", label: "candid & unposed", slots: 4, note: "caught off guard" },
  { category: "final", label: "the letter", slots: 1, note: "final portrait" },
];
