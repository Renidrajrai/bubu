import ZinePage from "@/components/zine/ZinePage";
import { getZineContent } from "@/lib/zine-data";

export const dynamic = "force-dynamic";

export default async function Home() {
  const { items, text } = await getZineContent();
  return <ZinePage initialMedia={items} initialText={text} />;
}
