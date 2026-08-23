import FloatingDoodle from "../animation/FloatingDoodle";
import MediaSlot from "../media/MediaSlot";
import { ph } from "./placeholders";

// scene-01 · "the beginning" — one portrait memory, lots of air.
export default function IntroScene() {
  return (
    <section className="relative flex min-h-dvh w-full max-w-5xl items-center justify-center py-24">
      <div className="flex flex-col items-center gap-10 sm:flex-row sm:gap-16">
        <figure className="relative shrink-0 rotate-[-2deg] rounded-sm bg-white p-3 pb-8 shadow-[var(--shadow-soft)]">
          <MediaSlot
            aspectRatio="3/4"
            src={ph("pattu-01", 900, 1200)}
            alt="the first photo"
            className="w-56 rounded-sm sm:w-72"
          />
          <figcaption className="absolute inset-x-0 bottom-2 text-center font-hand text-xl text-text-secondary">
            where it started
          </figcaption>
        </figure>

        <div className="relative max-w-sm text-center sm:text-left">
          <FloatingDoodle
            kind="sparkle"
            className="absolute -top-9 right-4 h-7 w-7 text-warm-red/60 sm:-left-12 sm:right-auto"
          />
          <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-text-secondary">
            est. 2025 · a private archive
          </p>
          <h1 className="mt-5 text-4xl font-medium leading-tight tracking-tight text-text-primary sm:text-5xl">
            the little things we kept
          </h1>
          <p className="mt-6 font-hand text-2xl leading-snug text-deep-sage">
            for you — scroll slowly,
            <br /> like flipping through an album.
          </p>
        </div>
      </div>

      <FloatingDoodle
        kind="arrow-down"
        className="absolute bottom-8 left-1/2 h-8 w-8 -translate-x-1/2 text-text-secondary/40"
      />
    </section>
  );
}
