import { useEffect, useRef, useState } from "react";
import '../index.css'

const MONTHS = [
  { month: "January", pct: "2.4%", highlight: false },
  { month: "February", pct: "2.81%", highlight: false },
  { month: "March", pct: "2.94%", highlight: false },
  { month: "April", pct: "3.17%", highlight: false },
  { month: "May", pct: "2.81%", highlight: false },
  { month: "June", pct: "2.75%", highlight: false },
  { month: "July", pct: "3.2%", highlight: false },
  { month: "August", pct: "3.17%", highlight: false },
];

const HighlightMONTHS = [
  { month: "September", pct: "3.36%", highlight: true },
  { month: "October", pct: "3.32%", highlight: true },
  { month: "November", pct: "3.48%", highlight: true },
  { month: "December", pct: "3.4%", highlight: true },
];

// Hotspot data for the two commerce modes. Indexed by HOTSPOT_DATA[activeIdx]:
//   0 = E-commerce   (shown first when pin engages)
//   1 = Quick commerce (shown after scrolling through the pin)
const HOTSPOT_DATA = [
  {
    leftState: "Haryana", leftPct: 4.30,
    centerText: "E-commerce",
    rightState: "Kerala", rightPct: 7.93,
  },
  {
    leftState: "Karnataka", leftPct: 6.91,
    centerText: "Quick commerce",
    rightState: "Maharashtra", rightPct: 7.24,
  },
];

/*
 * CountUp: animates a number from 0 to `target` over `duration` ms. Re-runs
 * whenever `trigger` changes (we pass activeIdx as the trigger so the
 * animation restarts on each data switch). Shown with 2 decimal places + "%".
 *
 * Skips the first mount animation — on initial render we snap directly to
 * target. This avoids the number "ticking up" when the page first loads
 * while the user is nowhere near the section. The 0→value animation only
 * plays on subsequent trigger changes (i.e. when the user actively scrolls
 * and flips E-commerce ↔ Quick commerce during the pin).
 */
