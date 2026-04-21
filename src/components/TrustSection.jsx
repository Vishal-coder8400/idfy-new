import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { clamp, ease } from "./helpers";
import '../index.css'

export default function TrustSection() {
  const sectionRef = useRef(null);
  const [p, setP] = useState(-1);
  const [vw, setVw] = useState(0);

  useEffect(() => {
    const update = () => setVw(window.innerWidth);
    update();
    window.addEventListener("resize", update, { passive: true });
    return () => window.removeEventListener("resize", update);
  }, []);

  const isMobile = vw > 0 && vw < 600;

  useEffect(() => {
    const onScroll = () => {
      const el = sectionRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const scrolled = -rect.top;
      const total = el.offsetHeight - window.innerHeight;
      const triggerOffset = window.innerHeight * 0.5;
      const adjustedScrolled = scrolled + triggerOffset;
      const adjustedTotal = total + triggerOffset;
      if (adjustedTotal <= 0) setP(-1);
      else if (adjustedScrolled < 0) setP(0);
      else if (adjustedScrolled > adjustedTotal) setP(-1);
      else setP(adjustedScrolled / adjustedTotal);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const lp = (start, end) => ease(clamp((p - start) / (end - start), 0, 1));

  // Each card has its own timing window:
  //   card1: enters 0.20, peaks 0.45, exits 0.70
  //   card2: enters 0.45, peaks 0.70, exits 0.95
  // For a given card, progress goes 0 → 1 across its full window (enter to exit).
  //
  // cardProgress returns 0..1 visibility. The previous version used a pure
  // bell curve (peaked at a single instant in the middle), which meant the
  // card was only SHARP for a blink — fade/blur was always active at the
  // moment a user actually read it. That felt like "no animation visible"
  // because there was never a steady readable state.
  //
  // The new curve is a trapezoid: fade in over the first 20% of the window,
  // hold at full visibility/sharpness for the middle 60%, fade out over the
  // last 20%. This gives the user a real reading plateau and makes the
  // fade-in/fade-out feel like deliberate animations rather than always-on
  // blur.
  const cardProgress = (cp) => {
    if (cp <= 0 || cp >= 1) return 0;
    if (cp < 0.2) return cp / 0.2;        // fade in  (0 → 1 over first 20%)
    if (cp > 0.8) return (1 - cp) / 0.2;  // fade out (1 → 0 over last  20%)
    return 1;                              // steady held for middle 60%
  };

  const card1P = lp(0.10, 0.80);
  const card2P = lp(0.35, 1.05);
  const card1Visibility = cardProgress(card1P);
  const card2Visibility = cardProgress(card2P);
  // Y translate: moves from +60px to -60px across the full window
  const card1Y = 60 - card1P * 120;
  const card2Y = 60 - card2P * 120;
  // Blur: 20px at edges, 0px at middle
  const card1Blur = (1 - card1Visibility) * 20;
  const card2Blur = (1 - card2Visibility) * 20;

  /*
   * Font sizes reduced 25%:
   *   trustFontSize: clamp(36px,8vw,110px) → clamp(27px,6vw,82.5px)
   *   subFontSize:   clamp(13px,1.8vw,20px) → clamp(9.75px,1.35vw,15px)
   *   ghostFontSize: clamp(14px,1.8vw,26px) → clamp(10.5px,1.35vw,19.5px)
   *
   * Ghost panel widths reduced 25%:
   *   clamp(260px,40vw,590px) → clamp(195px,30vw,442.5px)
   */
  const trustFontSize = "clamp(27px, 6vw, 82.5px)";
  const subFontSize = "clamp(9.75px, 1.35vw, 15px)";
  const ghostFontSize = "clamp(10.5px, 1.35vw, 19.5px)";

  const overlay = (
    <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 9999, overflow: "hidden" }}>
      <div style={{
        position: "absolute", left: "18%", top: "35%", width: "clamp(195px, 30vw, 442.5px)",
        transform: `translateY(${card1Y}px) rotate(-2.5deg)`,
        opacity: card1Visibility,
        filter: `blur(${card1Blur}px)`,
        WebkitFilter: `blur(${card1Blur}px)`,
        background: "rgba(255,255,255,0.4)", backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)", borderRadius: 8,
        padding: "clamp(10px, 1.5vw, 16px) clamp(14px, 2vw, 22px)",
        boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
        willChange: "opacity, filter, transform",
      }}>
        <p style={{ fontSize: ghostFontSize, color: "#343434", lineHeight: "1.4", fontFamily: "Inter", margin: 0, fontWeight: 300 }}>
          When speed and scale take priority, due diligence slips and blind spots widen. That's exactly what is happening in the gig economy today.
        </p>
      </div>
      <div style={{
        position: "absolute", right: "18%", top: "55%", width: "clamp(195px, 30vw, 442.5px)",
        transform: `translateY(${card2Y}px) rotate(2.5deg)`,
        opacity: card2Visibility,
        filter: `blur(${card2Blur}px)`,
        WebkitFilter: `blur(${card2Blur}px)`,
        background: "rgba(255,255,255,0.4)", backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)", borderRadius: 8,
        padding: "clamp(10px, 1.5vw, 16px) clamp(14px, 2vw, 22px)",
        boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
        willChange: "opacity, filter, transform",
      }}>
        <p style={{ fontSize: ghostFontSize, color: "#343434", lineHeight: "1.4", fontFamily: "Inter", margin: 0, fontWeight: 300 }}>
          Identity swaps, impersonation, and hidden criminal histories do more than disrupt operations. They put safety, credibility, and customer trust at risk.
        </p>
      </div>
    </div>
  );

  // Shared trust text block — used in both mobile and desktop
  const trustText = (
    <div style={{ textAlign: "center", lineHeight: 1.08 }}>
      <span style={{ fontFamily: "Inter", fontWeight: 600, color: "#1A3BB0", display: "block", lineHeight: 1.0, fontSize: trustFontSize }}>Trust,</span>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "center", gap: "0.2em", flexWrap: "wrap" }}>
        <span style={{ fontFamily: "Inter", fontWeight: 300, color: "#5D5D5D", lineHeight: 1.0, fontSize: trustFontSize }}>however is </span>
        <span style={{ fontFamily: "Inter", fontWeight: 700, color: "#343434", lineHeight: 1.05, marginLeft: "8px", fontSize: trustFontSize }}>fragile.</span>
      </div>
      <div><span style={{ fontFamily: "Inter", fontWeight: 700, color: "#CE1010", fontSize: trustFontSize }}>One </span><span style={{ fontFamily: "Inter", fontWeight: 400, color: "#5d5d5d", fontSize: trustFontSize }}>news headline.</span></div>
      <div><span style={{ fontFamily: "Inter", fontWeight: 700, color: "#CE1010", fontSize: trustFontSize }}>One </span><span style={{ fontFamily: "Inter", fontWeight: 400, color: "#5d5d5d", fontSize: trustFontSize }}>breach.</span></div>
      <div><span style={{ fontFamily: "Inter", fontWeight: 700, color: "#CE1010", fontSize: trustFontSize }}>One </span><span style={{ fontFamily: "Inter", fontWeight: 400, color: "#5d5d5d", fontSize: trustFontSize }}>bad experience</span></div>
      <div style={{ marginTop: "clamp(12px, 2vw, 28px)" }}>
        <p style={{ fontSize: subFontSize, color: "#343434", lineHeight: 1.6, margin: 0 }}>
          is all it takes to undo years of hard-earned customer confidence.
        </p>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <div id="dots-png" ref={sectionRef} style={{ padding: "40px 6vw 16px" }}>
        {trustText}
        <div style={{ marginTop: 20, background: "rgba(243,242,242,0.9)", borderRadius: 8, padding: "14px 16px", marginBottom: 12 }}>
          <p style={{ fontSize: ghostFontSize, color: "#343434", lineHeight: "1.6", fontFamily: "Inter", margin: 0, fontWeight: 300 }}>
            When speed and scale take priority, due diligence slips and blind spots widen. That's exactly what is happening in the gig economy today.
          </p>
        </div>
        <div style={{ background: "rgba(243,242,242,0.9)", borderRadius: 8, padding: "14px 16px" }}>
          <p style={{ fontSize: ghostFontSize, color: "#343434", lineHeight: "1.6", fontFamily: "Inter", margin: 0, fontWeight: 300 }}>
            Identity swaps, impersonation, and hidden criminal histories do more than disrupt operations. They put safety, credibility, and customer trust at risk.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      {p >= 0 && createPortal(overlay, document.body)}
      <div ref={sectionRef} style={{ position: "relative", height: "240vh", background: "#fff" }}>
        {/* Static dots layer — fixed so it doesn't scroll with content */}
        <div style={{
          position: "sticky",
          top: 0,
          height: "100vh",
          width: "100%",
          backgroundImage: "url('/assets/Dots.png')",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          backgroundSize: "contain",
          pointerEvents: "none",
          zIndex: 0,
        }} />
        <div style={{
          position: "absolute",
          top: 0, left: 0, right: 0, bottom: 0,
          zIndex: 1,
        }}>
          <div style={{
            position: "sticky", top: 0, height: "100vh",
            display: "flex", flexDirection: "column", alignItems: "center",
            justifyContent: "center", overflow: "hidden",
            padding: "0 6vw",
          }}>
            <div style={{ position: "relative", textAlign: "center", zIndex: 1, lineHeight: 1.08 }}>
              {trustText}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}