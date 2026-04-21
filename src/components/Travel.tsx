"use client";
import { useEffect, useMemo, useState } from "react";
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

export default function Travel() {
  const [pins, setPins] = useState<TravelPin[]>([]);
  const [active, setActive] = useState<CityGroup | null>(null);
  const [loading, setLoading] = useState(true);

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

  const groups = useMemo(() => groupByCity(pins), [pins]);

  return (
    <Section id="places" eyebrow="Places" title="Where I&rsquo;ve been.">
      <div className="relative">
        <div className="glass noise overflow-hidden">
          <WorldMap className="text-white">
            {groups.map((g) => (
              <Marker
                key={g.key}
                coordinates={g.coords}
                onClick={() => setActive(g)}
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
              key={active.key}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:max-w-md glass glass-strong noise p-4 max-h-[75%] overflow-y-auto"
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
                {active.label}
              </div>
              <div className="mt-0.5 text-[10px] uppercase tracking-[0.2em] text-white/40">
                {active.pins.length} trip{active.pins.length === 1 ? "" : "s"}
              </div>

              <ul className="mt-3 space-y-4 pr-1">
                {active.pins
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
                              className="block aspect-square overflow-hidden rounded-md"
                            >
                              <img
                                src={src}
                                alt=""
                                loading="lazy"
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
