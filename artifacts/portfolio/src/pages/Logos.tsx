import { motion, AnimatePresence } from "framer-motion";
import { Check, ArrowLeft, Palette, ChevronDown, Droplets, Flame, Waves, Sparkles, ZoomIn, ZoomOut, X } from "lucide-react";
import { useLocation } from "wouter";
import { useRef, useState, useEffect, useCallback } from "react";
import { GlobalBackground } from "@/components/GlobalBackground";
import { FireBackground } from "@/components/FireBackground";
import { SeaBackground } from "@/components/SeaBackground";
import { WaterfallBackground } from "@/components/WaterfallBackground";
import { ScrollProgress } from "@/components/ScrollProgress";
import { TiltCard } from "@/components/TiltCard";
import { MagneticButton } from "@/components/MagneticButton";
import { AmbientAudio } from "@/components/AmbientAudio";
import { useTheme, type Theme } from "@/components/ThemeContext";
import { useAnimation } from "@/components/AnimationContext";
import { ViewCounter } from "@/components/ViewCounter";
import { useDiscordAvatar } from "@/hooks/useDiscordAvatar";

const WM_SVG = encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200">` +
  `<text x="100" y="100" dominant-baseline="middle" text-anchor="middle" ` +
  `font-family="Arial,sans-serif" font-size="12" font-weight="bold" ` +
  `fill="rgba(255,255,255,0.20)" transform="rotate(-35,100,100)" letter-spacing="2">` +
  `MYSTICFUSION7X</text></svg>`
);
const WM_URL = `url("data:image/svg+xml,${WM_SVG}")`;

interface LightboxState {
  src: string;
  alt: string;
  zoom: number;
}

function ProtectedImage({
  src,
  alt,
  onClick,
}: {
  src: string;
  alt: string;
  onClick?: () => void;
}) {
  return (
    <div
      className="relative select-none overflow-hidden rounded-xl cursor-zoom-in group"
      onContextMenu={(e) => e.preventDefault()}
      onClick={onClick}
    >
      <img
        src={src}
        alt={alt}
        draggable={false}
        className="w-full h-auto block rounded-xl transition-transform duration-300 group-hover:scale-105"
        style={{ pointerEvents: "none", userSelect: "none" }}
      />
      <div
        className="absolute inset-0 rounded-xl"
        style={{ backgroundImage: WM_URL, backgroundSize: "170px 170px", pointerEvents: "none" }}
      />
      {/* Zoom hint overlay */}
      <div className="absolute inset-0 rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        style={{ background: "rgba(0,0,0,0.35)" }}>
        <ZoomIn className="w-6 h-6 text-white/80" />
      </div>
      <div
        className="absolute inset-0 rounded-xl"
        onContextMenu={(e) => e.preventDefault()}
        style={{ cursor: "zoom-in" }}
      />
    </div>
  );
}

