"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import styles from "./ZinePage.module.css";
import { ScrollReveal, ImageReveal, ParallaxLayer, FloatingDecor } from "@/components/animation/motion-primitives";
import BotanicalSticker from "@/components/animation/BotanicalSticker";
import FloatingDoodle from "@/components/animation/FloatingDoodle";


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
    "Hello, Pattu. My love, my greatest love of all time, my first love. I love you very, very much.\n\nThis is my first time being with someone this good in my life, and honestly, sometimes I don’t even know what to say. Every birthday, I try to do something extra for you. Sometimes I think, “Maybe I shouldn’t do this much for anyone.” But then I look at your face and I’m like, “Oh, I need to.” There is something I must do to serve this face that I got from the gods, or maybe the angels.\n\nI love you very much. There are so many things I want to say, but I don’t think I can put all of them into words. I loved you from the moment I saw you. Well, not technically, but still. I love you very, very much. I loved you from the moment you blocked that other person who was talking to you.\n\nAnd I think it was fate that we met. We met so slowly, so gradually. Nothing felt overpowering or rushed, and somehow, that made me think, “Yes, I think everything happened for a reason.” I met you for a reason. I met you because I was born to love you. I was born to take care of you. I was born to cherish you. And you were born to be mine. At least, that’s how I feel.\n\nBut yeah, it’s just that I love you very, very much. I don’t even know what else to say. Just be with me for the rest of your life, and I will take care of you for the rest of mine. I will love you until the moon gets blown away, until it doesn’t exist anymore. I will love you in my next lifetime, and the lifetime after that, and another one after that, if there is one. I will love you.\n\nPlease, please be with me for the rest of your life. We have so many plans. We want to go to different countries, and I can’t wait to experience all of that with you. Just going places, seeing new things, traveling together, eating lots of food, even though I’m dieting right now, I’ll eat with you, even if it’s just a bite.\n\nI want to go out with you and have fun freely, with no one around to judge us. I want us to have our own room, our own space, and just be together. I don’t want to feel that pain I feel every time you leave my house anymore. I want that so badly for us. I want to be able to wake up beside you, spend my days with you, and not have to say goodbye and feel that emptyness afterward.\n\nAnd I will make that happen. I will do everything I can so that we can be happy together. I will love you like this until I’m very, very old. And even when I can’t do everything I want to do for you, I will still try my best. I will always try my best to take care of you, to take care of your needs, and to make you feel loved.\n\nSo please, love me. And I love you. That’s all I can say right now. I love you, baby.",
};

