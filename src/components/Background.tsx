"use client";
import { useEffect, useRef } from "react";

export default function Background() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 20;
      const y = (e.clientY / window.innerHeight - 0.5) * 20;
      el.style.setProperty("--mx", `${x}px`);
      el.style.setProperty("--my", `${y}px`);
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
      style={{
        transform: "translate3d(var(--mx,0), var(--my,0), 0)",
        transition: "transform 600ms cubic-bezier(.2,.8,.2,1)",
      }}
    >
      <div
        className="blob animate-float"
        style={{
          width: "55vw",
          height: "55vw",
          left: "-10vw",
          top: "-10vw",
          background:
            "radial-gradient(circle at 30% 30%, #6366f1, transparent 60%)",
        }}
      />
      <div
        className="blob animate-float"
        style={{
          width: "50vw",
          height: "50vw",
          right: "-12vw",
          top: "10vh",
          animationDelay: "-3s",
          background:
            "radial-gradient(circle at 60% 40%, #22d3ee, transparent 60%)",
        }}
      />
      <div
        className="blob animate-float"
        style={{
          width: "60vw",
          height: "60vw",
          left: "10vw",
          bottom: "-20vh",
          animationDelay: "-6s",
          background:
            "radial-gradient(circle at 50% 50%, #c084fc, transparent 60%)",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(1200px 600px at 50% -10%, rgba(255,255,255,0.08), transparent 60%)",
        }}
      />
      <div
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          maskImage:
            "radial-gradient(ellipse at 50% 40%, black 30%, transparent 75%)",
        }}
      />
    </div>
  );
}
