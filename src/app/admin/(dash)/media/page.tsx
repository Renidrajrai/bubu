import Image from "next/image";
import { connectDB } from "@/lib/mongodb";
import { MediaAsset } from "@/models/MediaAsset";
import { Memory } from "@/models/Memory";

export const dynamic = "force-dynamic";

export default async function AdminMediaPage() {
  await connectDB();
  const [assets, memories] = await Promise.all([
    MediaAsset.find().sort({ createdAt: -1 }).limit(200).lean(),
    Memory.find({}, { cloudinaryPublicId: 1 }).lean(),
  ]);

  const usedPublicIds = new Set(memories.map((m) => m.cloudinaryPublicId));

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-4">
      <h1 className="text-lg font-medium">media</h1>
      <p className="-mt-3 text-xs text-text-secondary">
        everything uploaded to Cloudinary. “orphan” = uploaded but not used by any memory yet.
      </p>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {assets.map((a) => {
          const orphan = !usedPublicIds.has(a.publicId);
          return (
            <figure key={String(a._id)} className="overflow-hidden rounded-lg border border-border bg-surface">
              <div className="relative aspect-[4/3] bg-surface-muted">
                {a.thumbnailUrl ? (
                  <Image src={a.thumbnailUrl} alt={a.publicId} fill sizes="200px" className="object-cover" unoptimized />
                ) : null}
                <span className="absolute left-1.5 top-1.5 rounded-full bg-black/50 px-2 py-0.5 text-[10px] text-white">
                  {a.mediaType}
                </span>
                {orphan && (
                  <span className="absolute right-1.5 top-1.5 rounded-full bg-warm-red px-2 py-0.5 text-[10px] text-white">
                    orphan
                  </span>
                )}
              </div>
              <figcaption className="truncate px-2 py-1.5 font-mono text-[10px] text-text-secondary">
                {a.publicId}
              </figcaption>
            </figure>
          );
        })}
        {assets.length === 0 && (
          <p className="col-span-full py-8 text-center text-sm text-text-secondary">
            nothing uploaded yet.
          </p>
        )}
      </div>
    </div>
  );
}
