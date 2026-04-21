// ReferralRingSection.jsx
import { useInView } from "./helpers";
import { useState, useEffect } from "react";

export default function ReferralRingSection() {
  const [leftRef, leftVisible] = useInView(0.2);
  const [rightRef, rightVisible] = useInView(0.2);
  const [tlRef, tlVisible] = useInView(0.15);
  const [savingsRef, savingsVisible] = useInView(0.2);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const TIMELINE_EVENTS = [
    {
      label: "Week 0",
      pos: "above",
      desc: null,
      subDesc: "3 agents profiles flagged for tampering at the time of onboarding.",
    },
    {
      label: "Week 2, Day 1",
      pos: "below",
      desc: "2 weeks and 104 tampered documents later, we noticed something was off.",
      subDesc: null,
    },
    {
      label: "Week 2, Day 2",
      pos: "above",
      desc: null,
      subDesc: "Upon digging deeper, we noticed a pattern with all the profiles referred by Vishal.\n• Every profile had a tampered ID\n• Every ID had the same PIN code\n• Every single profile came through Vishal's reference.",
    },
    {
      label: "Week 2, Day 3",
      pos: "below",
      desc: "The entire fake-account ring was flagged, traced and wiped out.",
      subDesc: null,
    },
  ];

  return (
    <section style={{
      padding: isMobile ? "60px 6vw 80px" : "80px 6vw 100px",
      position: "relative",
      backgroundColor: "transparent",
      overflow: "hidden",
    }}>
      <style>{`
        .timeline-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          position: relative;
          width: 100%;
        }
        .horizontal-line {
          position: absolute;
          top: 50%;
          left: 0; right: 0;
          height: 2px;
          background: rgba(255,255,255,1);
          transform: translateY(-50%);
          z-index: 1;
        }
        .timeline-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          position: relative;
          z-index: 2;
          min-height: 280px;
          justify-content: center;
        }
        .timeline-content {
          height: 120px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          width: 100%;
          padding: 0 10px;
          text-align: center;
        }
        .dot-container {
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          z-index: 3;
        }
        .red-dot {
          width: 16px;
          height: 16px;
          background: #e53e3e;
          border-radius: 50%;
          box-shadow: 0 0 12px rgba(229,62,62,0.6);
          border: 2px solid #e53e3e;
          flex-shrink: 0;
        }
        .timeline-mobile {
          position: relative;
          display: flex;
          flex-direction: column;
          gap: 0;
        }
        .timeline-mobile-line {
          position: absolute;
          left: 50%;
          top: 8px;
          bottom: 8px;
          width: 2px;
          background: rgba(255,255,255,1);
          transform: translateX(-50%);
          z-index: 1;
        }
        .timeline-mobile-row {
          display: grid;
          grid-template-columns: 1fr 32px 1fr;
          align-items: flex-start;
          position: relative;
          z-index: 2;
          min-height: 120px;
          padding: 16px 0;
        }
        .tm-left { padding-right: 16px; text-align: right; }
        .tm-right { padding-left: 16px; text-align: left; }
        .tm-dot-col {
          display: flex;
          align-items: flex-start;
          justify-content: center;
          padding-top: 2px;
          z-index: 3;
        }
      `}</style>

      {/* Ellipse handled by UnifiedBackground wrapper */}

      {/* Story Columns */}
      <div style={{
        display: isMobile ? "flex" : "grid",
        gridTemplateColumns: "1fr 1fr",
        flexDirection: isMobile ? "column" : "row",
        gap: isMobile ? 40 : 60,
        maxWidth: 1000,
        margin: "0 auto 100px",
        position: "relative", zIndex: 1,
        textAlign: isMobile ? "center" : "left",
      }}>
        {/* Left */}
        <div ref={leftRef} style={{
          opacity: leftVisible ? 1 : 0,
          transform: leftVisible ? "translateY(0)" : "translateY(30px)",
          transition: "opacity 0.7s, transform 0.7s",
        }}>
          {/*
           * Paragraph:
           *   mobile:  11px → 8.25px, lineHeight 1.7
           *   desktop: 30px → 22.5px, lineHeight 40px → 30px
           */}
          <p style={{
            fontFamily: "Inter",
            fontSize: isMobile ? "8.25px" : "22.5px",
            color: "#fff",
            lineHeight: isMobile ? 1.7 : "30px",
            marginBottom: isMobile ? 20 : 32,
          }}>
            Vishal was a delivery agent with Zap Logistics, which was running a generous referral scheme
          </p>
          {/*
           * ₹ amount:
           *   mobile:  56px → 42px
           *   desktop: 105px → 78.75px
           */}
          <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 8, justifyContent: isMobile ? "center" : "flex-start" }}>
            <span style={{
              fontFamily: "Inter",
              fontSize: isMobile ? "42px" : "78.75px",
              fontWeight: 700, color: "white", lineHeight: 1,
            }}>
              <span style={{ color: "#CE1010" }}>₹</span> 3000
            </span>
          </div>
          <p style={{
            fontFamily: "Inter",
            fontSize: isMobile ? "8.25px" : "22.5px",
            marginTop: isMobile ? 12 : 23,
            color: "#fff",
            lineHeight: "30px",
          }}>
            for every delivery agent referred. Vishal spotted an opportunity.
          </p>
        </div>

        {/* Right */}
        <div ref={rightRef} style={{
          opacity: rightVisible ? 1 : 0,
          transform: rightVisible ? "translateY(0)" : "translateY(30px)",
          transition: "opacity 0.7s 0.15s, transform 0.7s 0.15s",
        }}>
          <p style={{
            fontFamily: "Inter",
            fontSize: isMobile ? "8.25px" : "22.5px",
            color: "#fff", fontWeight: 300,
            lineHeight: isMobile ? 1.7 : "30px",
            marginBottom: isMobile ? 16 : 20,
          }}>
            He and his friends found a loophole to bypass the verification process and fabricated
            <span style={{ color: "#CE1010", fontWeight: 700 }}> 107 fake IDs</span> to pocket the referral bonuses.
          </p>
          <p style={{
            fontFamily: "Inter",
            fontSize: isMobile ? "8.25px" : "22.5px",
            color: "#fff", fontWeight: 300,
            lineHeight: isMobile ? 1.7 : "30px",
          }}>
            The entire scheme collapsed during onboarding, when every ID linked to his referrals was
            <span style={{ color: "#CE1010", fontWeight: 700 }}> flagged for fraud.</span>
          </p>
        </div>
      </div>

      {/* Timeline Section */}
      <div ref={tlRef} style={{
        maxWidth: 1100, margin: "0 auto 100px",
        opacity: tlVisible ? 1 : 0,
        transform: tlVisible ? "translateY(0)" : "translateY(30px)",
        transition: "opacity 0.7s, transform 0.7s",
      }}>
        {/*
         * "Timeline of events" h2:
         *   mobile:  37px → 27.75px
         *   desktop: 120px → 90px
         */}
        <h2 style={{
          fontFamily: "Inter",
          fontSize: isMobile ? "27.75px" : "90px",
          fontWeight: 700, color: "white",
          textAlign: "center",
          marginBottom: isMobile ? 40 : 60,
          lineHeight: 1.05,
        }}>
          Timeline of events
        </h2>

        {/* WEB timeline */}
        {!isMobile && (
          <div className="timeline-grid">
            <div className="horizontal-line" />
            {TIMELINE_EVENTS.map((ev, i) => (
              <div key={i} className="timeline-item">
                <div className="timeline-content" style={{ justifyContent: "flex-end" }}>
                  {ev.pos === "above" ? (
                    /* label: 24px → 18px */
                    <p style={{ color: "#CE1010", fontWeight: 700, fontSize: 18, margin: "0 0 8px" }}>{ev.label}</p>
                  ) : (
                    /* body: 20px → 15px, lineHeight 26px → 19.5px */
                    <p style={{ color: "rgba(255,255,255,0.9)", fontSize: 15, lineHeight: "19.5px", margin: 0, textAlign: "left" }}>{ev.desc}</p>
                  )}
                </div>
                <div className="dot-container">
                  <div className="red-dot" />
                </div>
                <div className="timeline-content" style={{ justifyContent: "flex-start" }}>
                  {ev.pos === "above" ? (
                    /* body: 18px → 13.5px, lineHeight 26px → 19.5px */
                    <p style={{ color: "rgba(255,255,255,0.9)", fontSize: 13.5, lineHeight: "19.5px", whiteSpace: "pre-line", margin: 0, textAlign: "left" }}>
                      {ev.subDesc}
                    </p>
                  ) : (
                    /* label: 24px → 18px */
                    <p style={{ color: "#CE1010", fontWeight: 700, fontSize: 18, margin: 0 }}>{ev.label}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* MOBILE timeline — alternating: pos 'above' = left, pos 'below' = right */}
        {isMobile && (
          <div className="timeline-mobile">
            <div className="timeline-mobile-line" />
            {TIMELINE_EVENTS.map((ev, i) => {
              const onLeft = ev.pos === "above";
              return (
                <div key={i} className="timeline-mobile-row">
                  <div className="tm-left">
                    {onLeft && (
                      <>
                        <p style={{ color: "#CE1010", fontWeight: 700, fontSize: 11, margin: "0 0 4px", lineHeight: 1.3 }}>{ev.label}</p>
                        <p style={{ color: "rgba(255,255,255,0.85)", fontSize: 10, lineHeight: 1.6, margin: 0, whiteSpace: "pre-line" }}>
                          {ev.subDesc || ev.desc}
                        </p>
                      </>
                    )}
                  </div>
                  <div className="tm-dot-col">
                    <div className="red-dot" />
                  </div>
                  <div className="tm-right">
                    {!onLeft && (
                      <>
                        <p style={{ color: "#CE1010", fontWeight: 700, fontSize: 11, margin: "0 0 4px", lineHeight: 1.3 }}>{ev.label}</p>
                        <p style={{ color: "rgba(255,255,255,0.85)", fontSize: 10, lineHeight: 1.6, margin: 0, whiteSpace: "pre-line" }}>
                          {ev.subDesc || ev.desc}
                        </p>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Savings impact */}
      <div ref={savingsRef} style={{
        maxWidth: 1200, margin: "0 auto", textAlign: "center",
        opacity: savingsVisible ? 1 : 0,
        transform: savingsVisible ? "translateY(0)" : "translateY(30px)",
        transition: "opacity 0.7s, transform 0.7s",
      }}>
        {/*
         * "This single catch…" paragraph:
         *   mobile:  11px → 8.25px, lineHeight 1.5
         *   desktop: 60px → 45px, lineHeight 70px → 52.5px
         */}
        <p style={{
          fontFamily: "Inter",
          fontSize: isMobile ? "8.25px" : "45px",
          color: "rgba(255,255,255,0.8)",
          marginBottom: 16,
          lineHeight: isMobile ? 1.5 : "52.5px",
        }}>
          This single catch saved <span style={{ color: "#CE1010", fontWeight: 700 }}>Zap Logistics</span> nearly
        </p>
        {/*
         * "₹16 lakh…" h2:
         *   mobile:  33px → 24.75px
         *   desktop: 120px → 90px
         */}
        <h2 style={{
          fontFamily: "Inter",
          fontSize: isMobile ? "27.75px" : "90px",
          fontWeight: 700, color: "white",
          lineHeight: 1.05, margin: "0 0 24px",
        }}>
          {/* <span style={{ color: "#CE1010" }}>₹</span>16 lakh <br /> in potential theft and fraud */}
          <span style={{ color: "#CE1010" }}>₹</span>16 lakh {!isMobile && <br />} in potential theft and fraud
        </h2>
        {/*
         * Footer paragraph:
         *   mobile:  14px → 10.5px, lineHeight 1.6
         *   desktop: 30px → 22.5px, lineHeight 36px → 27px
         */}
        <p style={{
          fontFamily: "Inter",
          fontSize: isMobile ? "10.5px" : "22.5px",
          color: "white",
          lineHeight: isMobile ? 1.6 : "27px",
          maxWidth: 1100, margin: "0 auto",
          fontWeight: 300,
        }}>
          More importantly, it stopped countless bad actors from entering customer homes under the mask of a 'verified' agent. The entire operation was shut down
        </p>
      </div>
    </section>
  );
}