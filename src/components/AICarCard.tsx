"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  Star,
  Fuel,
  Zap,
  Users,
  ExternalLink,
  Search,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { AICar } from "@/lib/ai-types";

interface AICarCardProps {
  car: AICar;
  matchScore?: number;
  index?: number;
  badge?: string; // e.g. "Top Pick", "Best Value"
}

// Body-style gradient backgrounds
function getBodyGradient(bodyStyle: string): string {
  const bs = bodyStyle.toLowerCase();
  if (bs.includes("suv") || bs.includes("crossover")) return "from-slate-100 to-blue-50 dark:from-slate-800/60 dark:to-blue-900/20";
  if (bs.includes("truck")) return "from-stone-100 to-amber-50 dark:from-stone-800/60 dark:to-amber-900/20";
  if (bs.includes("sedan")) return "from-zinc-100 to-slate-100 dark:from-zinc-800/60 dark:to-slate-900/20";
  if (bs.includes("coupe") || bs.includes("sport")) return "from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/10";
  if (bs.includes("van") || bs.includes("minivan")) return "from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/10";
  if (bs.includes("convertible")) return "from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/10";
  return "from-[#f0e8de] to-[#e5d9cc] dark:from-[#2a2520] dark:to-[#1e1c18]";
}

function BodySVG({ bodyStyle }: { bodyStyle: string }) {
  const bs = bodyStyle.toLowerCase();
  // Simple inline SVG silhouettes
  if (bs.includes("truck")) {
    return (
      <svg viewBox="0 0 300 100" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" className="w-full opacity-40">
        <path strokeWidth="2" d="M 20 68 L 20 54 C 22 48 28 46 36 46 L 52 46 C 56 34 68 18 90 16 L 150 16 C 164 16 174 22 178 34 L 180 46 L 188 46 L 188 68" />
        <path strokeWidth="2" d="M 188 46 L 270 46 L 270 68" />
        <path strokeWidth="2" d="M 20 68 L 46 68 A 16 16 0 0 1 78 68 L 148 68 A 16 16 0 0 1 180 68 L 188 68 L 248 68 A 16 16 0 0 1 272 68" />
        <circle cx="62" cy="80" r="14" strokeWidth="2" />
        <circle cx="164" cy="80" r="14" strokeWidth="2" />
        <circle cx="258" cy="80" r="14" strokeWidth="2" />
      </svg>
    );
  }
  if (bs.includes("suv") || bs.includes("crossover")) {
    return (
      <svg viewBox="0 0 300 100" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" className="w-full opacity-40">
        <path strokeWidth="2" d="M 20 70 L 20 56 C 22 50 28 48 36 48 L 52 48 C 56 34 68 16 90 16 L 195 16 C 218 16 234 30 244 48 L 252 50 C 264 51 270 56 270 64 L 270 70 L 248 70 A 16 16 0 0 1 214 70 L 88 70 A 16 16 0 0 1 52 70 Z" />
        <circle cx="70" cy="82" r="14" strokeWidth="2" />
        <circle cx="230" cy="82" r="14" strokeWidth="2" />
      </svg>
    );
  }
  // Default sedan
  return (
    <svg viewBox="0 0 300 100" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" className="w-full opacity-40">
      <path strokeWidth="2" d="M 20 70 L 20 58 C 22 52 28 50 36 50 L 52 50 C 60 38 78 24 107 20 L 185 20 C 206 20 226 33 240 50 L 252 52 C 262 53 268 58 268 66 L 268 70 L 246 70 A 16 16 0 0 1 212 70 L 90 70 A 16 16 0 0 1 54 70 Z" />
      <circle cx="72" cy="82" r="14" strokeWidth="2" />
      <circle cx="228" cy="82" r="14" strokeWidth="2" />
    </svg>
  );
}

