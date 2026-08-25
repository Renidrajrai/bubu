"use client";

import type { PublicStory } from "@/lib/story-data";
import StoryCanvas from "./StoryCanvas";
import BloomScene from "../scenes/BloomScene";
import DandelionScene from "../scenes/DandelionScene";
import EndingScene from "../scenes/EndingScene";
import GrowScene from "../scenes/GrowScene";
import IntroScene from "../scenes/IntroScene";

export default function StoryPage({ story }: { story: PublicStory }) {
  const introScene = story.scenes.find((s) => s.slug === "intro")!;
  const bloomScene = story.scenes.find((s) => s.slug === "bloom")!;
  const dandelionScene = story.scenes.find((s) => s.slug === "dandelion")!;
  const growScene = story.scenes.find((s) => s.slug === "grow")!;

  return (
    <StoryCanvas>
      <IntroScene slots={introScene.slots} />
      <BloomScene slots={bloomScene.slots} />
      <DandelionScene slots={dandelionScene.slots} />
      <GrowScene slots={growScene.slots} />
      <EndingScene archive={story.archive} />
    </StoryCanvas>
  );
}
