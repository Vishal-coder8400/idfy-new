import { useEffect, useRef, useState } from "react";

export default function FraudSection() {
  const sectionRef = useRef(null);
  const [isMobile, setIsMobile] = useState(() => typeof window !== "undefined" && window.innerWidth < 768);
  const [vw, setVw] = useState(() => typeof window !== "undefined" ? window.innerWidth : 1440);
  const [vh, setVh] = useState(() => typeof window !== "undefined" ? window.innerHeight : 900);

  useEffect(() => {
    const check = () => {
      setIsMobile(window.innerWidth < 768);
      setVw(window.innerWidth);
      setVh(window.innerHeight);
    };
    check();
    window.addEventListener("resize", check, { passive: true });
    return () => window.removeEventListener("resize", check);
  }, []);

  const isTablet = vw >= 768 && vw < 1024;
  const isShortDesktop = !isMobile && !isTablet && vh < 780;

  const headingStyle = {
    fontFamily: "Inter",
    fontWeight: 700,
    color: "white",
    textAlign: "center",
    margin: 0,
    /*
     * fontSize reduced 25%:
     *   mobile:        30px → 22.5px
     *   isShortDesktop: 110px → 82.5px
     *   desktop:       120px → 90px
     *
     * lineHeight reduced 25%:
     *   mobile:        40.86px → 30.65px
     *   isShortDesktop: 120px → 90px
     *   desktop:       130px → 97.5px
     */
    fontSize: isMobile ? "22.5px" : isShortDesktop ? "82.5px" : "90px",
    lineHeight: isMobile ? "30.65px" : isShortDesktop ? "90px" : "97.5px",
    letterSpacing: "-0.04em",
  };

  return (
    <div ref={sectionRef} style={{ position: "relative" }}>
      <div
        style={{
          position: "relative",
          top: 0,
          height: "auto",
          overflow: "hidden",
          background: "transparent",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-start",
          padding: isMobile ? "40px 16px 24px" : "50px 64px 20px",
        }}
      >
        {/* Ellipse handled by UnifiedBackground wrapper */}

        {/* Main heading */}
        <div style={{
          width: "100%", maxWidth: 1200, zIndex: 1,
          opacity: 1, transform: "none", textAlign: "center",
          marginBottom: isMobile ? 8 : 12,
        }}>
          <h2 style={{ ...headingStyle }}>
            The Fraud Behind
            <br />
            the Workforce
          </h2>
        </div>

        {/* Subtitle — 12px→9px, 30px→22.5px; lineHeight 18px→13.5px, 36px→27px */}
        <p style={{
          color: "white",
          fontSize: isMobile ? "9px" : "22.5px",
          fontWeight: 600,
          margin: isMobile ? "0 0 12px" : "0 0 20px",
          textAlign: "center",
          fontFamily: "Inter",
          zIndex: 1,
          opacity: 1,
          lineHeight: isMobile ? "13.5px" : "27px",
        }}>
          India's gig workforce has grown from
        </p>

        {/* Chart GIF container — maxWidth: 750→562.5, 980→735 */}
        <div style={{
          width: "100%",
          maxWidth: isMobile ? "100%" : isShortDesktop ? 562 : 735,
          opacity: 1, transform: "none", zIndex: 1,
        }}>
          <img
            src="/assets/graph.gif"
            alt="Gig workforce growth chart"
            style={{ width: "100%", display: "block", borderRadius: 4 }}
          />
          <div style={{ textAlign: "center", marginTop: 6, marginBottom: 4, opacity: 1 }}>
            {/* source text: matches "Source: Logistics Insider" style */}
            <span style={{ color: "rgba(255,255,255,0.45)", fontSize: isMobile ? 8 : 10, fontFamily: "Inter", fontStyle: "italic" }}>
              Source:{" "}
              <a href="https://www.niti.gov.in/sites/default/files/2023-06/Policy_Brief_India%27s_Booming_Gig_and_Platform_Economy_27062022.pdf" target="_blank" rel="noreferrer" style={{ color: "rgba(255,255,255,0.65)", textDecoration: "underline" }}>
                Niti Ayog
              </a>
              {" "}and{" "}
              <a href="https://www.livemint.com/money/personal-finance/indias-gig-economy-in-2025-growth-formalisation-and-financial-inclusion-explained-11753438649777.html" target="_blank" rel="noreferrer" style={{ color: "rgba(255,255,255,0.65)", textDecoration: "underline" }}>
                Mint
              </a>
            </span>
          </div>
        </div>

        {/* Footer line — 13px→9.75px, 28px→21px; lineHeight 36px→27px */}
        <p style={{
          color: "white",
          fontSize: isMobile ? "9.75px" : "21px",
          fontFamily: "Inter",
          textAlign: "center",
          margin: isMobile ? "8px 0 20px" : "8px 0 0px",
          maxWidth: 700,
          zIndex: 1,
          opacity: 1,
          lineHeight: "27px",
        }}>
          But as the workforce expands, fraud scales alongside it.
        </p>
      </div>
    </div>
  );
}