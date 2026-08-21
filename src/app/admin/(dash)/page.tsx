import { Suspense } from "react";
import MemoriesDashboard from "@/components/admin/MemoriesDashboard";
import { connectDB } from "@/lib/mongodb";
import { Memory } from "@/models/Memory";

export const dynamic = "force-dynamic";

export default async function AdminMemoriesPage() {
  await connectDB();
  const memories = await Memory.find().sort({ order: 1, createdAt: -1 }).lean();

  return (
    <Suspense>
      <MemoriesDashboard
        memories={JSON.parse(JSON.stringify(memories))}
      />
    </Suspense>
  );
}