function Lightbox({ state, onClose }: { state: LightboxState; onClose: () => void }) {
  const [zoom, setZoom] = useState(state.zoom);
  const MIN_ZOOM = 0.5;
  const MAX_ZOOM = 3;
  const STEP = 0.25;

  const zoomIn  = () => setZoom(z => Math.min(z + STEP, MAX_ZOOM));
  const zoomOut = () => setZoom(z => Math.max(z - STEP, MIN_ZOOM));

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "+" || e.key === "=") zoomIn();
      if (e.key === "-") zoomOut();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  return (
    <motion.div
      className="fixed inset-0 z-[9999] flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      style={{ background: "rgba(0,0,0,0.85)", backdropFilter: "blur(12px)" }}
      onClick={onClose}
    >
      {/* Controls */}
      <div
        className="absolute top-5 right-5 flex items-center gap-2 z-10"
        onClick={e => e.stopPropagation()}
      >
        <motion.button
          whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
          onClick={zoomOut}
          disabled={zoom <= MIN_ZOOM}
          className="w-9 h-9 rounded-full flex items-center justify-center transition-all disabled:opacity-30"
          style={{ background: "rgba(255,255,255,0.10)", border: "1px solid rgba(255,255,255,0.15)" }}
        >
          <ZoomOut className="w-4 h-4 text-white" />
        </motion.button>
        <span className="text-xs font-mono text-white/50 min-w-[3rem] text-center">
          {Math.round(zoom * 100)}%
        </span>
        <motion.button
          whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
          onClick={zoomIn}
          disabled={zoom >= MAX_ZOOM}
          className="w-9 h-9 rounded-full flex items-center justify-center transition-all disabled:opacity-30"
          style={{ background: "rgba(255,255,255,0.10)", border: "1px solid rgba(255,255,255,0.15)" }}
        >
          <ZoomIn className="w-4 h-4 text-white" />
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
          onClick={onClose}
          aria-label="Close image"
          title="Close image"
          className="w-9 h-9 rounded-full flex items-center justify-center ml-2"
          style={{ background: "rgba(255,255,255,0.10)", border: "1px solid rgba(255,255,255,0.15)" }}
        >
          <X className="w-4 h-4 text-white" />
        </motion.button>
      </div>

      {/* Image */}
      <motion.div
        onClick={e => e.stopPropagation()}
        initial={{ scale: 0.85 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.85 }}
        transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
        style={{ transform: `scale(${zoom})`, transition: "transform 0.2s ease" }}
        className="max-w-[90vw] max-h-[85vh] overflow-hidden rounded-2xl select-none"
        onContextMenu={e => e.preventDefault()}
      >
        <div className="relative">
          <img
            src={state.src}
            alt={state.alt}
            draggable={false}
            className="max-w-[80vw] max-h-[80vh] object-contain rounded-2xl"
            style={{ pointerEvents: "none", userSelect: "none" }}
          />
          <div
            className="absolute inset-0 rounded-2xl"
            style={{ backgroundImage: WM_URL, backgroundSize: "170px 170px", pointerEvents: "none" }}
          />
        </div>
      </motion.div>

      {/* Click to close hint */}
      <p className="absolute bottom-5 left-1/2 -translate-x-1/2 text-xs text-white/25">
        Click outside or press Esc to close · +/- to zoom
      </p>
    </motion.div>
  );
}

const logos = [
  { file: "epd-army.png",       name: "Executive Protection Detail",                  tag: "US Army",      tier: "HIGH" },
  { file: "vanguard-intel.png", name: "Vanguard Intelligence Branch",                 tag: "Vanguard Site", tier: "HIGH" },
  { file: "nasa.png",           name: "National Aeronautics and Space Administration", tag: "NASA",         tier: "HIGH" },
  { file: "ioc.png",            name: "Information Operations Center",                tag: "IOC",          tier: "HIGH" },
  { file: "usar.png",           name: "United States Army Reserve",                   tag: "USAR",         tier: "HIGH" },
  { file: "nsa.png",            name: "National Security Agency",                     tag: "NSA",          tier: "HIGH" },
  { file: "ang.png",            name: "Army National Guard",                          tag: "ANG",          tier: "HIGH" },
  { file: "ppg.png",            name: "Protective Programs Group",                    tag: "PPG",          tier: "HIGH" },
  { file: "ncasc.png",          name: "Natl. Counterintelligence and Security Center",tag: "NCASC",        tier: "HIGH" },
  { file: "usspacecom-dark.png",name: "United States Space Command",                  tag: "USSPACECOM",   tier: "HIGH" },
  { file: "fbi.png",            name: "Federal Bureau of Investigation",              tag: "FBI",          tier: "HIGH" },
  { file: "cia-uni.png",        name: "CIA University",                               tag: "EST. 2026",    tier: "MID"  },
  { file: "nga.png",            name: "National Geospatial-Intelligence Agency",      tag: "NGA",          tier: "HIGH" },
  { file: "usspacecom.png",     name: "United States Space Command",                  tag: "USSPACECOM",   tier: "HIGH" },
  { file: "ncti-color.png",     name: "Natl. Counterintelligence Training Institute", tag: "NCTI",         tier: "MID"  },
  { file: "ncti-bw.png",        name: "Natl. Counterintelligence Training Institute", tag: "NCTI (B&W)",   tier: "LOW"  },
];

