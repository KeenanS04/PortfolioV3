"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { ExternalLink, GitFork, Github, RefreshCw, Star } from "lucide-react";
import Section from "./Section";

type Repo = {
  id: number;
  name: string;
  description: string | null;
  url: string;
  homepage: string | null;
  stars: number;
  forks: number;
  language: string | null;
  topics: string[];
  updated: string;
};

type ApiResp = { repos: Repo[]; fetchedAt: string };

const LANG_COLORS: Record<string, string> = {
  Python: "#3572A5",
  JavaScript: "#f1e05a",
  TypeScript: "#3178c6",
  Java: "#b07219",
  "Jupyter Notebook": "#DA5B0B",
  HTML: "#e34c26",
  CSS: "#563d7c",
  Swift: "#F05138",
  C: "#555555",
  "C++": "#f34b7d",
  Go: "#00ADD8",
  Shell: "#89e051",
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

export default function Projects() {
  const [data, setData] = useState<ApiResp | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      setLoading(true);
      const r = await fetch("/api/github", { cache: "no-store" });
      if (!r.ok) throw new Error(`GitHub API ${r.status}`);
      const j: ApiResp = await r.json();
      setData(j);
      setErr(null);
    } catch (e) {
      setErr((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    const id = setInterval(load, 5 * 60_000); // auto-refresh every 5 min
    const onFocus = () => load();
    window.addEventListener("focus", onFocus);
    return () => {
      clearInterval(id);
      window.removeEventListener("focus", onFocus);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Section id="projects" eyebrow="Projects" title="Live from GitHub.">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div className="flex items-center gap-2 text-sm text-white/60">
          <Github size={16} />
          <a
            href="https://github.com/KeenanS04"
            target="_blank"
            rel="noreferrer"
            className="hover:text-white transition-colors"
          >
            @KeenanS04
          </a>
          <span className="text-white/30">·</span>
          <span className="text-xs">
            {data
              ? `updated ${relTime(data.fetchedAt)}`
              : loading
              ? "fetching…"
              : "—"}
          </span>
        </div>
        <button
          onClick={load}
          className="glass inline-flex items-center gap-2 text-xs px-3 py-1.5 text-white/80 hover:text-white hover:bg-white/10 transition-colors"
        >
          <RefreshCw size={13} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {err && (
        <div className="glass p-5 text-sm text-rose-200">
          Could not reach GitHub: {err}
        </div>
      )}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <AnimatePresence mode="popLayout">
          {(data?.repos ?? Array.from({ length: 6 }).map(() => null)).map(
            (repo, i) =>
              repo ? (
                <motion.a
                  key={repo.id}
                  href={repo.homepage || repo.url}
                  target="_blank"
                  rel="noreferrer"
                  layout
                  initial={{ opacity: 0, y: 20, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.5, delay: i * 0.04 }}
                  whileHover={{ y: -4 }}
                  className="glass noise group relative p-5 flex flex-col min-h-[200px] overflow-hidden [will-change:transform] [clip-path:inset(0_round_1.25rem)]"
                >
                  <div
                    aria-hidden
                    className="pointer-events-none absolute -top-24 -right-24 h-48 w-48 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{
                      background:
                        "radial-gradient(closest-side, rgba(147,197,253,0.4), transparent 70%)",
                    }}
                  />
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-white font-medium tracking-tight truncate">
                      {repo.name}
                    </h3>
                    <ExternalLink
                      size={14}
                      className="text-white/40 group-hover:text-white transition-colors shrink-0"
                    />
                  </div>
                  <p className="mt-2 text-sm text-white/60 line-clamp-3 flex-1">
                    {repo.description || "No description."}
                  </p>
                  {repo.topics.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {repo.topics.slice(0, 4).map((t) => (
                        <span
                          key={t}
                          className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-white/60"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-white/55">
                    <div className="flex items-center gap-2">
                      {repo.language && (
                        <span className="inline-flex items-center gap-1.5">
                          <span
                            className="h-2 w-2 rounded-full"
                            style={{
                              background: LANG_COLORS[repo.language] ?? "#888",
                            }}
                          />
                          {repo.language}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="inline-flex items-center gap-1">
                        <Star size={12} /> {repo.stars}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <GitFork size={12} /> {repo.forks}
                      </span>
                      <span>{relTime(repo.updated)}</span>
                    </div>
                  </div>
                </motion.a>
              ) : (
                <div
                  key={`sk-${i}`}
                  className="glass min-h-[200px] animate-pulse"
                />
              )
          )}
        </AnimatePresence>
      </div>
    </Section>
  );
}
