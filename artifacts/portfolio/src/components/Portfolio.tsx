import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TiltCard } from "./TiltCard";
import { AnimatedText } from "./AnimatedText";
import { X, ZoomIn } from "lucide-react";

const SCREENSHOTS: Record<string, string[]> = {
  "VARIOUS ROLEPLAY UIs": [
    "/images/roleplay/citation.png",
    "/images/roleplay/incident-report.png",
    "/images/roleplay/surveillance-report.png",
    "/images/roleplay/notifications.png",
    "/images/roleplay/cia-secure-access-portal.png", // CIA Secure Access Portal
    "/images/roleplay/cia-access-verification.png", // CIA Access Verification
    "/images/ui/Group_1_(1)_1782698895070.png", // CIA Main Menu
    "/images/ui/CIA_CASE_DASHBOARD_1782698943338.png", // CIA Case Dashboard
    "/images/ui/Screenshot_2_1782698943343.png", // CIA Loading Screen
  ],
  "Fort Benning": [
    "/images/ui/image_1782699714758.png", // Loading Screen
    "/images/ui/image_1782699695211.png", // Main Menu
    "/images/ui/image_1782699772466.png", // BCT Hosting UI
    "/images/ui/image_1782699794486.png", // Events UI
    "/images/ui/image_1782699805450.png", // Emote Wheel
    "/images/ui/image_1782699769173.png", // ID Card UI
  ],
  "SCP Site Aether": [
    "/images/ui/Group_2_(1)_1782698943340.png", // Loading Screen
    "/images/ui/Screenshot_6_1782698943344.png", // Class Icons
    "/images/ui/Screenshot_3_1782698943343.png", // Health & Stamina HUD
    "/images/ui/Screenshot_4_1782698943344.png", // Settings UI
    "/images/ui/Group_2_(2)_1782698943341.png", // Notifications
    "/images/ui/image-Photoroom_(3)_1782698943342.png", // Proximity Prompt
  ],
  "Various Clients": [
    "/images/ui/Slide_16_9_-_2_(2)_1782698895073.png", // Anime UI
    "/images/ui/Group_23_1782698895072.png", // Car Shop UI
    "/images/ui/DailyRewardsUI_1782698895071.png", // Daily Rewards
    "/images/ui/Frame_2_1782698895068.png", // Redeem Codes
    "/images/ui/Frame_1_1782698895069.png", // Leaderboard
    "/images/ui/Group_5_1782698943341.png", // Quests
    "/images/ui/Group_1_(2)_1782698943338.png", // Kill Feed
    "/images/ui/Slide_16_9_-_1_(1)_1782698895072.png", // Gloves Shop (TTX)
    "/images/ui/image_1782699117451.png", // Inventory (TTX)
    "/images/ui/image_1782699122523.png", // Settings (TTX)
    "/images/ui/TeamSelection_1782699662023.png", // Team Selection (Vanguard)
    "/images/roleplay/shop-interface.png", // Shop Interface
    "/images/roleplay/request-feature.png", // Request a Feature
  ],
};

const projects = [
  {
    game: "VARIOUS ROLEPLAY UIs",
    category: "Roleplay",
    screens: ["Citation", "Incident Report", "Surveillance Report", "Notifications", "CIA Secure Access Portal", "CIA Access Verification", "CIA Main Menu", "CIA Case Dashboard", "CIA Loading Screen"],
    desc: "",
    tag: "",
  },
  {
    game: "Fort Benning",
    category: "Military RP",
    screens: ["Loading Screen", "Main Menu", "BCT Hosting UI", "Events UI", "Emote Wheel", "ID Card UI"],
    desc: "Full UI suite for a military roleplay experience. Loading screen, main menu, BCT hosting, events system, emote selection wheel, and identification card.",
    tag: "6 Screens",
  },
  {
    game: "SCP Site Aether",
    category: "SCP / Military RP",
    screens: ["Loading Screen", "Class Icons", "Health & Stamina HUD", "Settings UI", "Notifications", "Proximity Prompt"],
    desc: "Dark, immersive UI system for an SCP roleplay site. Loading screen, class selection, notifications, custom proximity prompt, settings, and a health/stamina HUD.",
    tag: "6 Screens",
  },
  {
    game: "Various Clients",
    category: "Mixed",
    screens: ["Anime UI", "Car Shop UI", "Daily Rewards", "Redeem Codes", "Leaderboard", "Quests", "Kill Feed", "Gloves Shop", "Inventory", "Settings", "Team Selection", "Shop Interface", "Request a Feature"],
    desc: "Standalone commissions including anime interfaces, car shop, daily rewards, redeem codes, leaderboards, quests, kill feed, shop UIs, and team selection systems.",
    tag: "13 Screens",
  },
];

