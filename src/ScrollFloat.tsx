import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./ScrollFloat.css";

gsap.registerPlugin(ScrollTrigger);

interface ScrollFloatProps {
  children: string;
}

export default function ScrollFloat({ children }: ScrollFloatProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Splitting the text: lines (\n), words (space), characters
    const lines = children.split("\n");
    const container = containerRef.current;
    container.innerHTML = ""; // Clear initial text

    lines.forEach((lineText) => {
      const lineSpan = document.createElement("span");
      lineSpan.style.display = "block";

      const words = lineText.split(" ");
      words.forEach((wordText, wordIdx) => {
        const wordSpan = document.createElement("span");
        wordSpan.style.display = "inline-block";
        wordSpan.style.whiteSpace = "nowrap";

        // Wrap each character
        for (let i = 0; i < wordText.length; i++) {
          const charSpan = document.createElement("span");
          charSpan.className = "char";
          charSpan.textContent = wordText[i];
          wordSpan.appendChild(charSpan);
        }

        lineSpan.appendChild(wordSpan);

        // Add non-breaking space between words
        if (wordIdx < words.length - 1) {
          const space = document.createTextNode("\u00A0");
          lineSpan.appendChild(space);
        }
      });

      container.appendChild(lineSpan);
    });

    const chars = container.querySelectorAll(".char");

    // Scroll trigger text animation
    const tl = gsap.fromTo(
      chars,
      {
        opacity: 1,
        yPercent: 0,
        scaleY: 1,
        scaleX: 1,
        transformOrigin: "50% 0%",
      },
      {
        opacity: 0,
        yPercent: 250,
        scaleY: 1.2,
        scaleX: 0.9,
        stagger: 0.05,
        ease: "power2.inOut",
        duration: 1,
        scrollTrigger: {
          trigger: document.body,
          start: "top top",
          end: "+=1000",
          scrub: 1.5,
        },
      }
    );

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
    };
  }, [children]);

  return (
    <div className="fixed inset-0 flex flex-col justify-end p-4 md:p-8 pointer-events-none z-10">
      <div
        ref={containerRef}
        className="text-white font-dirty leading-[0.85] tracking-[0%] w-full"
        style={{ fontSize: "clamp(4rem, 15vw, 317px)" }}
      >
        {children}
      </div>
    </div>
  );
}
