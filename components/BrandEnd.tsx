"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Албан ёсны уриа: бичлэгийг өөрчлөхгүй
const SLOGAN = "Алхам бүрт хамт";

/**
 * Hero-гийн дараах брэндийн төгсгөл: лого гэнэт гарч ирээд, уриа үг үгээрээ гарна.
 * TODO: жинхэнэ лого ирэхээр <div className="brand-logo">-г <img src="/images/logo.svg"> болгоно.
 */
export default function BrandEnd() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: el, start: "top 60%", toggleActions: "play none none reverse" },
      });
      tl.from(".brand-logo", { scale: 1.6, opacity: 0, filter: "blur(12px)", duration: 0.7, ease: "expo.out" })
        .from(".brand-glow", { opacity: 0, scale: 0.4, duration: 0.8, ease: "power2.out" }, "<")
        .from(".brand-slogan span", { y: 24, opacity: 0, duration: 0.45, stagger: 0.14, ease: "power3.out" }, "-=0.2");
    });

    return () => mm.revert();
  }, []);

  return (
    <section ref={ref} className="brand-end" aria-label={SLOGAN}>
      <div className="brand-glow" aria-hidden="true" />
      <div className="brand-logo">TODSOCKS</div>
      <p className="brand-slogan">
        {SLOGAN.split(" ").map((w, i) => (
          <span key={i}>{w}</span>
        ))}
      </p>
    </section>
  );
}