function useTierConfig() {
  return {
    HIGH: {
      bg:     "var(--c-glass-bright)",
      border: "1px solid var(--c-border)",
      color:  "var(--c-primary)",
      label: "HIGH QUALITY",
    },
    MID: {
      bg:     "var(--c-glass-bg)",
      border: "1px solid var(--c-border-soft)",
      color:  "var(--c-primary-2)",
      label: "MID QUALITY",
    },
    LOW: {
      bg:     "rgba(255,255,255,0.02)",
      border: "1px solid rgba(255,255,255,0.06)",
      color:  "var(--c-primary-dark)",
      label: "LOW QUALITY",
    },
  };
}

const plans = [
  {
    tier: "HIGH",
    name: "High Quality",
    subtitle: "3D Icon Seals",
    usd: "$7",
    robux: "779 Robux",
    note: "tax included",
    time: "~3 hours per logo",
    min: "Minimum 1 logo",
    features: [
      "3D icon in the center (eagle, globe, etc.)",
      "Made from scratch or inspired by real divisions",
      "Custom outer ring with your text and colors",
      "PNG with transparent background",
    ],
  },
  {
    tier: "MID",
    name: "Mid Quality",
    subtitle: "2D Original Seals",
    usd: "$4",
    robux: "459 Robux",
    note: "tax included",
    time: "~2 hours per logo",
    min: "Minimum 2 logos",
    features: [
      "2D icon made fully from scratch",
      "Not copied or traced from real seals",
      "Custom outer ring with your text and colors",
      "PNG with transparent background",
    ],
  },
  {
    tier: "LOW",
    name: "Low Quality",
    subtitle: "2D Emblem + Custom Ring",
    usd: "$2",
    robux: "229 Robux",
    note: "tax included",
    time: "~1 hour per logo",
    min: "Minimum 3 logos",
    features: [
      "2D emblem center (FBI-style, etc.)",
      "Custom outer ring with your colors and text",
      "Reference must be provided",
      "PNG with transparent background",
    ],
  },
];

const orderFields = [
  ["QUALITY",                 "HIGH / MID / LOW"],
  ["PAYMENT",                 "PAYPAL / ROBUX"],
  ["NUMBER OF LOGOS",         "#"],
  ["DIVISION",                "FBI, CIA, ARMY, etc."],
  ["RING COLORS",             "or: MATCH TO ICON"],
  ["CENTER ICON / EMBLEM",    "reference here"],
  ["STYLE EXAMPLE",           "reference here"],
];

const THEME_CONFIG: Record<Theme, { bg: string; label: string; dot: string; gradient?: string }> = {
  purple: { bg: "#16052f", label: "Purple", dot: "#e000ff", gradient: "linear-gradient(135deg, #e000ff, #4b2dff)" },
  black:  { bg: "#090909", label: "Black",  dot: "#777777" },
  red:    { bg: "#CC1A1A", label: "Red",    dot: "#CC1A1A" },
};
const THEME_ORDER: Theme[] = ["purple", "black", "red"];

const LOGO_ANIMATIONS = [
  { id: "ambient" as const, label: "Ambient Flow", icon: Droplets, desc: "The site's layered color motion" },
  { id: "smoky"   as const, label: "Smoky Flow",   icon: Palette,  desc: "The loading screen's smoke texture" },
];

