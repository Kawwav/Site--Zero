import { useEffect, useRef } from "react";
import "./Header.css";

export default function Header() {
  const screenRef = useRef(null);
  const animatedRef = useRef(false); // ← guard contra StrictMode

  useEffect(() => {
    if (animatedRef.current) return;
    animatedRef.current = true;

    const loadGSAP = () =>
      new Promise((resolve) => {
        if (window.gsap) return resolve(window.gsap);
        const script = document.createElement("script");
        script.src =
          "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js";
        script.onload = () => resolve(window.gsap);
        document.head.appendChild(script);
      });

    loadGSAP().then((gsap) => {
      const screen = screenRef.current;
      if (!screen) return;

      const container = screen.querySelector(".loading-text");
      container.innerHTML = ""; // ← limpa caso tenha rodado antes

      const text = "Conecte seus produtos ao público certo";
      const words = text.split(" ");
      const spans = [];

      words.forEach((word, wi) => {
        const outer = document.createElement("span");
        outer.className = "span-outer";
        const inner = document.createElement("span");
        inner.className = "span-inner";
        inner.textContent = word;
        outer.appendChild(inner);
        container.appendChild(outer);

        if (wi < words.length - 1) {
          const space = document.createElement("span");
          space.className = "space";
          space.textContent = "\u00A0";
          container.appendChild(space);
        }

        spans.push(inner);
      });

      gsap.set(spans, { y: "110%", rotation: 10, transformOrigin: "left bottom" });

      const tl = gsap.timeline({ delay: 0.4 });

      tl.to(spans, {
        y: "0%",
        rotation: 0,
        duration: 1,
        ease: "expo.out",
        stagger: { each: 0.05, from: "start" },
      });

      tl.to(
        spans,
        {
          y: "-200%",
          rotation: 0,
          duration: 1,
          ease: "power2.in",
          stagger: { each: 0.05, from: "end" },
        },
        "+=0.1"
      );

      tl.to(
        screen,
        {
          y: "-100%",
          duration: 1,
          ease: "power2.inOut",
          onComplete: () => screen.remove(),
        },
        "-=0.2"
      );
    });

    return () => {};
  }, []);

  return (
    <div className="loading-screen" ref={screenRef}>
      <div className="loading-text-wrap">
        <div className="loading-text" />
      </div>
    </div>
  );
}