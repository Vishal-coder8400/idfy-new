import { useEffect, useState } from "react";
import { useInView } from "./helpers";

export default function WayForwardSection() {
  const [ref, visible] = useInView(0.15);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check, { passive: true });
    return () => window.removeEventListener("resize", check);
  }, []);

  return (
    <section className="flex justify-center" style={{
      background: "transparent", position: "relative",
      padding: isMobile ? "30px 5vw 50px" : "90px 5vw 100px",
      color: "white", fontFamily: "Inter",
      maxWidth: "100%", overflow: "hidden",
    }}>
      <div className="max-w-7xl w-full">

        {/* Ellipse handled by UnifiedBackground wrapper */}

        {/*
         * "Way Forward" h2:
         *   mobile:  48px → 36px; Tailwind sm:text-[96px] → sm:text-[72px]
         *   desktop: 120px → 90px
         */}
        <h2
          className="sm:text-[72px] text-[36px]"
          style={{
            fontWeight: 700, fontFamily: "Inter",
            background: "linear-gradient(180deg, rgba(255,255,255,0.95) 0%, rgba(170,170,200,0.5) 100%)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            textAlign: "center",
            marginBottom: isMobile ? "36px" : "70px",
            lineHeight: "1.05",
            fontSize: isMobile ? "36px" : "90px",
          }}
        >
          Way Forward
        </h2>

        <div ref={ref} style={{
          maxWidth: "1300px", margin: "0 auto",
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(50px)",
          transition: "all 1s ease-out",
        }}>
          <div style={{ paddingTop: "10px" }}>

            {/*
             * Subheading h2:
             *   mobile:  18px → 13.5px
             *   desktop: 30px → 22.5px
             */}
            <h2 className="text-center" style={{
              fontFamily: "Inter",
              fontSize: isMobile ? "13.5px" : "22.5px",
              lineHeight: "1.45",
              marginBottom: isMobile ? "18px" : "26px",
              fontWeight: 600,
              padding: isMobile ? "0 4px" : 0,
            }}>
              The gig economy is set to grow from 1 crore workers in 2025 to 2.35 crore by 2029–30.
            </h2>

            {/*
             * Body p:
             *   mobile:  15px → 11.25px; lineHeight 1.6
             *   desktop: 30px → 22.5px; lineHeight 40px → 30px
             * Bold span inside:
             *   mobile:  18px → 13.5px
             *   desktop: 30px → 22.5px
             */}
            <p className="text-center" style={{
              fontSize: isMobile ? "11.25px" : "22.5px",
              lineHeight: isMobile ? 1.6 : "30px",
              fontWeight: 300, marginBottom: "20px",
              color: "white", padding: isMobile ? "0 4px" : 0,
            }}>
              But such massive growth in hiring also puts the industry under regulators' risk radar.
              <br className="sm:flex hidden" />
              Think about how many delivery agents you meet in a day.
              <br />
              <span style={{
                display: "block",
                marginTop: isMobile ? "14px" : "20px",
                marginBottom: isMobile ? "14px" : "20px",
                fontSize: isMobile ? "13.5px" : "22.5px",
                fontWeight: 700, color: "white",
              }}>
                Now imagine the impact if even one of those interactions goes wrong.
              </span>
              <br className="sm:flex hidden" />
              With millions of daily customer touchpoints, companies are doubling down
              <br className="sm:flex hidden" />
              on making gig workers as secure and verified as their white-collar counterparts.
              <br className="sm:flex hidden" />
              In fact, AI-powered solutions already exist to keep fraudsters out of your gig workforce.
            </p>

            {/* "Are you ready" block */}
            <div style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: isMobile ? "8px" : "16px",
              marginTop: isMobile ? "32px" : "60px",
              marginBottom: isMobile ? "12px" : "26px",
              textAlign: "left",
              flexWrap: "nowrap",
              }}>
              <h2 style={{
                fontFamily: "Inter",
                fontSize: isMobile ? "14px" : "32px",
                fontWeight: 800,
                lineHeight: 1.1,
                margin: 0,
                textTransform: "uppercase",
                letterSpacing: "-0.01em",
                textAlign: "right",
              }}>
                <span style={{ color: "white" }}>The real question is &ndash; </span>
                <span style={{ color: "#CE1010" }}>Are you<br />ready to make that change</span>
              </h2>
              <span style={{
                fontFamily: "Inter",
                fontSize: isMobile ? "42px" : "96px",
                fontWeight: 800,
                color: "#CE1010",
                lineHeight: 1,
                alignSelf: "center",
                marginTop: isMobile ? "-4px" : "-10px",
              }}>
                ?
              </span>
            </div>
          </div>
        </div>

        {/* Infinite Logo Carousel */}
        <div style={{
          marginTop: isMobile ? "40px" : "80px",
          overflow: "hidden", width: "100%", position: "relative",
        }}>
          {/* Fade edges */}
          <div style={{
            position: "absolute", left: 0, top: 0, bottom: 0,
            width: isMobile ? "60px" : "120px", zIndex: 2,
            background: "linear-gradient(to right, black, transparent)",
            pointerEvents: "none",
          }} />
          <div style={{
            position: "absolute", right: 0, top: 0, bottom: 0,
            width: isMobile ? "60px" : "120px", zIndex: 2,
            background: "linear-gradient(to left, black, transparent)",
            pointerEvents: "none",
          }} />

          <style>{`
            @keyframes scroll-logos {
              0%   { transform: translateX(0); }
              100% { transform: translateX(-50%); }
            }
            .logo-track {
              display: flex;
              gap: ${isMobile ? "32px" : "64px"};
              width: max-content;
              animation: scroll-logos 18s linear infinite;
              align-items: center;
            }
          `}</style>

          <div className="logo-track">
            {[
              "zomato.png", "blinkit.png", "flipkart.png",
              "blackbug.png", "porter.png", "uber.png", "asianpaint.png",
              "zomato.png", "blinkit.png", "flipkart.png",
              "blackbug.png", "porter.png", "uber.png", "asianpaint.png",
            ].map((logo, i) => (
              <div key={i} style={{
                /*
                 * Logo container:
                 *   mobile:  56×56 → 42×42
                 *   desktop: 80×80 → 60×60
                 */
                width: isMobile ? "42px" : "60px",
                height: isMobile ? "42px" : "60px",
                flexShrink: 0, display: "flex",
                alignItems: "center", justifyContent: "center",
              }}>
                <img
                  src={`/assets/${logo}`}
                  alt={logo.replace(".png", "")}
                  style={{
                    /*
                     * Logo img:
                     *   mobile:  70×70 → 52.5×52.5
                     *   desktop: 100×100 → 75×75
                     */
                    width: isMobile ? "52.5px" : "75px",
                    height: isMobile ? "52.5px" : "75px",
                    objectFit: "contain",
                    filter: "brightness(0) invert(1)",
                    opacity: 0.75,
                  }}
                />
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}