export default function AICarCard({ car, matchScore, index = 0, badge }: AICarCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const isElectric = car.engine.toLowerCase().includes("electric") || car.engine.toLowerCase() === "ev";
  const isHybrid = car.engine.toLowerCase().includes("hybrid");

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const dx = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
    const dy = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);
    setTilt({ x: dy * -6, y: dx * 6 });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
    setHovered(false);
  };

  const gradient = getBodyGradient(car.bodyStyle);

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.div
        ref={cardRef}
        className="group relative bg-card rounded-[14px] overflow-hidden border border-subtle cursor-default select-none"
        style={{
          transformStyle: "preserve-3d",
          transform: hovered
            ? `perspective(900px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translateY(-5px) scale(1.012)`
            : "perspective(900px) rotateX(0deg) rotateY(0deg) translateY(0) scale(1)",
          transition: hovered
            ? "transform 0.06s ease-out, box-shadow 0.25s ease"
            : "transform 0.55s ease, box-shadow 0.3s ease",
          boxShadow: hovered
            ? "0 20px 56px rgba(45,41,38,0.17)"
            : "0 2px 18px rgba(45,41,38,0.06)",
        }}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={handleMouseLeave}
      >
        {/* Image area */}
        <div className={`relative h-44 bg-gradient-to-br ${gradient} flex items-end justify-center px-6 pb-3 pt-5 overflow-hidden`}>
          {/* Dot grid */}
          <div
            className="absolute inset-0 opacity-[0.06]"
            style={{ backgroundImage: "radial-gradient(circle, currentColor 1px, transparent 1px)", backgroundSize: "18px 18px" }}
          />
          <div className="w-full text-[#2d2926]/30 dark:text-[#e4ddd4]/20">
            <BodySVG bodyStyle={car.bodyStyle} />
          </div>

          {/* Badge top-left */}
          {badge && (
            <div className="absolute top-3 left-3">
              <span className="text-[10px] px-2.5 py-1 rounded-full gold-gradient text-white font-bold shadow-sm uppercase tracking-wide">
                {badge}
              </span>
            </div>
          )}

          {/* Match score top-right */}
          {matchScore !== undefined && (
            <div className="absolute top-3 right-3">
              <div className="flex items-center gap-1 px-2.5 py-1 rounded-full gold-gradient text-white text-xs font-bold shadow-sm">
                <Star size={9} fill="white" />
                {matchScore}%
              </div>
            </div>
          )}

          {/* Make watermark */}
          <div className="absolute bottom-3 left-3">
            <p className="text-[11px] font-bold tracking-wider uppercase text-[#2d2926]/40 dark:text-[#e4ddd4]/30">
              {car.make}
            </p>
          </div>

          {/* EV / Hybrid tag */}
          <div className="absolute bottom-3 right-3 flex gap-1">
            {isElectric && (
              <span className="text-[9px] px-2 py-0.5 rounded-full bg-emerald-100/80 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400 font-semibold">EV</span>
            )}
            {isHybrid && (
              <span className="text-[9px] px-2 py-0.5 rounded-full bg-blue-100/80 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400 font-semibold">Hybrid</span>
            )}
          </div>
        </div>

        {/* Card body */}
        <div className="p-4">
          <div className="mb-3">
            <p className="text-[11px] text-muted font-semibold tracking-wide uppercase mb-0.5">{car.make} · {car.year}</p>
            <h3 className="font-serif text-[17px] font-bold leading-tight text-[#2d2926] dark:text-[#e4ddd4]">{car.model}</h3>
            <p className="text-xs text-muted mt-0.5">{car.bodyStyle} · {car.drivetrain}</p>
          </div>

          {/* Match reason */}
          <p className="text-xs text-muted leading-relaxed mb-3 border-l-2 border-[#a07850]/25 pl-2.5 italic">
            {car.matchReason}
          </p>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-2 mb-4">
            <div className="rounded-lg bg-[#a07850]/5 dark:bg-[#cba070]/7 p-2 text-center">
              <Users size={12} className="mx-auto mb-1 text-muted" />
              <p className="text-xs font-bold text-[#2d2926] dark:text-[#e4ddd4]">{car.passengers}</p>
              <p className="text-[10px] text-muted">seats</p>
            </div>
            <div className="rounded-lg bg-[#a07850]/5 dark:bg-[#cba070]/7 p-2 text-center">
              {isElectric
                ? <Zap size={12} className="mx-auto mb-1 text-emerald-500" />
                : <Fuel size={12} className="mx-auto mb-1 text-muted" />}
              <p className="text-xs font-bold text-[#2d2926] dark:text-[#e4ddd4]">
                {isElectric ? (car.range?.split(" ")[0] ?? "—") : (car.mpg?.split("/")[0] ?? "—")}
              </p>
              <p className="text-[10px] text-muted">{isElectric ? "mi range" : "city mpg"}</p>
            </div>
            <div className="rounded-lg bg-[#a07850]/5 dark:bg-[#cba070]/7 p-2 text-center">
              <p className="text-[10px] font-bold text-gold text-center mb-1">HP</p>
              <p className="text-xs font-bold text-[#2d2926] dark:text-[#e4ddd4]">{car.horsepower}</p>
              <p className="text-[10px] text-muted">power</p>
            </div>
          </div>

          {/* Price */}
          <div className="flex items-end justify-between gap-2 mb-4">
            <div>
              <p className="text-[11px] text-muted mb-0.5">Price range</p>
              <p className="text-[16px] font-bold font-serif text-[#2d2926] dark:text-[#e4ddd4] leading-none">{car.priceRange}</p>
            </div>
          </div>

          {/* Highlights */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {car.highlights.map((h) => (
              <span key={h} className="text-[10px] px-2 py-0.5 rounded-full bg-[#a07850]/8 text-[#a07850] dark:bg-[#cba070]/10 dark:text-[#cba070] font-medium border border-[#a07850]/15 dark:border-[#cba070]/15">
                {h}
              </span>
            ))}
          </div>

          {/* Expand toggle */}
          <button
            onClick={() => setExpanded(!expanded)}
            className="w-full flex items-center justify-center gap-1 text-[11px] text-muted hover:text-gold transition-colors py-1"
          >
            {expanded ? <><ChevronUp size={12} /> Show less</> : <><ChevronDown size={12} /> Pros & Cons</>}
          </button>

          {/* Pros & Cons (expandable) */}
          {expanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-3 grid grid-cols-2 gap-3"
            >
              <div>
                <p className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 mb-1 uppercase tracking-wide">Pros</p>
                <ul className="space-y-1">
                  {car.pros.map((p) => (
                    <li key={p} className="text-[10px] text-[#2d2926] dark:text-[#e4ddd4] flex items-start gap-1">
                      <span className="text-emerald-500 mt-0.5">✓</span> {p}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-[10px] font-bold text-red-500 dark:text-red-400 mb-1 uppercase tracking-wide">Cons</p>
                <ul className="space-y-1">
                  {car.cons.map((c) => (
                    <li key={c} className="text-[10px] text-[#2d2926] dark:text-[#e4ddd4] flex items-start gap-1">
                      <span className="text-red-400 mt-0.5">✗</span> {c}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          )}

          {/* Action links */}
          <div className="mt-4 grid grid-cols-3 gap-1.5">
            <a
              href={car.manufacturerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-1 py-2 px-1 rounded-lg border border-subtle hover:bg-[#a07850]/6 dark:hover:bg-[#cba070]/6 transition-colors group"
            >
              <ExternalLink size={11} className="text-muted group-hover:text-gold transition-colors" />
              <span className="text-[9px] text-muted group-hover:text-gold transition-colors font-medium text-center leading-tight">Official<br />Site</span>
            </a>
            <a
              href={car.carsComUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-1 py-2 px-1 rounded-lg border border-subtle hover:bg-[#a07850]/6 dark:hover:bg-[#cba070]/6 transition-colors group"
            >
              <Search size={11} className="text-muted group-hover:text-gold transition-colors" />
              <span className="text-[9px] text-muted group-hover:text-gold transition-colors font-medium text-center leading-tight">Cars<br />.com</span>
            </a>
            <a
              href={car.carGurusUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-1 py-2 px-1 rounded-lg border border-subtle hover:bg-[#a07850]/6 dark:hover:bg-[#cba070]/6 transition-colors group"
            >
              <Search size={11} className="text-muted group-hover:text-gold transition-colors" />
              <span className="text-[9px] text-muted group-hover:text-gold transition-colors font-medium text-center leading-tight">Car<br />Gurus</span>
            </a>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
