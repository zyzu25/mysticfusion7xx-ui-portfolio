import { motion } from "framer-motion";
import { TiltCard } from "./TiltCard";
import { AnimatedText } from "./AnimatedText";
import { BadgeCheck } from "lucide-react";

const testimonials = [
  {
    quote: "Bro literally made my game look like a completely different thing. The HUD and shop just hit different now, everyone in the server keeps asking who designed it.",
    rating: 4.5,
  },
  {
    quote: "The military UI was exactly what I needed. No back and forth, no weird revisions, just straight clean work. Understood the assignment immediately.",
    rating: 5,
  },
  {
    quote: "Loading screen alone got me like 5 extra players cause people were posting screenshots of it. The whole UI package was worth every robux. Def coming back for more.",
    rating: 4.5,
  },
  {
    quote: "Amazing UI designs took even less than the time I expected him to deliver the UIs in, they are very high quality and great prices as well",
    rating: 5,
  },
  {
    quote: "The UIs were great the only problem was that the importing wasn't positioned well in studio but I understand it cause he works on figma more",
    rating: 4.5,
  },
  {
    quote: "Made my CIA UIs exactly like how I wanted them maybe one UI wasn't the best but the other UI's quality was really really GREAT especially loading screen I think he's too good at making loading screens, I'd probably suggest that you hire him 100%",
    rating: 4,
  },
  {
    quote: "I don't really have anything to say, you already reached professional level",
    rating: 5,
  },
];

function Stars({ count }: { count: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => {
        const full = i + 1 <= count;
        const half = !full && i + 0.5 <= count;
        return (
          <svg key={i} className="w-3.5 h-3.5" viewBox="0 0 20 20" style={{ color: (full || half) ? "#f59e0b" : "rgba(255,255,255,0.1)" }}>
            {half ? (
              <>
                <defs>
                  <linearGradient id={`half-${i}`} x1="0" x2="1" y1="0" y2="0">
                    <stop offset="50%" stopColor="#f59e0b" />
                    <stop offset="50%" stopColor="rgba(255,255,255,0.1)" />
                  </linearGradient>
                </defs>
                <path fill={`url(#half-${i})`} d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.368 2.448a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.54 1.118l-3.368-2.447a1 1 0 00-1.175 0l-3.368 2.447c-.784.57-1.838-.197-1.539-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.074 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.275-3.957z" />
              </>
            ) : (
              <path fill="currentColor" d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.368 2.448a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.54 1.118l-3.368-2.447a1 1 0 00-1.175 0l-3.368 2.447c-.784.57-1.838-.197-1.539-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.074 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.275-3.957z" />
            )}
          </svg>
        );
      })}
    </div>
  );
}

export function Testimonials() {
  return (
    <section className="py-28 border-t border-white/5 section-glow" id="testimonials" style={{ zIndex: 2 }}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="max-w-xl mb-14">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-xs font-semibold uppercase tracking-widest gradient-text-blue mb-4"
          >
            Testimonials
          </motion.p>
          <h2 className="text-4xl md:text-5xl font-bold text-white">
            <AnimatedText text="What clients say." delay={0.1} />
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: i * 0.10, duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
            >
              <TiltCard className="glass rounded-2xl p-7 flex flex-col h-full card-hover" intensity={10}>
                {/* Stars */}
                <div className="mb-4 flex items-center gap-2">
                  <Stars count={t.rating} />
                  <span className="text-[10px] text-white/30 font-semibold">{t.rating}/5</span>
                </div>

                {/* Quote mark */}
                <svg className="w-5 h-5 mb-3" viewBox="0 0 24 24" fill="currentColor" style={{ color: "var(--c-primary)", opacity: 0.5 }}>
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>

                <p className="text-white/55 leading-relaxed text-sm flex-1 italic">"{t.quote}"</p>

                {/* Verified client footer */}
                <div className="mt-5 pt-4 border-t border-white/7 flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center"
                    style={{ background: "linear-gradient(135deg, var(--c-glow-soft), var(--c-border-soft))", border: "1px solid var(--c-border)" }}
                  >
                    <BadgeCheck className="w-4 h-4" style={{ color: "var(--c-primary)" }} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-white/70 flex items-center gap-1">
                      <BadgeCheck className="w-3 h-3 inline" style={{ color: "var(--c-primary)" }} />
                      Verified Client
                    </p>
                    <p className="text-[10px] text-white/25 mt-0.5">Confirmed commission</p>
                  </div>
                </div>
              </TiltCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
