"use client";
import { useEffect, useState } from "react";
import { Marker } from "react-simple-maps";
import { AnimatePresence, motion } from "framer-motion";
import { MapPin, X } from "lucide-react";
import Section from "./Section";
import WorldMap from "./WorldMap";
import type { TravelPin } from "@/lib/travel";

export default function Travel() {
  const [pins, setPins] = useState<TravelPin[]>([]);
  const [active, setActive] = useState<TravelPin | null>(null);
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

  return (
    <Section id="places" eyebrow="Places" title="Where I&rsquo;ve been.">
      <div className="relative">
        <div className="glass noise p-2 sm:p-4 overflow-hidden">
          <WorldMap className="text-white">
            {pins.map((p) => (
              <Marker
                key={p.id}
                coordinates={p.coords}
                onClick={() => setActive(p)}
                style={{
                  default: { cursor: "pointer" },
                  hover: { cursor: "pointer" },
                  pressed: { cursor: "pointer" },
                }}
              >
                <g>
                  <circle r={5} fill="#22d3ee" fillOpacity={0.15} />
                  <circle r={2.5} fill="#22d3ee">
                    <animate
                      attributeName="r"
                      values="2.5;3.5;2.5"
                      dur="2.4s"
                      repeatCount="indefinite"
                    />
                    <animate
                      attributeName="fill-opacity"
                      values="0.9;0.55;0.9"
                      dur="2.4s"
                      repeatCount="indefinite"
                    />
                  </circle>
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
              key={active.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:max-w-sm glass glass-strong noise p-4"
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
                {active.name}
              </div>
              {active.caption && (
                <p className="mt-1.5 text-xs text-white/70 leading-snug">{active.caption}</p>
              )}
              {active.images.length > 0 && (
                <div className="mt-3 grid grid-cols-3 gap-1.5">
                  {active.images.slice(0, 6).map((src) => (
                    // eslint-disable-next-line @next/next/no-img-element
                    <a key={src} href={src} target="_blank" rel="noreferrer" className="block aspect-square overflow-hidden rounded-md">
                      <img src={src} alt="" className="h-full w-full object-cover hover:scale-105 transition-transform" loading="lazy" />
                    </a>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Section>
  );
}
