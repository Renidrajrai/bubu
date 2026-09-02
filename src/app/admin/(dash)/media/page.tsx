import { connectDB } from "@/lib/mongodb";
import { MediaAsset } from "@/models/MediaAsset";
import { Memory } from "@/models/Memory";
import MediaLibrary from "@/components/admin/media/MediaLibrary";

export const dynamic = "force-dynamic";

export default async function AdminMediaPage() {
  await connectDB();
  const [assets, memories] = await Promise.all([
    MediaAsset.find().sort({ createdAt: -1 }).limit(200).lean(),
    Memory.find({}, { cloudinaryPublicId: 1 }).lean(),
  ]);

  const usedPublicIds = new Set(memories.map((m) => m.cloudinaryPublicId));
  const assetsWithOrphan = assets.map((a) => ({
    ...a,
    _id: String(a._id),
    isOrphan: !usedPublicIds.has(a.publicId),
  }));

  return (
    <MediaLibrary
      initialAssets={assetsWithOrphan}
    />
  );
}
