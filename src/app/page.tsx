import About from "@/components/About";
import Contact from "@/components/Contact";
import Experience from "@/components/Experience";
import Hero from "@/components/Hero";
import Instagram from "@/components/Instagram";
import Nav from "@/components/Nav";
import Projects from "@/components/Projects";
import Skills from "@/components/Skills";
import Travel from "@/components/Travel";

export default function Page() {
  return (
    <main className="relative">
      <Nav />
      <Hero />
      <About />
      <Experience />
      <Projects />
      <Skills />
      <Travel />
      <Instagram />
      <Contact />
    </main>
  );
}
