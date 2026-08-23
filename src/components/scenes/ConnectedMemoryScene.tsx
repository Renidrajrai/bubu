import FloatingDoodle from "../animation/FloatingDoodle";
import MediaSlot from "../media/MediaSlot";
import { ph } from "./placeholders";

// scene-03 · "connection" — one memory, framed by whitespace and a scribble.
export default function ConnectedMemoryScene() {
  return (
    <section className="relative flex min-h-[90vh] w-full max-w-5xl items-center justify-center py-24">
      <figure className="relative w-64 sm:w-80">
        <FloatingDoodle
          kind="scribble"
          className="absolute -left-24 -top-14 h-20 w-20 rotate-[-12deg] text-dusty-blue/70"
        />
        <MediaSlot
          aspectRatio="3/4"
          src={ph("pattu-07", 900, 1200)}
          alt="us, somewhere in the middle of everything"
          className="w-full rounded-lg shadow-[var(--shadow-soft)]"
        />
        <figcaption className="mt-5 text-center font-hand text-2xl text-text-secondary">
          some moments just belong together.
        </figcaption>
      </figure>
    </section>
  );
}
