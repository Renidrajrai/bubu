import { DEMO_VIDEO, ph } from "./placeholders";

// scene-04 · "moving pictures" — one cinematic video, nothing else.
// Phase 7 adds viewport play/pause; static prototype just loops muted.
export default function VideoScene() {
  return (
    <section className="flex min-h-[90vh] w-full max-w-5xl flex-col items-center justify-center py-24">
      <p className="mb-8 self-start font-mono text-[11px] uppercase tracking-[0.3em] text-text-secondary">
        scene-04 · moving pictures
      </p>
      <video
        className="aspect-video w-full max-w-3xl rounded-xl bg-black object-cover shadow-[var(--shadow-soft)]"
        src={DEMO_VIDEO}
        poster={ph("pattu-video", 1280, 720)}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
      />
      <p className="mt-6 max-w-md text-center font-hand text-2xl text-text-secondary">
        you said delete this. i did not.
      </p>
    </section>
  );
}