function CountUp({ target, duration = 1000, trigger }) {
  const [val, setVal] = useState(target);
  const rafRef = useRef(null);
  const firstRun = useRef(true);
  useEffect(() => {
    if (firstRun.current) {
      firstRun.current = false;
      setVal(target);
      return;
    }
    setVal(0);
    const start = performance.now();
    const tick = (now) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - (1 - t) * (1 - t); // ease-out-quad
      setVal(target * eased);
      if (t < 1) rafRef.current = requestAnimationFrame(tick);
      else setVal(target);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [trigger, target, duration]);
  return <>{val.toFixed(2)}%</>;
}

export default function StatsSection() {
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== "undefined" && window.innerWidth < 768
  );

  // Scroll-hijack state for the E-commerce/Quick Commerce Hotspot block.
  // Mirrors the pattern used in SpikeSection's Story block.
  //   "before" → hotspot block not yet reached
  //   "pinned" → hotspot block locked to viewport center, activeIdx advances
  //   "after"  → all data states shown, content released back into flow
  const [pinState, setPinState] = useState("before");
  const [activeIdx, setActiveIdx] = useState(0);
  const [hijackDist, setHijackDist] = useState(0);
  const [contentH, setContentH] = useState(0);

  const hotspotRef = useRef(null);        // outer wrapper (padded + minHeight)
  const hotspotInnerRef = useRef(null);   // positioning wrapper (fixed/absolute)
  const hotspotContentRef = useRef(null); // content box (for height measurement)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  /*
   * Mobile-switch cleanup — belt-and-suspenders clearing of any inline
   * styles the pin effect may have left on hotspotRef when the user resizes
   * from desktop to mobile. The hotspotRef wrapper is conditionally
   * rendered (desktop-only return), so in theory its unmount takes the
   * inline styles with it — but we've observed stale padding/minHeight
   * persisting across resize in some cases. This effect nukes the
   * dynamic properties unconditionally on mobile, and resets pin state
   * so the positioning wrapper doesn't carry over "pinned" or "after".
   */
  useEffect(() => {
    if (!isMobile) return;
    if (hotspotRef.current) {
      hotspotRef.current.style.minHeight = "";
      hotspotRef.current.style.paddingTop = "";
      hotspotRef.current.style.paddingBottom = "";
    }
    setPinState("before");
    setActiveIdx(0);
  }, [isMobile]);

  /*
   * Pin effect — same approach as the Story section in SpikeSection.js:
   *   - Extend wrapper's top/bottom padding so neighboring content is
   *     naturally pushed off-screen at the pin moment. No fullscreen mask
   *     required (a black mask is added only to hide the scrolling
   *     UnifiedBackground ellipses behind).
   *   - Extend wrapper's minHeight = topPad + contentH + bottomPad + hijackDist
   *     so the page has scroll room during the pin window.
   *   - Pin triggers when content's vertical midpoint reaches viewport center.
   *   - During pin: activeIdx = floor(progress * 2), so 0 → 1 as user
   *     scrolls through the hijack distance.
   *   - "after" places content absolute at top:(topPad + hijackDist) for
   *     zero visual jump at release.
   *
   * Mobile skipped entirely — mobile layout stacks both hotspots differently
   * and keeps activeIdx at 0.
   */
  useEffect(() => {
    if (isMobile) return;

    let hijackDistance = 0;
    let contentHeight = 0;
    let pinStartScrollY = 0;
    let topPadPx = 48;
    let bottomPadPx = 48;

    const measure = () => {
      const content = hotspotContentRef.current;
      const wrapper = hotspotRef.current;
      if (!content || !wrapper) return;

      // If the viewport has dropped to mobile width during a resize, clear
      // any inline styles we may have applied and bail out. This handles the
      // case where the user resizes the browser from desktop to mobile:
      // resize events fire BEFORE React re-renders to mobile JSX, and the
      // measure listener is still active. Without this guard, measure would
      // recompute (now larger) padding values for the shrinking viewport
      // and apply them right before the desktop wrapper unmounts — leaving
      // a transient gap that persists if the unmount cleanup races wrong.
      if (window.innerWidth < 768) {
        wrapper.style.minHeight = "";
        wrapper.style.paddingTop = "";
        wrapper.style.paddingBottom = "";
        return;
      }

      contentHeight = content.offsetHeight;
      setContentH(contentHeight);
      // Only 2 data states (E-commerce → Quick commerce), so a single
      // viewport-height of scroll room is enough to clearly separate them.
      hijackDistance = window.innerHeight * 1.0;
      setHijackDist(hijackDistance);

      const vh = window.innerHeight;
      const needed = Math.max(48, (vh - contentHeight) / 2 + 60);
      topPadPx = needed;
      bottomPadPx = needed;
      wrapper.style.paddingTop = `${topPadPx}px`;
      wrapper.style.paddingBottom = `${bottomPadPx}px`;
      wrapper.style.minHeight =
        `${topPadPx + contentHeight + bottomPadPx + hijackDistance}px`;
    };

    const onScroll = () => {
      const wrapper = hotspotRef.current;
      if (!wrapper) return;

      // Absolute page Y of wrapper (not offsetTop — that's relative to the
      // nearest positioned ancestor and would be wrong here).
      const wrapperAbsTop = wrapper.getBoundingClientRect().top + window.scrollY;
      pinStartScrollY =
        wrapperAbsTop + topPadPx + contentHeight / 2 - window.innerHeight / 2;

      const scrollY = window.scrollY;
      const pinEnd = pinStartScrollY + hijackDistance;

      if (scrollY < pinStartScrollY) {
        setPinState("before");
        setActiveIdx(0);
      } else if (scrollY >= pinEnd) {
        setPinState("after");
        setActiveIdx(HOTSPOT_DATA.length - 1);
      } else {
        setPinState("pinned");
        const p = (scrollY - pinStartScrollY) / hijackDistance;
        const idx = Math.min(
          HOTSPOT_DATA.length - 1,
          Math.floor(p * HOTSPOT_DATA.length)
        );
        setActiveIdx(idx);
      }
    };

    measure();
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", measure, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", measure);
      if (hotspotRef.current) {
        hotspotRef.current.style.minHeight = "";
        hotspotRef.current.style.paddingTop = "";
        hotspotRef.current.style.paddingBottom = "";
      }
    };
  }, [isMobile]);

  // Active hotspot data — used by both the mobile path (activeIdx stays 0)
  // and the desktop path (activeIdx changes via scroll hijack).
  const data = HOTSPOT_DATA[activeIdx];

  // Positioning style for the hotspotInnerRef wrapper based on pinState.
  // Same pattern as SpikeSection's Story block.
  const hotspotInnerStyle = isMobile
    ? {}
    : pinState === "pinned"
      ? {
          position: "fixed",
          top: `calc(50vh - ${contentH / 2}px)`,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          paddingLeft: "clamp(24px, 4vw, 64px)",
          paddingRight: "clamp(24px, 4vw, 64px)",
          boxSizing: "border-box",
          zIndex: 2,
        }
      : pinState === "after"
        ? {
            position: "absolute",
            top: `calc(max(48px, (100vh - ${contentH}px) / 2 + 60px) + ${hijackDist}px)`,
            left: 0,
            right: 0,
            display: "flex",
            justifyContent: "center",
            paddingLeft: "clamp(24px, 4vw, 64px)",
            paddingRight: "clamp(24px, 4vw, 64px)",
            boxSizing: "border-box",
          }
        : {};

  const renderCard = (m, i, isHighlight) => {
    const imgSrc = isHighlight ? "/assets/highlight-card.png" : "/assets/calender.png";
    return (
      <div key={i} style={{ position: "relative", opacity: 1, transform: "none", minWidth: 0, width: "100%" }}>
        <img src={imgSrc} alt="" style={{ width: "100%", display: "block", pointerEvents: "none", aspectRatio: "248/266", maxWidth: "100%", height: "auto" }} />
        <div style={{
          position: "absolute", top: "28%", bottom: "6%", left: 0, right: 0,
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
          gap: "6%", pointerEvents: "none",
        }}>
          {/*
           * month name:
           *   mobile: clamp(8px,3vw,14px) → clamp(6px,2.25vw,10.5px)
           *   desktop: 30px → 22.5px
           */}
          <div style={{
            color: "white",
            fontSize: isMobile ? "clamp(6px, 2.25vw, 10.5px)" : "22.5px",
            fontFamily: "Inter", letterSpacing: 0.3, fontWeight: 500, textAlign: "center",
          }}>
            {m.month}
          </div>
          {/*
           * percentage:
           *   mobile: clamp(11px,5vw,24px) → clamp(8.25px,3.75vw,18px)
           *   desktop: 30px → 22.5px
           */}
          <div style={{
            color: "white",
            fontSize: isMobile ? "clamp(8.25px, 3.75vw, 18px)" : "22.5px",
            fontWeight: 700, fontFamily: "Inter", lineHeight: 1, textAlign: "center",
          }}>
            {m.pct}
          </div>
        </div>
      </div>
    );
  };

  /* ── Mobile hotspot block ── */
  const MobileHotspots = () => (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%", gap: 0, opacity: 1, transform: "none" }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {/* icon: 60×60 → 45×45 */}
          <img src="/assets/delivery.png" alt="" style={{ width: 45, height: 45, objectFit: "contain" }} />
          {/* label: 22px → 16.5px */}
          <span style={{ color: "white", fontSize: 16.5, fontWeight: 600, fontFamily: "Inter", lineHeight: 1.3 }}>
            Delivery<br />Partners
          </span>
        </div>
        {/* state: 22px → 16.5px */}
        <div style={{ color: "#e53e3e", fontSize: 16.5, fontWeight: 600, fontFamily: "Inter", marginTop: 12 }}>{data.leftState}</div>
        {/* pct: 48px → 36px */}
        <div style={{ color: "white", fontSize: "36px", fontWeight: 700, fontFamily: "Inter", lineHeight: 1 }}>{data.leftPct.toFixed(2)}%</div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, margin: "24px 0" }}>
        {/* centerText: 17px → 12.75px (triangles removed) */}
        <span style={{ color: "white", fontSize: 12.75, fontWeight: 700, fontFamily: "Inter", letterSpacing: 0.3 }}>{data.centerText}</span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {/* icon: 60×60 → 45×45 */}
          <img src="/assets/truck_driver.png" alt="" style={{ width: 45, height: 45, objectFit: "contain" }} />
          {/* label: 22px → 16.5px */}
          <span style={{ color: "white", fontSize: 16.5, fontWeight: 600, fontFamily: "Inter", lineHeight: 1.3 }}>
            Truck<br />Drivers
          </span>
        </div>
        {/* state: 22px → 16.5px */}
        <div style={{ color: "#e53e3e", fontSize: 16.5, fontWeight: 600, fontFamily: "Inter", marginTop: 12 }}>{data.rightState}</div>
        {/* pct: 48px → 36px */}
        <div style={{ color: "white", fontSize: "36px", fontWeight: 700, fontFamily: "Inter", lineHeight: 1 }}>{data.rightPct.toFixed(2)}%</div>
      </div>
    </div>
  );

  // ── MOBILE ──
  if (isMobile) {
    return (
      <div style={{ background: "transparent", width: "100%" }}>
        <div style={{
          background: "transparent", display: "flex", flexDirection: "column",
          alignItems: "center", boxSizing: "border-box", width: "100%",
        }}>
          {/* Title 1: 24px to match Geographic Risk Concentration */}
          <h2 className="text-[24px]" style={{
            fontFamily: "'Inter'", fontWeight: 700, color: "white",
            margin: "0 0 28px", textAlign: "center", lineHeight: 1.1,
            width: "100%", opacity: 1, transform: "none",
            fontSize: "24px",
          }}>
            E-commerce & Quick <br /> Commerce Risk Hotspots
          </h2>

          <MobileHotspots />

          {/* Title 2: 24px to match Geographic Risk Concentration */}
          <h2 className="text-[24px]" style={{
            fontFamily: "Inter", fontWeight: 700, color: "white",
            margin: "32px 0 8px", textAlign: "center", lineHeight: 1.1,
            opacity: 1, transform: "none", width: "100%",
            fontSize: "24px",
          }}>
            Seasonal Risk Spikes
          </h2>

          {/* subtitle: 11px → 8.25px */}
          <p style={{
            color: "white", margin: "0 0 24px", textAlign: "center",
            fontFamily: "Inter", opacity: 1,
            fontSize: "8.25px", lineHeight: 1.3, maxWidth: "100%",
          }}>
            A cyclical view of how risk rates spike and decline throughout the year.
          </p>

          <div style={{
            display: "grid", gridTemplateColumns: "repeat(4, 1fr)",
            gap: "clamp(4px, 2vw, 10px)", width: "100%",
            boxSizing: "border-box", padding: "0 4px",
          }}>
            {MONTHS.map((m, i) => renderCard(m, i, false))}
            {HighlightMONTHS.map((m, i) => renderCard(m, i + MONTHS.length, true))}
          </div>

          {/* footer note: 13px → 9.75px */}
          <p style={{
            textAlign: "center", marginTop: 20, fontFamily: "Inter",
            color: "rgba(255,255,255,1)", fontWeight: 600,
            opacity: 1, width: "100%", padding: "0 8px", marginBottom: 0,
            fontSize: "9.75px", boxSizing: "border-box",
          }}>
            Risk rates remain consistent throughout the year for all segments,{" "}
            <span style={{ color: "#CE1010" }}>except for September to December.</span>
          </p>
        </div>
      </div>
    );
  }

  // ── DESKTOP ──
  return (
    <div style={{ position: "relative" }}>
      {/*
       * HOTSPOT BLOCK — wrapped in hotspotRef so it can be pinned. The
       * wrapper gets dynamic topPad/bottomPad/minHeight applied via JS,
       * and we use the same three-state pin machine (before/pinned/after)
       * as the Story section.
       *
       * The pin-mask (full-viewport #000 layer) is rendered only during
       * "pinned" state to hide the scrolling UnifiedBackground ellipses
       * behind the fixed content.
       */}
      <div
        ref={hotspotRef}
        style={{
          position: "relative",
          background: "transparent",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          // Desktop uses flex-start because the dynamic minHeight makes the
          // wrapper much taller than content; center would float content
          // to the middle of that tall box, creating a gap above.
          justifyContent: "flex-start",
          boxSizing: "border-box",
          width: "100%",
          // Side padding matches original `padding: "24px clamp(24px, 4vw, 64px) 36px"`.
          // Top/bottom padding are set dynamically via measure() in the
          // useEffect above.
          paddingLeft: "clamp(24px, 4vw, 64px)",
          paddingRight: "clamp(24px, 4vw, 64px)",
        }}
      >
        {pinState === "pinned" && (
          <div
            aria-hidden="true"
            style={{
              position: "fixed",
              inset: 0,
              background: "#000",
              pointerEvents: "none",
              zIndex: 1,
            }}
          />
        )}

        <div
          ref={hotspotInnerRef}
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            ...hotspotInnerStyle,
          }}
        >
          <div
            ref={hotspotContentRef}
            style={{
              width: "100%",
              maxWidth: "min(1300px, 100%)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            {/* Title 1 h2 — 60px to match Geographic Risk Concentration heading */}
            <h2
              style={{
                fontFamily: "'Inter'", fontWeight: 700, color: "white",
                margin: "0 0 24px", textAlign: "center", lineHeight: 1.08,
                maxWidth: "min(1400px, 100%)", opacity: 1, transform: "none",
                fontSize: "60px",
              }}
            >
              E-commerce & Quick<br />Commerce Risk Hotspots
            </h2>

            {/* Hotspot Row — desktop */}
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "center",
              width: "1100px", maxWidth: "min(1300px, 100%)",
              marginBottom: 0, opacity: 1, transform: "none",
            }}>
              {/* Delivery Partners */}
              <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 6 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <img src="/assets/delivery.png" alt="" style={{ width: 60, height: 60, objectFit: "contain" }} />
                  <span style={{ color: "white", fontSize: "clamp(12px, 1.2vw, 18px)", fontWeight: 600, fontFamily: "Inter", lineHeight: 1.3 }}>
                    Delivery<br />Partners
                  </span>
                </div>
                <div style={{ color: "#e53e3e", fontSize: "clamp(12px, 1.2vw, 18px)", fontWeight: 600, fontFamily: "Inter", marginTop: 18 }}>{data.leftState}</div>
                <div style={{ color: "white", fontSize: "clamp(30px, 3.375vw, 48.75px)", fontWeight: 700, fontFamily: "Inter", lineHeight: 1 }}>
                  {/* CountUp re-animates from 0 → data.leftPct every time
                      activeIdx changes (E-commerce ↔ Quick commerce swap). */}
                  <CountUp target={data.leftPct} trigger={activeIdx} duration={1000} />
                </div>
              </div>

              {/* Center label */}
              <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 6 }}>
                <span style={{ color: "white", fontSize: "clamp(10.5px, 1.05vw, 15px)", fontWeight: 700, fontFamily: "Inter", letterSpacing: 0.3 }}>{data.centerText}</span>
              </div>

              {/* Truck Drivers */}
              <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <img src="/assets/truck_driver.png" alt="" style={{ width: 60, height: 60, objectFit: "contain" }} />
                  <span style={{ color: "white", fontSize: "clamp(12px, 1.2vw, 18px)", fontWeight: 600, fontFamily: "Inter", lineHeight: 1.3 }}>
                    Truck<br />Drivers
                  </span>
                </div>
                <div style={{ color: "#e53e3e", fontSize: "clamp(12px, 1.2vw, 18px)", fontWeight: 600, fontFamily: "Inter", marginTop: 18 }}>{data.rightState}</div>
                <div style={{ color: "white", fontSize: "clamp(30px, 3.375vw, 48.75px)", fontWeight: 700, fontFamily: "Inter", lineHeight: 1 }}>
                  <CountUp target={data.rightPct} trigger={activeIdx} duration={1000} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/*
       * SEASONAL RISK SPIKES — separate wrapper, normal flow. No pin, no
       * dynamic padding. Keeps the original look for everything below
       * the hotspot block.
       */}
      <div style={{
        position: "relative", overflow: "hidden", background: "transparent",
        display: "flex", flexDirection: "column", alignItems: "center",
        boxSizing: "border-box", width: "100%",
        padding: "24px clamp(24px, 4vw, 64px) 36px",
      }}>
        {/* Title 2 — 60px to match Geographic Risk Concentration heading */}
        <h2
          className="pt-12"
          style={{
            fontFamily: "Inter", fontWeight: 700, color: "white",
            margin: "0 0 8px", textAlign: "center", lineHeight: "115%",
            opacity: 1, transform: "none",
            fontSize: "60px",
            maxWidth: "min(1400px, 100%)",
          }}
        >
          Seasonal Risk Spikes
        </h2>

        {/* subtitle */}
        <p style={{
          color: "white", margin: "0 0 24px", textAlign: "center",
          fontFamily: "Inter", opacity: 1,
          fontSize: "clamp(12px, 1.5vw, 22.5px)", lineHeight: "150%",
          maxWidth: "min(900px, 100%)",
        }}>
          A cyclical view of how risk rates spike and decline throughout the year.
        </p>

        <div style={{
          display: "grid", gridTemplateColumns: "repeat(6, 1fr)",
          gap: "clamp(4px, 1.2vw, 24px)",
          width: "100%", maxWidth: "min(1100px, 100%)",
          boxSizing: "border-box",
        }}>
          {MONTHS.map((m, i) => renderCard(m, i, false))}
          {HighlightMONTHS.map((m, i) => renderCard(m, i + MONTHS.length, true))}
        </div>

        {/* footer note */}
        <p style={{
          textAlign: "center", marginTop: 28, fontFamily: "Inter",
          color: "rgba(255,255,255,1)", fontWeight: 600, opacity: 1,
          maxWidth: "min(1100px, 100%)", marginBottom: 40,
          fontSize: "clamp(12px, 1.5vw, 22.5px)", boxSizing: "border-box",
        }}>
          Risk rates remain consistent throughout the year for all segments,<br />
          <span style={{ color: "#CE1010" }}>except for September to December.</span>
        </p>
      </div>
    </div>
  );
}