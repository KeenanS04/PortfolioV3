"use client";
import { AnimatePresence, motion } from "framer-motion";
import { Instagram as IgIcon, Play, RefreshCw, Layers } from "lucide-react";
import { useEffect, useState } from "react";
import Section from "./Section";

type Post = {
  id: string;
  permalink: string;
  mediaType: "IMAGE" | "VIDEO" | "CAROUSEL_ALBUM";
  isReel: boolean;
  image: string;
  width: number;
  height: number;
  caption: string;
  timestamp: string;
  accent: string | null;
};

type Resp = {
  username: string;
  bio: string;
  avatar: string;
  followers: number;
  posts: Post[];
  fetchedAt: string;
};

function relTime(iso: string) {
  const d = (Date.now() - +new Date(iso)) / 1000;
  if (d < 60) return "just now";
  if (d < 3600) return `${Math.floor(d / 60)}m ago`;
  if (d < 86400) return `${Math.floor(d / 3600)}h ago`;
  if (d < 86400 * 30) return `${Math.floor(d / 86400)}d ago`;
  if (d < 86400 * 365) return `${Math.floor(d / (86400 * 30))}mo ago`;
  return `${Math.floor(d / (86400 * 365))}y ago`;
}

export default function Instagram() {
  const [data, setData] = useState<Resp | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  const load = async () => {
    try {
      setLoading(true);
      const r = await fetch("/api/instagram", { cache: "no-store" });
      if (!r.ok) throw new Error(`IG ${r.status}`);
      setData(await r.json());
      setErr(null);
    } catch (e) {
      setErr((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    const id = setInterval(load, 10 * 60_000);
    return () => clearInterval(id);
  }, []);

  return (
    <Section id="life" eyebrow="Off the clock" title="Lifting, traveling, and more">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <a
          href={`https://www.instagram.com/${data?.username ?? "keenbeannnnn"}/`}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-3 group"
        >
          {data?.avatar ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={data.avatar}
              alt=""
              className="h-10 w-10 rounded-full ring-2 ring-white/15 group-hover:ring-white/40 transition"
            />
          ) : (
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-pink-400 via-fuchsia-500 to-orange-400" />
          )}
          <div className="leading-tight">
            <div className="text-sm text-white flex items-center gap-1.5">
              <IgIcon size={14} className="text-pink-300" />
              @{data?.username ?? "keenbeannnnn"}
            </div>
            <div className="text-xs text-white/50">
              {data?.bio?.split("\n")[0] || "Creative journal"}
            </div>
          </div>
        </a>
        <div className="flex items-center gap-3 text-xs text-white/50">
          <span>
            {data ? `updated ${relTime(data.fetchedAt)}` : loading ? "fetching…" : "—"}
          </span>
          <button
            onClick={load}
            className="glass inline-flex items-center gap-2 px-3 py-1.5 text-white/80 hover:text-white hover:bg-white/10 transition-colors"
          >
            <RefreshCw size={13} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>
      </div>

      {err && (
        <div className="glass p-5 text-sm text-rose-200">Could not reach Instagram feed: {err}</div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
        <AnimatePresence mode="popLayout">
          {(data?.posts ?? Array.from({ length: 6 }).map(() => null)).map((p, i) =>
            p ? (
              <motion.a
                key={p.id}
                href={p.permalink}
                target="_blank"
                rel="noreferrer"
                initial={{ opacity: 0, y: 20, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.97 }}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.5, delay: i * 0.04 }}
                className="glass noise group relative block aspect-square overflow-hidden"
                style={
                  p.accent
                    ? ({
                        boxShadow: `0 20px 60px -20px ${p.accent}80, inset 0 1px 0 rgba(255,255,255,0.18)`,
                      } as React.CSSProperties)
                    : undefined
                }
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={p.image}
                  alt={p.caption.slice(0, 80) || "Instagram post"}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-80" />

                <div className="absolute top-2.5 right-2.5 flex items-center gap-1">
                  {p.mediaType === "VIDEO" && (
                    <span className="ig-tile-badge glass px-1.5 py-1 rounded-full text-white">
                      <Play size={11} className="fill-white" />
                    </span>
                  )}
                  {p.mediaType === "CAROUSEL_ALBUM" && (
                    <span className="ig-tile-badge glass px-1.5 py-1 rounded-full text-white">
                      <Layers size={11} />
                    </span>
                  )}
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <p className="ig-tile-text text-xs text-white/90 line-clamp-2 leading-snug">
                    {p.caption || "—"}
                  </p>
                  <div className="ig-tile-meta mt-1.5 text-[10px] uppercase tracking-wider text-white/50">
                    {relTime(p.timestamp)}
                  </div>
                </div>
              </motion.a>
            ) : (
              <div key={`sk-${i}`} className="glass aspect-square animate-pulse" />
            )
          )}
        </AnimatePresence>
      </div>
    </Section>
  );
}