function Lightbox({ src, alt, onClose }: { src: string; alt: string; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-12"
      style={{ background: 'rgba(2,2,12,0.92)', backdropFilter: 'blur(12px)' }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
        className="relative max-w-full max-h-full"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={src}
          alt={alt}
          className="max-w-full max-h-[85vh] rounded-xl object-contain select-none"
          style={{ pointerEvents: 'none', userSelect: 'none', WebkitUserSelect: 'none', WebkitTouchCallout: 'none' }}
          onContextMenu={(e) => e.preventDefault()}
          draggable={false}
        />
        <button
          onClick={onClose}
          className="absolute -top-10 right-0 text-white/60 hover:text-white transition-colors"
        >
          <X size={24} />
        </button>
      </motion.div>
    </motion.div>
  );
}

function ScreenSlot({
  src,
  alt,
  index,
  onClick,
}: {
  src: string;
  alt: string;
  index: number;
  onClick?: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05, duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
      className={`relative rounded-xl overflow-hidden group ${onClick ? 'cursor-zoom-in' : ''}`}
      style={{
        aspectRatio: '16/9',
        background: 'linear-gradient(145deg, rgba(4,4,12,0.96), rgba(12,7,26,0.92))',
      }}
      onClick={onClick}
    >
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-contain bg-black/40 asset-protected"
        draggable={false}
        onContextMenu={(e) => e.preventDefault()}
        onDragStart={(e) => e.preventDefault()}
        style={{
          userSelect: 'none',
          WebkitUserSelect: 'none',
          WebkitTouchCallout: 'none',
          pointerEvents: 'none',
          imageRendering: 'auto',
        }}
      />
      <div
        className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100"
        style={{ pointerEvents: 'none' }}
      >
        <ZoomIn size={20} className="text-white/70" />
      </div>
    </motion.div>
  );
}

export function Portfolio() {
  const [lightbox, setLightbox] = useState<{ src: string; alt: string } | null>(null);

  const openLightbox = useCallback((src: string, alt: string) => {
    setLightbox({ src, alt });
  }, []);

  const closeLightbox = useCallback(() => {
    setLightbox(null);
  }, []);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox();
      const key = e.key.toLowerCase();
      const modified = e.ctrlKey || e.metaKey;
      if (
        (modified && ['s', 'u', 'p'].includes(key)) ||
        (modified && e.shiftKey && ['i', 'j', 'c'].includes(key))
      ) {
        e.preventDefault();
      }
    };
    const preventAssetAction = (e: Event) => {
      const target = e.target;
      if (target instanceof Element && target.closest('#portfolio img')) {
        e.preventDefault();
      }
    };
    window.addEventListener('keydown', handleKey);
    document.addEventListener('contextmenu', preventAssetAction);
    document.addEventListener('dragstart', preventAssetAction);
    document.addEventListener('selectstart', preventAssetAction);
    return () => {
      window.removeEventListener('keydown', handleKey);
      document.removeEventListener('contextmenu', preventAssetAction);
      document.removeEventListener('dragstart', preventAssetAction);
      document.removeEventListener('selectstart', preventAssetAction);
    };
  }, [closeLightbox]);

  return (
    <section
      className="py-28 border-t border-white/5 section-glow"
      id="portfolio"
      style={{ zIndex: 2 }}
      onContextMenu={(e) => {
        if ((e.target as HTMLElement).closest('#portfolio img')) {
          e.preventDefault();
        }
      }}
    >
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex items-end justify-between mb-14">
          <div>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-xs font-semibold uppercase tracking-widest gradient-text-blue mb-3"
            >
              Portfolio
            </motion.p>
            <h2 className="text-4xl md:text-5xl font-bold text-white">
              <AnimatedText text="Featured work." delay={0.1} />
            </h2>
          </div>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="hidden md:block text-white/30 text-sm max-w-xs text-right leading-relaxed"
          >
            Real projects shipped for live Roblox games.
          </motion.p>
        </div>

        <div className="space-y-5">
          {projects.map((project, index) => (
            <TiltCard key={index} className="glass rounded-2xl overflow-hidden card-hover" intensity={6}>
              <div className="p-6 md:p-8">
                <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
                  <div>
                     <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-xl font-bold text-white">{project.game}</h3>
                       {project.tag && (
                         <span className="text-xs px-2.5 py-0.5 rounded-full font-medium text-white/55 pill-badge">
                           {project.tag}
                         </span>
                       )}
                    </div>
                    <p className="text-xs text-white/30 uppercase tracking-widest">{project.category}</p>
                  </div>
                   {project.desc && (
                     <p className="text-sm text-white/40 leading-relaxed max-w-md">{project.desc}</p>
                   )}
                </div>

                <div
                  className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3"
                >
                  {project.screens.map((screen, i) => {
                    const src = SCREENSHOTS[project.game]?.[i] ?? "";
                    return (
                      <ScreenSlot
                        key={i}
                        src={src}
                        alt={screen}
                        index={i}
                        onClick={src ? () => openLightbox(src, `${project.game} \u2014 ${screen}`) : undefined}
                      />
                    );
                  })}
                </div>
              </div>
            </TiltCard>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {lightbox && (
          <Lightbox
            src={lightbox.src}
            alt={lightbox.alt}
            onClose={closeLightbox}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
