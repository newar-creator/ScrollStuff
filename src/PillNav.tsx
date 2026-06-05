import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import "./PillNav.css";

gsap.registerPlugin(ScrollToPlugin);

interface NavItem {
  name: string;
  onClick: () => void;
}

export default function PillNav() {
  const containerRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLButtonElement>(null);
  const navItemsRef = useRef<HTMLDivElement>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: NavItem[] = [
    {
      name: "HOME",
      onClick: () => {
        gsap.to(window, { duration: 3, scrollTo: 0, ease: "power3.inOut" });
        setMobileMenuOpen(false);
      },
    },
    {
      name: "ABOUT",
      onClick: () => {
        gsap.to(window, {
          duration: 3,
          scrollTo: document.body.scrollHeight,
          ease: "power3.inOut",
        });
        setMobileMenuOpen(false);
      },
    },
    {
      name: "SERVICES",
      onClick: () => {
        // Services can scroll to a midway point or perform default behavior
        gsap.to(window, {
          duration: 3,
          scrollTo: document.body.scrollHeight * 0.5,
          ease: "power3.inOut",
        });
        setMobileMenuOpen(false);
      },
    },
    {
      name: "CONTACT",
      onClick: () => {
        // Contact can scroll to bottom
        gsap.to(window, {
          duration: 3,
          scrollTo: document.body.scrollHeight,
          ease: "power3.inOut",
        });
        setMobileMenuOpen(false);
      },
    },
  ];

  useEffect(() => {
    // Initial Load Animation
    // Logo scales from 0 to 1
    gsap.fromTo(
      logoRef.current,
      { scale: 0 },
      { scale: 1, duration: 0.6, ease: "back.out(1.7)" }
    );

    // Nav items container width animates from 0 to auto
    gsap.fromTo(
      navItemsRef.current,
      { width: 0, opacity: 0 },
      { width: "auto", opacity: 1, duration: 0.6, ease: "power2.out", delay: 0.2 }
    );
  }, []);

  // GSAP Rotate Logo SVG on Hover
  const handleLogoMouseEnter = () => {
    gsap.to(".logo-svg-container", {
      rotation: 360,
      duration: 0.2,
      ease: "power1.out",
    });
  };

  const handleLogoMouseLeave = () => {
    gsap.to(".logo-svg-container", {
      rotation: 0,
      duration: 0.2,
      ease: "power1.in",
    });
  };

  // GSAP Pill Hover Liquid Fill Effect
  const handlePillMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
    const pill = e.currentTarget;
    const hoverCircle = pill.querySelector(".hover-circle") as HTMLElement;
    const label = pill.querySelector(".pill-label") as HTMLElement;
    const labelHover = pill.querySelector(".pill-label-hover") as HTMLElement;

    if (!hoverCircle || !label || !labelHover) return;

    const w = pill.offsetWidth;
    const h = pill.offsetHeight;

    // Calculate dynamically the required circle radius R to cover the rectangle from bottom-center
    // R = (w^2 / 4 + h^2) / (2h)
    const r = (w * w / 4 + h * h) / (2 * h);
    const d = 2 * r + 2;
    const delta = r - Math.sqrt(r * r - (w * w) / 4) + 1;

    gsap.killTweensOf([hoverCircle, label, labelHover]);

    // Setup style dimensions
    gsap.set(hoverCircle, {
      width: d,
      height: d,
      left: w / 2 - r,
      bottom: -delta,
      transformOrigin: `50% ${d - delta}px`,
    });

    const tl = gsap.timeline();
    tl.to(hoverCircle, {
      scale: 3,
      duration: 0.3,
      ease: "power2.out",
    });
    tl.to(
      label,
      {
        yPercent: -100,
        duration: 0.3,
        ease: "power2.out",
      },
      0
    );
    tl.to(
      labelHover,
      {
        yPercent: -100,
        duration: 0.3,
        ease: "power2.out",
      },
      0
    );
  };

  const handlePillMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    const pill = e.currentTarget;
    const hoverCircle = pill.querySelector(".hover-circle") as HTMLElement;
    const label = pill.querySelector(".pill-label") as HTMLElement;
    const labelHover = pill.querySelector(".pill-label-hover") as HTMLElement;

    if (!hoverCircle || !label || !labelHover) return;

    gsap.killTweensOf([hoverCircle, label, labelHover]);

    const tl = gsap.timeline();
    tl.to(hoverCircle, {
      scale: 0,
      duration: 0.2,
      ease: "power2.in",
    });
    tl.to(
      label,
      {
        yPercent: 0,
        duration: 0.2,
        ease: "power2.in",
      },
      0
    );
    tl.to(
      labelHover,
      {
        yPercent: 0,
        duration: 0.2,
        ease: "power2.in",
      },
      0
    );
  };

  // Mobile menu button animates to 'X' shape
  useEffect(() => {
    if (mobileMenuOpen) {
      gsap.to("#line1", { rotation: 45, y: 3, duration: 0.3 });
      gsap.to("#line2", { rotation: -45, y: -3, duration: 0.3 });
      gsap.to(".mobile-menu-popover", {
        autoAlpha: 1,
        y: 0,
        duration: 0.4,
        ease: "power2.out",
      });
    } else {
      gsap.to("#line1", { rotation: 0, y: 0, duration: 0.3 });
      gsap.to("#line2", { rotation: 0, y: 0, duration: 0.3 });
      gsap.to(".mobile-menu-popover", {
        autoAlpha: 0,
        y: -10,
        duration: 0.3,
        ease: "power2.in",
      });
    }
  }, [mobileMenuOpen]);

  return (
    <div ref={containerRef} className="pill-nav-container">
      <nav className="pill-nav">
        {/* Circular Black Logo Button */}
        <button
          ref={logoRef}
          className="pill-logo border-none cursor-pointer"
          onMouseEnter={handleLogoMouseEnter}
          onMouseLeave={handleLogoMouseLeave}
        >
          <div className="logo-svg-container">
            <svg
              className="w-6 h-6 fill-white"
              viewBox="0 0 100 100"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="m50,50c0,18.2,14.77,32.98,32.97,32.98,0-18.2-14.77-32.98-32.97-32.98Z" />
              <path d="m17.02,82.98c18.2,0,32.98-14.77,32.98-32.98-18.2,0-32.98,14.77-32.98,32.98Z" />
              <path d="m82.98,17.02c-18.2,0-32.97,14.77-32.97,32.97,18.2,0,32.97-14.77,32.97-32.97Z" />
              <path d="m17.02,17.02c0,18.2,14.77,32.97,32.98,32.97,0-18.2-14.77-32.97-32.98-32.97Z" />
            </svg>
          </div>
        </button>

        {/* Space separation */}
        <div className="w-2" />

        {/* Desktop Navigation Items */}
        <div ref={navItemsRef} className="pill-nav-items desktop-only">
          <ul className="pill-list">
            {navItems.map((item, idx) => (
              <li key={`nav-desktop-${idx}`}>
                <button
                  onClick={item.onClick}
                  onMouseEnter={handlePillMouseEnter}
                  onMouseLeave={handlePillMouseLeave}
                  className="pill border-none cursor-pointer"
                >
                  <div className="hover-circle" />
                  <span className="label-stack">
                    <span className="pill-label">{item.name}</span>
                    <span className="pill-label-hover">{item.name}</span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Mobile menu container (768px and down) */}
        <div className="pill-nav-items mobile-only flex items-center bg-black border-2 border-black rounded-[50px] p-[4px]">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="mobile-menu-button"
            aria-label="Toggle menu"
          >
            <span id="line1" className="hamburger-line" />
            <span id="line2" className="hamburger-line" />
          </button>
        </div>
      </nav>

      {/* Mobile Popover Menu */}
      <div className="mobile-menu-popover w-64 absolute left-1/2 -translate-x-1/2">
        <ul className="mobile-menu-list">
          {navItems.map((item, idx) => (
            <li key={`nav-mobile-${idx}`}>
              <button
                onClick={item.onClick}
                className="mobile-menu-link w-full bg-transparent border-none py-2 font-semibold tracking-wider hover:text-gray-400 cursor-pointer text-center"
              >
                {item.name}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
