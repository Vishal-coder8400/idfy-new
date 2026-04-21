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

  return (
    <section style={{
      background: "transparent",
      padding: isMobile ? "20px 6vw 50px" : "30px 6vw 80px",
      textAlign: "center",
    }}>

      {/*
       * "Case Files" h1
       */}
      <h1 className="sm:text-[105px] text-[90px]" style={{
        fontFamily: "Inter",
        fontWeight: 700,
        background: "linear-gradient(180deg, rgba(255,255,255,0.95) 0%, rgba(180,180,200,0.55) 100%)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
        lineHeight: 1.0, margin: isMobile ? "0 0 8px" : "0 0 18px",
        fontSize: isMobile ? "36px" : "90px",
      }}>
        Case Files
      </h1>

      {/*
       * Subtitle p
       */}
      <p style={{
        fontFamily: "Inter",
        fontSize: isMobile ? "12px" : "22.5px",
        color: "rgba(255,255,255,0.85)",
        marginBottom: isMobile ? 18 : 35,
        marginTop: 0,
      }}>
        A closer look at real employee fraud cases
      </p>

      {/*
       * Case title h2
       */}
      <h2 style={{
        fontFamily: "Inter",
        fontSize: isMobile ? "16px" : "33.75px",
        fontWeight: 800, color: "white",
        marginTop: 0,
        marginBottom: isMobile ? 22 : 40,
      }}>
        The Fake Referral Ring
      </h2>

      {/* Two suspect cards */}
      <div ref={ref} style={{
        display: "grid",
        gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fit, minmax(300px, 1fr))",
        gap: 20, maxWidth: 980, margin: "0 auto",
      }}>

        {/* Suspect 1 */}
        <div style={{
          background: "rgba(255,255,255,0.05)",
          border: "1px solid rgba(255,255,255,0.12)",
          borderRadius: 16,
          padding: isMobile ? "24px 20px" : "32px 28px",
          textAlign: "left",
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(30px)",
          transition: "opacity 0.6s, transform 0.6s",
        }}>
          {/*
           * "Suspect 1" label:
           *   mobile:  18px → 13.5px
           *   desktop: 24px → 18px
           */}
          <p style={{
            fontFamily: "Inter",
            fontSize: isMobile ? "13.5px" : 18,
            fontWeight: 700, color: "#CE1010",
            marginBottom: 28, letterSpacing: 0.2,
          }}>Suspect 1</p>

          <div style={{ display: "flex", gap: isMobile ? 16 : 24, alignItems: "flex-start" }}>
            <div style={{ flex: 1 }}>
              {[
                { label: "Name", value: "Vishal Taleja" },
                { label: "Date of Birth", value: "18th April 1995" },
                { label: "Gender", value: "Male" },
              ].map(row => (
                <div key={row.label} style={{ marginBottom: isMobile ? 14 : 20 }}>
                  {/*
                   * field label:
                   *   mobile:  12px → 9px
                   *   desktop: 14px → 10.5px
                   */}
                  <p style={{
                    fontFamily: "Inter",
                    fontSize: isMobile ? "9px" : 10.5,
                    color: "rgba(255,255,255,0.45)", margin: "0 0 4px",
                  }}>{row.label}</p>
                  {/*
                   * field value:
                   *   mobile:  15px → 11.25px
                   *   desktop: 22px → 16.5px
                   */}
                  <p style={{
                    fontFamily: "Inter",
                    fontSize: isMobile ? "11.25px" : 16.5,
                    fontWeight: 700, color: "white", margin: 0,
                  }}>{row.value}</p>
                </div>
              ))}
            </div>

            {/*
             * Suspect 1 photo container:
             *   mobile:  140×168 → 105×126
             *   desktop: 180×216 → 135×162
             */}
            <div style={{
              width: isMobile ? 105 : 135,
              height: isMobile ? 126 : 162,
              flexShrink: 0, borderRadius: 8, overflow: "hidden",
              border: "14px solid rgba(255,255,255,1)",
            }}>
              <img
                src="/assets/suspect1.png" alt="Vishal Taleja"
                style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top" }}
              />
            </div>
          </div>
        </div>

        {/* Accomplices */}
        <div style={{
          background: "rgba(255,255,255,0.05)",
          borderRadius: 16,
          padding: isMobile ? "24px 20px" : "32px 28px",
          textAlign: "left",
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(30px)",
          transition: "opacity 0.6s 0.15s, transform 0.6s 0.15s",
        }}>
          {/* "The Accomplice…": 18→13.5, 24→18 */}
          <p style={{
            fontFamily: "Inter",
            fontSize: isMobile ? "13.5px" : 18,
            fontWeight: 700, color: "#CE1010", marginBottom: 28,
          }}>The Accomplice Vishal's friends</p>

          <div style={{ display: "flex", gap: isMobile ? 16 : 24, alignItems: "flex-start" }}>
            <div style={{ flex: 1 }}>
              {["Rahul", "Chavan", "Trivam"].map((name, i) => (
                <div key={name} style={{ marginBottom: isMobile ? 14 : 22 }}>
                  {/* label: 12→9, 14→10.5 */}
                  <p style={{
                    fontFamily: "Inter",
                    fontSize: isMobile ? "9px" : 10.5,
                    color: "rgba(255,255,255,0.45)", margin: "0 0 4px",
                  }}>Friend {i + 1}</p>
                  {/* value: 15→11.25, 22→16.5 */}
                  <p style={{
                    fontFamily: "Inter",
                    fontSize: isMobile ? "11.25px" : 16.5,
                    fontWeight: 700, color: "white", margin: 0,
                  }}>{name}</p>
                </div>
              ))}
            </div>

            {/*
             * Stacked friend photos container:
             *   mobile:  190×220 → 142.5×165
             *   desktop: 230×260 → 172.5×195
             * Individual photo boxes:
             *   mobile:  88×105 → 66×78.75
             *   desktop: 108×130 → 81×97.5
             */}
            <div style={{
              position: "relative",
              width: isMobile ? "142.5px" : "172.5px",
              height: isMobile ? "165px" : "195px",
              flexShrink: 0,
            }}>
              {/* Rahul — top left */}
              <div style={{
                position: "absolute", top: 0, left: 0,
                width: isMobile ? 66 : 81,
                height: isMobile ? 79 : 97,
                borderRadius: 6, border: "6px solid white",
                boxShadow: "0 4px 16px rgba(0,0,0,0.5)",
                zIndex: 1, overflow: "hidden",
              }}>
                <img src="/assets/rahul.png" alt="Rahul"
                  style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top", display: "block" }} />
              </div>

              {/* Chavan — top right */}
              <div style={{
                position: "absolute", top: 0,
                left: isMobile ? 72 : 88,
                width: isMobile ? 66 : 81,
                height: isMobile ? 79 : 97,
                borderRadius: 6, border: "6px solid white",
                boxShadow: "0 4px 16px rgba(0,0,0,0.5)",
                zIndex: 1, overflow: "hidden",
              }}>
                <img src="/assets/chavam.png" alt="Chavan"
                  style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top", display: "block" }} />
              </div>

              {/* Trivam — bottom center */}
              <div style={{
                position: "absolute",
                top: isMobile ? 67 : 85,
                left: isMobile ? 33 : 40,
                width: isMobile ? 66 : 81,
                height: isMobile ? 79 : 97,
                borderRadius: 6, border: "6px solid white",
                boxShadow: "0 4px 16px rgba(0,0,0,0.5)",
                zIndex: 0, overflow: "hidden", rotate: "7deg",
              }}>
                <img src="/assets/rahul.png" alt="Trivam"
                  style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top", display: "block" }} />
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}