export default function ZinePage({
  initialMedia = [],
  initialText,
}: {
  initialMedia?: ZineMedia[];
  initialText?: Record<string, string>;
}) {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [photoOpen, setPhotoOpen] = useState(false);
  const [vidOpen, setVidOpen] = useState(false);
  const [letterUnlocked, setLetterUnlocked] = useState(false);
  const [letterFlipped, setLetterFlipped] = useState(false);
  const [pwInput, setPwInput] = useState("");
  const [pwError, setPwError] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const LETTER_CODE = "180561";
  const [playing, setPlaying] = useState<ZineMedia | null>(null);
  const [hovered, setHovered] = useState(-1);
  const [media, setMedia] = useState<ZineMedia[]>(initialMedia);
  const [text, setText] = useState<Record<string, string>>(
    initialText && Object.keys(initialText).length ? initialText : TEXT_DEFAULTS
  );

  // Clear the playing video when the modal closes — adjust during render
  if (!vidOpen && playing !== null) setPlaying(null);

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
    ? images.map((it) => it.url)
    : FB.modal;

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
    <div className={styles.zine}>
      <main className={styles.page}>
        {/* ── SECTION 01 — HERO / COVER ── */}
        <section className={styles.hero} data-section="hero">
          <ScrollReveal className={styles.heroTop}>
            <span className={styles.micro}>PATTU / VISUAL ARCHIVE</span>
            <span className={styles.micro}>VOL. 01 / PRIVATE EDITION</span>
          </ScrollReveal>

          <div className={styles.heroSplit}>
            <div className={styles.heroLeft}>

              <ScrollReveal delay={0.1}>
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
              </ScrollReveal>
            </div>

            <div className={styles.heroRight}>
              <ImageReveal
                src={slot("hero", 0, FB.heroMain)}
                alt="Portrait, close on his face and eyes"
                className={styles.heroPhotoMain}
                delay={0.2}
              />
              <ImageReveal
                src={slot("hero", 1, FB.heroSide)}
                alt="A second candid portrait"
                className={styles.heroSide}
                delay={0.35}
              />
            </div>
          </div>

          <div className={styles.heroBottom}>
            <p className={styles.bubuLine}>{"bubu · ".repeat(28)}</p>
          </div>
        </section>

        {/* ── SECTION 02 — THE EYES ── */}
        <section className={styles.spread} data-section="eyes">
          <div className={styles.spreadHeader}>
            <ScrollReveal><div className={styles.verticalLabel}>FILE / 002 / EYES</div></ScrollReveal>
            <div>
              <ScrollReveal delay={0.1}>
              <h2 className={styles.spreadTitle}>
                cutu putu
                <br />
                <span className={styles.accent}>rome bybae.</span>
              </h2>
              <span className={styles.ecLabel}>eyes of an angel.</span>
              </ScrollReveal>
            </div>
          </div>

          <ParallaxLayer speed={0.08} className={styles.ecGrid}>
            <span className={styles.ecLabelText}>eyes of an angel.</span>

            <ImageReveal
              src={slot("eyes", 0, FB.eyes[0])}
              alt="Close-up of his eyes"
              className={`${styles.ecCell} ${styles.ecT1}`}
            />
            <ImageReveal
              src={slot("eyes", 1, FB.eyes[1])}
              alt="Close-up of his eyes"
              className={`${styles.ecCell} ${styles.ecT2}`}
              delay={0.06}
            />
            <ImageReveal
              src={slot("eyes", 2, FB.eyes[2])}
              alt="Close-up of his eyes"
              className={`${styles.ecCell} ${styles.ecT3}`}
              delay={0.12}
            />
            <ImageReveal
              src={slot("eyes", 3, FB.eyes[3])}
              alt="Close-up of his eyes"
              className={`${styles.ecCell} ${styles.ecT4}`}
              delay={0.18}
            />
            <ImageReveal
              src={slot("eyes", 4, FB.eyes[4])}
              alt="Close-up of his eyes"
              className={`${styles.ecCell} ${styles.ecT5}`}
              delay={0.24}
            />

            <FloatingDecor
              className={styles.eyesDeco}
              driftPx={5}
              duration={5}
            >
              <BotanicalSticker variant="leaf" />
            </FloatingDecor>
          </ParallaxLayer>

          <ScrollReveal delay={0.15}>
          <p className={styles.eyesPoetic}>
            {text.eyesPoetic || TEXT_DEFAULTS.eyesPoetic}
          </p>
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
          <div className={styles.eyesNote}>
            <p>{text.eyesLoveNote || TEXT_DEFAULTS.eyesLoveNote}</p>
          </div>
          </ScrollReveal>
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
            <ImageReveal
              src={slot("cameraroll", 0, FB.collage[0])}
              alt="Placeholder portrait"
              className={`${styles.photo} ${styles.a1}`}
              caption="IMG / 0031"
              objectPosition={posStyle("cameraroll", 0)?.objectPosition}
            />
            <ImageReveal
              src={slot("cameraroll", 1, FB.collage[1])}
              alt="Placeholder portrait"
              className={`${styles.photo} ${styles.a2}`}
              delay={0.07}
              caption="good one"
              objectPosition={posStyle("cameraroll", 1)?.objectPosition}
            />
            <ImageReveal
              src={slot("cameraroll", 2, FB.collage[2])}
              alt="Placeholder portrait"
              className={`${styles.photo} ${styles.a3}`}
              delay={0.14}
              caption="pattu / 02"
              objectPosition={posStyle("cameraroll", 2)?.objectPosition}
            />
            <ImageReveal
              src={slot("cameraroll", 3, FB.collage[3])}
              alt="Placeholder portrait"
              className={`${styles.photo} ${styles.a4}`}
              delay={0.21}
              caption="this one stays."
              objectPosition={posStyle("cameraroll", 3)?.objectPosition}
            />
            <div className={`${styles.scribble} ${styles.red}`} style={{ right: "5%", top: "45%" }}>
              patakey. absolutely patakey.
            </div>

            <FloatingDecor className={styles.collageDeco} driftPx={4} duration={5}>
              <FloatingDoodle kind="sparkle" className={styles.decoSvg} />
            </FloatingDecor>
          </div>
        </section>

        {/* ── SECTION 04 — RAKNI ARCHIVE ── */}
        <section className={styles.poster} data-section="poster">
          <div className={styles.posterGrid}>
            <div className={styles.posterCopy}>
              <ScrollReveal>
              <div className={styles.labelBox}>PATTU / SPECIAL EDITION</div>
              <h2>
                Bubu
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
              </ScrollReveal>
            </div>

            <div>
              <div className={styles.posterMosaic}>
                <ImageReveal
                  src={slot("poster", 0, FB.poster[0])}
                  alt="Placeholder portrait"
                  className={`${styles.posterPhoto} ${styles.pm1}`}
                  objectPosition={posStyle("poster", 0)?.objectPosition}
                />
                <ImageReveal
                  src={slot("poster", 1, FB.poster[1])}
                  alt="Placeholder portrait"
                  className={`${styles.posterPhoto} ${styles.pm2}`}
                  delay={0.07}
                  objectPosition={posStyle("poster", 1)?.objectPosition}
                />
                <ImageReveal
                  src={slot("poster", 2, FB.poster[2])}
                  alt="Placeholder portrait"
                  className={`${styles.posterPhoto} ${styles.pm3}`}
                  delay={0.14}
                  objectPosition={posStyle("poster", 2)?.objectPosition}
                />
                <ImageReveal
                  src={slot("poster", 3, FB.poster[3])}
                  alt="Placeholder portrait"
                  className={`${styles.posterPhoto} ${styles.pm4}`}
                  delay={0.21}
                  objectPosition={posStyle("poster", 3)?.objectPosition}
                />
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
                Handsome
                <br />
                <span className={styles.accent}> Kto Moh 123.</span>
              </h2>
            </div>
            <p style={{ maxWidth: 300, fontSize: 14, lineHeight: 1.4 }}>
              {text.candidSub || TEXT_DEFAULTS.candidSub}
            </p>
          </div>

          <div className={styles.candidGrid}>
            {[0, 1, 2, 3].map((i) => (
              <article className={styles.candidCard} key={i}>
                <ImageReveal
                  src={slot("candid", i, FB.candid[i])}
                  alt=""
                  className={styles.candidPhoto}
                  objectPosition={posStyle("candid", i)?.objectPosition}
                  delay={i * 0.07}
                />
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

          <ScrollReveal className={styles.videoGrid} y={40}>
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
          </ScrollReveal>

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
              My Love,
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
                <ImageReveal
                  src={slot("final", 0, FB.final)}
                  alt="Placeholder final portrait"
                  className={styles.letterPhoto}
                  objectPosition={posStyle("final", 0)?.objectPosition}
                />
                <div className={`${styles.letterBody} ${styles.flipWrap}`}>
                  {(() => {
                    const paras = (text.finalLetter || TEXT_DEFAULTS.finalLetter).split("\n\n");
                    const half = Math.ceil(paras.length / 2);
                    return (
                      <div className={`${styles.flipInner} ${letterFlipped ? styles.flipOpen : ""}`}>
                        <div className={styles.flipFace}>
                          <h3>pattu,</h3>
                          {paras.slice(0, half).map((para, i) => <p key={i}>{para}</p>)}
                          <button
                            type="button"
                            className={styles.flipBtn}
                            onClick={() => setLetterFlipped(true)}
                          >
                            turn the page — read more →
                          </button>
                        </div>
                        <div className={`${styles.flipFace} ${styles.flipBack}`}>
                          {paras.slice(half).map((para, i) => <p key={i}>{para}</p>)}
                          <span className={styles.sign}>— always, me ♡</span>
                          <button
                            type="button"
                            className={`${styles.flipBtn} ${styles.flipBackBtn}`}
                            onClick={() => setLetterFlipped(false)}
                          >
                            ← flip back
                          </button>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </div>
            )}

            <FloatingDecor className={styles.finalStamp} driftPx={3}>
              with
              <br />
              love,
              <br />
              always ♡
            </FloatingDecor>

            <FloatingDecor className={styles.finalDeco} driftPx={4} duration={5}>
              <FloatingDoodle kind="sparkle" className={styles.decoSvg} />
            </FloatingDecor>
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