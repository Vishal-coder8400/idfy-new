import { useState, useEffect, useRef, useCallback } from "react";

const MILES = [
  {
    id: "first", label: "First Mile",
    image: "/assets/firstMile.png",
    items: [
      { num: 1, title: "Warehouse pickers", desc: "Responsible for sorting goods at origin warehouses before dispatch." },
      { num: 2, title: "Dark-store associates", desc: "Operate out of high-density storage units in residential clusters." },
    ],
  },
  {
    id: "middle", label: "Middle Mile",
    image: "/assets/second-mile.png",
    items: [
      { num: 1, title: "Truck drivers", desc: "Transport goods between warehouses, hubs, and cities." },
      { num: 2, title: "Fleet operators", desc: "Manage movement from aggregation hubs to local distribution points." },
    ],
  },
  {
    id: "last", label: "Last Mile",
    image: "/assets/third-mile.png",
    items: [
      {
        num: 1,
        title: "Delivery partners",
        desc: "Handle final doorstep delivery - food, groceries, and parcels.",
      },
      {
        num: null,
        title: null,
        desc: "Factors such as high attrition, constant churn, frequent relocation, and flexible partner-based models (vs. full-time employment) increase verification complexity and compliance risk across these segments.",
      },
    ],
  },
];

const ANIM_MS = 500;
const EASE = "cubic-bezier(0.4, 0, 0.2, 1)";

