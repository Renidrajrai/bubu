"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import styles from "./ZinePage.module.css";


// Built-in fallbacks — the zine keeps this exact look on an empty database.
const FB = {
  heroMain:
    "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=1200&q=85",
  heroSide:
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=85",
  eyes: [
    "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=1400&q=85",
    "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=500&q=85",
    "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&w=500&q=85",
    "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=500&q=85",
    "https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?auto=format&fit=crop&w=500&q=85",
  ],
  collage: [
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1100&q=85",
    "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=85",
    "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=800&q=85",
    "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1200&q=85",
  ],
  poster: [
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=900&q=85",
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=900&q=85",
    "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?auto=format&fit=crop&w=900&q=85",
    "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&w=900&q=85",
  ],
  carousel: [
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=500&q=80",
    "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=500&q=80",
    "https://images.unsplash.com/photo-1521119989659-a83eee488004?auto=format&fit=crop&w=500&q=80",
    "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=500&q=80",
    "https://images.unsplash.com/photo-1520813792240-56fc4a3765a7?auto=format&fit=crop&w=500&q=80",
    "https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?auto=format&fit=crop&w=500&q=80",
    "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=500&q=80",
  ],
  candid: [
    "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=1000&q=85",
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=1000&q=85",
    "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=1000&q=85",
    "https://images.unsplash.com/photo-1521119989659-a83eee488004?auto=format&fit=crop&w=1000&q=85",
  ],
  final:
    "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=1200&q=90",
  modal: [
    "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=700&q=80",
    "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=700&q=80",
    "https://images.unsplash.com/photo-1521119989659-a83eee488004?auto=format&fit=crop&w=700&q=80",
    "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=700&q=80",
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=700&q=80",
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=700&q=80",
    "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=700&q=80",
    "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=700&q=80",
    "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?auto=format&fit=crop&w=700&q=80",
    "https://images.unsplash.com/photo-1520813792240-56fc4a3765a7?auto=format&fit=crop&w=700&q=80",
    "https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?auto=format&fit=crop&w=700&q=80",
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=700&q=80",
  ],
  videos: [
    "https://images.unsplash.com/photo-1520813792240-56fc4a3765a7?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=900&q=80",
  ],
} as const;

type ZineMedia = {
  id: string;
  title: string;
  caption: string;
  mediaType: "image" | "video";
  url: string;
  thumbnailUrl: string;
  category: string;
  objectPosition: string;
  date: string | null;
  slot: number | null;
};

const VIDEO_FALLBACKS = FB.videos.map((url) => ({ url, thumbnailUrl: url }));

// Built-in copy — kept in sync with Settings.storyText defaults so an empty
// database renders exactly this. The live values come from /api/zine.
const TEXT_DEFAULTS: Record<string, string> = {
  heroName: "Aayush\nRajbhandari",
  heroTag: "✦ aka pattu",
  heroKicker: "i love you baby muah!!!",
  eyesPoetic: "the eyes that make the greatest poets write poems about.",
  eyesLoveNote:
    "my baby, kuchu puchu — i love you so so much. i will forever be enchanted by your eyes.",
  cameraSub: "Unposed, mostly unaware, always the best shots in the roll.",
  candidSub: "The best ones are always the ones he doesn't know were taken.",
  videoSub:
    "The ones where the sound matters too. Hover to peek, tap to press play.",
  finalButton:
    "pattu — if you're reading this, it means i finally sent it to you...",
  finalLetter:
    "If you're reading this, it means I finally sent it to you.\n\nI've been collecting these pictures for a while now — not because I needed proof of anything, just because I like keeping the good parts.\n\nYou have this way of making ordinary days feel like something worth remembering. The eyes, obviously. But also just — you, mid-sentence, laughing at something only you find funny, completely unaware anyone's watching.\n\nThank you for being so easy to love, and so hard to stop looking at.",
};

