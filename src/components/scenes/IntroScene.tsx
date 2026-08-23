import FloatingDoodle from "../animation/FloatingDoodle";
import Polaroid from "../media/Polaroid";
import { ph } from "./placeholders";

function Bubu() {
  return (
    <svg width="70" height="78" viewBox="0 0 72 80" aria-hidden>
      <ellipse cx="36" cy="46" rx="26" ry="24" fill="#54372B" />
      <circle cx="14" cy="16" r="11" fill="#54372B" />
      <circle cx="58" cy="16" r="11" fill="#54372B" />
      <circle cx="14" cy="16" r="5" fill="#8A6455" />
      <circle cx="58" cy="16" r="5" fill="#8A6455" />
      <ellipse cx="36" cy="50" rx="15" ry="13" fill="#F3D9C4" />
      <circle cx="27" cy="42" r="2.6" fill="#2C1B14" />
      <circle cx="45" cy="42" r="2.6" fill="#2C1B14" />
      <ellipse cx="22" cy="52" rx="4" ry="2.6" fill="#F6C6D2" opacity=".85" />
      <ellipse cx="50" cy="52" rx="4" ry="2.6" fill="#F6C6D2" opacity=".85" />
      <path d="M31 51 Q36 56 41 51" stroke="#2C1B14" strokeWidth="1.6" fill="none" strokeLinecap="round" />
    </svg>
  );
}

function Dudu() {
  return (
    <svg width="70" height="78" viewBox="0 0 72 80" aria-hidden style={{ marginLeft: -8 }}>
      <ellipse cx="36" cy="46" rx="26" ry="24" fill="#FFFDF9" stroke="#F0E2D6" strokeWidth="1" />
      <circle cx="14" cy="16" r="11" fill="#2C1B14" />
      <circle cx="58" cy="16" r="11" fill="#2C1B14" />
      <ellipse cx="36" cy="50" rx="15" ry="13" fill="#FFFDF9" />
      <ellipse cx="24" cy="44" rx="7" ry="8" fill="#2C1B14" />
      <ellipse cx="48" cy="44" rx="7" ry="8" fill="#2C1B14" />
      <circle cx="25" cy="43" r="2.4" fill="#FFFDF9" />
      <circle cx="49" cy="43" r="2.4" fill="#FFFDF9" />
      <ellipse cx="22" cy="53" rx="4" ry="2.6" fill="#F6C6D2" opacity=".9" />
      <ellipse cx="50" cy="53" rx="4" ry="2.6" fill="#F6C6D2" opacity=".9" />
      <path d="M31 52 Q36 57 41 52" stroke="#2C1B14" strokeWidth="1.6" fill="none" strokeLinecap="round" />
    </svg>
  );
}

// Hero — bubu & dudu introduce the scrapbook; the featured photo sits front
// of a fanned stack that gently floats.
export default function IntroScene() {
  return (
    <section className="relative z-[2] flex min-h-[92svh] w-full flex-col items-center justify-center px-6 pb-20 pt-[9vh] text-center">
      <div className="hero-in flex items-end">
        <Bubu />
        <Dudu />
      </div>

      <p className="hero-in mt-3 font-display text-[13px] font-semibold uppercase tracking-[0.14em] text-rose [animation-delay:120ms]">
        a little corner just for him
      </p>
      <h1 className="hero-in mt-2 font-display text-5xl font-semibold leading-none text-cocoa sm:text-7xl [animation-delay:200ms]">
        every{" "}
        <span className="wiggle text-rose">little</span>{" "}
        moment
      </h1>
      <p className="hero-in mt-4 max-w-md font-hand text-2xl leading-snug text-cocoa-soft [animation-delay:280ms]">
        pictures of you, us, and everything in between —
        <br />
        scroll slowly, like flipping through our album.
      </p>

      {/* fanned photo stack */}
      <div className="relative mt-12 h-[300px] w-full max-w-md sm:h-[340px]">
        <div className="hero-in absolute left-0 top-8 w-32 rotate-[-10deg] sm:left-4 sm:w-40 [animation-delay:420ms]">
          <Polaroid src={ph("pattu-07", 600, 800)} alt="" aspectRatio="3/4" tape />
        </div>
        <div className="hero-in absolute right-0 top-6 w-32 rotate-[9deg] sm:right-4 sm:w-40 [animation-delay:520ms]">
          <Polaroid src={ph("pattu-05", 700, 900)} alt="" aspectRatio="3/4" tape />
        </div>
        <div className="hero-in absolute left-1/2 top-0 z-10 w-44 -translate-x-1/2 rotate-[2deg] sm:w-56 [animation-delay:340ms]">
          <Polaroid
            src={ph("pattu-01", 900, 1200)}
            alt="the first photo"
            aspectRatio="3/4"
            caption="where it started"
          />
        </div>
      </div>

      <div className="mt-10 flex flex-col items-center gap-1 font-display text-xs uppercase tracking-[0.12em] text-cocoa-soft">
        <span className="bob text-xl">🐾</span>
        scroll for more
      </div>

      <FloatingDoodle
        kind="sparkle"
        className="absolute left-[12%] top-[18%] h-7 w-7 text-gold/70"
      />
      <FloatingDoodle
        kind="heart"
        className="absolute right-[10%] top-[26%] h-6 w-6 text-rose/60"
      />
    </section>
  );
}
