"use client";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";

const skillsTicker = [
  "Python",
  "SQL",
  "PyTorch",
  "TensorFlow",
  "scikit-learn",
  "Pandas",
  "NumPy",
  "Apache Spark",
  "Databricks",
  "Snowflake",
  "Tableau",
  "Excel",
  "React",
  "Next.js",
  "TypeScript",
  "Swift",
  "Flask",
  "AWS",
  "Git",
  "Linux",
];

export default function Hero() {
  return (
    <section id="top" className="relative min-h-[92vh] flex items-center justify-center px-6 pt-28 overflow-hidden">
      <div className="relative z-10 max-w-5xl w-full text-center">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.7 }}
          className="inline-flex items-center gap-2 glass px-3 py-1.5 text-xs text-white/80 mb-6"
        >
          <Sparkles size={14} className="text-cyan-300" />
          Storyteller
        </motion.div>

        <motion.h1
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.9, ease: [0.2, 0.8, 0.2, 1] }}
          className="text-5xl sm:text-7xl md:text-8xl font-semibold tracking-tight leading-[0.95]"
        >
          <span className="text-gradient">Keenan Serrao</span>
        </motion.h1>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.35, duration: 0.9 }}
          className="mt-6 text-lg sm:text-xl text-white/70 max-w-2xl mx-auto"
        >
          I love making things — whether that&apos;s a model that finds a story
          in noisy data, a heavier lift than last week, or a short film from a
          trip. Welcome to my world.
        </motion.p>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.9 }}
          className="mt-10 flex items-center justify-center gap-3 flex-wrap"
        >
          <a
            href="#projects"
            className="group glass gradient-border px-5 py-3 text-sm font-medium text-white hover:bg-white/10 transition-colors inline-flex items-center gap-2"
          >
            See projects
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
          </a>
          <a
            href="#experience"
            className="glass px-5 py-3 text-sm font-medium text-white/80 hover:text-white hover:bg-white/10 transition-colors"
          >
            Experience
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 1.2 }}
          className="mt-16 mx-auto w-full max-w-xl overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_15%,black_85%,transparent)]"
        >
          <div className="flex w-max animate-marquee gap-10 text-xs uppercase tracking-[0.24em] text-white/45 whitespace-nowrap">
            {Array.from({ length: 2 }).map((_, dup) => (
              <div key={dup} className="flex gap-10 shrink-0 pr-10">
                {skillsTicker.map((s) => (
                  <span key={`${dup}-${s}`}>{s}</span>
                ))}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
