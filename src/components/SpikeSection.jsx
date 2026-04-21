import { useEffect, useRef, useState } from "react";
import { useInView } from "./helpers";

const SPIKES = [
  { id: 1, label: "Festive hiring surges", img: "/assets/spike1.png" },
  { id: 2, label: "Inventory scale-up", img: "/assets/spike2.png" },
  {
    id: 3,
    label: "Accelerated onboarding cycles & compromised verification processes",
    img: "/assets/spike3.png",
    wide: true,
  },
];

const INSIGHTS = [
  {
    id: 1,
    title: "The Middle-mile has the highest risk concentration of any segment",
    body: "Truck drivers operate across multiple states, making criminal and accident records harder to track. Local police checks often miss interstate cases. Add direct access to high-value goods, and the middle-mile becomes one of the most risk-prone segments of the gig economy.",
  },
  {
    id: 2,
    title: "Higher age corresponds to higher risk",
    body: "Despite being older on average, truck drivers exhibit the highest risk rates, indicating that risk correlates more with operational factors mentioned above than age alone.",
  },
  {
    id: 3,
    title: "External hiring agencies often take verification shortcuts",
    body: "Many drivers are hired through contractors or informal hubs with minimal documentation. Identity and license checks are sometimes limited to verbal assurances rather than robust background screening. This increases the chances of red flags emerging later.",
  },
  {
    id: 4,
    title: "High-risk delivery partners compromise customer safety",
    body: "Delivery partners interact with customers daily. In regions like Maharashtra, where risk rates cross 7%, the probability of fraud, theft, or misconduct rises. Every instance can directly affect customer trust.",
  },
  {
    id: 5,
    title: "Shorter onboarding cycles often result in weaker verification systems",
    body: "During peak seasons, thousands of delivery partners are onboarded rapidly. The focus is often shifted to speed over safety. As a result, companies skip deeper verification.",
  },
  {
    id: 6,
    title: "The nature of dark stores may contribute to lower risk",
    body: "Dark store employees operate in supervised locations with no direct customer interaction. Their relatively younger age also reduces the likelihood of criminal involvement. Many companies also conduct mandatory PCC verifications for these employees.",
  },
];

function SpikeCard({ item, delay, visible, isMobile }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: isMobile ? 12 : 18,
      backgroundImage: "linear-gradient(rgb(29, 29, 29), rgb(33, 33, 33))",
      borderRadius: 14,
      border: "1px solid white",
      padding: isMobile ? "8px 12px" : "10px 18px",
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0)" : "translateY(24px)",
      transition: `opacity 0.55s ${delay}s, transform 0.55s ${delay}s`,
    }}>
      <div style={{
        flexShrink: 0,
        width: isMobile ? 36 : 51,
        height: isMobile ? 36 : 51,
        background: "white",
        borderRadius: 12,
        display: "flex", alignItems: "center", justifyContent: "center",
        overflow: "hidden",
      }}>
        <img
          src={item.img}
          alt={item.label}
          style={{ width: isMobile ? 27 : 39, height: isMobile ? 27 : 39, objectFit: "contain" }}
        />
      </div>
      <span style={{
        fontFamily: "Inter",
        fontSize: isMobile ? "clamp(9px, 2.625vw, 10.5px)" : "clamp(11.25px, 0.86vw, 14.25px)",
        fontWeight: 500, color: "white", lineHeight: 1.4,
      }}>
        {item.label}
      </span>
    </div>
  );
}

