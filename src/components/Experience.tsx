"use client";
import { motion } from "framer-motion";
import Section from "./Section";

const jobs = [
  {
    role: "Data Analyst",
    company: "Toyota Financial Services",
    location: "Plano, TX",
    period: "Aug 2025 – Present",
    bullets: [
      "Driving analytics and reporting across financial operations.",
      "Building reproducible pipelines and dashboards for stakeholders.",
    ],
  },
  {
    role: "Data Science Intern",
    company: "Qualcomm Institute",
    location: "La Jolla, CA",
    period: "Jan 2024 – Jun 2025",
    bullets: [
      "Analyzed millions of patient records from UC San Diego's medical DB for Acute Kidney Injury research — contributing to publications.",
      "Collaborated with three physicians on data collection, cleaning, and preprocessing.",
      "Used Databricks + Apache Spark to process large-scale medical data, improving retrieval and analysis efficiency.",
    ],
  },
  {
    role: "Systems Analyst Intern",
    company: "Health Care Service Corporation",
    location: "Richardson, TX",
    period: "Jun 2024 – Aug 2024",
    bullets: [
      "Performed exploratory analysis on 2,000+ customer feedback entries in Python.",
      "Built a scikit-learn classifier automating categorization at 80%+ accuracy.",
      "Automated member-info retrieval via pyodbc + SQL.",
    ],
  },
  {
    role: "Instructional Assistant — DSC 10",
    company: "UC San Diego",
    location: "La Jolla, CA",
    period: "Sep 2023 – Jun 2024",
    bullets: [
      "Tutored 500+ students in intro data science.",
      "Built a grade-report tool: BeautifulSoup scraper, Pandas processing, Gradescope API integration.",
    ],
  },
];

export default function Experience() {
  return (
    <Section id="experience" eyebrow="Experience" title="Where I've shipped.">
      <ol className="relative ml-2">
        <div className="absolute left-[7px] top-1 bottom-1 w-px bg-gradient-to-b from-cyan-300/50 via-fuchsia-400/30 to-transparent" />
        {jobs.map((j, i) => (
          <motion.li
            key={j.company + j.role}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, delay: i * 0.05 }}
            className="relative pl-8 pb-10 last:pb-0"
          >
            <span className="absolute left-0 top-2 h-3.5 w-3.5 rounded-full bg-gradient-to-br from-cyan-300 to-fuchsia-400 shadow-[0_0_20px_4px_rgba(139,92,246,0.35)]" />
            <div className="glass noise p-6">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h3 className="text-lg font-medium text-white">
                  {j.role} <span className="text-white/50">·</span>{" "}
                  <span className="text-white/80">{j.company}</span>
                </h3>
                <span className="text-xs text-white/50">{j.period}</span>
              </div>
              <div className="text-xs text-white/40">{j.location}</div>
              <ul className="mt-4 space-y-2 text-sm text-white/75 list-disc pl-5 marker:text-cyan-300/60">
                {j.bullets.map((b) => <li key={b}>{b}</li>)}
              </ul>
            </div>
          </motion.li>
        ))}
      </ol>
    </Section>
  );
}
