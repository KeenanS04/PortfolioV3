"use client";
import { motion } from "framer-motion";
import { Github, Linkedin, Mail } from "lucide-react";

const links = [
  { href: "#about", label: "About" },
  { href: "#experience", label: "Experience" },
  { href: "#projects", label: "Projects" },
  { href: "#skills", label: "Skills" },
  { href: "#places", label: "Places" },
  { href: "#life", label: "Life" },
];

export default function Nav() {
  return (
    <div className="fixed top-4 inset-x-0 z-50 flex justify-center px-4 pointer-events-none">
      <motion.nav
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.2, 0.8, 0.2, 1] }}
        className="pointer-events-auto w-[min(960px,100%)]"
      >
        <div className="glass glass-strong noise flex items-center justify-between px-4 py-2.5">
          <a href="#top" className="flex items-center gap-2 font-semibold tracking-tight">
            <span className="h-7 w-7 rounded-lg bg-gradient-to-br from-indigo-400 via-fuchsia-400 to-cyan-400 grid place-items-center text-sm text-white shadow-lg shadow-indigo-500/30">K</span>
            <span className="hidden sm:inline text-white/90">Keenan Serrao</span>
          </a>
          <ul className="hidden md:flex items-center gap-1 text-sm text-white/70">
            {links.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  className="px-3 py-1.5 rounded-full hover:text-white hover:bg-white/10 transition-colors"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="flex items-center gap-1">
            <IconLink href="https://github.com/KeenanS04" label="GitHub"><Github size={16} /></IconLink>
            <IconLink href="https://www.linkedin.com/in/keenan-serrao/" label="LinkedIn"><Linkedin size={16} /></IconLink>
            <IconLink href="mailto:keenanserrao@gmail.com" label="Email"><Mail size={16} /></IconLink>
          </div>
        </div>
      </motion.nav>
    </div>
  );
}

function IconLink({ href, label, children }: { href: string; label: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={label}
      className="h-8 w-8 grid place-items-center rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors"
    >
      {children}
    </a>
  );
}
