import MediaSlot from "../media/MediaSlot";
import { ph } from "./placeholders";

// scene-05 · "a little cluster" — two polaroids overlapping, taped to the page.
function Tape({ className }: { className: string }) {
  return <div aria-hidden className={`absolute h-5 w-16 rounded-sm bg-beige/80 shadow-sm ${className}`} />;
}

export default function CollageScene() {
  return (
    <section className="relative flex min-h-[90vh] w-full max-w-5xl items-center justify-center py-24">
      <div className="relative">
        <figure className="relative w-52 rotate-[-3deg] rounded-sm bg-white p-3 pb-10 shadow-[var(--shadow-soft)] sm:w-64">
          <Tape className="-top-2.5 left-8 -rotate-[18deg]" />
          <MediaSlot
            aspectRatio="3/4"
            src={ph("pattu-05", 700, 900)}
            alt="cluster left"
            className="w-full rounded-sm"
          />
        </figure>

        <figure className="relative -mt-10 ml-auto w-60 rotate-[2.5deg] rounded-sm bg-white p-3 pb-10 shadow-[var(--shadow-soft)] sm:-ml-12 sm:mt-20 sm:w-72">
          <Tape className="-top-2.5 right-10 rotate-[14deg]" />
          <MediaSlot
            aspectRatio="5/4"
            src={ph("pattu-06", 1000, 800)}
            alt="two of us, one frame"
            className="w-full rounded-sm"
          />
          <figcaption className="absolute inset-x-0 bottom-2 text-center font-hand text-xl text-text-secondary">
            two of us, one frame — aug 1
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
