import { useEffect, useRef, useState } from "react";

export default function Question() {
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
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const isTablet = vw >= 768 && vw < 1024;
  const isShortDesktop = !isMobile && !isTablet && vh < 780;

  const questions = [
    { img: "/assets/question1.png", text: "Which segments are the most risk-prone?" },
    { img: "/assets/question2.png", text: "Where are the risk hotspots across the country?" },
    { img: "/assets/question3.png", text: "what correlations exist between risk rates and other factors?" },
  ];

  const people = [
    { label: "Truck drivers", riskRate: "4.75%", meanAge: "30.90", img: "/assets/people1.png", style: { bottom: 8, right: -20, rotate: "-6deg" } },
    { label: "Dark Store Workers", riskRate: "2.36%", meanAge: "24.34", img: "/assets/people2.png", style: { bottom: -13, right: 7, rotate: "10deg" } },
    { label: "Delivery Partners", riskRate: "3.04%", meanAge: "27.94", img: "/assets/people3.png", style: { bottom: 13, right: -18, rotate: "-7deg" } },
  ];

  return (
    <div style={{ position: "relative" }}>
      <div style={{
        position: "relative",
        height: "auto",
        overflow: "hidden",
        background: "transparent",
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        padding: isMobile ? "0px 20px 32px" : "32px 64px 32px",
        gap: isMobile ? 24 : 32,
      }}>
        {/* Ellipse handled by UnifiedBackground wrapper */}

        {/* ── Section 1: Questions ── */}
        <div style={{ width: "100%", maxWidth: 1300 }}>
          <h2 className="sm:text-[52.5px] text-[22.5px]" style={{
            fontFamily: "Inter",
            fontWeight: 700, color: "white",
            margin: "0 0 32px", textAlign: "center",
            lineHeight: isMobile ? "27px" : "45px",
            opacity: 1, transform: "none",
          }}>
            What the data reveals
          </h2>

          <div style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)",
            gap: isMobile ? 24 : 20,
            width: "100%",
          }}>
            {questions.map((q, i) => (
              <div key={i} style={{
                backgroundImage: "linear-gradient(#1d1d1d,#212121)",
                border: "1px solid white",
                borderRadius: 16, padding: isMobile ? "6px 10px" : "18px 20px",
                display: "flex", alignItems: "center", gap: 20,
                minHeight: isMobile ? 80 : 110,
                opacity: 1, transform: "none",
              }}>
                <div style={{
                  width: 58, height: 58, flexShrink: 0,
                  borderRadius: 14,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <img src={q.img} alt="" style={{ width: 112, height: 75, objectFit: "contain" }} />
                </div>
                <p style={{
                  color: "white",
                  fontSize: isMobile ? "10.5px" : "clamp(9.75px, 0.79vw, 12.75px)",
                  fontWeight: 500, margin: 0, lineHeight: 1.5,
                  fontFamily: "Inter",
                }}>{q.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div style={{ width: "100%", maxWidth: 1300, height: 1, background: "rgba(255,255,255,0.08)", opacity: 1 }} />

        {/* ── Section 2: People ── */}
        <div style={{ width: "100%", maxWidth: 1100, marginTop: isMobile ? 10 : 30}}>
          <h2
            className="bg-gradient-to-r from-[#cdcdcd] to-white bg-clip-text text-transparent"
            style={{
              fontFamily: "Inter",
              fontWeight: 700,
              margin: isMobile ? "0 0 14px" : "0 0 24px",
              textAlign: "center",
              lineHeight: 1.05,
              opacity: 1, transform: "none",
              fontSize: isMobile ? 24 : 60,
            }}
          >
            People In Focus
          </h2>

          {/* wrapper: on mobile, 80% wide and centered */}
          <div style={{
            width: isMobile ? "80%" : "100%",
            margin: isMobile ? "0 auto" : "0",
          }}>
            <div style={{
              marginTop: isMobile ? 30 : 60,
              display: "grid",
              gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)",
              gap: isMobile ? 10 : 20,
              width: "100%",
            }}>
              {people.map((p, i) => (
                <div key={i} style={{
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 16,
                  padding: isMobile ? "16px 20px 0" : "28px 28px 0",
                  display: "flex",
                  flexDirection: "column",
                  position: "relative",
                  overflow: "hidden",
                  minHeight: isMobile ? 185 : 280,
                  opacity: 1,
                  transform: "none",
                }}>
                  {/* Label */}
                  <div style={{
                    color: "#CE1010",
                    fontSize: isMobile ? "14px" : "13.5px",
                    fontWeight: 600,
                    marginBottom: isMobile ? 6 : 16,
                    fontFamily: "Inter",
                  }}>{p.label}</div>

                  {/* Risk Rate value */}
                  <div style={{
                    color: "white",
                    marginTop: isMobile ? "4px" : "12px",
                    fontSize: isMobile ? "30px" : "clamp(19.5px, 2.1vw, 31.5px)",
                    fontWeight: 700,
                    lineHeight: 1,
                    fontFamily: "Inter",
                  }}>{p.riskRate}</div>

                  {/* Risk Rate label */}
                  <div style={{
                    color: "white",
                    fontSize: isMobile ? "13px" : 13.5,
                    marginTop: isMobile ? 4 : 6,
                    marginBottom: isMobile ? 14 : 20,
                    lineHeight: 1.2,
                  }}>Risk Rate</div>

                  {/* Mean Age label */}
                  <div style={{
                    color: "white",
                    fontSize: isMobile ? "13px" : 13.5,
                    marginBottom: isMobile ? 2 : 4,
                    marginTop: 0,
                    lineHeight: 1.2,
                  }}>Mean Age</div>

                  {/* Mean Age value */}
                  <div style={{
                    color: "white",
                    fontSize: isMobile ? "30px" : "clamp(19.5px, 2.1vw, 31.5px)",
                    fontWeight: 700,
                    lineHeight: 1,
                    fontFamily: "Inter",
                  }}>{p.meanAge}</div>

                  {/* years label */}
                  <div style={{
                    color: "white",
                    fontSize: isMobile ? "13px" : 13.5,
                    marginTop: isMobile ? 2 : 4,
                    marginBottom: isMobile ? 16 : 20,
                    lineHeight: 1.2,
                  }}>years</div>

                  {/* Person image */}
                  <img
                    src={p.img}
                    alt={p.label}
                    style={{
                      position: "absolute",
                      bottom: p.style?.bottom || -10,
                      right: p.style?.right || -10,
                      width: isMobile ? 115 : 109,
                      height: isMobile ? 115 : 109,
                      objectFit: "contain",
                      objectPosition: "bottom right",
                      transform: `rotate(${p.style?.rotate || "10deg"})`,
                      transformOrigin: "bottom right",
                      opacity: 0.88,
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}