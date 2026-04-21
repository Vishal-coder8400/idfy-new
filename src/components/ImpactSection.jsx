import { useEffect, useRef, useState } from "react";
import { clamp } from "./helpers";
import "../index.css";

export default function ImpactSection() {
  const [progress, setProgress] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const el = sectionRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const p = clamp(-rect.top / (el.offsetHeight - window.innerHeight), 0, 1);
      setProgress(p);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div ref={sectionRef} style={{ height: "auto", position: "relative" }}>
      <div
        style={{
          position: "relative",
          top: 0,
          height: "auto",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Top half — transparent (unified BG handles dark backdrop) */}
        <div
          style={{
            flex: 1,
            background: "transparent",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "flex-end",
            padding: isMobile ? "30px 10px 30px" : "54px 60px 90px", // reduced by 25%
            textAlign: "center",
          }}
        >
          {/* Ellipse handled by UnifiedBackground wrapper */}

          {/* Faint grid */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              zIndex: 0,
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px)," +
                "linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)",
              backgroundSize: "60px 60px", // reduced from 80px
              pointerEvents: "none",
            }}
          />

          <div
            className="impact-content"
            style={{
            position: "relative",
            zIndex: 1,
            width: "100%",
            maxWidth: 900, // reduced from 1200
            }}
          >
            {/* Title */}
            <h2
              style={{
                fontFamily: "Inter",
                fontSize: isMobile ? "16.5px" : "45px", // reduced by 25%
                fontWeight: 700,
                color: "white",
                margin: isMobile ? "0 0 15px" : "0 0 27px", // reduced by 25%
                lineHeight: isMobile ? 1.2 : "115%",
              }}
            >
              The Impact of the fraud We Caught
            </h2>

            {/* Para 1 */}
            <p
              style={{
                color: "rgba(255,255,255,0.78)",
                fontSize: isMobile ? "9px" : "22.5px", // reduced by 25%
                lineHeight: isMobile ? 1.5 : "115%",
                margin: isMobile ? "0 auto 15px" : "0 auto 30px", // reduced by 25%
                maxWidth: 743, // reduced from 990
                fontFamily: "Inter",
              }}
            >
              Even one missed red flag in any of these segments can increase the
              risk of{" "}
              <br className="sm:flex hidden" />
              high-value cargo being stolen, a customer being mistreated, or
              possible <br className="sm:flex hidden" />
              food adulteration in a dark store. Incidents such as this
            </p>

            {/* Amount */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 3, // reduced from 4
                position: "relative",
                zIndex: 2,
              }}
            >
              <span
                style={{
                  fontSize: isMobile ? "31.5px" : "78.75px", // reduced by 25%
                  fontWeight: 700,
                  color: "#ce1010",
                  fontFamily: "Inter",
                  lineHeight: 1,
                }}
              >
                ₹
              </span>
              <span
                style={{
                  fontSize: isMobile ? "31.5px" : "90px", // reduced by 25%
                  fontWeight: 700,
                  color: "white",
                  fontFamily: "Inter",
                  lineHeight: 1,
                }}
              >
                1.21 Crore
              </span>
            </div>

            {/* Para 2 */}
            <p
              style={{
                color: "rgba(255,255,255,0.92)",
                fontSize: isMobile ? "9px" : "22.5px", // reduced by 25%
                lineHeight: isMobile ? 1.5 : "115%",
                margin: "0 auto",
                maxWidth: 743, // reduced from 990
                marginTop: isMobile ? 12 : 30, // reduced by 25%
                marginBottom: isMobile ? 12 : 30, // reduced by 25%
                fontFamily: "Inter",
                position: "relative",
                zIndex: 2,
              }}
            >
              truck robbery involving smartphones, apparel, and perfumes highlight how{" "}
                {isMobile && <br />}
                gaps in background screening can increase exposure to serious{" "}
                {isMobile && <br />}
                financial losses and erode customer trust.
            </p>

            {/* Source */}
            <p
              style={{
                color: "rgba(255,255,255,0.45)",
                fontSize: isMobile ? 8 : 10, // reduced by 25% (11→8, 13→10)
                fontFamily: "Inter",
                fontStyle: "italic",
                margin: 0,
                position: "relative",
                zIndex: 2,
              }}
            >
              Source:{" "}
              <a
                href="https://www.logisticsinsider.in/%E2%82%B91-21-crore-worth-of-iphones-stolen-from-flipkart-truck-in-punjab/"
                target="_blank"
                rel="noreferrer"
                style={{
                  color: "rgba(255,255,255,0.65)",
                  textDecoration: "underline",
                  cursor: "pointer",
                  pointerEvents: "auto",
                }}
              >
                Logistics Insider
              </a>
            </p>

          </div>
        </div>
      </div>
    </div>
  );
}