export default function SpikesSection() {
  const [spikesRef, spikesVisible] = useInView(0.2);
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== "undefined" && window.innerWidth < 768
  );
  const [activeIdx, setActiveIdx] = useState(0);
  // Scroll-hijack state:
  //   "before" → section not yet reached, content flows in normal position
  //   "pinned" → section reached, content fixed to viewport while scroll advances activeIdx
  //   "after"  → all insights shown, content released at top:hijackDist inside
  //              the wrapper so it transitions seamlessly from pinned (zero jump).
  const [pinState, setPinState] = useState("before");
  const [hijackDist, setHijackDist] = useState(0);
  // Measured content height — used at render time to compute the centered
  // vertical position of the content when pinned and the offset after release.
  const [contentH, setContentH] = useState(0);
  const storyRef = useRef(null);        // outer wrapper (minHeight-extended)
  const storyInnerRef = useRef(null);   // positioning wrapper (gets fixed/absolute)
  // Separate ref for measuring the actual content height. storyInnerRef is the
  // positioning wrapper whose size changes with pinState (fixed + 100vh when
  // pinned), so we can't measure it reliably. This ref points to the real
  // content div which stays the same size throughout.
  const storyContentRef = useRef(null);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  /*
   * Mobile auto-cycle — restores the original 3-second rotation through
   * insights. Only runs on mobile; desktop drives activeIdx via scroll
   * hijack (see the pin effect below) and must not have a timer fighting it.
   */
  useEffect(() => {
    if (!isMobile) return;
    const timer = setInterval(() => {
      setActiveIdx((i) => (i + 1) % INSIGHTS.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [isMobile]);

  /*
   * Mobile-switch cleanup — belt-and-suspenders clearing of any inline
   * styles the pin effect may have left on storyRef when the user resizes
   * from desktop to mobile. The pin effect's own cleanup should handle
   * this, but in practice we've seen stale padding-top/padding-bottom
   * persist across resize on some browsers (likely due to CSS shorthand/
   * longhand interaction with React's style diffing). This effect runs
   * every time isMobile flips, and unconditionally nukes the three
   * dynamic properties on mobile.
   *
   * Also clears pinState back to "before" on mobile so the positioning
   * wrapper doesn't carry over a stale "pinned" or "after" state.
   */
  useEffect(() => {
    if (!isMobile) return;
    if (storyRef.current) {
      storyRef.current.style.minHeight = "";
      storyRef.current.style.paddingTop = "";
      storyRef.current.style.paddingBottom = "";
    }
    setPinState("before");
    setActiveIdx(0);
  }, [isMobile]);

  /*
   * Scroll-jack the Story section on desktop.
   *
   * Approach:
   *   - storyRef points to the OUTER wrapper. We dynamically set minHeight =
   *     contentHeight + hijackDistance so the page has extra scroll room
   *     AFTER the content. Combined with justifyContent: flex-start on the
   *     outer, the content sits at the top of the wrapper and the extra
   *     space is all below it.
   *
   *   - Pin triggers when the content would be vertically CENTERED in the
   *     viewport (not when the wrapper's top hits viewport top). This means
   *     the content flows naturally into view, reaches viewport center, and
   *     locks there — seamless entry, no visual jump.
   *
   *     pinStartScrollY = wrapperAbsTop + 48 + contentHeight/2 - viewportHeight/2
   *
   *     (wrapperAbsTop + 48 is where content starts, +contentHeight/2 puts us
   *     at content's vertical midpoint, minus viewportHeight/2 gives the
   *     scrollY value at which that midpoint aligns with viewport center.)
   *
   *   - During pin, storyInnerRef becomes position: fixed + top:(vh-contentH)/2
   *     + background: #000 (full-viewport opaque backdrop). Scroll delta
   *     within hijackDistance advances activeIdx.
   *
   *   - After (scrollY >= pinStart + hijackDist): storyInnerRef becomes
   *     position: absolute + top:(48 + hijackDist) relative to wrapper.
   *     At the transition frame this places content at the exact same
   *     viewport position it had in pinned state — zero visual jump.
   *
   * On mobile we skip this entirely.
   */
  useEffect(() => {
    if (isMobile) return;

    let hijackDistance = 0;
    let contentHeight = 0;
    let pinStartScrollY = 0;
    let topPadPx = 48;    // will be recomputed in measure()
    let bottomPadPx = 48;

    const measure = () => {
      const content = storyContentRef.current;
      const wrapper = storyRef.current;
      if (!content || !wrapper) return;

      // If the viewport has dropped to mobile width during a resize, clear
      // any inline styles we may have applied and bail out. Without this,
      // a measure() fired during the resize gesture (before checkMobile
      // updates state and React re-renders to mobile JSX) would recompute
      // padding based on the shrinking viewport and apply it to the
      // soon-to-unmount desktop wrapper — leaving a transient gap.
      if (window.innerWidth < 768) {
        wrapper.style.minHeight = "";
        wrapper.style.paddingTop = "";
        wrapper.style.paddingBottom = "";
        return;
      }

      contentHeight = content.offsetHeight;
      setContentH(contentHeight);
      // Each insight gets ~40% of viewport height of scroll room before
      // advancing. 6 insights × 0.4vh = 240vh total hijack scroll.
      hijackDistance = window.innerHeight * INSIGHTS.length * 0.4;
      setHijackDist(hijackDistance);

      // Compute top/bottom padding so neighboring sections are naturally
      // hidden at the pin moment — no need to cover them with a black box.
      //
      // At pin start, content is at viewport center. For the previous
      // section to be hidden above, the wrapper's top edge must be at/above
      // viewport top. That requires:
      //   topPad >= (viewportH - contentH) / 2
      //
      // Same logic for bottomPad at pin end. We use max(48, ...) so that
      // the original 48px baseline is never reduced on large screens.
      const vh = window.innerHeight;
      const needed = Math.max(48, (vh - contentHeight) / 2 + 60);
      // +60 as safety margin so the edges of previous/next sections aren't
      // flickering into view right at the pin boundaries.
      topPadPx = needed;
      bottomPadPx = needed;
      wrapper.style.paddingTop = `${topPadPx}px`;
      wrapper.style.paddingBottom = `${bottomPadPx}px`;

      // Extend wrapper so the page has scroll room during the pin window.
      // Total height = topPad + contentH + bottomPad + hijackDist.
      // minHeight achieves this (padding adds to content height already).
      wrapper.style.minHeight = `${topPadPx + contentHeight + bottomPadPx + hijackDistance}px`;
    };

    const onScroll = () => {
      const wrapper = storyRef.current;
      if (!wrapper) return;

      // Compute pinStartScrollY fresh every scroll (not cached from measure)
      // so late layout shifts from images/fonts don't leave it stale.
      //
      // wrapper.getBoundingClientRect().top + window.scrollY gives the true
      // absolute page Y of the wrapper. offsetTop does NOT — it's relative
      // to the nearest positioned ancestor (in this case UnifiedBackground),
      // which caused pin to trigger far too early in the previous version.
      //
      // Pin starts when content's vertical midpoint = viewport center:
      //   wrapperAbsTop + topPad + contentH/2 = scrollY + viewportH/2
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
        setActiveIdx(INSIGHTS.length - 1);
      } else {
        setPinState("pinned");
        const p = (scrollY - pinStartScrollY) / hijackDistance;
        const idx = Math.min(INSIGHTS.length - 1, Math.floor(p * INSIGHTS.length));
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
      if (storyRef.current) {
        storyRef.current.style.minHeight = "";
        storyRef.current.style.paddingTop = "";
        storyRef.current.style.paddingBottom = "";
      }
    };
  }, [isMobile]);

  const nextIdx = (activeIdx + 1) % INSIGHTS.length;

  // Positioning style for the storyInnerRef wrapper based on pinState.
  //
  // When "pinned": position: fixed; top: calc(50vh - contentH/2). The content
  //   is placed at the viewport's vertical center. NO background color, NO
  //   100vw/100vh mask — the wrapper's extra top/bottom padding naturally
  //   pushes neighboring sections out of view, so there's nothing behind
  //   the fixed content that needs hiding. This avoids the "jump to full
  //   screen" effect from the previous approach.
  //
  // When "after":  absolute at top:(topPadPx + hijackDist) relative to the
  //   wrapper. At the pinned→after transition, pinned content sat at
  //   viewport-Y (50vh - contentH/2). Absolute-page-Y = scrollY + that =
  //   wrapperAbsTop + topPad + hijackDist. Relative to wrapper → topPad +
  //   hijackDist. Zero visual jump.
  //
  // When "before": {} — normal flex layout in outer wrapper.
  const storyInnerStyle = isMobile
    ? {}
    : pinState === "pinned"
      ? {
          position: "fixed",
          top: `calc(50vh - ${contentH / 2}px)`,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          paddingLeft: 60,
          paddingRight: 60,
          boxSizing: "border-box",
          zIndex: 2,
        }
      : pinState === "after"
        ? {
            position: "absolute",
            // topPad is dynamic; we read it from contentH-derived calc here.
            // At pin-end, content's page-Y was wrapperAbsTop + topPad +
            // hijackDist. Relative-to-wrapper top = topPad + hijackDist.
            // topPad is max(48, (vh - contentH)/2 + 20). We recompute it
            // inline here rather than plumbing through another state var.
            top: `calc(max(48px, (100vh - ${contentH}px) / 2 + 60px) + ${hijackDist}px)`,
            left: 0,
            right: 0,
            display: "flex",
            justifyContent: "center",
            paddingLeft: 60,
            paddingRight: 60,
            boxSizing: "border-box",
          }
        : {};

  return (
    <>
      {/* ══ 1. SPIKES SECTION ══ */}
      <section style={{
        background: "transparent",
        padding: "10px 5vw 0px",
        display: "flex", flexDirection: "column", alignItems: "center",
        textAlign: "center",
      }}>
        <h2 style={{
          fontFamily: "Inter",
          fontSize: isMobile ? "11.25px" : "22.5px",
          fontWeight: 700, color: "white",
          marginBottom: 48, lineHeight: isMobile ? 1.3 : "150%",
        }}>
          These spikes typically occur due to
        </h2>

        <div ref={spikesRef} style={{
          width: "100%", maxWidth: 1040,
          display: "grid", gridTemplateColumns: "1fr 1fr",
          gap: isMobile ? 12 : 18, marginBottom: 48,
        }}>
          {SPIKES.slice(0, 2).map((item, i) => (
            <SpikeCard key={item.id} item={item} delay={0.1 * i} visible={spikesVisible} isMobile={isMobile} />
          ))}
          <div style={{ gridColumn: "1 / -1" }}>
            <SpikeCard item={SPIKES[2]} delay={0.22} visible={spikesVisible} isMobile={isMobile} />
          </div>
        </div>

        <p style={{
          fontFamily: "Inter",
          fontSize: isMobile ? "8.25px" : "22.5px",
          fontWeight: 300, color: "rgba(255,255,255,1)",
          lineHeight: isMobile ? "16.5px" : "28.5px", maxWidth: 1100,
          opacity: spikesVisible ? 1 : 0,
          transform: spikesVisible ? "translateY(0)" : "translateY(16px)",
          transition: "opacity 0.55s 0.38s, transform 0.55s 0.38s",
          marginBottom: 40,
        }}>
          When hiring volume spikes, verification compromises follow and{" "}
          <strong style={{ color: "#CE1010" }}>risk rates</strong>{" "}
          <br className="sm:flex hidden" />
          inch upward. Even a <strong style={{ color: "white" }}>0.3%</strong>{" "}
          increase at scale translates into{" "}
          <strong style={{ color: "#CE1010" }}>thousands</strong>
          <br className="sm:flex hidden" />
          of additional high-risk profiles entering the ecosystem.
        </p>
      </section>

      {/* ══ 2. STORY SECTION ══ */}
      {/*
       * storyRef → outer wrapper. minHeight is set dynamically on desktop to
       * (contentHeight + hijackDistance), creating scroll room AFTER the
       * content. justifyContent is flipped from center to flex-start on
       * desktop so content sits at the top, not floated to the middle of
       * the tall wrapper (which would create a visible empty gap above).
       *
       * storyInnerRef → positioning wrapper. Gets storyInnerStyle applied:
       *   before → {} (normal flow)
       *   pinned → position: fixed; viewport-wide, centers its child
       *   after  → position: absolute; top:hijackDist
       *
       * storyContentRef → the actual content (row with left + right panels),
       * used only for height measurement. Its maxWidth: 1100 is preserved.
       */}
      <div ref={storyRef} style={{
        background: "transparent",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        // Desktop uses flex-start because the dynamic minHeight makes the
        // wrapper much taller than the content; center would float content
        // to the middle of that tall box, creating a visible gap above.
        // Mobile is untouched (no minHeight override, no hijack).
        justifyContent: isMobile ? "center" : "flex-start",
        padding: isMobile ? "24px 20px" : "48px 60px",
        boxSizing: "border-box",
        position: "relative",
      }}>
        {/*
         * Pin-mask: when pinned, the outer wrapper is still scrolling with
         * the page (the fixed content stays put, but everything else in the
         * wrapper — including the UnifiedBackground ellipses behind it —
         * scrolls normally). That makes the ellipses visibly drift past
         * behind the static content, which looks wrong.
         *
         * This fixed black layer covers the full viewport and sits BEHIND
         * the content (zIndex: 1 vs content's zIndex: 2), so during pin
         * the ellipses are hidden. Only rendered when pinned, so there's
         * no DOM/layout impact in before/after states.
         */}
        {!isMobile && pinState === "pinned" && (
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
        <div ref={storyInnerRef} style={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          ...storyInnerStyle,
        }}>
        <div ref={storyContentRef} style={{
          width: "100%", maxWidth: 1100,
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          alignItems: isMobile ? "center" : "stretch",
          // gap: isMobile ? 0 : "4vw",
        }}>

          {/* Left Panel */}
          <div style={{
            width: isMobile ? "100%" : "48%",
            flexShrink: 0,
            display: "flex", flexDirection: "column",
            justifyContent: isMobile ? "flex-start" : "space-between",
            paddingTop: 8, paddingBottom: isMobile ? 20 : 8,
            textAlign: isMobile ? "center" : "left",
          }}>
            <div>
              <h2 style={{
                fontFamily: "Inter", fontWeight: 700, color: "white",
                fontSize: isMobile ? "30px" : "75px",
                lineHeight: isMobile ? 1.1 : 1.0,
                margin: isMobile ? "0 0 16px" : "0 0 24px",
                letterSpacing: isMobile ? "-0.5px" : "-2px",
              }}>
                {isMobile ? (
                  <>The Story Behind<br />the Data</>
                ) : (
                  <>The Story<br />Behind<br />the Data</>
                )}
              </h2>

              <p style={{
                fontFamily: "Inter",
                fontSize: isMobile ? "11px" : "19.5px",
                color: "rgba(255,255,255,0.9)",
                lineHeight: isMobile ? 1.55 : "115%",
                margin: isMobile ? "0 auto 20px" : "0 0 32px",
                maxWidth: isMobile ? "80%" : 340,
                fontWeight: 300,
              }}>
                After analyzing all the numbers, we identified a few observations
                across the segments of truck drivers, delivery partners, and dark
                store employees.
              </p>  
            </div>


          </div>

                    {/* Right Panel */}
          <div style={{
            flex: 1, display: "flex", flexDirection: "column",
            justifyContent: "center",
            minHeight: isMobile ? 220 : 180, width: isMobile ? "100%" : "auto",
            position: "relative",
            paddingRight: isMobile ? 0 : 40,
            paddingLeft: 0,
            textAlign: "left",
          }}>
            {/* Desktop-only progress bar — anchored to outer panel, full height */}
            {!isMobile && (
              <div style={{
                position: "absolute", top: 0, right: 0,
                width: 2, height: "100%",
                background: "rgba(255,255,255,0.12)", borderRadius: 2, overflow: "hidden",
              }}>
                <div style={{
                  width: "100%",
                  height: `${((activeIdx + 1) / INSIGHTS.length) * 100}%`,
                  background: "#CE1010", borderRadius: 2,
                  transition: "height 0.3s ease",
                }} />
              </div>
            )}

            {/* Inner wrapper: narrower, centered on the page,
                so block sits center but text inside is left-aligned */}
            <div style={{
              position: "relative",
              width: isMobile ? 260 : "auto",
              margin: isMobile ? "0 auto" : 0,
              paddingRight: isMobile ? 16 : 0,
            }}>
              {/* Mobile-only progress bar — anchored to inner wrapper, content height */}
              {isMobile && (
                <div style={{
                  position: "absolute", top: 0, right: -15,
                  width: 2, height: "100%",
                  background: "rgba(255,255,255,0.12)", borderRadius: 2, overflow: "hidden",
                }}>
                  <div style={{
                    width: "100%",
                    height: `${((activeIdx + 1) / INSIGHTS.length) * 100}%`,
                    background: "#CE1010", borderRadius: 2,
                    transition: "height 0.3s ease",
                  }} />
                </div>
              )}

              <div key={activeIdx} style={{ animation: "fadeSlideIn 0.45s ease forwards" }}>
                {/* Active insight */}
                <div style={{ marginBottom: isMobile ? 20 : 32 }}>
                  <h3 style={{
                    fontFamily: "Inter",
                    fontSize: isMobile ? "13px" : "19.5px",
                    fontWeight: 700, color: "white",
                    margin: isMobile ? "0 0 8px" : "0 0 12px",
                    lineHeight: 1.4,
                  }}>
                    {INSIGHTS[activeIdx].title}
                  </h3>
                  <p style={{
                    fontFamily: "Inter",
                    fontSize: isMobile ? "10.5px" : "19.5px",
                    color: "rgba(255,255,255,0.9)",
                    margin: 0,
                    fontWeight: 300,
                    lineHeight: isMobile ? 1.55 : "115%",
                  }}>
                    {INSIGHTS[activeIdx].body}
                  </p>
                </div>

                {/* Next insight preview */}
                <div>
                  <h3 style={{
                    fontFamily: "Inter",
                    fontSize: isMobile ? "11.5px" : "19.5px",
                    fontWeight: 600, color: "#f4f4f4",
                    opacity: 0.55,
                    margin: 0,
                    lineHeight: 1.4,
                  }}>
                    {INSIGHTS[nextIdx].title}
                  </h3>
                </div>
              </div>
            </div>
          </div>
      </div>
      </div>
      </div>

      <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  );
}