export default function ZinePage() {
  const rootRef = useRef<HTMLDivElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [photoOpen, setPhotoOpen] = useState(false);
  const [vidOpen, setVidOpen] = useState(false);
  const [letterUnlocked, setLetterUnlocked] = useState(false);
  const [pwInput, setPwInput] = useState("");
  const [pwError, setPwError] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const LETTER_CODE = "180561";
  const [playing, setPlaying] = useState<ZineMedia | null>(null);
  const [hovered, setHovered] = useState(-1);
  const [media, setMedia] = useState<ZineMedia[]>([]);
  const [text, setText] = useState<Record<string, string>>(TEXT_DEFAULTS);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/zine")
      .then((r) => r.json())
      .then((d) => {
        if (cancelled) return;
        setMedia(Array.isArray(d?.items) ? d.items : []);
        if (d?.text && typeof d.text === "object") setText({ ...TEXT_DEFAULTS, ...d.text });
      })
      .catch(() => {
        if (!cancelled) setMedia([]);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Images only, grouped by section — videos live in the Glimpse ("videos")
  // section regardless of tag, so they never occupy a photo slot.
  const byCat = useMemo(() => {
    const map = new Map<string, ZineMedia[]>();
    for (const item of media) {
      if (item.mediaType === "video") continue;
      const arr = map.get(item.category) ?? [];
      arr.push(item);
      map.set(item.category, arr);
    }
    return map;
  }, [media]);

  const images = useMemo(() => media.filter((m) => m.mediaType === "image"), [media]);
  const videos = useMemo(() => media.filter((m) => m.mediaType === "video"), [media]);

  // A photo pinned to a slot fills it. Empty slots keep the built-in placeholder.
  const itemAt = (name: string, i: number) => {
    const list = byCat.get(name) ?? [];
    return list.find((m) => m.slot === i);
  };
  const slot = (name: string, i: number, fallback: string) => {
    return itemAt(name, i)?.url || fallback;
  };
  const posStyle = (name: string, i: number) => {
    const pos = itemAt(name, i)?.objectPosition;
    return pos && pos !== "center" ? ({ objectPosition: pos } as const) : undefined;
  };

  const cardCount = 3;
  const videoCards = useMemo(() => {
    const shown = videos.slice(0, cardCount);
    return Array.from({ length: cardCount }, (_, i) => shown[i] ?? null);
  }, [videos]);

  const carouselSlides = images.length
    ? images.slice(0, 24)
    : FB.carousel.map((url) => ({ id: `fb-${url}`, url, thumbnailUrl: url }));
  const modalSlots = images.length
    ? images.slice(0, 30).map((it) => it.url)
    : FB.modal;

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.animate(
            [
              { opacity: 0, transform: "translateY(45px)" },
              { opacity: 1, transform: "translateY(0)" },
            ],
            { duration: 750, easing: "cubic-bezier(.22,.8,.22,1)", fill: "forwards" }
          );
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.16 }
    );

    root.querySelectorAll("[data-motion]").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    document.body.style.overflow = photoOpen || vidOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [photoOpen, vidOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setPhotoOpen(false);
      setVidOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const scrollCarousel = (dir: number) =>
    carouselRef.current?.scrollBy({ left: dir * 320, behavior: "smooth" });

  const openVideo = (item: ZineMedia | null) => {
    setPlaying(item);
    setVidOpen(true);
  };

  const stepVideo = (dir: number) => {
    if (!videos.length) return;
    const i = playing ? videos.findIndex((v) => v.id === playing.id) : -1;
    const next = (i === -1 ? 0 : i + dir + videos.length) % videos.length;
    setPlaying(videos[next]);
  };

  const tryUnlock = () => {
    if (pwInput === LETTER_CODE) {
      setLetterUnlocked(true);
      setPwError(false);
      setPwInput("");
    } else {
      setPwError(true);
      setPwInput("");
    }
  };

  return (
    <div className={styles.zine} ref={rootRef}>
      <main className={styles.page}>
        {/* ── SECTION 01 — HERO / COVER ── */}
        <section className={styles.hero} data-section="hero">
          <div className={styles.heroTop}>
            <span className={styles.micro}>PATTU / VISUAL ARCHIVE</span>
            <span className={styles.micro}>VOL. 01 / PRIVATE EDITION</span>
          </div>

          <div className={styles.heroSplit}>
            <div className={styles.heroLeft}>

              <p className={styles.heroName}>
                {(text.heroName || TEXT_DEFAULTS.heroName).split("\n").map((ln, i) => (
                  <span key={i}>
                    {ln}
                    {i < (text.heroName || TEXT_DEFAULTS.heroName).split("\n").length - 1 && <br />}
                  </span>
                ))}
                <span className={styles.heroTag}>
                  {" "}{text.heroTag || TEXT_DEFAULTS.heroTag}
                </span>
              </p>
              <p className={styles.heroKicker}>
                {text.heroKicker || TEXT_DEFAULTS.heroKicker}
              </p>
            </div>

            <div className={styles.heroRight}>
              <figure className={styles.heroPhotoMain}>
                <img src={slot("hero", 0, FB.heroMain)} style={posStyle("hero", 0)} alt="Portrait, close on his face and eyes" />
              </figure>
              <figure className={styles.heroSide}>
                <img src={slot("hero", 1, FB.heroSide)} style={posStyle("hero", 1)} alt="A second candid portrait" />
              </figure>
            </div>
          </div>

          <div className={styles.heroBottom}>
            <p className={styles.bubuLine}>{"bubu · ".repeat(28)}</p>
          </div>
        </section>

        {/* ── SECTION 02 — THE EYES ── */}
        <section className={styles.spread} data-section="eyes">
          <div className={styles.spreadHeader}>
            <div className={styles.verticalLabel}>FILE / 002 / EYES</div>
            <div>
              <h2 className={styles.spreadTitle}>
                THOSE
                <br />
                <span className={styles.accent}>EYES.</span>
              </h2>
              <span className={styles.ecLabel}>those eyes.</span>
            </div>
          </div>

          <div className={styles.ecCollage} data-motion="eyes">
            <span className={styles.ecLabelText}>those eyes.</span>

            <figure className={`${styles.ecImg} ${styles.ecBase}`}>
              <img src={slot("eyes", 0, FB.eyes[0])} alt="Close-up of his eyes and brows" />
            </figure>

            <figure className={`${styles.ecImg} ${styles.ec2}`}>
              <img src={slot("eyes", 1, FB.eyes[1])} alt="Close-up, low light" />
            </figure>

            <figure className={`${styles.ecImg} ${styles.ec3}`}>
              <img src={slot("eyes", 2, FB.eyes[2])} alt="Close-up, mid-laugh" />
            </figure>

            <figure className={`${styles.ecImg} ${styles.ec4}`}>
              <img src={slot("eyes", 3, FB.eyes[3])} alt="Candid close-up" />
            </figure>

            <figure className={`${styles.ecImg} ${styles.ec5}`}>
              <img src={slot("eyes", 4, FB.eyes[4])} alt="Candid close-up" />
            </figure>
          </div>

          <p className={styles.eyesPoetic}>
            {text.eyesPoetic || TEXT_DEFAULTS.eyesPoetic}
          </p>

          <div className={styles.eyesNote}>
            <p>{text.eyesLoveNote || TEXT_DEFAULTS.eyesLoveNote}</p>
          </div>
        </section>

        {/* ── SECTION 03 — COLLAGE / CAMERA ROLL ── */}
        <section className={styles.spread} data-section="collage">
          <div className={styles.spreadHeader}>
            <div className={styles.verticalLabel}>FILE / 003 / CAMERA ROLL</div>
            <div>
              <h2 className={styles.spreadTitle}>
                MY
                <br />
                <span className={styles.accent}>BABY</span>
              </h2>
              <p className={styles.spreadSub}>
                {text.cameraSub || TEXT_DEFAULTS.cameraSub}
              </p>
            </div>
          </div>

          <div className={styles.collageA}>
            <figure className={`${styles.photo} ${styles.a1}`}>
              <img src={slot("cameraroll", 0, FB.collage[0])} style={posStyle("cameraroll", 0)} alt="Placeholder portrait" />
              <figcaption>IMG / 0031</figcaption>
            </figure>

            <figure className={`${styles.photo} ${styles.a2}`}>
              <img src={slot("cameraroll", 1, FB.collage[1])} style={posStyle("cameraroll", 1)} alt="Placeholder portrait" />
              <figcaption>good one</figcaption>
            </figure>

            <figure className={`${styles.photo} ${styles.a3}`}>
              <img src={slot("cameraroll", 2, FB.collage[2])} style={posStyle("cameraroll", 2)} alt="Placeholder portrait" />
              <figcaption>pattu / 02</figcaption>
            </figure>

            <figure className={`${styles.photo} ${styles.a4}`}>
              <img src={slot("cameraroll", 3, FB.collage[3])} style={posStyle("cameraroll", 3)} alt="Placeholder portrait" />
              <figcaption>this one stays.</figcaption>
            </figure>

            <div className={`${styles.scribble} ${styles.red}`} style={{ right: "5%", top: "45%" }}>
              patakey. absolutely patakey.
            </div>
          </div>
        </section>

        {/* ── SECTION 04 — RAKNI ARCHIVE ── */}
        <section className={styles.poster} data-section="poster">
          <div className={styles.posterGrid}>
            <div className={styles.posterCopy}>
              <div className={styles.labelBox}>PATTU / SPECIAL EDITION</div>
              <h2>
                RAKNI
                <br />
                <span style={{ color: "var(--paper)" }}>ARCHIVE</span>
              </h2>

              <div className={styles.posterNotes}>
                <span className={styles.posterNote}>look 04</span>
                <span className={styles.posterNote}>camera roll</span>
                <span className={styles.posterNote}>favourite</span>
                <span className={styles.posterNote}>private file</span>
              </div>

              <button className={styles.posterViewAll} onClick={() => setPhotoOpen(true)}>
                view all photos ↗
              </button>
            </div>

            <div>
              <div className={styles.posterMosaic}>
                <figure className={`${styles.posterPhoto} ${styles.pm1}`} data-motion="poster">
                  <img src={slot("poster", 0, FB.poster[0])} style={posStyle("poster", 0)} alt="Placeholder portrait" />
                </figure>
                <figure className={`${styles.posterPhoto} ${styles.pm2}`} data-motion="poster">
                  <img src={slot("poster", 1, FB.poster[1])} style={posStyle("poster", 1)} alt="Placeholder portrait" />
                </figure>
                <figure className={`${styles.posterPhoto} ${styles.pm3}`} data-motion="poster">
                  <img src={slot("poster", 2, FB.poster[2])} style={posStyle("poster", 2)} alt="Placeholder portrait" />
                </figure>
                <figure className={`${styles.posterPhoto} ${styles.pm4}`} data-motion="poster">
                  <img src={slot("poster", 3, FB.poster[3])} style={posStyle("poster", 3)} alt="Placeholder portrait" />
                </figure>
              </div>

              <div className={styles.posterCarouselWrap}>
                <div className={styles.posterCarouselLabel}>
                  <span className={styles.micro} style={{ opacity: 0.7 }}>
                    more from the roll →
                  </span>
                  <div className={styles.carouselArrows}>
                    <button
                      className={styles.carouselArrow}
                      onClick={() => scrollCarousel(-1)}
                      aria-label="Scroll carousel back"
                    >
                      ‹
                    </button>
                    <button
                      className={styles.carouselArrow}
                      onClick={() => scrollCarousel(1)}
                      aria-label="Scroll carousel forward"
                    >
                      ›
                    </button>
                  </div>
                </div>
                <div className={styles.posterCarousel} ref={carouselRef}>
                  {carouselSlides.map((slide, i) => (
                    <figure className={styles.carouselSlide} key={slide.id ?? i}>
                      <img src={slide.url} style={posStyle("poster", i)} alt="" />
                    </figure>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── SECTION 05 — CANDID ── */}
        <section className={styles.candid} data-section="candid">
          <div className={styles.candidHead}>
            <div>
              <span className={styles.micro}>FILE / 005 / CAUGHT OFF GUARD</span>
              <h2 className={styles.candidTitle}>
                CANDID
                <br />
                <span className={styles.accent}>& UNPOSED.</span>
              </h2>
            </div>
            <p style={{ maxWidth: 300, fontSize: 14, lineHeight: 1.4 }}>
              {text.candidSub || TEXT_DEFAULTS.candidSub}
            </p>
          </div>

          <div className={styles.candidGrid}>
            {[0, 1, 2, 3].map((i) => (
              <article className={styles.candidCard} key={i}>
                <div className={styles.candidPhoto} data-motion="candid">
                  <img src={slot("candid", i, FB.candid[i])} style={posStyle("candid", i)} alt="" />
                </div>
                <div className={styles.candidMeta}>
                  <span>{["mid-sentence", "didn&apos;t notice", "the squint", "so this happened"][i]}</span>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* ── SECTION 06 — GLIMPSE OF MY BABIES ── */}
        <section className={`${styles.spread} ${styles.videoWrap}`} data-section="video">
          <div className={styles.spreadHeader}>
            <div className={styles.verticalLabel}>FILE / 006 / HOME VIDEOS</div>
            <div>
              <h2 className={styles.spreadTitle}>
                GLIMPSE
                <br />
                <span className={styles.accent}>OF MY BABY.</span>
              </h2>
              <p className={styles.spreadSub}>
                {text.videoSub || TEXT_DEFAULTS.videoSub}
              </p>
            </div>
          </div>

          <div className={styles.videoGrid} data-motion="video">
            {videoCards.map((v, i) => (
              <article
                className={styles.videoCard}
                key={v?.id ?? i}
                onMouseEnter={() => v && setHovered(i)}
                onMouseLeave={() => setHovered(-1)}
              >
                <span className={styles.videoTape} />
                <div className={styles.videoFilm}>
                  <div className={styles.videoFrame}>
                    {v && hovered === i ? (
                      <video src={v.url} autoPlay muted loop playsInline aria-hidden />
                    ) : (
                      <img
                        src={v ? v.thumbnailUrl || v.url : VIDEO_FALLBACKS[i].thumbnailUrl}
                        alt={v?.title || ""}
                      />
                    )}
                    <button
                      className={styles.videoPlay}
                      onClick={() => openVideo(v)}
                      aria-label={v ? `watch ${v.title || "video"}` : undefined}
                      type="button"
                    >
                      ▶
                    </button>
                  </div>
                </div>
                <div className={styles.videoMeta}>
                  <span>♪</span>
                  <span>{v?.title || `clip 0${i + 1}`}</span>
                </div>
              </article>
            ))}
          </div>

          {videos.length === 0 && <p className={styles.videoNote}>compiling tapes…</p>}

          {videos.length > 0 && (
            <div className={styles.videoCta}>
              <button className={styles.videoButton} onClick={() => openVideo(videos[0])} type="button">
                watch all videos ↘
              </button>
            </div>
          )}
        </section>

        {/* ── SECTION 07 — FINAL / LOVE LETTER ── */}
        <section className={styles.final} data-section="final">
          <div>
            <span className={styles.micro}>ONE LAST THING</span>
            <h2 className={styles.finalTitle}>
              A Letter,
              <br />
              <span className={styles.accent}>For You.</span>
            </h2>
          </div>

          <div className={styles.finalStage}>
            {!letterUnlocked ? (
              <div className={`${styles.envelope} ${pwError ? styles.envelopeShake : ""}`}>
              <div className={styles.envelopeFace}>
                <span className={styles.envelopeX} aria-hidden="true">✕</span>
                <button
                  type="button"
                  className={styles.envelopeSeal}
                  aria-label="Open the letter"
                  disabled={showPw}
                  onClick={() => setShowPw(true)}
                >
                  ♡
                </button>
                <span className={styles.envelopeLine} />
                <span className={styles.envelopeLine2} />
                <span className={styles.envelopeTo}>for: pattu</span>
              </div>
              <div className={`${styles.envelopeLock} ${showPw ? styles.envelopeLockOpen : ""}`}>
                <label className={styles.micro}>enter the lock code</label>
                <div className={styles.pwRow}>
                  <input
                    type="password"
                    inputMode="numeric"
                    maxLength={6}
                    value={pwInput}
                    autoFocus={showPw}
                    onChange={(e) => {
                      setPwInput(e.target.value.replace(/\D/g, ""));
                      setPwError(false);
                    }}
                    onKeyDown={(e) => e.key === "Enter" && tryUnlock()}
                    placeholder="000000"
                    aria-label="Letter lock code"
                  />
                  <button type="button" onClick={tryUnlock}>
                    open
                  </button>
                </div>
                {pwError && <p className={styles.pwError}>wrong code — no access</p>}
              </div>
              </div>
            ) : (
              <div className={styles.letterOpen}>
                <figure className={styles.letterPhoto}>
                  <img src={slot("final", 0, FB.final)} style={posStyle("final", 0)} alt="Placeholder final portrait" />
                </figure>
                <div className={styles.letterBody}>
                  <h3>pattu,</h3>
                  {(text.finalLetter || TEXT_DEFAULTS.finalLetter).split("\n\n").map((para, i) => (
                    <p key={i}>{para}</p>
                  ))}
                  <span className={styles.sign}>— always, me ♡</span>
                </div>
              </div>
            )}

            <div className={styles.finalStamp}>
              with
              <br />
              love,
              <br />
              always ♡
            </div>
          </div>

          <footer>
            <span>pattu / visual archive</span>
            <span>made with too many photographs</span>
            <span>scroll back up if you missed one</span>
          </footer>
        </section>
      </main>

      {/* ── VIEW-ALL MODAL ── */}
      <div
        className={`${styles.modal} ${photoOpen ? styles.open : ""}`}
        data-modal="photos"
        role="dialog"
        aria-modal="true"
        onClick={(e) => {
          if (e.target === e.currentTarget) setPhotoOpen(false);
        }}
      >
        <div className={styles.modalHead}>
          <h3 className={styles.modalTitle}>All of him.</h3>
          <button className={styles.modalClose} onClick={() => setPhotoOpen(false)} aria-label="Close">
            ✕
          </button>
        </div>
        <div className={styles.modalGrid}>
          {modalSlots.map((url, i) => (
            <figure key={`${url}-${i}`}>
              <img src={url} alt="" />
            </figure>
          ))}
        </div>
      </div>

      {/* ── VIDEO LIGHTBOX ── */}
      <div
        className={`${styles.modal} ${vidOpen ? styles.open : ""}`}
        data-modal="videos"
        role="dialog"
        aria-modal="true"
        onClick={(e) => {
          if (e.target === e.currentTarget) setVidOpen(false);
        }}
      >
        <div className={styles.modalHead}>
          <h3 className={styles.modalTitle}>Roll it. ▶</h3>
          <button className={styles.modalClose} onClick={() => setVidOpen(false)} aria-label="Close">
            ✕
          </button>
        </div>

        <div className={styles.vidPlayer}>
          {playing ? (
            <video key={playing.id} src={playing.url} controls autoPlay playsInline />
          ) : (
            <p className={styles.vidEmpty}>pick a clip</p>
          )}
          {playing && (
            <div className={styles.vidNav}>
              <button
                type="button"
                onClick={() => stepVideo(-1)}
                className={styles.vidNavBtn}
                aria-label="Previous video"
              >
                ‹ previous
              </button>
              <p className={styles.vidCaption}>{playing.caption || playing.title}</p>
              <button
                type="button"
                onClick={() => stepVideo(1)}
                className={styles.vidNavBtn}
                aria-label="Next video"
              >
                next ›
              </button>
            </div>
          )}
        </div>

        <div className={styles.modalGrid}>
          {videos.map((v) => (
            <figure key={v.id} className={styles.vidThumb} data-thumb onClick={() => setPlaying(v)}>
              <img src={v.thumbnailUrl} alt="" />
              <span className={styles.vidThumbTitle}>{v.title || "clip"}</span>
            </figure>
          ))}
        </div>
      </div>

    </div>
  );
}