function MileContent({ mile, layout }) {
  if (layout === "mobile") {
    return (
      <div style={{ width: "100%" }}>
        <div style={{
          width: "385px",
          aspectRatio: "4/3",
          borderRadius: 9,
          overflow: "hidden",
          background: "#f0eeeb",
          border: "1px solid #e5e5e5",
          marginBottom: 21,
          height: "180px",
        }}>
          <img
            src={mile.image}
            alt={mile.label}
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          />
        </div>
        <div style={{
          display: "grid",
          gridTemplateColumns: mile.id === "last" ? "1fr" : "1fr 1fr",
          gap: "15px 12px",
        }}>
          {mile.items.map((item, i) => (
            <div key={i} style={{ textAlign: "center" }}>
              {item.title && (
                <h3 style={{
                  fontFamily: "Inter",
                  fontSize: "11.25px",
                  fontWeight: 700,
                  color: "#1C43B9",
                  marginBottom: 6,
                  lineHeight: 1.3,
                }}>
                  {item.num}.&nbsp;{item.title}
                </h3>
              )}
              <p style={{
                fontSize: mile.id === "last" && !item.title ? "7.5px" : "8.25px",
                color: "#5D5D5D",
                lineHeight: 1.65,
                fontFamily: "Inter",
                margin: 0,
              }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (layout === "tablet") {
    return (
      <div style={{ width: "100%" }}>
        <div style={{
          width: "100%",
          aspectRatio: "16/7",
          borderRadius: 9,
          overflow: "hidden",
          background: "#f0eeeb",
          border: "1px solid #e5e5e5",
          marginBottom: 24,
        }}>
          <img
            src={mile.image}
            alt={mile.label}
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          />
        </div>
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "18px 30px",
        }}>
          {mile.items.map((item, i) => (
            <div key={i}>
              {item.title && (
                <h3 style={{
                  fontFamily: "Inter",
                  fontSize: "15px",
                  fontWeight: 700,
                  color: "#1C43B9",
                  marginBottom: 7.5,
                  lineHeight: 1.3,
                }}>
                  {item.num}.&nbsp;{item.title}
                </h3>
              )}
              <p style={{
                fontSize: "11.25px",
                color: "#5D5D5D",
                lineHeight: "16.5px",
                fontFamily: "Inter",
                margin: 0,
              }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Desktop
  return (
    <div style={{
      display: "flex",
      gap: 75,
      alignItems: "stretch",
      width: "100%",
      justifyContent: "center",
    }}>
      <div style={{
        flexShrink: 0,
        width: 285,
        minHeight: 225,
        borderRadius: 7.5,
        overflow: "hidden",
        background: "#f0eeeb",
        border: "1px solid #e5e5e5",
      }}>
        <img
          src={mile.image}
          alt={mile.label}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center",
            display: "block",
          }}
        />
      </div>
      <div style={{
        flex: 1,
        paddingTop: 6,
        textAlign: "left",
        maxWidth: 315,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}>
        {mile.items.map((item, i) => (
          <div key={i} style={{ marginBottom: i < mile.items.length - 1 ? 36 : 0 }}>
            {item.title && (
              <h3 style={{
                fontFamily: "Inter",
                fontSize: "clamp(16.5px, 1.5vw, 22.5px)",
                fontWeight: 700,
                color: "#1C43B9",
                marginBottom: 9,
                lineHeight: 1.3,
              }}>
                {item.num}.&nbsp;{item.title}
              </h3>
            )}
            <p style={{
              fontSize: "clamp(13.5px, 1.2vw, 15px)",
              color: "#5D5D5D",
              lineHeight: 1.5,
              fontFamily: "Inter",
              margin: 0,
            }}>{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function PeopleSection() {
  const [active, setActive] = useState(0);
  const [animState, setAnimState] = useState(null);
  const [layout, setLayout] = useState("desktop");
  const timerRef = useRef(null);
  const autoCycleRef = useRef(null);
  const rafRef = useRef(null);

  const wrapperRef = useRef(null);
  const activeRef = useRef(0);
  const animLockedRef = useRef(false);

  const [isLargeDesktop, setIsLargeDesktop] = useState(false);

  useEffect(() => {
    const check = () => {
      const w = window.innerWidth;
      if (w < 640) setLayout("mobile");
      else if (w < 1100) setLayout("tablet");
      else setLayout("desktop");
      setIsLargeDesktop(w >= 1400);
    };
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const isMobile = layout === "mobile";
  const isTablet = layout === "tablet";

  const go = useCallback((idx) => {
    if (idx === activeRef.current) return;
    if (animLockedRef.current) {
      clearTimeout(timerRef.current);
      animLockedRef.current = false;
    }
    const dir = idx > activeRef.current ? "left" : "right";
    const from = activeRef.current;

    animLockedRef.current = true;
    setAnimState({ from, to: idx, dir });

    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      activeRef.current = idx;
      animLockedRef.current = false;
      setActive(idx);
      setAnimState(null);
    }, ANIM_MS);
  }, []);

  // Auto-cycle for mobile (every 3 seconds)
  useEffect(() => {
    if (!isMobile) return;
    autoCycleRef.current = setInterval(() => {
      const next = (activeRef.current + 1) % MILES.length;
      go(next);
    }, 3000);
    return () => clearInterval(autoCycleRef.current);
  }, [isMobile, go]);

  // Scroll-driven for tablet/desktop
  useEffect(() => {
    if (isMobile) return;

    const handleScroll = () => {
      if (rafRef.current) return;
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = null;
        if (!wrapperRef.current) return;
        const rect = wrapperRef.current.getBoundingClientRect();
        const wrapperHeight = wrapperRef.current.offsetHeight;
        const vh = window.innerHeight;
        const scrolled = -rect.top;
        const totalScrollable = wrapperHeight - vh;
        if (scrolled < 0 || scrolled > totalScrollable) return;
        const progress = scrolled / totalScrollable;
        const newIndex = Math.min(
          Math.floor(progress * MILES.length),
          MILES.length - 1
        );
        go(newIndex);
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [isMobile, go]);

  useEffect(() => () => clearTimeout(timerRef.current), []);

  const isAnim = animState !== null;
  const fromIdx = animState?.from;
  const toIdx = animState?.to ?? active;
  const dir = animState?.dir ?? "left";
  const exitKF = dir === "left" ? "pexit-left" : "pexit-right";
  const enterKF = dir === "left" ? "penter-right" : "penter-left";

  const DOT_POSITIONS = isMobile ? ["18%", "50%", "82%"] : ["20%", "50%", "80%"];

  const headingSize = isMobile
    ? "22.5px"
    : isTablet
      ? "45px"
      : "clamp(60px, 6vw, 82.5px)";

  const subSize = isMobile
    ? "8.25px"
    : isTablet
      ? "12px"
      : "clamp(13.5px, 1.2vw, 21px)";

  const subLine = isMobile
    ? "11.25px"
    : isTablet
      ? "18px"
      : "clamp(21px, 1.875vw, 30px)";

  const sectionPad = isMobile
    ? "30px 3vw 36px"
    : isTablet
      ? "36px 4.5vw 42px"
      : "clamp(24px, 3vh, 48px) 3.75vw clamp(18px, 2.25vh, 36px)";

  const contentMinH = isMobile ? 390 : isTablet ? 360 : 345;

  // ── Mobile: plain div (no scroll-jacking) ──────────────────────────────────
  if (isMobile) {
    return (
      <div style={{ position: "relative" }}>
        <section style={{
          background: "#fff",
          borderRadius: "0px 0px 23px 23px",
          overflow: "hidden",
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}>
          <style>{`
            @keyframes pexit-left   { from{transform:translateX(0);opacity:1}    to{transform:translateX(-105%);opacity:0} }
            @keyframes pexit-right  { from{transform:translateX(0);opacity:1}    to{transform:translateX(105%);opacity:0}  }
            @keyframes penter-right { from{transform:translateX(105%);opacity:0}  to{transform:translateX(0);opacity:1}    }
            @keyframes penter-left  { from{transform:translateX(-105%);opacity:0} to{transform:translateX(0);opacity:1}    }
            @keyframes ppulse {
              0%  { transform:translate(-50%,-50%) scale(1);   opacity:.8; }
              100%{ transform:translate(-50%,-50%) scale(2.2); opacity:0;  }
            }
          `}</style>

          {/* Heading */}
          <div style={{
            textAlign: "center",
            padding: "30px 3vw 12px",
            marginBottom: 12,
          }}>
            <h2 style={{
              fontFamily: "Inter",
              fontWeight: 700,
              color: "#343434",
              lineHeight: 1.03,
              margin: "0 0 18px",
              fontSize: headingSize,
            }}>
              The people who powered this evolution
            </h2>
            <p style={{
              fontSize: subSize,
              color: "#5D5D5D",
              lineHeight: subLine,
              maxWidth: 675,
              margin: "0 auto",
              fontFamily: "Inter",
              fontWeight: 300,
            }}>
              The gig workforce spans the entire supply chain, from first-mile
              operations to last-mile delivery.
            </p>
          </div>

          <div style={{
            maxWidth: 990,
            margin: "0 auto",
            padding: "0 3vw",
            width: "100%",
          }}>

            {/* Timeline */}
            <div style={{ marginBottom: 27 }}>
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "0 18%",
                marginBottom: 7.5,
              }}>
                {MILES.map((mile, i) => (
                  <button
                    key={mile.id}
                    onClick={() => go(i)}
                    style={{
                      background: "none", border: "none",
                      cursor: "pointer",
                      padding: 0, width: 0, display: "flex",
                      flexDirection: "column", alignItems: "center",
                      overflow: "visible",
                    }}
                  >
                    <span style={{
                      fontFamily: "Inter",
                      fontSize: 9.75,
                      fontWeight: 700,
                      color: "#e53e3e",
                      opacity: toIdx === i ? 1 : 0.5,
                      transition: "opacity 0.3s",
                      whiteSpace: "nowrap",
                    }}>{mile.label}</span>
                  </button>
                ))}
              </div>

              <div style={{ position: "relative", height: 21 }}>
                <div style={{
                  position: "absolute",
                  top: "50%", left: 0, right: 0,
                  height: 1.5, background: "#e53e3e",
                  transform: "translateY(-50%)",
                }} />

                {MILES.map((mile, i) => {
                  const isActive = toIdx === i;
                  return (
                    <button
                      key={mile.id}
                      onClick={() => go(i)}
                      style={{
                        position: "absolute",
                        left: DOT_POSITIONS[i],
                        top: "50%",
                        transform: "translate(-50%, -50%)",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        padding: 0,
                        width: isActive ? 21 : 12,
                        height: isActive ? 21 : 12,
                        transition: "width 0.3s, height 0.3s",
                      }}
                    >
                      <div style={{
                        width: "100%", height: "100%",
                        borderRadius: "50%",
                        background: "#e53e3e",
                        border: isActive ? "3px solid #fff" : "none",
                        boxShadow: isActive ? "0 0 0 3px #e53e3e" : "none",
                        transition: "all 0.35s cubic-bezier(0.34,1.56,0.64,1)",
                        position: "relative",
                      }}>
                        {isActive && (
                          <span style={{
                            position: "absolute",
                            top: "50%", left: "50%",
                            width: "100%", height: "100%",
                            borderRadius: "50%",
                            border: "2px solid rgba(229,62,62,0.4)",
                            animation: "ppulse 1.5s ease-out infinite",
                          }} />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Content panel */}
            <div style={{ position: "relative", overflow: "hidden", minHeight: contentMinH }}>
              {isAnim && (
                <div style={{
                  position: "absolute", top: 0, left: 0, right: 0,
                  animation: `${exitKF} ${ANIM_MS}ms ${EASE} forwards`,
                }}>
                  <MileContent mile={MILES[fromIdx]} layout={layout} />
                </div>
              )}
              <div style={{ animation: isAnim ? `${enterKF} ${ANIM_MS}ms ${EASE} forwards` : "none" }}>
                <MileContent mile={MILES[toIdx]} layout={layout} />
              </div>
            </div>

          </div>
        </section>
      </div>
    );
  }

  // ── Tablet / Desktop: original scroll-jacking wrapper ─────────────────────
  return (
    <div ref={wrapperRef} style={{ height: "300vh", position: "relative" }}>
      <section style={{
        background: "#fff",
        borderRadius: "0px 0px 23px 23px",
        position: "sticky",
        top: 0,
        height: "100vh",
        overflow: "hidden",
        boxSizing: "border-box",
        paddingTop: isTablet ? 16 : "clamp(8px, 1.5vh, 20px)",
        paddingBottom: isTablet ? 60 : "clamp(30px, 4.5vh, 60px)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
      }}>
        <style>{`
          @keyframes pexit-left   { from{transform:translateX(0);opacity:1}    to{transform:translateX(-105%);opacity:0} }
          @keyframes pexit-right  { from{transform:translateX(0);opacity:1}    to{transform:translateX(105%);opacity:0}  }
          @keyframes penter-right { from{transform:translateX(105%);opacity:0}  to{transform:translateX(0);opacity:1}    }
          @keyframes penter-left  { from{transform:translateX(-105%);opacity:0} to{transform:translateX(0);opacity:1}    }
          @keyframes ppulse {
            0%  { transform:translate(-50%,-50%) scale(1);   opacity:.8; }
            100%{ transform:translate(-50%,-50%) scale(2.2); opacity:0;  }
          }
        `}</style>

        {/* Heading */}
        <div style={{
          textAlign: "center",
          padding: "0 3.75vw clamp(12px, 1.5vh, 24px)",
          marginBottom: 12,
        }}>
          <h2 style={{
            fontFamily: "Inter",
            fontWeight: 700,
            color: "#343434",
            lineHeight: 1.03,
            margin: "0 0 18px",
            fontSize: headingSize,
            marginTop: 0,
          }}>
            The people who{" "}
            <br />
            powered this evolution
          </h2>
          <p style={{
            fontSize: subSize,
            color: "#5D5D5D",
            lineHeight: subLine,
            maxWidth: isLargeDesktop ? 735 : 675,
            margin: "0 auto",
            fontFamily: "Inter",
            fontWeight: 300,
          }}>
            The gig workforce spans the entire supply chain, from first-mile
            operations to last-mile delivery.
          </p>
        </div>

        <div style={{
          maxWidth: 990,
          margin: "0 auto",
          padding: isTablet ? "0 4.5vw" : "0 3.75vw",
          width: "100%",
        }}>

          {/* Timeline */}
          <div style={{ marginBottom: 39 }}>
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "0 20%",
              marginBottom: 7.5,
            }}>
              {MILES.map((mile, i) => (
                <button
                  key={mile.id}
                  onClick={() => go(i)}
                  style={{
                    background: "none", border: "none",
                    cursor: animState ? "default" : "pointer",
                    padding: 0, width: 0, display: "flex",
                    flexDirection: "column", alignItems: "center",
                    overflow: "visible",
                  }}
                >
                  <span style={{
                    fontFamily: "Inter",
                    fontSize: isTablet ? 11.25 : 12,
                    fontWeight: 700,
                    color: "#e53e3e",
                    opacity: toIdx === i ? 1 : 0.5,
                    transition: "opacity 0.3s",
                    whiteSpace: "nowrap",
                  }}>{mile.label}</span>
                </button>
              ))}
            </div>

            <div style={{ position: "relative", height: 21 }}>
              <div style={{
                position: "absolute",
                top: "50%", left: 0, right: 0,
                height: 1.5, background: "#e53e3e",
                transform: "translateY(-50%)",
              }} />

              {MILES.map((mile, i) => {
                const isActive = toIdx === i;
                return (
                  <button
                    key={mile.id}
                    onClick={() => go(i)}
                    style={{
                      position: "absolute",
                      left: DOT_POSITIONS[i],
                      top: "50%",
                      transform: "translate(-50%, -50%)",
                      background: "none",
                      border: "none",
                      cursor: animState ? "default" : "pointer",
                      padding: 0,
                      width: isActive ? 21 : 12,
                      height: isActive ? 21 : 12,
                      transition: "width 0.3s, height 0.3s",
                    }}
                  >
                    <div style={{
                      width: "100%", height: "100%",
                      borderRadius: "50%",
                      background: "#e53e3e",
                      border: isActive ? "3px solid #fff" : "none",
                      boxShadow: isActive ? "0 0 0 3px #e53e3e" : "none",
                      transition: "all 0.35s cubic-bezier(0.34,1.56,0.64,1)",
                      position: "relative",
                    }}>
                      {isActive && (
                        <span style={{
                          position: "absolute",
                          top: "50%", left: "50%",
                          width: "100%", height: "100%",
                          borderRadius: "50%",
                          border: "2px solid rgba(229,62,62,0.4)",
                          animation: "ppulse 1.5s ease-out infinite",
                        }} />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Content panel */}
          <div style={{ position: "relative", overflow: "hidden", minHeight: contentMinH }}>
            {isAnim && (
              <div style={{
                position: "absolute", top: 0, left: 0, right: 0,
                animation: `${exitKF} ${ANIM_MS}ms ${EASE} forwards`,
              }}>
                <MileContent mile={MILES[fromIdx]} layout={layout} />
              </div>
            )}
            <div style={{ animation: isAnim ? `${enterKF} ${ANIM_MS}ms ${EASE} forwards` : "none" }}>
              <MileContent mile={MILES[toIdx]} layout={layout} />
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}