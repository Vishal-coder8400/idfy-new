import { useEffect, useRef, useState } from "react";
import { clamp, ease } from "./helpers";

const TIMELINE = [
  { year: "1999", desc: "The first online shopping platform gained traction.", title: "Medium", sub: "Courier services", tilt: -2.5 },
  { year: "2015", desc: "A social media platform introduced shoppable tags, where people could directly sell on the platform.", title: "Medium", sub: "Fleet operators", tilt: 1.8 },
  { year: "2017", desc: "E-commerce platforms offered same-day delivery services to compete on speed and reach. Premium members.", title: "Medium", sub: "Fleet operators + delivery drivers", tilt: -1.5 },
  { year: "2019", desc: "Food delivery platforms competed for speed promising delivery in 10–15 minutes from micro-fulfillment centers.", title: "Medium", sub: "Delivery Partners + Dark stores", tilt: 2.2 },
  { year: "2021", desc: "Quick commerce gained popularity for providing sub-15 minute delivery for premium products.", title: "Medium", sub: "Delivery Partners + Dark stores", tilt: -1.8 },
  { year: "2025", desc: "On-demand services (cleaning, cooking, etc) can be booked instantly.", title: "Medium", sub: "For everything instantly", tilt: 1.2 },
];

/*
 * Card dimensions reduced 25%:
 *   MOBILE_CARD_W: 210 → 158
 *   MOBILE_CARD_H: 270 → 203
 *   DESKTOP_CARD_H: 380 → 285
 *   MOBILE_GAP: 12 → 9
 *   desktopCardW: 300 → 225
 *   desktopGap: 24→18, 32→24
 *   imgHeight mobile: 85 → 64
 *   imgHeight desktop: 130 → 98
 */
const MOBILE_CARD_W = 158;
const MOBILE_CARD_H = 203;
const DESKTOP_CARD_H = 285;
const MOBILE_GAP = 9;
const TOTAL_MOBILE_RAIL_W =
  TIMELINE.length * MOBILE_CARD_W + (TIMELINE.length - 1) * MOBILE_GAP;

