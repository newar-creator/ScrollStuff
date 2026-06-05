import { useEffect, useRef, useState } from "react";
import Hls from "hls.js";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface ScrollVideoProps {
  src: string;
  className?: string;
}

export default function ScrollVideo({ src, className = "" }: ScrollVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Keep track of target seek time to avoid overloading the player
  const currentTargetRef = useRef<number>(0);
  const seekPendingRef = useRef<boolean>(false);

  const doSeek = (video: HTMLVideoElement) => {
    video.currentTime = currentTargetRef.current;
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let hls: Hls | null = null;

    // Handler when video data is loaded enough to play
    const handleCanPlay = () => {
      setIsLoading(false);
    };

    video.addEventListener("canplay", handleCanPlay);

    // Safari / iOS Native HLS or fallback
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

    if (isSafari && video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = src;
      // Estimate progress
      video.addEventListener("progress", () => {
        if (video.duration) {
          const buffered = video.buffered;
          if (buffered.length > 0) {
            const pct = Math.min(100, Math.round((buffered.end(buffered.length - 1) / video.duration) * 100));
            setProgress(pct);
          }
        }
      });
    } else if (Hls.isSupported()) {
      hls = new Hls({
        maxBufferLength: 120,
        maxMaxBufferLength: 600,
        maxBufferSize: 200 * 1024 * 1024,
        startPosition: 0,
        capLevelToPlayerSize: false,
        startLevel: -1,
        autoStartLoad: true,
      });

      hls.loadSource(src);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        const maxLevel = hls!.levels.length - 1;
        hls!.currentLevel = maxLevel;
        hls!.startLevel = maxLevel;
      });

      hls.on(Hls.Events.FRAG_BUFFERED, () => {
        if (video.duration) {
          const buffered = video.buffered;
          if (buffered.length > 0) {
            const pct = Math.min(100, Math.round((buffered.end(buffered.length - 1) / video.duration) * 100));
            setProgress(pct);
          }
        }
      });
    }

    // Scroll trigger setup to scrub video frames
    let trigger: ScrollTrigger | null = null;

    const handleLoadedMetadata = () => {
      trigger = ScrollTrigger.create({
        trigger: document.documentElement,
        start: "top top",
        end: "bottom bottom",
        scrub: true,
        onUpdate: (self) => {
          if (!video.duration) return;
          const targetTime = self.progress * video.duration;
          currentTargetRef.current = targetTime;

          if (!video.seeking) {
            doSeek(video);
          } else {
            seekPendingRef.current = true;
          }
        },
      });
    };

    video.addEventListener("loadedmetadata", handleLoadedMetadata);

    const handleSeeked = () => {
      if (seekPendingRef.current) {
        seekPendingRef.current = false;
        doSeek(video);
      }
    };

    video.addEventListener("seeked", handleSeeked);

    // Parallax mouse movements
    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      // Normalized offset from -1 to 1
      const moveX = (e.clientX / innerWidth) * 2 - 1;
      const moveY = (e.clientY / innerHeight) * 2 - 1;

      gsap.to(containerRef.current, {
        x: moveX * -30,
        y: moveY * -30,
        duration: 1.5,
        ease: "power2.out",
        overwrite: "auto",
      });
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      video.removeEventListener("canplay", handleCanPlay);
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
      video.removeEventListener("seeked", handleSeeked);
      window.removeEventListener("mousemove", handleMouseMove);
      if (trigger) trigger.kill();
      if (hls) {
        hls.destroy();
      }
    };
  }, [src]);

  return (
    <>
      {isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black text-white text-2xl font-sans">
          Loading... {progress}%
        </div>
      )}
      <div
        ref={containerRef}
        className={`fixed top-0 left-0 w-full h-full z-0 scale-[1.05] origin-center ${className}`}
      >
        <video
          ref={videoRef}
          className="w-full h-full object-cover scale-[1.35]"
          muted
          playsInline
          crossOrigin="anonymous"
        />
      </div>
    </>
  );
}
