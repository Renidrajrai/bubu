import Connector from "@/components/animation/Connector";
import StoryCanvas from "@/components/story/StoryCanvas";
import CollageScene from "@/components/scenes/CollageScene";
import ConnectedMemoryScene from "@/components/scenes/ConnectedMemoryScene";
import IntroScene from "@/components/scenes/IntroScene";
import MemoryScene from "@/components/scenes/MemoryScene";
import QuietMomentScene from "@/components/scenes/QuietMomentScene";
import VideoScene from "@/components/scenes/VideoScene";

export default function Home() {
  return (
    <StoryCanvas>
      <IntroScene />
      <Connector />
      <MemoryScene />
      <Connector />
      <ConnectedMemoryScene />
      <Connector />
      <VideoScene />
      <Connector />
      <CollageScene />
      <Connector />
      <QuietMomentScene />
    </StoryCanvas>
  );
}