function TimelineCard({ item, entrance, isMobile, index }) {
  const cardWidth = isMobile ? MOBILE_CARD_W : 225;
  const cardHeight = isMobile ? MOBILE_CARD_H : DESKTOP_CARD_H;
  const imgHeight = isMobile ? 64 : 98;

  return (
    <div style={{
      opacity: entrance,
      transform: `scale(${0.88 + entrance * 0.12}) rotate(${item.tilt}deg)`,
      transformOrigin: "center center", // Changed from "50% 0%" to "center center"
      willChange: "transform, opacity",
      flexShrink: 0,
      transition: "opacity 0.35s ease-out, transform 0.45s cubic-bezier(0.2, 0.9, 0.4, 1.1)",
      // Add margin to prevent clipping at edges
      margin: isMobile ? "8px 0" : "0",
    }}>
      {/* Rest of your component remains the same */}
      <div style={{
        width: cardWidth,
        height: cardHeight,
        background: "#fff",
        borderRadius: 20,
        border: "none",
        overflow: "hidden",
        boxShadow: "0 12px 40px rgba(0,0,0,0.12), 0 4px 12px rgba(0,0,0,0.06)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        boxSizing: "border-box",
      }}>
        {/* Text content */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
          <div style={{ padding: isMobile ? "10px 12px 6px" : "16px 20px 10px" }}>
            <div style={{
              display: "inline-block", color: "#CE1010",
              fontSize: isMobile ? 14 : 20,
              fontWeight: 800,
              fontFamily: "Inter", letterSpacing: -0.5, marginBottom: 6,
            }}>{item.year}</div>
            <p style={{
              fontSize: isMobile ? 9 : 10.5,
              color: "#444", lineHeight: 1.55,
              fontFamily: "Inter", margin: 0,
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}>{item.desc}</p>
          </div>
          <div style={{ padding: isMobile ? "4px 12px 8px" : "8px 20px 10px" }}>
            <p style={{ fontSize: isMobile ? 10 : 13.5, fontWeight: 800, color: "#1a1a1a", fontFamily: "Inter", marginBottom: 2, margin: 0 }}>{item.title}</p>
            <p style={{ fontSize: isMobile ? 8 : 10, color: "#888", fontFamily: "Inter", lineHeight: 1.4, margin: 0 }}>{item.sub}</p>
          </div>
        </div>

        {/* Image container */}
        <div style={{
          margin: isMobile ? "0 8px 8px" : "0 12px 12px",
          borderRadius: 10,
          overflow: "hidden",
          height: imgHeight,
          flexShrink: 0,
          background: "transparent",
        }}>
          <img
            src={`/assets/${index + 15}.png`}
            alt={item.year}
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          />
        </div>
      </div>
    </div>
  );
}

export default function Workforce() {
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== "undefined" && window.innerWidth < 768
  );
  const [isTablet, setIsTablet] = useState(
    () => typeof window !== "undefined" && window.innerWidth >= 768 && window.innerWidth < 1024
  );
  const [vw, setVw] = useState(
    () => (typeof window !== "undefined" ? window.innerWidth : 1440)
  );
  const [vh, setVh] = useState(
    () => (typeof window !== "undefined" ? window.innerHeight : 900)
  );

  const sectionRef = useRef(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const update = () => {
      setIsMobile(window.innerWidth < 768);
      setIsTablet(window.innerWidth >= 768 && window.innerWidth < 1024);
      setVw(window.innerWidth);
      setVh(window.innerHeight);
    };
    update();
    window.addEventListener("resize", update, { passive: true });
    return () => window.removeEventListener("resize", update);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const el = sectionRef.current;
      if (!el) return;
      const scrolled = -el.getBoundingClientRect().top;
      const total = el.offsetHeight - window.innerHeight;
      setProgress(Math.max(0, Math.min(1, scrolled / total)));
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const railShift = ease(clamp(progress / 0.95, 0, 1));

  const cardEntrance = (i) => {
    if (isMobile) return 1;
    if (i < 3) return 1;
    const start = i * 0.08;
    const end = start + 0.12;
    return ease(clamp((progress - start) / (end - start), 0, 1));
  };

  const mobileInitial = vw * 0.5;
  const mobileEnd = -(TOTAL_MOBILE_RAIL_W - vw + 48);
  const mobileTranslateX = mobileInitial * (1 - railShift) + mobileEnd * railShift;

  /* desktopCardW reduced to 225, desktopGap: 24→18 (tablet), 32→24 (desktop) */
  const desktopCardW = 225;
  const desktopGap = isTablet ? 18 : 24;
  const totalDesktopW = TIMELINE.length * desktopCardW + (TIMELINE.length - 1) * desktopGap;
  const railPadLeft = vw * 0.06;
  const widthOfThreeCards = 3 * desktopCardW + 2 * desktopGap;
  const desktopStart = ((vw - railPadLeft - widthOfThreeCards) / vw) * 100;
  const desktopEnd = -((totalDesktopW - vw * 0.88) / vw) * 100;
  const desktopTranslateX = `calc(${desktopStart - railShift * (desktopStart - desktopEnd)}vw)`;

  const sectionH = isMobile
    ? vh + vh * 0.8
    : vh + vh * (TIMELINE.length * 0.35);

  const isShortDesktop = !isMobile && !isTablet && vh < 780;

  /*
   * titleSize reduced 25%:
   *   mobile:  clamp(32px,10vw,52px) → clamp(24px,7.5vw,39px)
   *   tablet:  clamp(52px,8vw,80px)  → clamp(39px,6vw,60px)
   *   desktop: clamp(64px,7vw,105px) → clamp(48px,5.25vw,78.75px)
   *
   * bodySize reduced 25%:
   *   mobile:  clamp(13px,3.5vw,16px) → clamp(9.75px,2.625vw,12px)
   *   tablet:  clamp(16px,2.5vw,22px) → clamp(12px,1.875vw,16.5px)
   *   desktop: clamp(18px,1.8vw,30px) → clamp(13.5px,1.35vw,22.5px)
   */
  const titleSize = isMobile
    ? "clamp(24px, 7.5vw, 39px)"
    : isTablet
      ? "clamp(39px, 6vw, 60px)"
      : "clamp(48px, 5.25vw, 78.75px)";

  const bodySize = isMobile
    ? "clamp(9.75px, 2.625vw, 12px)"
    : isTablet
      ? "clamp(12px, 1.875vw, 16.5px)"
      : "clamp(13.5px, 1.35vw, 22.5px)";

  return (
    <div
      className="rounded-xl"
      ref={sectionRef}
      style={{ height: isMobile ? "" : sectionH, position: "relative", marginTop: 0, background: "#fff" }}
    >
      <div
        style={{
          position: "sticky",
          top: 0,
          height: isMobile ? "auto" : "100vh",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          background: "#fff",
          justifyContent: isShortDesktop ? "flex-start" : "center",
          paddingTop: isMobile ? 20 : isShortDesktop ? 10 : 60,
          paddingBottom: isMobile ? 20 : isShortDesktop ? 16 : 30,
          boxSizing: "border-box",
        }}
      >
        {/* Header text block */}
        <div style={{
          textAlign: "center",
          marginBottom: isMobile ? 20 : isTablet ? 32 : isShortDesktop ? 24 : 48,
          paddingLeft: isMobile ? 16 : 24,
          paddingRight: isMobile ? 16 : 24,
        }}>
          <h2 style={{
            fontFamily: "Inter",
            fontWeight: 700,
            color: "#CE1010",
            lineHeight: 1.05,
            margin: "0 0 12px",
            fontSize: titleSize,
          }}>
            The Workforce<br />Behind Every Order
          </h2>
          <p style={{
            fontSize: bodySize,
            lineHeight: isMobile ? 1.5 : 1.4,
            color: "#343434",
            maxWidth: 900,
            margin: "0 auto 10px",
            fontWeight: 300,
            textAlign: "center",
          }}>
            India's doorstep economy operates at the intersection of logistics,
            technology, and human workforce. But that wasn't the case 15 years ago.
            Let's look at how the gig economy evolved with various business models
            over the last 3 decades.
          </p>
          {/* source links: 11→8, 14→10.5 */}
          <p style={{ fontSize: isMobile ? 8 : 10.5, color: "#aaa", fontStyle: "italic", margin: 0 }}>
            Sources:{" "}
            {["Kearney", "Young Urban Project", "Shiproket"].map((s) => (
              <a
                key={s}
                href="https://www.youngurbanproject.com/what-is-quick-commerce/"
                target="_blank"
                rel="noopener noreferrer"
                style={{ textDecoration: "underline", cursor: "pointer", color: "#aaa", marginRight: 6 }}
                onMouseEnter={(e) => (e.target.style.color = "#CE1010")}
                onMouseLeave={(e) => (e.target.style.color = "#aaa")}
              >
                {s}
              </a>
            ))}
          </p>
        </div>

        {/* Card rail */}
        <div style={{
          width: "100%",
          overflowX: isMobile ? "auto" : "visible",
          overflowY: "hidden",
          WebkitOverflowScrolling: "touch",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          // paddingBottom: isMobile ? 20 : 16,
          paddingTop: isMobile ? 0 : 24,
          paddingBottom: isMobile ? 20 : 16,
        }}>
          <div style={{
            display: "flex",
            gap: isMobile ? MOBILE_GAP : desktopGap,
            alignItems: "flex-start",
            paddingLeft: isMobile ? "6vw" : "6vw",
            paddingRight: isMobile ? "6vw" : "6vw",
            width: isMobile ? "max-content" : "auto",
            transform: isMobile ? "none" : `translateX(${desktopTranslateX})`,
            willChange: isMobile ? "auto" : "transform",
            transition: isMobile ? "none" : "transform 0.12s linear",
          }}>
            {TIMELINE.map((item, i) => (
              <TimelineCard
                key={item.year}
                item={item}
                entrance={cardEntrance(i)}
                isMobile={isMobile}
                index={i}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}