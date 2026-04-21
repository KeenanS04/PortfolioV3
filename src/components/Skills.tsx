"use client";
import { motion } from "framer-motion";
import Section from "./Section";

const groups = [
  {
    title: "Languages",
    items: ["Python", "SQL", "Java", "JavaScript/TypeScript", "Swift", "HTML/CSS"],
  },
  {
    title: "Data & ML",
    items: ["PyTorch", "TensorFlow", "scikit-learn", "Pandas", "NumPy", "Apache Spark", "Databricks", "Snowflake", "Tableau", "Excel"],
  },
  {
    title: "Web / Tools",
    items: ["React", "Next.js", "Flask", "Git", "AWS", "JUnit", "Linux"],
  },
];

export default function Skills() {
  return (
    <Section id="skills" eyebrow="Skills" title="Tooling I reach for.">
      <div className="grid md:grid-cols-3 gap-5">
        {groups.map((g, i) => (
          <motion.div
            key={g.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: i * 0.08 }}
            className="glass noise p-6"
          >
            <div className="text-xs uppercase tracking-[0.22em] text-cyan-300/80 mb-4">
              {g.title}
            </div>
            <ul className="flex flex-wrap gap-2">
              {g.items.map((s) => (
                <li
                  key={s}
                  className="text-sm px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-white/80 hover:bg-white/10 transition-colors"
                >
                  {s}
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}
