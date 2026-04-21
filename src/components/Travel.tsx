"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { Marker } from "react-simple-maps";
import { AnimatePresence, motion } from "framer-motion";
import { MapPin, X } from "lucide-react";
import Section from "./Section";
import WorldMap from "./WorldMap";
import type { TravelPin } from "@/lib/travel";

type CityGroup = {
  key: string;
  label: string;
  coords: [number, number];
  pins: TravelPin[];
};

function groupByCity(pins: TravelPin[]): CityGroup[] {
  const map = new Map<string, CityGroup>();
  for (const p of pins) {
    const key = (p.city || `${p.coords[0].toFixed(2)},${p.coords[1].toFixed(2)}`).toLowerCase();
    const existing = map.get(key);
    if (existing) {
      existing.pins.push(p);
    } else {
      map.set(key, {
        key,
        label: p.city || p.name,
        coords: p.coords,
        pins: [p],
      });
    }
  }
  return Array.from(map.values());
}

const POPUP_W = 320;
const POPUP_OFFSET = 18;

export default function Travel() {
  const [pins, setPins] = useState<TravelPin[]>([]);
  const [active, setActive] = useState<{ group: CityGroup; x: number; y: number; flipX: boolean; flipY: boolean } | null>(null);
  const [loading, setLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const r = await fetch("/api/travel", { cache: "no-store" });
        const j = await r.json();
        setPins(j.pins ?? []);
      } finally {
        setLoading(false);
      }
    };
    load();
    const id = setInterval(load, 5 * 60_000);
    return () => clearInterval(id);
  }, []);

  // Preload pin images so popups don't jank on first open.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const urls = Array.from(new Set(pins.flatMap((p) => p.images).filter(Boolean)));
    urls.forEach((u) => {
      const img = new window.Image();
      img.decoding = "async";
      img.src = u;
    });
  }, [pins]);

  const groups = useMemo(() => groupByCity(pins), [pins]);

  const openGroup = (g: CityGroup, evt: React.MouseEvent) => {
    const box = containerRef.current?.getBoundingClientRect();
    if (!box) {
      setActive({ group: g, x: 0, y: 0, flipX: false, flipY: false });
      return;
    }
    const x = evt.clientX - box.left;
    const y = evt.clientY - box.top;
    const flipX = x + POPUP_OFFSET + POPUP_W > box.width - 8;
    const flipY = y + 200 > box.height - 8;
    setActive({ group: g, x, y, flipX, flipY });
  };

  return (
    <Section id="places" eyebrow="Places" title="Where I&rsquo;ve been.">
      <div className="relative" ref={containerRef}>
        <div className="glass noise overflow-hidden">
          <WorldMap className="text-white">
            {groups.map((g) => (
              <Marker
                key={g.key}
                coordinates={g.coords}
                onClick={(e: React.MouseEvent) => openGroup(g, e)}
                style={{
                  default: { cursor: "pointer" },
                  hover: { cursor: "pointer" },
                  pressed: { cursor: "pointer" },
                }}
              >
                <g>
                  <circle r={6} fill="#22d3ee" fillOpacity={0.15} />
                  <circle r={2.8} fill="#22d3ee">
                    <animate attributeName="r" values="2.8;3.8;2.8" dur="2.4s" repeatCount="indefinite" />
                    <animate attributeName="fill-opacity" values="0.9;0.55;0.9" dur="2.4s" repeatCount="indefinite" />
                  </circle>
                  {g.pins.length > 1 && (
                    <text
                      textAnchor="middle"
                      y={-8}
                      fontSize={9}
                      fill="#e5e7eb"
                      style={{ fontWeight: 600, pointerEvents: "none" }}
                    >
                      {g.pins.length}
                    </text>
                  )}
                </g>
              </Marker>
            ))}
          </WorldMap>
        </div>

        {!loading && pins.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="glass px-4 py-2 text-sm text-white/70 flex items-center gap-2">
              <MapPin size={14} />
              No trips pinned yet.
            </div>
          </div>
        )}

        <AnimatePresence>
          {active && (
            <motion.div
              key={active.group.key}
              initial={{ opacity: 0, scale: 0.9, y: -4 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.18, ease: [0.2, 0.8, 0.2, 1] }}
              style={{
                position: "absolute",
                width: POPUP_W,
                left: active.flipX ? undefined : active.x + POPUP_OFFSET,
                right: active.flipX ? Math.max(8, (containerRef.current?.clientWidth ?? 0) - active.x + POPUP_OFFSET) : undefined,
                top: active.flipY ? undefined : Math.max(8, active.y - 20),
                bottom: active.flipY ? Math.max(8, (containerRef.current?.clientHeight ?? 0) - active.y - 20) : undefined,
                transformOrigin: `${active.flipX ? "right" : "left"} ${active.flipY ? "bottom" : "top"}`,
                zIndex: 20,
              }}
              className="glass glass-strong noise p-4 max-h-[75%] overflow-y-auto shadow-2xl"
            >
              <button
                onClick={() => setActive(null)}
                aria-label="Close"
                className="absolute top-2 right-2 h-7 w-7 grid place-items-center rounded-full text-white/60 hover:text-white hover:bg-white/10"
              >
                <X size={14} />
              </button>
              <div className="flex items-center gap-2 text-sm text-white">
                <MapPin size={14} className="text-cyan-300" />
                {active.group.label}
              </div>
              <div className="mt-0.5 text-[10px] uppercase tracking-[0.2em] text-white/40">
                {active.group.pins.length} trip{active.group.pins.length === 1 ? "" : "s"}
              </div>

              <ul className="mt-3 space-y-4 pr-1">
                {active.group.pins
                  .slice()
                  .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt))
                  .map((p) => (
                    <li key={p.id}>
                      <div className="text-sm text-white">{p.name}</div>
                      {p.caption && (
                        <p className="mt-0.5 text-xs text-white/60 leading-snug">{p.caption}</p>
                      )}
                      {p.images.length > 0 && (
                        <div className="mt-2 grid grid-cols-3 gap-1.5">
                          {p.images.slice(0, 6).map((src) => (
                            // eslint-disable-next-line @next/next/no-img-element
                            <a
                              key={src}
                              href={src}
                              target="_blank"
                              rel="noreferrer"
                              className="block aspect-square overflow-hidden rounded-md bg-white/5"
                            >
                              <img
                                src={src}
                                alt=""
                                loading="eager"
                                decoding="async"
                                className="h-full w-full object-cover hover:scale-105 transition-transform"
                              />
                            </a>
                          ))}
                        </div>
                      )}
                    </li>
                  ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Section>
  );
}
