import { useEffect, useRef, useState } from "react";

const SEGMENTS = [
  { title: "Truck Drivers", mapSrc: "/assets/truck driver.svg" },
  { title: "Dark Store Workers", mapSrc: "/assets/dark store.svg" },
  { title: "Delivery Partners", mapSrc: "/assets/delivery partner.svg" },
];

const DEFAULT_MAP = "/assets/truck driver.svg";

export default function GeographicSection() {
  const [openIndex, setOpenIndex] = useState(null);
  const [isMobile, setIsMobile] = useState(() => typeof window !== "undefined" && window.innerWidth < 768);
  const [vw, setVw] = useState(() => typeof window !== "undefined" ? window.innerWidth : 1440);
  const [vh, setVh] = useState(() => typeof window !== "undefined" ? window.innerHeight : 900);
  const sectionRef = useRef(null);

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

  const activeMap = openIndex === null ? DEFAULT_MAP : SEGMENTS[openIndex].mapSrc;

  const handleSegmentClick = (i) => setOpenIndex(prev => prev === i ? null : i);

  const SegmentButtons = () =>
    SEGMENTS.map((item, i) => {
      const isOpen = openIndex === i;
      return (
        <button
          key={i}
          onClick={() => handleSegmentClick(i)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: isMobile ? 5 : 8,
            cursor: "pointer",
            background: isOpen ? "#e53e3e" : "transparent",
            border: "none",
            borderRadius: 6,
            padding: isMobile ? "4px 8px" : "6px 14px",
            color: "white",
            /* fontSize: mobile 10px→7.5px, desktop 18px→13.5px */
            fontSize: isMobile ? 7.5 : 13.5,
            fontWeight: 700,
            fontFamily: "Inter",
            userSelect: "none",
            transition: "background 0.2s ease, color 0.2s ease",
          }}
        >
          <span style={{
            display: "inline-block",
            transform: isOpen ? "rotate(90deg)" : "rotate(0deg)",
            transition: "transform 0.2s ease",
            /* arrow fontSize: mobile 8px→6px, desktop 13px→9.75px */
            fontSize: isMobile ? 6 : 9.75,
            color: isOpen ? "white" : "#e53e3e",
          }}>▶</span>
          {item.title}
        </button>
      );
    });

  return (
    <div ref={sectionRef} style={{ position: "relative" }}>
      <div style={{
        position: "relative",
        height: "auto",
        overflow: "hidden",
        background: "transparent",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: isMobile ? "0px 56px 32px" : "32px 56px 32px",
      }}>
        {/* Ellipse handled by UnifiedBackground wrapper */}

        {/* Title */}
        <div style={{ textAlign: "center", marginBottom: 8, opacity: 1, position: "relative", zIndex: 1 }}>
          <h2 style={{
            fontFamily: "Inter",
            fontWeight: 700,
            color: "white",
            margin: 0,
            lineHeight: 1.05,
            /*
             * fontSize:
             *   mobile: 32px → 24px
             *   desktop: 80px → 60px
             */
            fontSize: isMobile ? "24px" : "60px",
            maxWidth: isMobile ? "100%" : "900px",
          }}>
            Geographic Risk Concentration
          </h2>
          {/*
           * subtitle:
           *   mobile: 11px → 8.25px
           *   desktop: 26px → 19.5px
           */}
          <p style={{
            color: "white",
            margin: "12px 0 0",
            fontFamily: "Inter",
            fontSize: isMobile ? "8.25px" : "19.5px",
          }}>
            A breakdown of states with the highest risk rates across India.
          </p>

          {/* Segment buttons */}
          <div style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            gap: isMobile ? 6 : 16,
            marginTop: isMobile ? 10 : 18,
          }}>
            <SegmentButtons />
          </div>
        </div>

        {/* Body */}
        <div
          className="flex flex-col-reverse lg:grid lg:grid-cols-[277px_460px] justify-center gap-12 md:gap-20 w-full max-w-[1400px] mt-10"
          style={{ position: "relative", zIndex: 1 }}
        >
          {/* Left panel */}
          <div style={{ opacity: 1, transform: "none", display: "flex", flexDirection: "column", gap: 30, paddingTop: 8 }}>
            {/* Desktop paragraphs — 26px → 19.5px */}
            <p className="hidden lg:block" style={{
              color: "white",
              fontSize: 19.5,
              lineHeight: "115%",
              fontFamily: "Inter",
              margin: 0,
            }}>
              Kerala records the highest risk rate in the country, with
              Maharashtra close behind, making them two of the highest risk
              concentration states across segments.
            </p>
            <p className="hidden lg:block" style={{
              color: "white",
              fontSize: 19.5,
              lineHeight: "115%",
              fontFamily: "Inter",
              margin: 0,
            }}>
              Another contributing factor behind this surge could be stronger
              crime reporting mechanisms in southern and western states. For
              example, in Kerala, many challans are automatically generated
              through AI-enabled monitoring cameras at traffic junctions.
            </p>

            {/* Mobile paragraphs — 11px → 8.25px */}
            <p className="block lg:hidden" style={{
              color: "white", fontSize: 8.25, lineHeight: 1.7,
              fontFamily: "Inter", margin: 0, textAlign: "center",
            }}>
              Kerala records the highest risk rate in the country, with
              Maharashtra close behind, making them two of the highest risk
              concentration states across segments.
            </p>
            <p className="block lg:hidden" style={{
              color: "white", fontSize: 8.25, lineHeight: 1.7,
              fontFamily: "Inter", margin: 0, textAlign: "center",
            }}>
              Another contributing factor behind this surge could be stronger
              crime reporting mechanisms in southern and western states. For
              example, in Kerala, many challans are automatically generated
              through AI-enabled monitoring cameras at traffic junctions.
            </p>
          </div>

          {/*
           * Map container — reduced 25%:
           *   613.02px → 459.77px
           *   562.79px → 422.09px
           */}
          <div style={{
            position: "relative",
            opacity: 1, transform: "none",
            display: "flex", alignItems: "center", justifyContent: "center",
            width: isMobile ? "100%" : "459.77px",
            height: isMobile ? "auto" : "422.09px",
            flexShrink: 0,
          }}>
            <img
              key={activeMap}
              src={activeMap}
              alt={openIndex === null ? "India map" : SEGMENTS[openIndex].title + " map"}
              style={{
                width: isMobile ? "100%" : "459.77px",
                height: isMobile ? "auto" : "422.09px",
                objectFit: "contain",
                objectPosition: "center",
                display: "block",
                filter: "brightness(0.9)",
                transition: "opacity 0.3s ease",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}