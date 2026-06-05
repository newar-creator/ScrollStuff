import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function GlassPanel() {
  const containerRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const container = containerRef.current;
    if (!wrapper || !container) return;

    // Slide-up animation triggered by scroll at the bottom
    const trigger = gsap.fromTo(
      wrapper,
      { y: "100%" },
      {
        y: "0%",
        ease: "none",
        scrollTrigger: {
          trigger: container,
          start: "top bottom",
          end: "bottom bottom",
          scrub: 1.5,
        },
      }
    );

    // 3D Parallax Mousemove trigger
    const handleMouseMove = (e: MouseEvent) => {
      const panel = panelRef.current;
      if (!panel) return;

      const rect = panel.getBoundingClientRect();
      const panelCenterX = rect.left + rect.width / 2;
      const panelCenterY = rect.top + rect.height / 2;

      // Normalized offsets from center (-1 to 1)
      const moveX = (e.clientX - panelCenterX) / (window.innerWidth / 2);
      const moveY = (e.clientY - panelCenterY) / (window.innerHeight / 2);

      gsap.to(panel, {
        x: moveX * 20,
        y: moveY * 20,
        rotationY: moveX * 4,
        rotationX: -moveY * 4,
        ease: "power3.out",
        duration: 1,
        overwrite: "auto",
      });
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      trigger.scrollTrigger?.kill();
      trigger.kill();
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  const brandNames = ["VOICEFLOW", "ZENDESK", "PENDO", "GLIDE", "CANVA"];
  // Repeat 4x for seamless infinite scroll
  const marqueeItems = [...brandNames, ...brandNames, ...brandNames, ...brandNames];

  return (
    <div
      ref={containerRef}
      className="absolute bottom-0 left-0 w-full h-screen flex items-center justify-center pointer-events-none"
    >
      <div
        ref={wrapperRef}
        className="w-full max-w-[1250px] h-[900px] max-h-[85vh] pointer-events-auto px-4"
        style={{ perspective: "1000px" }}
      >
        <div
          ref={panelRef}
          className="w-full h-full flex flex-col justify-between rounded-3xl relative overflow-hidden"
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.16)",
            backdropFilter: "blur(160px)",
            WebkitBackdropFilter: "blur(160px)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            transformStyle: "preserve-3d",
            willChange: "transform",
          }}
        >
          {/* Main Content Area */}
          <div className="flex-1 flex flex-col items-center justify-center px-6 md:px-12 text-center">
            <p className="font-serif italic text-white/70 text-base md:text-lg mb-4 md:mb-6">
              About Us
            </p>
            <h2 className="font-serif text-white text-4xl md:text-6xl lg:text-[96px] leading-[1.1] lg:leading-[92.6px] tracking-tight w-full max-w-[1000px] mx-auto">
              We transform sterile concrete into thriving{" "}
              <span className="italic">urban</span> jungles. Our innovative
              designs bring wild <span className="italic">nature</span> back to
              modern cities. Experience the <span className="italic">bloom</span>
            </h2>
          </div>

          {/* Bottom Marquee */}
          <div className="border-t border-white/10 py-6 overflow-hidden w-full relative">
            <div className="flex w-[200%] animate-marquee">
              <div className="flex justify-around min-w-full items-center">
                {marqueeItems.slice(0, marqueeItems.length / 2).map((name, i) => (
                  <span
                    key={`mq-1-${i}`}
                    className="text-white opacity-40 hover:opacity-100 transition-opacity duration-300 uppercase font-sans font-semibold text-sm tracking-widest cursor-default px-4"
                  >
                    {name}
                  </span>
                ))}
              </div>
              <div className="flex justify-around min-w-full items-center">
                {marqueeItems.slice(marqueeItems.length / 2).map((name, i) => (
                  <span
                    key={`mq-2-${i}`}
                    className="text-white opacity-40 hover:opacity-100 transition-opacity duration-300 uppercase font-sans font-semibold text-sm tracking-widest cursor-default px-4"
                  >
                    {name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
