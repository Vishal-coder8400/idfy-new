import { useEffect, useRef, useState } from "react";
import '../index.css';

export default function HeroSection() {
    const [vw, setVw] = useState(0);
    const sectionRef = useRef(null);

    useEffect(() => {
        const update = () => setVw(window.innerWidth);
        update();
        window.addEventListener("resize", update, { passive: true });
        return () => window.removeEventListener("resize", update);
    }, []);

    const isMobile = vw > 0 && vw < 600;
    const isTablet = vw >= 600 && vw < 1024;

    const titleFontSize = isMobile ? "29px" : isTablet ? "64px" : "120px";
    const subtitleFontSize = isMobile ? "16px" : isTablet ? "24px" : "52px";
    const textMaxWidth = isMobile ? "90vw" : "98vw";

    return (
        <div ref={sectionRef} style={{ height: "100vh", position: "relative" }}>
            <div
                id="home-banner"
                style={{
                    position: "relative",
                    top: 0,
                    height: "100vh",
                    overflow: "hidden",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                {/* Background video - replaces background image */}
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    preload="auto"
                    style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        zIndex: 0,
                        pointerEvents: "none",
                    }}
                >
                    <source src="/assets/Gradient Background.mp4" type="video/mp4" />
                </video>

                {/* Grid background - KEPT ORIGINAL */}
                <div
                    style={{
                        position: "absolute",
                        inset: 0,
                        zIndex: 1,
                        backgroundImage:
                            "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px)," +
                            "linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
                        backgroundSize: "clamp(32px, 4vw, 48px) clamp(32px, 4vw, 48px)",
                    }}
                />

                {/* Title */}
                <div
                    style={{
                        position: "relative",
                        zIndex: 15,
                        textAlign: "center",
                        width: textMaxWidth,
                        maxWidth: "1300px",
                        padding: isMobile ? "0 20px" : "0",
                    }}
                >
                    <h1
                        style={{
                            fontFamily: "Inter",
                            fontSize: titleFontSize,
                            fontWeight: 900,
                            color: "white",
                            margin: 0,
                            lineHeight: isMobile ? 1.2 : 1.05,
                            whiteSpace: "normal",
                            overflowWrap: "break-word",
                            wordBreak: "break-word",
                            letterSpacing: "-0.02em",
                        }}
                    >
                        The Trust Gap in the
                        <br />
                        Gig Economy
                    </h1>

                    {/* Subtitle */}
                    <p
                        style={{
                            fontSize: subtitleFontSize,
                            fontWeight: 500,
                            color: "white",
                            margin: 0,
                            lineHeight: 1.4,
                            opacity: 0.88,
                            marginTop: isMobile ? "20px" : "30px",
                            maxWidth: "800px",
                            marginLeft: "auto",
                            marginRight: "auto",
                            padding: isMobile ? "0 10px" : "0",
                        }}
                    >
                        Exposing the true scale of fraud in India's workforce
                    </p>
                </div>
            </div>
        </div>
    );
}