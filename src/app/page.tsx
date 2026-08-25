import { getPublicStory } from "@/lib/story-data";
import StoryPage from "@/components/story/StoryPage";

export default async function Home() {
  const story = await getPublicStory();
  return <StoryPage story={story} />;
}
