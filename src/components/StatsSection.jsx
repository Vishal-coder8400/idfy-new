import { useEffect, useRef, useState } from "react";
import { useInView } from "./helpers";

function CountUp({ target, suffix = "", duration = 2000, trigger }) {
  const [current, setCurrent] = useState(0);
  const raf = useRef(null);
  useEffect(() => {
    if (!trigger) return;
    const start = performance.now();
    const run = (now) => {
      const t = Math.min((now - start) / duration, 1);
      const e = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
      setCurrent(+(target * e).toFixed(1));
      if (t < 1) raf.current = requestAnimationFrame(run);
      else setCurrent(target);
    };
    raf.current = requestAnimationFrame(run);
    return () => cancelAnimationFrame(raf.current);
  }, [trigger, target, duration]);
  return <>{current}{suffix}</>;
}


function AnimatedDots({ trigger }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!trigger) return;
    setCount(0);
    const t1 = setTimeout(() => setCount(1), 400);
    const t2 = setTimeout(() => setCount(2), 900);
    const t3 = setTimeout(() => setCount(3), 1400);
    const loop = setInterval(() => {
      setCount(0);
      setTimeout(() => setCount(1), 400);
      setTimeout(() => setCount(2), 900);
      setTimeout(() => setCount(3), 1400);
    }, 3000);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearInterval(loop); };
  }, [trigger]);
  return (
    <span className="inline-flex gap-0.5 items-end ml-0.5">
      {[0, 1, 2].map((i) => (
        <span key={i} className="inline-block transition-opacity duration-150" style={{ opacity: count > i ? 1 : 0 }}>.</span>
      ))}
    </span>
  );
}

export default function StatsSection() {
  const [ref, visible] = useInView(0.25);
  const [bigRef, bigVisible] = useInView(0.2);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);


  return (
    <>
      <section
        ref={ref}
        className="bg-white px-6 pt-10 md:pt-[110px] md:px-[60px] flex flex-col items-center text-center"
        style={{ borderRadius: "23px 23px 0px 0px", paddingBottom: isMobile ? "8px" : "0" }}
      >
        {/* Heading bumped to 20px on mobile (was 14px) so it reads as a heading */}
        <h2
          className="sm:mt-2 mt-3 text-[20px] sm:text-[45px] text-[#343434] leading-tight font-[300] max-w-[760px] mb-3 sm:mb-7 tracking-[-0.02em]"
          style={{ fontFamily: "Inter", padding: isMobile ? "0 16px" : "0", fontWeight: isMobile ? 600 : 300 }}
        >
          The gig economy has changed{" "}
          {/* matching size */}
          <strong className="text-[20px] sm:text-[45px] text-[#343434] font-bold leading-3">
            our consumption patterns
          </strong>
        </h2>

        {/* 16px → 12px, 30px → 22px */}
        <p className="font-sans text-[#5D5D5D] text-[12px] sm:text-[22px] leading-relaxed max-w-[960px] mb-3 font-light px-2 sm:px-0">
          becoming an integral part of everyday life. From late-night food deliveries{" "}
          <br className="sm:flex hidden" />
          and instant electronics, it has fundamentally reshaped urban living.
        </p>

        {/* 16px → 12px, 30px → 22px */}
        <p className="font-sans text-[#5D5D5D] text-[12px] sm:text-[22px] leading-relaxed max-w-[960px] font-light mb-4 px-2 sm:px-0">
          At the heart of this transformation are millions of gig workers powering{" "}
          <br className="sm:flex hidden" />
          the instant convenience ecosystem, a workforce that stood at{" "}
          <br className="sm:flex hidden" />
          {/* 16px → 12px, 30px → 22px */}
          <strong className="text-[#1A3BB0] text-[12px] sm:text-[22px] font-sans font-bold">
            <CountUp target={7.7} suffix="M in 2020" trigger={visible} />
          </strong>{" "}
          and is expected to{" "}
          <strong className="text-[#1A3BB0] text-[12px] sm:text-[22px] font-sans font-bold">
            exceed <CountUp target={23.5} suffix="M by 2030." trigger={visible} duration={2400} />
          </strong>
        </p>
      </section>

      <section
        ref={bigRef}
        className="sm:pt-0 pb-5 sm:pb-0 pt-5 bg-white px-4 sm:px-6 md:py-[50px] md:px-10 text-center"
      >
        {/* 45px → 34px, 100px → 75px */}
        <h2
          className="font-sans text-[34px] sm:text-[75px] font-black text-gig-red leading-[1.05] transition-all duration-700 tracking-[-0.03em]"
          style={{
            fontFamily: "Inter",
            fontWeight: "700",
            color: "#CE1010",
            letterSpacing: "-3%",
            opacity: bigVisible ? 1 : 0,
            transform: bigVisible ? "scale(1)" : "scale(0.88)",
          }}
        >
          The biggest risk <br className="sm:flex hidden" />
          still remains<AnimatedDots trigger={bigVisible} />
        </h2>
      </section>
    </>
  );
}