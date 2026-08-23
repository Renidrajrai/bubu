import Floaters from "@/components/animation/Floaters";
import Sticker from "@/components/animation/Sticker";
import StoryCanvas from "@/components/story/StoryCanvas";
import BloomScene from "@/components/scenes/BloomScene";
import DandelionScene from "@/components/scenes/DandelionScene";
import EndingScene from "@/components/scenes/EndingScene";
import GrowScene from "@/components/scenes/GrowScene";
import IntroScene from "@/components/scenes/IntroScene";

// Scrollytelling: hero (free) → pinned scenes (bloom → dandelion → regrow)
// → archive finale. Each SceneShell is temporarily pinned while its
// progress 0→1 scrubs the animation, then exits as the next enters.
export default function Home() {
  return (
    <StoryCanvas>
      <Floaters />
      <IntroScene />
      <Sticker emoji="✨" />
      <BloomScene />
      <DandelionScene />
      <GrowScene />
      <Sticker emoji="🌱" />
      <EndingScene />
    </StoryCanvas>
  );
}
