import MediaSlot from "../media/MediaSlot";
import { ph } from "./placeholders";

// scene-02 · "first memory" — two slots, staggered and off-balance on purpose.
export default function MemoryScene() {
  return (
    <section className="relative flex min-h-[90vh] w-full max-w-5xl items-center justify-center py-24">
      <div className="flex w-full flex-col items-center gap-10 sm:block">
        <figure className="sm:absolute sm:left-[4%] sm:top-16 sm:w-[46%] sm:rotate-[-1.5deg]">
          <MediaSlot
            aspectRatio="4/3"
            src={ph("pattu-02", 1200, 900)}
            alt="a walk at golden hour"
            className="w-full rounded-lg shadow-[var(--shadow-soft)]"
          />
          <figcaption className="mt-4 max-w-xs font-hand text-xl leading-snug text-text-secondary sm:ml-6">
            we walked until the sun gave up — june 14
          </figcaption>
        </figure>

        <figure className="sm:absolute sm:right-[8%] sm:top-56 sm:w-[30%] sm:rotate-[2deg]">
          <MediaSlot
            aspectRatio="1/1"
            src={ph("pattu-03", 800, 800)}
            alt="coffee"
            className="w-full rounded-full shadow-[var(--shadow-soft)]"
          />
          <figcaption className="mt-3 text-center font-hand text-xl text-text-secondary">
            your terrible coffee order
          </figcaption>
        </figure>

        {/* spacer keeps the section tall enough for the absolute pair on desktop */}
        <div className="hidden h-[70vh] sm:block" />
      </div>
    </section>
  );
}
