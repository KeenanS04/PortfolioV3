"use client";
import { motion } from "framer-motion";
import Section from "./Section";

const stats = [
  { k: "3.94", v: "GPA · UCSD Cum Laude" },
  { k: "∞", v: "Potential to grow" },
  { k: "500+", v: "Students tutored (DSC 10)" },
  { k: "4 plates", v: "Of food, no problem" },
];

export default function About() {
  return (
    <Section id="about" eyebrow="About" title="Data-driven, end-to-end.">
      <div className="grid md:grid-cols-5 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="glass noise md:col-span-3 p-7 text-white/80 leading-relaxed"
        >
          <p>
            I&apos;m a Data Analyst at{" "}
            <span className="text-white">Toyota Financial Services</span> and a
            UCSD Data Science grad. Data is the thing I keep coming back to —
            but really I just love making things and pushing my limits, whether
            that&apos;s in a dataset, under a barbell, or behind a camera.
          </p>
          <p className="mt-4 text-white/70">
            {/* TODO: Keenan — write second paragraph here */}
            Placeholder — more about me coming soon.
          </p>
          <p className="mt-4 text-white/60 text-sm">
            {/* TODO: Keenan — rewrite "currently exploring" */}
            Currently exploring continual test-time adaptation, robust ML, and
            the occasional Swift side-project.
          </p>
        </motion.div>

        <div className="md:col-span-2 grid grid-cols-2 gap-3">
          {stats.map((s, i) => (
            <motion.div
              key={s.v}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.07 }}
              className="glass p-5"
            >
              <div className="text-3xl font-semibold text-gradient">{s.k}</div>
              <div className="mt-1 text-xs text-white/60 leading-snug">{s.v}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </Section>
  );
}
