import { useInView } from "./helpers";
import { useState, useEffect } from "react";

export default function CaseFilesSection() {
  const [ref, visible] = useInView(0.15);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const timelineNodes = [
    { day: "Day 1", title: null, body: "Rohan's application was submitted." },
    { day: "Day 2", title: "During the Digital Address Verification call", body: "His GPS showed Delhi. His IP address showed Faridabad." },
    { day: "Day 2 Later", title: null, body: "We detected a VPN signal. With help from a cousin, he attempted to mask his real location." },
  ];

  return (
    <section className="flex justify-center" style={{
      background: "transparent", position: "relative",
      padding: isMobile ? "24px 20px" : "30px 5vw 10px",
      color: "white", fontFamily: "Inter",
    }}>
      <div className="max-w-[1150px]" style={{ width: "100%", margin: "0 auto" }}>

        {/* Ellipse handled by UnifiedBackground wrapper */}

        <div ref={ref} style={{
          display: "flex", flexDirection: "column",
          gap: isMobile ? "36px" : "30px",
          maxWidth: "1150px", margin: "0 auto",
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(30px)",
          transition: "all 1s ease-out",
          position: "relative", zIndex: 1,
        }}>

          {isMobile ? (
            <>
              {/* 1. Heading block */}
              <div style={{ display: "flex", flexDirection: "column", gap: "14px", textAlign: "center", alignItems: "center", width: "100%" }}>
                {/* "The GPS Spoofer": 38px → 28.5px */}
                <h1 style={{ fontSize: "28.5px", fontWeight: 800, margin: 0, lineHeight: 1.1, fontFamily: "Inter" }}>
                  The GPS Spoofer
                </h1>
                {/* "Rohan applied…": 21px → 15.75px */}
                <h2 style={{ fontSize: "15.75px", fontWeight: 700, margin: 0, lineHeight: 1.3, fontFamily: "Inter" }}>
                  Rohan applied to be a truck driver at MPK Shipments Ltd.
                </h2>
                {/* "…address verification…": 16px → 12px */}
                <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.65)", margin: 0, lineHeight: 1.5, fontFamily: "Inter" }}>
                  ...and the address verification revealed something even bigger.
                </p>
              </div>

              {/* 2. Suspect Card */}
              <div style={{
                width: "100%",
                background: "rgba(255,255,255,0.05)",
                border: "0.5px solid rgba(255,255,255,0.12)",
                borderRadius: "15px", padding: "20px",
              }}>
                {/* "Suspect 1": 26px → 19.5px */}
                <p style={{ color: "#CE1010", fontSize: "19.5px", fontWeight: 700, margin: "0 0 18px" }}>
                  Suspect 1
                </p>
                <div style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
                  <div style={{ flex: 1 }}>
                    {[
                      { label: "Name", value: "Vishal Taleja" },
                      { label: "Date of Birth", value: "18th April 1995" },
                      { label: "Gender", value: "Male" },
                    ].map((item) => (
                      <div key={item.label} style={{ marginBottom: "16px" }}>
                        {/* field label: 13px → 9.75px */}
                        <p style={{ fontSize: "9.75px", color: "rgba(255,255,255,0.45)", margin: "0 0 3px" }}>{item.label}</p>
                        {/* field value: 20px → 15px */}
                        <p style={{ fontSize: "15px", fontWeight: 700, margin: 0 }}>{item.value}</p>
                      </div>
                    ))}
                  </div>
                  {/* Photo: 130×156 → 97.5×117 */}
                  <div style={{
                    width: "97.5px", height: "117px", flexShrink: 0,
                    background: "#111", borderRadius: "8px",
                    border: "1px solid rgba(255,255,255,0.15)", overflow: "hidden",
                  }}>
                    <img src="../../assets/a4.png" alt="Vishal Taleja"
                      style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "8px", border: "6px solid white" }} />
                  </div>
                </div>
              </div>
            </>
          ) : (
            /* DESKTOP */
            <div style={{ display: "flex", flexDirection: "row", flexWrap: "wrap", gap: "60px", alignItems: "flex-start" }}>
              {/*
               * Suspect Card:
               *   600×435 → 448.5×326.25
               * "Suspect 1": 30px → 22.5px
               * field label: 20px → 15px
               * field value: 30px → 22.5px
               * Photo: 240×288 → 180×216
               */}
              <div style={{
                width: "100%", maxWidth: "448.5px", height: "326.25px",
                background: "rgba(255,255,255,0.05)",
                border: "0.5px solid rgba(255,255,255,0.12)",
                borderRadius: "15px", padding: "26px 24px", flexShrink: 0,
              }}>
                <p style={{ color: "#CE1010", fontSize: "22.5px", fontWeight: 700, margin: "0 0 20px" }}>Suspect 1</p>
                <div style={{ display: "flex", gap: "22px", alignItems: "flex-start" }}>
                  <div style={{ flex: 1 }}>
                    {[
                      { label: "Name", value: "Vishal Taleja" },
                      { label: "Date of Birth", value: "18th April 1995" },
                      { label: "Gender", value: "Male" },
                    ].map((item) => (
                      <div key={item.label} style={{ marginBottom: "20px" }}>
                        <p style={{ fontSize: "15px", color: "rgba(255,255,255,0.45)", margin: "0 0 4px" }}>{item.label}</p>
                        <p style={{ fontSize: "22.5px", fontWeight: 700, margin: 0 }}>{item.value}</p>
                      </div>
                    ))}
                  </div>
                  <div style={{
                    width: "180px", height: "216px", flexShrink: 0,
                    background: "#111", borderRadius: "8px",
                    border: "1px solid rgba(255,255,255,0.15)", overflow: "hidden",
                  }}>
                    <img src="../../assets/a4.png" alt="Vishal Taleja"
                      style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "8px", border: "6px solid white" }} />
                  </div>
                </div>
              </div>

              {/* Intro Text */}
              <div style={{ display: "flex", flexDirection: "column", gap: "16px", flex: 1 }}>
                {/* "The GPS Spoofer": 45px → 33.75px */}
                <h1 style={{ fontSize: "33.75px", fontWeight: 800, margin: 0, lineHeight: 1.1, maxWidth: "377px", fontFamily: "Inter" }}>
                  The GPS Spoofer
                </h1>
                {/* "Rohan applied…": 30px → 22.5px */}
                <h2 style={{ fontSize: "22.5px", fontWeight: 700, margin: 0, lineHeight: 1.3, maxWidth: "517px", fontFamily: "Inter" }}>
                  Rohan applied to be a truck driver at MPK Shipments Ltd.
                </h2>
                {/* "…address verification…": 20px → 15px */}
                <p style={{ fontSize: "15px", color: "rgba(255,255,255,0.65)", margin: 0, lineHeight: 1.4, fontFamily: "Inter" }}>
                  ...and the address verification revealed something even bigger.
                </p>
              </div>
            </div>
          )}

          {/* ══════════════════════════
              TIMELINE SECTION
          ══════════════════════════ */}
          {/*
           * "Timeline of events" h2:
           *   mobile:  33px → 24.75px
           *   desktop: 100px → 75px
           */}
          <h2 style={{
            fontSize: isMobile ? "24.75px" : "75px",
            fontWeight: 800, textAlign: "center",
            marginTop: isMobile ? "0" : "40px",
            marginBottom: isMobile ? "12px" : "30px",
            lineHeight: 1.1, fontFamily: "Inter",
          }}>
            Timeline of events
          </h2>

          {/* DESKTOP horizontal timeline */}
          {!isMobile && (
            <div style={{ position: "relative", width: "100%", height: "240px", display: "flex", alignItems: "center" }}>
              <div style={{
                position: "absolute", width: "100%", height: "2px",
                background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.6) 5%, rgba(255,255,255,0.6) 95%, transparent 100%)",
                top: "50%", transform: "translateY(-50%)",
              }} />
              <div style={{ position: "absolute", width: "100%", height: "100%", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                {/* Node 1 */}
                <div style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center", width: "30%" }}>
                  {/* "Day 1": 20px → 15px */}
                  <div style={{ position: "absolute", bottom: "50%", marginBottom: "16px", color: "#CE1010", fontWeight: 700, fontSize: "15px" }}>Day 1</div>
                  <div style={{ width: "20px", height: "20px", borderRadius: "50%", background: "#CE1010", border: "4px solid #111", boxShadow: "0 0 14px rgba(206,16,16,0.6)", zIndex: 1 }} />
                  {/* body: 20px → 15px */}
                  <div style={{ position: "absolute", top: "50%", marginTop: "16px", color: "rgba(255,255,255,0.75)", fontSize: "15px", textAlign: "center", lineHeight: 1.4 }}>Rohan's application was<br />submitted</div>
                </div>
                {/* Node 2 */}
                <div style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center", width: "30%" }}>
                  {/* title + body: 20px → 15px */}
                  <div style={{ position: "absolute", bottom: "50%", marginBottom: "16px", color: "white", fontSize: "15px", textAlign: "center", lineHeight: 1.4, fontWeight: 700 }}>
                    During the Digital Address<br />Verification call<br />
                    <span style={{ fontWeight: 400, color: "rgba(255,255,255,0.7)" }}>His GPS showed Delhi.<br />His IP address showed Faridabad.</span>
                  </div>
                  <div style={{ width: "20px", height: "20px", borderRadius: "50%", background: "#CE1010", border: "4px solid #111", boxShadow: "0 0 14px rgba(206,16,16,0.6)", zIndex: 1 }} />
                  <div style={{ position: "absolute", top: "50%", marginTop: "16px", color: "#CE1010", fontWeight: 700, fontSize: "15px" }}>Day 2</div>
                </div>
                {/* Node 3 */}
                <div style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center", width: "30%" }}>
                  <div style={{ position: "absolute", bottom: "50%", marginBottom: "16px", color: "#CE1010", fontWeight: 700, fontSize: "15px" }}>Day 2 Later</div>
                  <div style={{ width: "20px", height: "20px", borderRadius: "50%", background: "#CE1010", border: "4px solid #111", boxShadow: "0 0 14px rgba(206,16,16,0.6)", zIndex: 1 }} />
                  {/* body: 20px → 15px; lineHeight 26px → 19.5px */}
                  <div style={{ position: "absolute", top: "50%", marginTop: "16px", color: "rgba(255,255,255,0.75)", fontSize: "15px", textAlign: "center", lineHeight: "19.5px" }}>
                    We detected a VPN signal. With help<br />from a cousin, he attempted to mask<br />his real location.
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* MOBILE timeline — alternating: index 0,2 = left | index 1 = right */}
          {isMobile && (
            <div style={{ position: "relative", width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div style={{
                position: "absolute", left: "50%", top: 0, bottom: 0,
                width: "2px", background: "rgba(255,255,255,0.28)",
                transform: "translateX(-50%)", zIndex: 0,
              }} />
              {timelineNodes.map((node, i) => {
                const onLeft = i % 2 === 0; // Day 1 (i=0) left, Day 2 (i=1) right, Day 2 Later (i=2) left
                return (
                  <div key={i} style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 32px 1fr",
                    alignItems: "flex-start",
                    width: "100%",
                    position: "relative", zIndex: 1,
                    padding: "12px 0",
                    minHeight: "60px",
                  }}>
                    {/* Left column */}
                    <div style={{ paddingRight: "16px", textAlign: "right" }}>
                      {onLeft && (
                        <>
                          <p style={{ color: "#CE1010", fontWeight: 700, fontSize: "11px", margin: "0 0 4px", lineHeight: 1.3 }}>{node.day}</p>
                          {node.title && (
                            <p style={{ fontSize: "10px", fontWeight: 700, color: "white", margin: "0 0 4px", lineHeight: 1.4 }}>{node.title}</p>
                          )}
                          <p style={{ fontSize: "10px", color: "rgba(255,255,255,0.75)", margin: 0, lineHeight: 1.6 }}>{node.body}</p>
                        </>
                      )}
                    </div>
                    {/* Center dot */}
                    <div style={{
                      display: "flex",
                      alignItems: "flex-start",
                      justifyContent: "center",
                      paddingTop: "4px",
                      zIndex: 2,
                    }}>
                      <div style={{
                        width: "16px", height: "16px", borderRadius: "50%",
                        background: "#CE1010", border: "3px solid #000",
                        boxShadow: "0 0 10px rgba(206,16,16,0.8)",
                        flexShrink: 0,
                      }} />
                    </div>
                    {/* Right column */}
                    <div style={{ paddingLeft: "16px", textAlign: "left" }}>
                      {!onLeft && (
                        <>
                          <p style={{ color: "#CE1010", fontWeight: 700, fontSize: "11px", margin: "0 0 4px", lineHeight: 1.3 }}>{node.day}</p>
                          {node.title && (
                            <p style={{ fontSize: "10px", fontWeight: 700, color: "white", margin: "0 0 4px", lineHeight: 1.4 }}>{node.title}</p>
                          )}
                          <p style={{ fontSize: "10px", color: "rgba(255,255,255,0.75)", margin: 0, lineHeight: 1.6 }}>{node.body}</p>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* ── BOTTOM: 2-column story ── */}
          <div style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
            gap: isMobile ? "20px" : "80px",
          }}>
            {/*
             * Story paragraphs:
             *   mobile:  16px → 12px; lineHeight 30px → 22.5px
             *   desktop: 30px → 22.5px; lineHeight 40px → 30px
             */}
            <p style={{ fontSize: isMobile ? "12px" : "22.5px", lineHeight: isMobile ? "22.5px" : "30px", margin: 0, color: "rgba(255,255,255,0.85)" }}>
              He was also flagged with two active FIRs linked to high-value cargo robbery, both filed by his previous employers. Rohan was aware of MPK's high-value laptop inventory. The plan was simple: steal the cargo, disappear, and leave no trace behind.
            </p>
            <p style={{ fontSize: isMobile ? "12px" : "22.5px", lineHeight: isMobile ? "22.5px" : "30px", margin: 0, color: "rgba(255,255,255,0.85)" }}>
              The catch saved MPK Shipments Ltd. several lakhs in potential cargo theft and exposed how sophisticated address fraud has become with GPS spoofing and VPN usage.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}