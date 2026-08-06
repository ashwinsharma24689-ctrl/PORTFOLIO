"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";


const NAV_LINKS = [
  { id: "about", label: "ABOUT", hex: "0x01" },
  { id: "skills", label: "SKILLS", hex: "0x02" },
  { id: "projects", label: "PROJECTS", hex: "0x03" },
  { id: "certifications", label: "CERTS", hex: "0x04" },
  { id: "hackathons", label: "HACKS", hex: "0x05" },
  { id: "contact", label: "CONTACT", hex: "0x06" },
];

const RESUME_VLSI_HREF = "/Ashwin_Sharma_Resume_VLSI.pdf";
const RESUME_EMBEDDED_HREF = "/Ashwin_Sharma_Resume_Embedded.pdf";
const STATUS_LABEL = "OPEN TO OPPORTUNITIES";

/* ---------- circuit trace divider ---------- */
function TraceDivider({ flip = false }: { flip?: boolean }) {
  return (
    <div className="relative h-10 w-full overflow-hidden opacity-40" aria-hidden="true">
      <svg
        viewBox="0 0 1200 40"
        preserveAspectRatio="none"
        className={`h-full w-full ${flip ? "scale-x-[-1]" : ""}`}
      >
        <path
          d="M0 20 H300 L330 5 H520 L545 20 H760 L790 35 H980 L1010 20 H1200"
          fill="none"
          stroke="#E0A458"
          strokeWidth="1"
        />
        <circle cx="330" cy="5" r="2.5" fill="#3FA9F5" />
        <circle cx="790" cy="35" r="2.5" fill="#3FA9F5" />
        <circle cx="1010" cy="20" r="2.5" fill="#E0A458" />
      </svg>
    </div>
  );
}

/* ---------- background trace texture (fixed, ultra low opacity) ---------- */
function BackgroundTraces() {
  return (
    <svg
      className="pointer-events-none fixed inset-0 h-full w-full opacity-[0.05]"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <pattern id="pcbgrid" width="120" height="120" patternUnits="userSpaceOnUse">
          <path d="M0 60 H120 M60 0 V120" stroke="#3FA9F5" strokeWidth="0.5" />
          <circle cx="60" cy="60" r="2" fill="#E0A458" />
          <path d="M0 20 H40 L50 30 H120" stroke="#E0A458" strokeWidth="0.5" fill="none" />
          <path d="M0 100 H80 L90 90 H120" stroke="#3FA9F5" strokeWidth="0.5" fill="none" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#pcbgrid)" />
    </svg>
  );
}

