"use client";
import { motion } from "framer-motion";
import { Github, Linkedin, Mail } from "lucide-react";

export default function Contact() {
  return (
    <section id="contact" className="relative px-6 pt-16 pb-32 max-w-4xl mx-auto text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="glass glass-strong noise p-10 sm:p-14 gradient-border"
      >
        <div className="text-xs uppercase tracking-[0.25em] text-cyan-300/80 mb-3">
          Get in touch
        </div>
        <h3 className="text-3xl sm:text-5xl font-semibold tracking-tight">
          <span className="text-gradient">Let&apos;s build something.</span>
        </h3>
        <p className="mt-4 text-white/70 max-w-xl mx-auto">
          Open to collaborations, data problems, and occasional coffee chats.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <a
            href="mailto:keenanserrao@gmail.com"
            className="glass px-5 py-3 text-sm text-white hover:bg-white/10 transition-colors inline-flex items-center gap-2"
          >
            <Mail size={16} /> keenanserrao@gmail.com
          </a>
          <a
            href="https://github.com/KeenanS04"
            target="_blank"
            rel="noreferrer"
            className="glass px-5 py-3 text-sm text-white hover:bg-white/10 transition-colors inline-flex items-center gap-2"
          >
            <Github size={16} /> GitHub
          </a>
          <a
            href="https://www.linkedin.com/in/keenan-serrao/"
            target="_blank"
            rel="noreferrer"
            className="glass px-5 py-3 text-sm text-white hover:bg-white/10 transition-colors inline-flex items-center gap-2"
          >
            <Linkedin size={16} /> LinkedIn
          </a>
        </div>
      </motion.div>
      <div className="mt-10 text-xs text-white/30">
        © {new Date().getFullYear()} Keenan Serrao · Built with Next.js, Tailwind, Framer Motion.
      </div>
    </section>
  );
}
