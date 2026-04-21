"use client";
import { motion } from "framer-motion";
import { ReactNode } from "react";

export default function Section({
  id,
  eyebrow,
  title,
  children,
}: {
  id: string;
  eyebrow: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="relative px-6 py-24 sm:py-32 max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7 }}
        className="mb-12"
      >
        <div className="text-xs uppercase tracking-[0.25em] text-cyan-300/80 mb-3">
          {eyebrow}
        </div>
        <h2 className="text-3xl sm:text-5xl font-semibold tracking-tight text-white/95">
          {title}
        </h2>
      </motion.div>
      {children}
    </section>
  );
}
