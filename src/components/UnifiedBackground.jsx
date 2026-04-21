import { useEffect, useState } from "react";

/**
 * UnifiedBackground
 * Wraps every section from "The Fraud Behind the Workforce" through the Footer
 * with a single black background and decorative blue Ellipse glows positioned
 * relative to the wrapper (so they stay anchored to content, not the viewport).
 *
 * The ellipses are absolutely positioned by percentage so they track the
 * content vertically across screen sizes. Sizes are clamped so they look
 * proportional on both mobile and desktop.
 */
export default function UnifiedBackground({ children }) {
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== "undefined" && window.innerWidth < 768
  );

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", onResize, { passive: true });
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Each ellipse is anchored by % of the wrapper height. Side offsets push
  // them ~60% off-screen so only ~40% of the glow shows on the page.
  // Sizes shrink on mobile to keep them from dominating the layout.
  const ellipseSize = isMobile ? 320 : 720;
  // Side offset = -60% of full size (so 60% of circle is off-screen, 40% visible)
  const sideOffset = -ellipseSize * 0.6;

  const ellipses = [
    // Right side, below graph.gif so it doesn't collide with the chart
    { top: "5%", side: "right", offset: sideOffset },
    // Around "People in focus" / Geographic
    //{ top: "18%", side: "left", offset: sideOffset },
    // Around "E-commerce & Quick Commerce Risk Hotspots"
    //{ top: "32%", side: "right", offset: sideOffset },
    // Around "Seasonal Risk Spikes" / "The Story Behind the Data"
    //{ top: "46%", side: "left", offset: sideOffset },
    // Around the "Every fraudulent" / ₹1.21 Crore block
    { top: "58%", side: "right", offset: sideOffset },
    // Around Case Files
    { top: "70%", side: "left", offset: sideOffset },
    // Around Timeline of events / GPS Spoofer (kept above Way Forward)
    { top: "76%", side: "right", offset: sideOffset },
  ];

  return (
    <div
      style={{
        position: "relative",
        background: "#000",
        overflow: "hidden",
      }}
    >
      {/* Decorative ellipse glows — anchored to wrapper, not viewport */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          zIndex: 0,
          overflow: "hidden",
        }}
      >
        {ellipses.map((e, i) => (
          <img
            key={i}
            src="/assets/Ellipse.png"
            alt=""
            style={{
              position: "absolute",
              top: e.top,
              [e.side]: e.offset,
              width: ellipseSize,
              height: ellipseSize,
              objectFit: "contain",
              opacity: isMobile ? 0.7 : 0.9,
              userSelect: "none",
            }}
          />
        ))}
      </div>

      {/* Actual page content */}
      <div style={{ position: "relative", zIndex: 1 }}>{children}</div>
    </div>
  );
}
