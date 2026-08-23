import FloatingDoodle from "../animation/FloatingDoodle";
import MediaSlot from "../media/MediaSlot";
import { ph } from "./placeholders";

// scene-06 · "quiet moment" — the exhale. widest frame, fewest words.
export default function QuietMomentScene() {
  return (
    <section className="flex min-h-[80vh] w-full max-w-5xl flex-col items-center justify-center py-32">
      <MediaSlot
        aspectRatio="16/9"
        src={ph("pattu-08", 1280, 720)}
        alt="a quiet moment"
        className="w-full max-w-4xl rounded-xl shadow-[var(--shadow-soft)]"
      />
      <p className="mt-10 font-hand text-3xl text-deep-sage">
        to be continued…
      </p>
      <div className="mt-4 flex items-center gap-2 text-text-secondary/50">
        <FloatingDoodle kind="sparkle" className="h-4 w-4" />
        <span className="font-mono text-[10px] uppercase tracking-[0.25em]">
          the archive keeps growing
        </span>
        <FloatingDoodle kind="sparkle" className="h-4 w-4" />
      </div>
    </section>
  );
}