/* ---------- reveal-on-scroll wrapper ---------- */
function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.12 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`${className} transition-all duration-700 ease-out motion-reduce:transition-none motion-reduce:transform-none ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

/* ---------- section label like a hex register ---------- */
function SectionLabel({ hex, title }: { hex: string; title: string }) {
  return (
    <div className="mb-10 flex items-center gap-3">
      <span className="font-mono text-xs tracking-widest text-[#E0A458]">{hex}</span>
      <span className="font-mono text-xs tracking-widest text-[#E8E8E3]/40">//</span>
      <h2 className="font-mono text-sm tracking-[0.25em] text-[#E8E8E3]">{title}</h2>
      <span className="ml-4 h-px flex-1 bg-gradient-to-r from-[#3FA9F5]/40 to-transparent" />
    </div>
  );
}

/* ---------- Boot intro overlay ---------- */
function BootScreen({ onDone }: { onDone: () => void }) {
  const [lines, setLines] = useState<string[]>([]);
  const fullSequence = [
    "> initializing ashwin_sharma.sys ...",
    "> mounting /dev/rtl0 ... ok",
    "> mounting /dev/firmware0 ... ok",
    "> linking register_file ... ok",
    "> boot complete.",
  ];

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      onDone();
      return;
    }
    let i = 0;
    const interval = setInterval(() => {
      i += 1;
      setLines(fullSequence.slice(0, i));
      if (i >= fullSequence.length) {
        clearInterval(interval);
        setTimeout(onDone, 450);
      }
    }, 260);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0A0E12]">
      <div className="w-[min(90vw,520px)] font-mono text-sm text-[#3FA9F5]">
        {lines.map((line, idx) => (
          <p key={idx} className="mb-1.5 leading-relaxed">
            {line}
            {idx === lines.length - 1 && (
              <span className="ml-1 inline-block h-3.5 w-2 animate-pulse bg-[#3FA9F5] align-middle" />
            )}
          </p>
        ))}
      </div>
    </div>
  );
}

/* ---------- nav ---------- */
function Nav({ active }: { active: string }) {
  const [open, setOpen] = useState(false);

  const scrollTo = (id: string) => {
    setOpen(false);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <nav className="fixed top-0 z-40 w-full border-b border-[#3FA9F5]/15 bg-[#0A0E12]/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3 sm:px-8">
        <button
          onClick={() => scrollTo("hero")}
          className="flex items-center gap-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3FA9F5] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0E12]"
          aria-label="Scroll to top"
        >
          <span className="relative flex h-9 w-9 items-center justify-center border border-[#E0A458]/50 font-mono text-xs font-bold text-[#E0A458]">
            <span className="absolute -left-1 top-1/2 h-2 w-1 -translate-y-1/2 bg-[#E0A458]/60" />
            <span className="absolute -right-1 top-1/2 h-2 w-1 -translate-y-1/2 bg-[#E0A458]/60" />
            AS
          </span>
          <span className="hidden items-center gap-1.5 sm:flex">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#3FA9F5]/70 motion-reduce:animate-none" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#3FA9F5]" />
            </span>
            <span className="font-mono text-[10px] tracking-wider text-[#E8E8E3]/60">
              {STATUS_LABEL}
            </span>
          </span>
        </button>

        <div className="hidden items-center gap-7 md:flex">
          {NAV_LINKS.map((link) => (
            <button
              key={link.id}
              onClick={() => scrollTo(link.id)}
              className={`group relative font-mono text-xs tracking-widest transition-colors focus:outline-none ${
                active === link.id ? "text-[#E0A458]" : "text-[#E8E8E3]/60 hover:text-[#E8E8E3]"
              }`}
            >
              {link.label}
              <span
                className={`absolute -bottom-1.5 left-0 h-px w-full origin-left bg-[#3FA9F5] transition-transform duration-300 ${
                  active === link.id ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                }`}
              />
            </button>
          ))}
        </div>

        <button
          className="flex flex-col gap-1.5 md:hidden focus:outline-none"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle navigation menu"
          aria-expanded={open}
        >
          <span className={`h-px w-6 bg-[#E8E8E3] transition-transform ${open ? "translate-y-[3px] rotate-45" : ""}`} />
          <span className={`h-px w-6 bg-[#E8E8E3] transition-opacity ${open ? "opacity-0" : ""}`} />
          <span className={`h-px w-6 bg-[#E8E8E3] transition-transform ${open ? "-translate-y-[5px] -rotate-45" : ""}`} />
        </button>
      </div>

      {open && (
        <div className="border-t border-[#3FA9F5]/15 bg-[#0A0E12] px-5 py-4 md:hidden">
          <div className="flex flex-col gap-4">
            {NAV_LINKS.map((link) => (
              <button
                key={link.id}
                onClick={() => scrollTo(link.id)}
                className={`text-left font-mono text-xs tracking-widest ${
                  active === link.id ? "text-[#E0A458]" : "text-[#E8E8E3]/70"
                }`}
              >
                {link.hex} // {link.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}

/* ---------- IC-package bordered card (used for skills groups) ---------- */
function ChipCard({ title, items, delay = 0 }: { title: string; items: string[]; delay?: number }) {
  return (
    <Reveal delay={delay}>
      <div className="group relative border border-[#3FA9F5]/25 bg-[#0B0F14] p-5 transition-colors hover:border-[#E0A458]/50">
        <span className="absolute -left-[3px] top-4 h-[2px] w-2 bg-[#3FA9F5]/50" />
        <span className="absolute -left-[3px] bottom-4 h-[2px] w-2 bg-[#3FA9F5]/50" />
        <span className="absolute -right-[3px] top-4 h-[2px] w-2 bg-[#3FA9F5]/50" />
        <span className="absolute -right-[3px] bottom-4 h-[2px] w-2 bg-[#3FA9F5]/50" />
        <h3 className="mb-4 font-mono text-[11px] tracking-widest text-[#E0A458]">{title}</h3>
        <div className="flex flex-wrap gap-2">
          {items.map((item) => (
            <span
              key={item}
              className="border border-[#E8E8E3]/15 bg-[#0A0E12] px-2.5 py-1 font-mono text-[11px] text-[#E8E8E3]/80"
            >
              {item}
            </span>
          ))}
        </div>
      </div>
    </Reveal>
  );
}

type ProjectStatus = "Verified" | "Synthesized" | "Deployed";

const BADGE_STYLE: Record<ProjectStatus, { icon: string; color: string }> = {
  Verified: { icon: "✅", color: "text-[#3FA9F5]" },
  Synthesized: { icon: "🔧", color: "text-[#E0A458]" },
  Deployed: { icon: "📡", color: "text-[#E8E8E3]" },
};

type Project = {
  id: string;
  title: string;
  subtitle?: string;
  category: "Digital Design" | "Embedded/IoT";
  tags: string[];
  bullets: string[];
  status: ProjectStatus;
  github: string;
  featured?: boolean;
};

/* ---------- project card ---------- */
function ProjectCard({ project, featured = false, delay = 0 }: { project: Project; featured?: boolean; delay?: number }) {
  const badge = BADGE_STYLE[project.status];
  return (
    <Reveal delay={delay} className={featured ? "md:col-span-2" : ""}>
      <div className="group relative flex h-full flex-col border border-[#3FA9F5]/20 bg-[#0B0F14] p-6 transition-all duration-300 hover:-translate-y-0.5 hover:border-[#E0A458]/50 hover:shadow-[0_0_0_1px_rgba(224,164,88,0.15)]">
        <span className="absolute -left-[3px] top-6 h-[2px] w-2 bg-[#3FA9F5]/50 transition-colors group-hover:bg-[#E0A458]" />
        <span className="absolute -left-[3px] bottom-6 h-[2px] w-2 bg-[#3FA9F5]/50 transition-colors group-hover:bg-[#E0A458]" />
        <span className="absolute -right-[3px] top-6 h-[2px] w-2 bg-[#3FA9F5]/50 transition-colors group-hover:bg-[#E0A458]" />
        <span className="absolute -right-[3px] bottom-6 h-[2px] w-2 bg-[#3FA9F5]/50 transition-colors group-hover:bg-[#E0A458]" />

        <div className="mb-3 flex items-start justify-between gap-3">
          <h3 className={`font-mono font-semibold text-[#E8E8E3] ${featured ? "text-lg" : "text-base"}`}>
            {project.title}
          </h3>
          <span className={`shrink-0 font-mono text-[11px] ${badge.color}`}>
            {badge.icon} {project.status}
          </span>
        </div>

        {project.subtitle && (
          <p className="mb-3 font-mono text-xs tracking-wide text-[#E0A458]/80">{project.subtitle}</p>
        )}

        <div className="mb-4 flex flex-wrap gap-1.5">
          {project.tags.map((tag) => (
            <span key={tag} className="border border-[#3FA9F5]/25 px-2 py-0.5 font-mono text-[10px] text-[#3FA9F5]">
              {tag}
            </span>
          ))}
        </div>

        <ul className="mb-5 flex-1 space-y-2 text-sm text-[#E8E8E3]/75">
          {project.bullets.map((b, i) => (
            <li key={i} className="flex gap-2">
              <span className="mt-1.5 h-1 w-1 shrink-0 bg-[#E0A458]" />
              <span>{b}</span>
            </li>
          ))}
        </ul>

        <a
          href={project.github}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 font-mono text-xs text-[#3FA9F5] transition-colors hover:text-[#E0A458] focus:outline-none focus-visible:underline"
        >
          view_source()
          <svg className="h-3 w-3 transition-transform group-hover:translate-x-0.5" viewBox="0 0 12 12" fill="none">
            <path d="M2 10L10 2M10 2H4M10 2V8" stroke="currentColor" strokeWidth="1.4" />
          </svg>
        </a>
      </div>
    </Reveal>
  );
}

const PROJECTS: Project[] = [
  {
    id: "crisp",
    title: "CRISP",
    subtitle: "Customized RISC-V with Improved Staged Pipeline",
    category: "Digital Design",
    tags: ["Verilog", "Microarchitecture"],
    bullets: [
      "5-stage RV32I CPU with forwarding, load-use stall handling, and branch flush logic.",
      "Custom 32-bit CSLA plus full RV32I ISA coverage validated across 11 testbenches.",
    ],
    status: "Verified",
    github: "https://github.com/ashwinsharma24689-ctrl",
    featured: true,
  },
  {
    id: "microkernal",
    title: "MICROKERNAL-F1",
    category: "Embedded/IoT",
    tags: ["Bare-Metal C", "ARM Cortex-M3"],
    bullets: [
      "Bare-metal RTOS-style scheduler on STM32F103, built from scratch without HAL/CubeMX.",
      "Interrupt-driven SysTick plus non-blocking USART shell with clock-tree and race-condition fixes.",
    ],
    status: "Deployed",
    github: "https://github.com/ashwinsharma24689-ctrl",
    featured: true,
  },
  {
    id: "score",
    title: "SCORE",
    subtitle: "Serial COmpute and Register Engine",
    category: "Digital Design",
    tags: ["Verilog", "RTL Design"],
    bullets: [
      "8-bit serial-commanded compute engine with UART, dual FIFOs, register file, and CLA ALU.",
      "Verified across 11 testbenches with 152/152 checks passing in Icarus Verilog.",
    ],
    status: "Verified",
    github: "https://github.com/ashwinsharma24689-ctrl",
  },
  {
    id: "cla",
    title: "Distributed 8-bit Carry-Lookahead Adder",
    category: "Digital Design",
    tags: ["Verilog", "Cadence Xcelium/Genus"],
    bullets: [
      "8-bit carry-lookahead adder designed to avoid ripple-carry delay.",
      "Simulated in Xcelium, synthesized in Genus on TSMC18, and formally equivalence-checked.",
    ],
    status: "Synthesized",
    github: "https://github.com/ashwinsharma24689-ctrl",
  },
  {
    id: "iot",
    title: "IoT Network Pipeline",
    subtitle: "Environmental Monitoring System",
    category: "Embedded/IoT",
    tags: ["Embedded C", "Python", "ESP32", "UDP"],
    bullets: [
      "ESP32 environmental monitor streaming DHT22 and MQ2 data over UDP WiFi.",
      "playit.gg tunnel to a Python base station for alerts, logging, and Wokwi validation.",
    ],
    status: "Deployed",
    github: "https://github.com/ashwinsharma24689-ctrl",
  },
  {
    id: "led-tester",
    title: "Arduino LED Tester + Resistor Calculator",
    category: "Embedded/IoT",
    tags: ["Embedded C", "PWM", "I2C"],
    bullets: [
      "Bench instrument for LED forward-voltage and current measurement using a 10Ω sense resistor.",
      "Closed-loop PWM control with E24 lookup, power warnings, and I2C LCD output.",
    ],
    status: "Verified",
    github: "https://github.com/ashwinsharma24689-ctrl",
  },
];

const CERTIFICATIONS = [
  {
    title: "IBM SkillsBuild — Getting Started with AI",
    org: "IBM",
    date: "Mar 2026",
    tag: "Verified on Credly",
  },
  {
    title: "RTL-to-GDSII Flow on SRAM (5 Days)",
    org: "ECE Dept., BIT × VLSIMINDS",
    date: "2026",
    tag: "Cadence Xcelium / Genus / Modus / Innovus",
  },
  {
    title: "SEMulator3D Physical Design Workshop (3 Days)",
    org: "IISc Bengaluru × IEEE × Lam Research",
    date: "2025",
    tag: "Device & process scaling",
  },
  {
    title: "NPTEL — Hardware Modeling Using Verilog",
    org: "Prof. Indraneel Sen Gupta, IIT",
    date: "2025",
    tag: "Course completed",
  },
];

const HACKATHONS = [
  {
    title: "Cisco Next Gen Champions League 2026",
    desc: "AI-driven predictive hardware health monitor — edge ML on ESP32/STM32 with multi-sensor fusion.",
    result: "Round 1 cleared",
  },
  {
    title: "Xcelerate 24hr Hackathon — NIKSHATRA E-Summit 2025",
    desc: "MINDCARE+, a student mental health monitoring app.",
    result: "National level · Team Nexus",
  },
  {
    title: "Smart India Hackathon (SIH) 2025",
    desc: "IoT-based sand grain monitoring system for real-time beach coastline mapping.",
    result: "Institute-level selection",
  },
];

const FILTERS = ["All", "Digital Design", "Embedded/IoT"] as const;

/* ---------- dual resume download slots ---------- */
function ResumeSlots({ variant = "buttons" }: { variant?: "buttons" | "pins" }) {
  if (variant === "pins") {
    return (
      <>
        <li className="flex items-center gap-4">
          <span className="w-24 shrink-0 font-mono text-xs text-[#E0A458]">RESUME (VLSI) →</span>
          <a
            href={RESUME_VLSI_HREF}
            download
            className="text-sm text-[#3FA9F5] underline decoration-[#3FA9F5]/30 underline-offset-4 hover:decoration-[#3FA9F5]"
          >
            Ashwin_Sharma_Resume_VLSI.pdf ↓
          </a>
        </li>
        <li className="flex items-center gap-4">
          <span className="w-24 shrink-0 font-mono text-xs text-[#E0A458]">RESUME (EMBED) →</span>
          <a
            href={RESUME_EMBEDDED_HREF}
            download
            className="text-sm text-[#3FA9F5] underline decoration-[#3FA9F5]/30 underline-offset-4 hover:decoration-[#3FA9F5]"
          >
            Ashwin_Sharma_Resume_Embedded.pdf ↓
          </a>
        </li>
      </>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <a
        href={RESUME_VLSI_HREF}
        download
        className="border border-[#3FA9F5]/50 px-5 py-3 font-mono text-xs tracking-widest text-[#3FA9F5] transition-colors hover:bg-[#3FA9F5] hover:text-[#0A0E12] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3FA9F5] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0E12]"
      >
        RESUME · VLSI ↓
      </a>
      <a
        href={RESUME_EMBEDDED_HREF}
        download
        className="border border-[#3FA9F5]/50 px-5 py-3 font-mono text-xs tracking-widest text-[#3FA9F5] transition-colors hover:bg-[#3FA9F5] hover:text-[#0A0E12] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3FA9F5] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0E12]"
      >
        RESUME · EMBEDDED ↓
      </a>
    </div>
  );
}

export default function Portfolio() {
  const [booted, setBooted] = useState(false);
  const [active, setActive] = useState("hero");
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("All");
  const [formState, setFormState] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    document.body.style.overflow = booted ? "auto" : "hidden";
  }, [booted]);

  useEffect(() => {
    const sections = ["hero", ...NAV_LINKS.map((l) => l.id)];
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 }
    );
    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [booted]);

  const scrollTo = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const filteredProjects = PROJECTS.filter((p) => filter === "All" || p.category === filter);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#0A0E12] font-sans text-[#E8E8E3] antialiased">
      <style>{`\n        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&family=Inter:wght@400;500;600&display=swap');\n        .font-mono { font-family: 'JetBrains Mono', ui-monospace, monospace; }\n        .font-sans { font-family: 'Inter', ui-sans-serif, system-ui; }\n        html { scroll-behavior: smooth; }\n        @media (prefers-reduced-motion: reduce) {\n          html { scroll-behavior: auto; }\n        }\n      `}</style>

      {!booted && <BootScreen onDone={() => setBooted(true)} />}
      <BackgroundTraces />
      <Nav active={active} />

      <main className={`relative transition-opacity duration-700 ${booted ? "opacity-100" : "opacity-0"}`}>
        {/* ============ HERO ============ */}
        <section id="hero" className="relative flex min-h-screen items-center px-5 pt-24 sm:px-8">
          <div className="mx-auto w-full max-w-4xl">
            <p className="mb-5 font-mono text-xs tracking-[0.3em] text-[#3FA9F5]">0x00 // BOOT</p>
            <h1 className="mb-4 font-mono text-4xl font-bold leading-tight tracking-tight text-[#E8E8E3] sm:text-6xl">
              Ashwin Sharma
            </h1>
            <p className="mb-6 font-mono text-lg text-[#E0A458] sm:text-xl">
              Hardware / Firmware Engineer
            </p>
            <p className="mb-3 max-w-2xl text-base leading-relaxed text-[#E8E8E3]/75 sm:text-lg">
              Final-year ECE student building across RTL, VLSI verification, bare-metal firmware,
              and ESP32/ARM IoT systems.
            </p>
            <p className="mb-10 max-w-2xl text-sm leading-relaxed text-[#E8E8E3]/55 sm:text-base">
              Targeting VLSI, embedded systems, and firmware internships where I can design
              hardware, debug low-level behavior, and ship real products.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <button
                onClick={() => scrollTo("projects")}
                className="border border-[#E0A458] px-6 py-3 font-mono text-xs tracking-widest text-[#E0A458] transition-colors hover:bg-[#E0A458] hover:text-[#0A0E12] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E0A458] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0E12]"
              >
                VIEW PROJECTS →
              </button>

              <ResumeSlots variant="buttons" />

              <a
                href="https://github.com/ashwinsharma24689-ctrl"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub profile"
                className="flex h-11 w-11 items-center justify-center border border-[#E8E8E3]/20 text-[#E8E8E3]/70 transition-colors hover:border-[#E8E8E3]/60 hover:text-[#E8E8E3] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3FA9F5]"
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
                  <path d="M12 0C5.37 0 0 5.5 0 12.3c0 5.44 3.44 10.05 8.21 11.68.6.11.82-.27.82-.6 0-.29-.01-1.06-.02-2.08-3.34.75-4.04-1.65-4.04-1.65-.55-1.44-1.34-1.82-1.34-1.82-1.09-.77.08-.76.08-.76 1.21.09 1.84 1.28 1.84 1.28 1.07 1.87 2.81 1.33 3.5 1.02.11-.79.42-1.33.76-1.64-2.67-.31-5.47-1.38-5.47-6.14 0-1.36.47-2.46 1.24-3.33-.12-.31-.54-1.57.12-3.28 0 0 1.01-.33 3.3 1.27a11.2 11.2 0 0 1 6.01 0c2.29-1.6 3.3-1.27 3.3-1.27.66 1.71.24 2.97.12 3.28.77.87 1.24 1.97 1.24 3.33 0 4.77-2.81 5.82-5.49 6.13.43.38.81 1.13.81 2.28 0 1.65-.01 2.98-.01 3.38 0 .33.21.72.82.6C20.57 22.34 24 17.74 24 12.3 24 5.5 18.63 0 12 0Z" />
                </svg>
              </a>
            </div>
          </div>

          <span className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 animate-bounce motion-reduce:animate-none sm:block" aria-hidden="true">
            <svg width="16" height="24" viewBox="0 0 16 24" fill="none">
              <path d="M8 0V22M8 22L2 16M8 22L14 16" stroke="#3FA9F5" strokeWidth="1.4" opacity="0.5" />
            </svg>
          </span>
        </section>

        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <TraceDivider />
        </div>

        {/* ============ ABOUT ============ */}
        <section id="about" className="scroll-mt-20 px-5 py-20 sm:px-8">
          <div className="mx-auto max-w-6xl">
            <SectionLabel hex="0x01" title="ABOUT // REGISTER_FILE" />
            <Reveal>
              <div className="border border-[#3FA9F5]/25 bg-[#0B0F14]">
                <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-[#3FA9F5]/20 px-6 py-4">
                  <h3 className="font-mono text-base font-semibold text-[#E8E8E3]">
                    B.E. Electronics and Communication Engineering
                  </h3>
                  <span className="font-mono text-xs text-[#E0A458]">CGPA 8.64</span>
                </div>
                <dl className="divide-y divide-[#3FA9F5]/10">
                  <div className="flex flex-wrap items-center gap-x-6 gap-y-1 px-6 py-3">
                    <dt className="w-32 shrink-0 font-mono text-[11px] tracking-widest text-[#E8E8E3]/45">
                      INSTITUTION
                    </dt>
                    <dd className="text-sm text-[#E8E8E3]/85">Bangalore Institute of Technology, Bengaluru</dd>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-6 gap-y-1 px-6 py-3">
                    <dt className="w-32 shrink-0 font-mono text-[11px] tracking-widest text-[#E8E8E3]/45">
                      DURATION
                    </dt>
                    <dd className="text-sm text-[#E8E8E3]/85">2023 – 2027</dd>
                  </div>
                  <div className="flex flex-wrap items-start gap-x-6 gap-y-1 px-6 py-3">
                    <dt className="w-32 shrink-0 font-mono text-[11px] tracking-widest text-[#E8E8E3]/45">
                      COURSEWORK
                    </dt>
                    <dd className="flex-1 text-sm text-[#E8E8E3]/85">
                      VLSI Design, Digital Electronics, Microarchitecture, Embedded Systems,
                      Computer Networks
                    </dd>
                  </div>
                </dl>
              </div>
            </Reveal>
          </div>
        </section>

        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <TraceDivider flip />
        </div>

        {/* ============ SKILLS ============ */}
        <section id="skills" className="scroll-mt-20 px-5 py-20 sm:px-8">
          <div className="mx-auto max-w-6xl">
            <SectionLabel hex="0x02" title="SKILLS // INSTRUCTION_SET" />
            <div className="grid gap-5 sm:grid-cols-2">
              <ChipCard
                title="DIGITAL DESIGN & VERIFICATION"
                items={["Verilog", "Cadence Genus", "Cadence Xcelium", "Icarus Verilog", "GTKWave", "Xilinx Vivado (Spartan-3)", "SEMulator3D"]}
              />
              <ChipCard
                title="EMBEDDED SYSTEMS & FIRMWARE"
                items={["Embedded Bare-Metal C", "C Programming", "ARM Cortex-M3", "Keil µVision"]}
                delay={80}
              />
              <ChipCard
                title="NETWORKING & IOT"
                items={["UDP Sockets", "TCP/IP", "WiFi (ESP32)", "OSI Model", "JSON over UDP", "playit.gg tunneling"]}
                delay={160}
              />
              <ChipCard
                title="TOOLS & PLATFORMS"
                items={["Git/GitHub", "Arduino IDE", "Wokwi Simulator", "Tinkercad", "Python"]}
                delay={240}
              />
            </div>
          </div>
        </section>

        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <TraceDivider />
        </div>

        {/* ============ PROJECTS ============ */}
        <section id="projects" className="scroll-mt-20 px-5 py-20 sm:px-8">
          <div className="mx-auto max-w-6xl">
            <SectionLabel hex="0x03" title="PROJECTS // PIPELINE" />

            <div className="mb-8 flex flex-wrap gap-2">
              {FILTERS.map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`border px-4 py-1.5 font-mono text-xs tracking-widest transition-colors focus:outline-none ${
                    filter === f
                      ? "border-[#E0A458] bg-[#E0A458]/10 text-[#E0A458]"
                      : "border-[#E8E8E3]/20 text-[#E8E8E3]/60 hover:border-[#E8E8E3]/40 hover:text-[#E8E8E3]"
                  }`}
                >
                  [ {f.toUpperCase()} ]
                </button>
              ))}
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              {filteredProjects.map((p, i) => (
                <ProjectCard key={p.id} project={p} featured={p.featured} delay={(i % 2) * 80} />
              ))}
            </div>
          </div>
        </section>

        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <TraceDivider flip />
        </div>

        {/* ============ CERTIFICATIONS ============ */}
        <section id="certifications" className="scroll-mt-20 px-5 py-20 sm:px-8">
          <div className="mx-auto max-w-6xl">
            <SectionLabel hex="0x04" title="CERTIFICATIONS // FIRMWARE_UPDATES" />
            <div className="relative border-l border-[#3FA9F5]/25 pl-8">
              {CERTIFICATIONS.map((c, i) => (
                <Reveal key={c.title} delay={i * 70}>
                  <div className="relative mb-9 last:mb-0">
                    <span className="absolute -left-[37px] top-1.5 h-2.5 w-2.5 rounded-full border-2 border-[#0A0E12] bg-[#E0A458]" />
                    <div className="mb-1 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                      <span className="font-mono text-[11px] text-[#3FA9F5]">{c.date}</span>
                    </div>
                    <h3 className="mb-1 text-base font-semibold text-[#E8E8E3]">{c.title}</h3>
                    <p className="text-sm text-[#E8E8E3]/60">
                      {c.org} <span className="text-[#E8E8E3]/30">·</span> {c.tag}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <TraceDivider />
        </div>

        {/* ============ HACKATHONS ============ */}
        <section id="hackathons" className="scroll-mt-20 px-5 py-20 sm:px-8">
          <div className="mx-auto max-w-6xl">
            <SectionLabel hex="0x05" title="HACKATHONS // FIELD_TESTS" />
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {HACKATHONS.map((h, i) => (
                <Reveal key={h.title} delay={i * 90}>
                  <div className="h-full border border-[#3FA9F5]/20 bg-[#0B0F14] p-6">
                    <h3 className="mb-2 font-mono text-sm font-semibold text-[#E8E8E3]">{h.title}</h3>
                    <p className="mb-4 text-sm leading-relaxed text-[#E8E8E3]/70">{h.desc}</p>
                    <span className="inline-block border border-[#E0A458]/40 px-2.5 py-1 font-mono text-[11px] text-[#E0A458]">
                      {h.result}
                    </span>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <TraceDivider flip />
        </div>

        {/* ============ CONTACT ============ */}
        <section id="contact" className="scroll-mt-20 px-5 py-20 sm:px-8">
          <div className="mx-auto max-w-6xl">
            <SectionLabel hex="0x06" title="CONTACT // I/O_PORTS" />

            <div className="grid gap-10 lg:grid-cols-2">
              {/* pinout */}
              <Reveal>
                <div className="border border-[#3FA9F5]/25 bg-[#0B0F14] p-6">
                  <p className="mb-6 font-mono text-[11px] tracking-widest text-[#E8E8E3]/40">
                    PIN ASSIGNMENT
                  </p>
                  <ul className="space-y-5">
                    <li className="flex items-center gap-4">
                      <span className="w-24 shrink-0 font-mono text-xs text-[#E0A458]">EMAIL →</span>
                      <a
                        href="mailto:ashwinsharma24689@gmail.com"
                        className="break-all text-sm text-[#3FA9F5] underline decoration-[#3FA9F5]/30 underline-offset-4 hover:decoration-[#3FA9F5]"
                      >
                        ashwinsharma24689@gmail.com
                      </a>
                    </li>
                    <li className="flex items-center gap-4">
                      <span className="w-24 shrink-0 font-mono text-xs text-[#E0A458]">PHONE →</span>
                      <a
                        href="tel:+919148678402"
                        className="text-sm text-[#3FA9F5] underline decoration-[#3FA9F5]/30 underline-offset-4 hover:decoration-[#3FA9F5]"
                      >
                        +91 9148678402
                      </a>
                    </li>
                    <li className="flex items-center gap-4">
                      <span className="w-24 shrink-0 font-mono text-xs text-[#E0A458]">GITHUB →</span>
                      <a
                        href="https://github.com/ashwinsharma24689-ctrl"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="break-all text-sm text-[#3FA9F5] underline decoration-[#3FA9F5]/30 underline-offset-4 hover:decoration-[#3FA9F5]"
                      >
                        github.com/ashwinsharma24689-ctrl
                      </a>
                    </li>
                    <ResumeSlots variant="pins" />
                  </ul>
                </div>
              </Reveal>

              {/* form */}
              <Reveal delay={100}>
                {submitted ? (
                  <div className="flex h-full flex-col items-center justify-center border border-[#3FA9F5]/25 bg-[#0B0F14] p-6 text-center">
                    <p className="mb-2 font-mono text-sm text-[#3FA9F5]">// transmission received</p>
                    <p className="text-sm text-[#E8E8E3]/70">
                      Thanks for reaching out — I&apos;ll get back to you directly at your email.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="border border-[#3FA9F5]/25 bg-[#0B0F14] p-6">
                    <div className="mb-4">
                      <label htmlFor="name" className="mb-1.5 block font-mono text-[11px] tracking-widest text-[#E8E8E3]/45">
                        NAME
                      </label>
                      <input
                        id="name"
                        type="text"
                        required
                        value={formState.name}
                        onChange={(e) => setFormState((s) => ({ ...s, name: e.target.value }))}
                        className="w-full border border-[#E8E8E3]/15 bg-[#0A0E12] px-3 py-2.5 text-sm text-[#E8E8E3] outline-none transition-colors focus:border-[#3FA9F5]"
                        placeholder="Your name"
                      />
                    </div>
                    <div className="mb-4">
                      <label htmlFor="email" className="mb-1.5 block font-mono text-[11px] tracking-widest text-[#E8E8E3]/45">
                        EMAIL
                      </label>
                      <input
                        id="email"
                        type="email"
                        required
                        value={formState.email}
                        onChange={(e) => setFormState((s) => ({ ...s, email: e.target.value }))}
                        className="w-full border border-[#E8E8E3]/15 bg-[#0A0E12] px-3 py-2.5 text-sm text-[#E8E8E3] outline-none transition-colors focus:border-[#3FA9F5]"
                        placeholder="you@example.com"
                      />
                    </div>
                    <div className="mb-5">
                      <label htmlFor="message" className="mb-1.5 block font-mono text-[11px] tracking-widest text-[#E8E8E3]/45">
                        MESSAGE
                      </label>
                      <textarea
                        id="message"
                        required
                        rows={4}
                        value={formState.message}
                        onChange={(e) => setFormState((s) => ({ ...s, message: e.target.value }))}
                        className="w-full resize-none border border-[#E8E8E3]/15 bg-[#0A0E12] px-3 py-2.5 text-sm text-[#E8E8E3] outline-none transition-colors focus:border-[#3FA9F5]"
                        placeholder="What's on your mind?"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full border border-[#E0A458] py-2.5 font-mono text-xs tracking-widest text-[#E0A458] transition-colors hover:bg-[#E0A458] hover:text-[#0A0E12] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E0A458]"
                    >
                      TRANSMIT →
                    </button>
                  </form>
                )}
              </Reveal>
            </div>
          </div>
        </section>

        {/* ============ FOOTER ============ */}
        <footer className="border-t border-[#3FA9F5]/15 px-5 py-8 sm:px-8">
          <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 sm:flex-row">
            <p className="font-mono text-[11px] tracking-wider text-[#E8E8E3]/35">
              // designed &amp; built by Ashwin Sharma — REV 1.0
            </p>
            <p className="font-mono text-[11px] tracking-wider text-[#E8E8E3]/35">
              © {new Date().getFullYear()} · Bengaluru, IN
            </p>
          </div>
        </footer>
      </main>
    </div>
  );
}
