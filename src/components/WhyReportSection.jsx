import { useEffect, useRef, useState } from "react";

function CountUp({ target, duration = 1800, trigger }) {
  const [val, setVal] = useState(0);
  const raf = useRef(null);
  useEffect(() => {
    if (!trigger) return;
    const start = performance.now();
    const run = (now) => {
      const t = Math.min((now - start) / duration, 1);
      const e = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
      setVal(+(target * e).toFixed(1));
      if (t < 1) raf.current = requestAnimationFrame(run);
      else setVal(target);
    };
    raf.current = requestAnimationFrame(run);
    return () => cancelAnimationFrame(raf.current);
  }, [trigger, target, duration]);
  return <>{val}</>;
}

function useVisible(layoutKey) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    setVisible(false);
    const t = setTimeout(() => setVisible(true), 250);
    return () => clearTimeout(t);
  }, [layoutKey]);
  return [ref, visible];
}

const AIMS = [
  "Understanding the fraud-prone segments of the gig economy workforce",
  "Examining structural blind spots in the current risk assessment processes",
  "Quantifying these blind spots, uncovering fraud patterns, and highlighting where risk is quietly concentrating",
  "Covering real-life fraud stories that IDfy witnessed last year",
];

export default function WhyReportSection() {
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== "undefined" && window.innerWidth < 768
  );
  const [ref, visible] = useVisible(isMobile);

  useEffect(() => {
    const update = () => setIsMobile(window.innerWidth < 768);
    update();
    window.addEventListener("resize", update, { passive: true });
    return () => window.removeEventListener("resize", update);
  }, []);

  return (
    <section style={{
      background: "#fff",
      padding: "clamp(20px, 4vw, 100px) clamp(5vw, 8vw, 8vw) clamp(48px, 8vw, 100px)",
      fontFamily: "Inter",
    }}>
      {/* h2: 22px→16.5, 5vw→3.75, 60px→45 */}
      <h2 style={{
        fontWeight: 700, fontFamily: "Inter", color: "#343434",
        textAlign: "center",
        fontSize: "clamp(16.5px, 3.75vw, 45px)",
        marginTop: 0,
        marginBottom: "clamp(20px, 4vw, 72px)",
        letterSpacing: "-0.02em",
      }}>
        Why we put this report together
      </h2>

      {isMobile ? (
        <div ref={ref} style={{ width: "100%", display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{
            textAlign: "center",
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(20px)",
            transition: "opacity 0.5s ease, transform 0.5s ease",
          }}>
            {/* "We analyzed over": 20px→15, 5vw→3.75, 30px→22.5 */}
            <p style={{ fontSize: "clamp(15px, 3.75vw, 22.5px)", color: "#4b5563", fontWeight: 400, margin: "0 0 4px 0", lineHeight: 1.5 }}>
              We analyzed over
            </p>
            {/* inline red number + label: 14px→10.5, 3.5vw→2.625, 17px→12.75 */}
            <p style={{ fontSize: "clamp(10.5px, 2.625vw, 12.75px)", color: "#343434", fontWeight: 500, margin: 0, lineHeight: 1.6 }}>
              <span style={{ fontSize: "clamp(11.25px, 2.625vw, 12.75px)", fontWeight: 700, color: "#CE1010", verticalAlign: "middle", marginRight: 6 }}>
                <CountUp target={5.8} trigger={visible} duration={1600} />M
              </span>
              <span style={{ fontWeight: 700, color: "#343434", fontSize: "clamp(11.25px, 2.625vw, 12.75px)" }}>
                Background Verifications
              </span>
            </p>
            {/* "conducted last year": 12px→9, 3vw→2.25, 14px→10.5 */}
            <p style={{ fontSize: "clamp(9px, 2.25vw, 10.5px)", color: "#5a6874", margin: "6px 0 0 0", fontWeight: 300, lineHeight: "13px" }}>
              conducted last year to build this report,
            </p>
          </div>

          <div style={{
            background: "#EEEEEE", borderRadius: 20, padding: "20px 18px", border: "1px solid #e2e2e2",
            opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(20px)",
            transition: "opacity 0.6s 0.15s, transform 0.6s 0.15s",
          }}>
            {/* "with the aim of": 12px→9, 3vw→2.25, 13px→9.75 */}
            <p style={{ fontSize: "clamp(9px, 2.25vw, 9.75px)", color: "#343434", fontWeight: 700, marginBottom: 16, letterSpacing: "0.4px" }}>
              with the aim of
            </p>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 12 }}>
              {AIMS.map((aim, i) => (
                <li key={i} style={{
                  display: "flex", gap: 12, alignItems: "flex-start",
                  opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(12px)",
                  transition: `opacity 0.4s ${0.2 + i * 0.08}s, transform 0.4s ${0.2 + i * 0.08}s`,
                }}>
                  <span style={{ flexShrink: 0, width: 7, height: 7, borderRadius: "50%", background: "#d93025", marginTop: 4 }} />
                  {/* aim text: 12px→9, 3vw→2.25, 13px→9.75 */}
                  <span style={{ fontSize: "clamp(9px, 2.25vw, 9.75px)", color: "#2c3e4f", lineHeight: 1.6, fontWeight: 400 }}>{aim}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

      ) : (
        <div style={{ display: "flex", justifyContent: "center", width: "100%" }}>
          <div style={{ display: "grid", gridTemplateColumns: "0.55fr 1.45fr", gap: "clamp(48px, 8vw, 120px)", width: "100%", maxWidth: 900, alignItems: "start" }}>
            <div>
              <div ref={ref} style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", paddingTop: 12 }}>
                {/* "We analyzed over": 18px→13.5, 2.5vw→1.875, 30px→22.5 */}
                <p style={{
                  fontSize: "clamp(13.5px, 1.875vw, 22.5px)", color: "#4b5563", fontWeight: 500,
                  margin: "0 0 8px 0", lineHeight: "115%",
                  opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(20px)",
                  transition: "opacity 0.5s ease, transform 0.5s ease",
                }}>We analyzed over</p>

                {/* big red number: 60px→45, 10vw→7.5, 120px→90 */}
                <div style={{
                  fontSize: "clamp(45px, 7.5vw, 90px)", fontWeight: 700, color: "#CE1010",
                  lineHeight: 1, letterSpacing: "-0.02em", margin: "12px 0 8px",
                  opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(20px)",
                  transition: "opacity 0.5s 0.05s, transform 0.5s 0.05s",
                }}>
                  <CountUp target={5.8} trigger={visible} duration={1600} />M
                </div>

                {/* "Background Verifications": 20px→15, 4vw→3, 50px→37.5 */}
                <p style={{
                  fontSize: "clamp(15px, 3vw, 37.5px)", fontWeight: 700, color: "#343434",
                  lineHeight: 1.2, margin: "16px 0 24px",
                  opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(20px)",
                  transition: "opacity 0.5s 0.1s, transform 0.5s 0.1s",
                }}>Background<br />Verifications</p>

                {/* "conducted last year": 16px→12, 2.5vw→1.875, 30px→22.5 */}
                <p style={{
                  fontSize: "clamp(12px, 1.875vw, 22.5px)", color: "#5a6874", margin: 0,
                  fontWeight: 300, lineHeight: "1.4",
                  opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(20px)",
                  transition: "opacity 0.5s 0.15s, transform 0.5s 0.15s",
                }}>conducted last year to build this report,</p>
              </div>
            </div>

            <div>
              <div style={{
                background: "#EEEEEE", borderRadius: 28, padding: "clamp(24px, 3vw, 44px) clamp(24px, 3.5vw, 48px)",
                border: "1px solid #e8e8e8",
                opacity: visible ? 1 : 0, transform: visible ? "translateX(0)" : "translateX(24px)",
                transition: "opacity 0.6s 0.2s, transform 0.6s 0.2s",
              }}>
                {/* "with the aim of": 13px→9.75, 1.2vw→0.9, 16px→12 */}
                <p style={{ fontSize: "clamp(9.75px, 0.9vw, 12px)", color: "#343434", fontWeight: 700, marginBottom: 28, letterSpacing: "0.5px" }}>
                  with the aim of
                </p>
                <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 20 }}>
                  {AIMS.map((aim, i) => (
                    <li key={i} style={{
                      display: "flex", gap: 16, alignItems: "flex-start",
                      opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(12px)",
                      transition: `opacity 0.4s ${0.25 + i * 0.08}s, transform 0.4s ${0.25 + i * 0.08}s`,
                    }}>
                      <span style={{ flexShrink: 0, width: 8, height: 8, borderRadius: "50%", background: "#d93025", marginTop: 6 }} />
                      {/* aim text: 14px→10.5, 1.5vw→1.125, 20px→15 */}
                      <span style={{ fontSize: "clamp(10.5px, 1.125vw, 15px)", color: "#2c3e4f", lineHeight: 1.6, fontWeight: 400 }}>{aim}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}