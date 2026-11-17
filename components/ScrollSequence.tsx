"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type Manifest = { count: number; width: number; height: number; ext: string };

type Props = {
  /** public/frames/<scene>/ доторх хавтасны нэр */
  scene: string;
  /** Scroll-ийн урт (vh). Их байх тусам удаан эргэнэ. */
  scrollVh?: number;
  /** Canvas дээр давхарлах текст */
  children?: ReactNode;
  /** Дэлгэц уншигчид зориулсан тайлбар */
  label: string;
  /** Жижиг шошго (AI тэмдэглэгээ) */
  badge?: string;
};

const MOBILE_QUERY = "(max-width: 767px)";

function frameUrl(scene: string, variant: string, i: number, ext: string) {
  return `/frames/${scene}/${variant}/${String(i + 1).padStart(4, "0")}.${ext}`;
}

export default function ScrollSequence({
  scene,
  scrollVh = 300,
  children,
  label,
  badge,
}: Props) {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    const canvas = canvasRef.current;
    if (!section || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let cancelled = false;
    let images: HTMLImageElement[] = [];
    let current = 0;
    let rafId = 0;

    // Canvas-ийг DPR-тай, "object-fit: cover" байдлаар зурна
    const draw = (index: number) => {
      // Хамгийн ойрын ачаалагдсан кадрыг олно (бүгд ачаалагдаагүй байж болно)
      let img: HTMLImageElement | undefined;
      for (let d = 0; d < images.length; d++) {
        const a = images[index - d];
        const b = images[index + d];
        if (a?.complete && a.naturalWidth) { img = a; break; }
        if (b?.complete && b.naturalWidth) { img = b; break; }
      }
      if (!img) return;
      const cw = canvas.width;
      const ch = canvas.height;
      const scale = Math.max(cw / img.naturalWidth, ch / img.naturalHeight);
      const w = img.naturalWidth * scale;
      const h = img.naturalHeight * scale;
      ctx.clearRect(0, 0, cw, ch);
      ctx.drawImage(img, (cw - w) / 2, (ch - h) / 2, w, h);
    };

    const requestDraw = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => draw(current));
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      canvas.width = Math.round(rect.width * dpr);
      canvas.height = Math.round(rect.height * dpr);
      requestDraw();
    };
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const mm = gsap.matchMedia();

    const load = async (variant: string, animate: boolean) => {
      const res = await fetch(`/frames/${scene}/${variant}/manifest.json`);
      if (!res.ok || cancelled) return null;
      const m: Manifest = await res.json();

      // Хуучин зургуудыг суллана
      images.forEach((im) => (im.src = ""));
      images = new Array(m.count);

      const make = (i: number) => {
        const im = new Image();
        im.decoding = "async";
        im.onload = () => {
          if (!cancelled && Math.abs(i - current) < 3) requestDraw();
        };
        im.src = frameUrl(scene, variant, i, m.ext);
        images[i] = im;
      };

      if (!animate) {
        make(0);
        current = 0;
        return m;
      }

      // Эхлээд эхний кадр, дараа нь 8 алхамтай "skeleton", дараа нь үлдсэн
      make(0);
      for (let i = 8; i < m.count; i += 8) make(i);
      for (let i = 1; i < m.count; i++) if (!images[i]) make(i);
      return m;
    };

    mm.add(
      {
        reduce: "(prefers-reduced-motion: reduce)",
        mobile: MOBILE_QUERY,
      },
      (context) => {
        const { reduce, mobile } = context.conditions as {
          reduce: boolean;
          mobile: boolean;
        };
        const variant = mobile ? "mobile" : "desktop";
        setReduced(reduce);
        let st: ScrollTrigger | undefined;

        load(variant, !reduce).then((m) => {
          if (!m || cancelled || reduce) {
            requestDraw();
            return;
          }
          st = ScrollTrigger.create({
            trigger: section,
            start: "top top",
            end: "bottom bottom",
            scrub: true,
            onUpdate: (self) => {
              const next = Math.round(self.progress * (m.count - 1));
              if (next !== current) {
                current = next;
                requestDraw();
              }
            },
          });
          ScrollTrigger.refresh();
        });

        return () => st?.kill();
      }
    );

    return () => {
      cancelled = true;
      cancelAnimationFrame(rafId);
      ro.disconnect();
      mm.revert();
      images.forEach((im) => (im.src = ""));
      images = [];
    };
  }, [scene]);

  return (
    <section
      ref={sectionRef}
      className="seq"
      style={{ height: reduced ? "100vh" : `${scrollVh}vh` }}
      aria-label={label}
    >
      <div className="seq-sticky">
        <canvas ref={canvasRef} className="seq-canvas" role="img" aria-label={label} />
        <div className="seq-shade" aria-hidden="true" />
        <div className="seq-content">{children}</div>
        {badge && <span className="seq-badge">{badge}</span>}
      </div>
    </section>
  );
}