function LogosNavbar({ onContact }: { onContact: () => void }) {
  const [dropOpen, setDropOpen]     = useState(false);
  const { theme, setTheme }         = useTheme();
  const { animation, setAnimation } = useAnimation();
  const [, navigate]                = useLocation();
  const dropRef                     = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropRef.current && !dropRef.current.contains(e.target as Node)) setDropOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="fixed top-0 left-0 right-0 z-[99] border-b border-white/5"
      style={{ background: "rgba(0,0,5,0.75)", backdropFilter: "blur(24px) saturate(1.2)" }}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <MagneticButton
            onClick={() => navigate("/")}
            className="flex items-center gap-1.5 text-white/45 hover:text-white transition-colors text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Portfolio
          </MagneticButton>
          <div className="w-px h-5 bg-white/10" />
          <div className="flex items-center gap-2.5">
            <div
              className="w-7 h-7 rounded-lg overflow-hidden flex-shrink-0"
              style={{ boxShadow: "0 0 10px var(--c-glow)" }}
            >
              <img src={useDiscordAvatar()} alt="MYSTICFUSION7X" className="w-full h-full object-cover" />
            </div>
            <span className="font-display font-bold text-sm tracking-tight text-white">Logo Design</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <ViewCounter />

          {/* Style dropdown */}
          <div className="relative" ref={dropRef}>
            <motion.button
              onClick={() => setDropOpen((o) => !o)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm text-white/50 hover:text-white transition-colors hover:bg-white/5"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
            >
              <Palette className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Style</span>
              <motion.div animate={{ rotate: dropOpen ? 180 : 0 }} transition={{ duration: 0.25 }}>
                <ChevronDown className="w-3 h-3 opacity-60" />
              </motion.div>
            </motion.button>

            <AnimatePresence>
              {dropOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.96 }}
                  transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
                  className="absolute right-0 top-full mt-2 w-56 rounded-2xl overflow-hidden z-[200]"
                  style={{
                    background: "rgba(8,6,20,0.92)",
                    border: "1px solid rgba(255,255,255,0.10)",
                    backdropFilter: "blur(24px)",
                    boxShadow: "0 8px 32px rgba(0,0,0,0.6), 0 0 0 0.5px rgba(255,255,255,0.05)",
                  }}
                >
                  <div className="px-4 pt-4 pb-3">
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-white/25 mb-3">Theme</p>
                    <div className="grid grid-cols-3 gap-1">
                      {THEME_ORDER.map((t) => {
                        const cfg = THEME_CONFIG[t];
                        const active = theme === t;
                        return (
                          <motion.button
                            key={t}
                            onClick={() => setTheme(t)}
                            whileHover={{ scale: 1.06 }}
                            whileTap={{ scale: 0.94 }}
                            className="flex flex-col items-center gap-1.5 px-1 py-2 rounded-xl transition-all"
                            style={{
                              background: active ? "rgba(255,255,255,0.08)" : "transparent",
                              border: active ? "1px solid rgba(255,255,255,0.14)" : "1px solid transparent",
                            }}
                          >
                            <div
                              className="rounded-full"
                              style={{
                                background: cfg.gradient ?? cfg.bg,
                                boxShadow: active ? `0 0 10px ${cfg.dot}` : "none",
                                border: t === "black" ? "1px solid rgba(255,255,255,0.2)" : "none",
                                transform: active ? "scale(1.2)" : "scale(1)",
                                transition: "all 0.25s ease",
                                width: "18px",
                                height: "18px",
                                flexShrink: 0,
                              }}
                            />
                            <span className="text-[8px] font-medium tracking-wide leading-none" style={{ color: active ? "rgba(255,255,255,0.85)" : "rgba(255,255,255,0.35)" }}>
                              {cfg.label}
                            </span>
                          </motion.button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="mx-4 border-t border-white/6" />

                  <div className="px-4 py-3">
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-white/25 mb-2">Animation</p>
                    <div className="flex flex-col gap-1">
                      {LOGO_ANIMATIONS.map(({ id, label, icon: Icon, desc }) => {
                        const active = animation === id;
                        return (
                          <motion.button
                            key={id}
                            onClick={() => setAnimation(id)}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-left transition-all w-full"
                            style={{
                              background: active ? "rgba(255,255,255,0.07)" : "transparent",
                              border: active ? "1px solid rgba(255,255,255,0.12)" : "1px solid transparent",
                            }}
                          >
                            <Icon className="w-3.5 h-3.5 flex-shrink-0" style={{ color: active ? "var(--c-primary)" : "rgba(255,255,255,0.30)" }} />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <p className="text-xs font-medium" style={{ color: active ? "rgba(255,255,255,0.90)" : "rgba(255,255,255,0.45)" }}>{label}</p>
                              </div>
                              <p className="text-[9px] text-white/20 leading-none mt-0.5">{desc}</p>
                            </div>
                            {active && (
                              <div className="ml-auto w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: "var(--c-primary)", boxShadow: "0 0 6px var(--c-glow)" }} />
                            )}
                          </motion.button>
                        );
                      })}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <MagneticButton
            onClick={onContact}
            className="btn-primary px-5 py-2 text-sm font-semibold text-white rounded-full"
          >
            Order Now
          </MagneticButton>
        </div>
      </div>
    </motion.header>
  );
}

export default function Logos() {
  const [, navigate]                = useLocation();
  const TIER                        = useTierConfig();
  const [lightbox, setLightbox]     = useState<LightboxState | null>(null);

  const openLightbox = useCallback((src: string, alt: string) => {
    setLightbox({ src, alt, zoom: 1 });
  }, []);

  const goContact = () => {
    navigate("/");
    setTimeout(() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" }), 300);
  };

  function BgComponent() {
    return <GlobalBackground />;
  }

  return (
    <>
      <BgComponent />
      <ScrollProgress />
      <AmbientAudio />

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <Lightbox state={lightbox} onClose={() => setLightbox(null)} />
        )}
      </AnimatePresence>

      <main className="relative min-h-screen overflow-x-hidden" style={{ background: "transparent" }}>
        <LogosNavbar onContact={goContact} />

        {/* Hero */}
        <section className="pt-36 pb-16 px-6" style={{ position: "relative", zIndex: 2 }}>
          <div className="max-w-7xl mx-auto">
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-xs font-semibold uppercase tracking-widest gradient-text-blue mb-4"
            >
              Logo Design Portfolio
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 40, filter: "blur(12px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.85, delay: 0.18, ease: [0.23, 1, 0.32, 1] }}
              className="font-bold text-white leading-tight mb-5"
              style={{ fontSize: "clamp(2.8rem, 6vw, 5rem)" }}
            >
              Seal-Style Logos<br />
              <span className="gradient-text">For RP Divisions.</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.32 }}
              className="text-white/45 text-base max-w-lg leading-relaxed"
            >
              Over 2 years of experience making official-looking circular emblem logos for Roblox divisions and RP groups. Affordable pricing, fast delivery, reference required.
            </motion.p>
          </div>
        </section>

        {/* Logo Grid */}
        <section className="px-6 pb-28" style={{ position: "relative", zIndex: 2 }}>
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {logos.map((logo, i) => {
                const t = TIER[logo.tier as keyof typeof TIER];
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.9, filter: "blur(8px)" }}
                    whileInView={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{ delay: i * 0.035, duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
                    whileHover={{ y: -4, transition: { duration: 0.25 } }}
                    className="rounded-2xl p-4 flex flex-col gap-3"
                    style={{ background: t.bg, border: t.border }}
                  >
                    <ProtectedImage
                      src={`/images/logos/${logo.file}`}
                      alt={logo.name}
                      onClick={() => openLightbox(`/images/logos/${logo.file}`, logo.name)}
                    />
                    <div>
                      <span
                        className="text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full inline-block mb-1.5"
                        style={{ background: "var(--c-glass-bg)", border: t.border, color: t.color }}
                      >
                        {t.label}
                      </span>
                      <p className="text-xs text-white/80 font-semibold leading-tight">{logo.name}</p>
                      <p className="text-[10px] text-white/30 mt-0.5">{logo.tag}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section className="px-6 pb-28 border-t border-white/5" style={{ position: "relative", zIndex: 2 }}>
          <div className="max-w-7xl mx-auto pt-20">
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-xs font-semibold uppercase tracking-widest gradient-text-blue mb-4"
            >
              Pricing
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-bold text-white mb-12"
            >
              Logo Pricing
            </motion.h2>

            <div className="grid md:grid-cols-3 gap-5 mb-6">
              {plans.map((plan, i) => {
                const t = TIER[plan.tier as keyof typeof TIER];
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
                    whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1, duration: 0.6 }}
                  >
                    <TiltCard className="rounded-2xl h-full card-hover" intensity={10}>
                      <div
                        className="p-6 flex flex-col h-full rounded-2xl"
                        style={{ background: t.bg, border: t.border }}
                      >
                        <div className="mb-5">
                          <span
                            className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full inline-block mb-3"
                            style={{ background: "var(--c-glass-bg)", border: t.border, color: t.color }}
                          >
                            {plan.tier} QUALITY
                          </span>
                          <h3 className="text-xl font-bold text-white">{plan.name}</h3>
                          <p className="text-xs text-white/35 mt-0.5">{plan.subtitle}</p>
                        </div>

                        <div className="mb-5 pb-5 border-b border-white/7">
                          <div className="flex items-baseline gap-2 mb-1">
                            <span
                              className="text-3xl font-bold text-white font-display"
                              style={{ textShadow: "0 0 24px var(--c-glow)" }}
                            >
                              {plan.usd}
                            </span>
                            <span className="text-sm text-white/35">per logo</span>
                          </div>
                          <p className="text-sm font-semibold" style={{ color: t.color }}>{plan.robux}</p>
                          <p className="text-xs text-white/25">{plan.note}</p>
                          <div className="mt-2 flex flex-wrap gap-2">
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/4 border border-white/7 text-white/40">{plan.time}</span>
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/4 border border-white/7 text-white/40">{plan.min}</span>
                          </div>
                        </div>

                        <ul className="space-y-2.5 flex-1 mb-5">
                          {plan.features.map((f, fi) => (
                            <li key={fi} className="flex items-start gap-2 text-xs text-white/50">
                              <Check
                                className="w-3.5 h-3.5 flex-shrink-0 mt-0.5"
                                style={{ color: t.color, filter: "drop-shadow(0 0 4px var(--c-glow-soft))" }}
                              />
                              {f}
                            </li>
                          ))}
                        </ul>

                        <MagneticButton
                          onClick={goContact}
                          className="w-full py-2.5 rounded-xl text-sm font-semibold text-white/75 hover:text-white transition-colors"
                          style={{ background: "var(--c-glass-bg)", border: t.border } as React.CSSProperties}
                        >
                          Order {plan.name}
                        </MagneticButton>
                      </div>
                    </TiltCard>
                  </motion.div>
                );
              })}
            </div>

            {/* Add-ons */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="glass rounded-2xl p-5 flex flex-wrap gap-6 items-center"
            >
              <p className="text-xs font-semibold uppercase tracking-widest text-white/25">Add-Ons</p>
              {[
                { label: "Rush Delivery", value: "+$3" },
                { label: "Extra Revision", value: "+$1 each" },
                { label: "ROBLOX Paid", value: "−20% on USD price" },
              ].map((a) => (
                <div key={a.label} className="flex items-center gap-2">
                  <span className="text-xs text-white/40">{a.label}</span>
                  <span className="text-xs font-bold" style={{ color: "var(--c-primary)" }}>{a.value}</span>
                </div>
              ))}
            </motion.div>

            {/* Order form */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-6 glass rounded-2xl p-5"
            >
              <p className="text-xs font-semibold uppercase tracking-widest text-white/25 mb-4">Order Template (DM on Discord)</p>
              <div className="grid sm:grid-cols-2 gap-2">
                {orderFields.map(([field, hint]) => (
                  <div key={field} className="flex items-baseline gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-white/30 min-w-[120px] flex-shrink-0">{field}:</span>
                    <span className="text-[10px] text-white/20 italic">{hint}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>
      </main>
    </>
  );
}
