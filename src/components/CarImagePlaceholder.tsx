"use client";

import { Car } from "@/lib/cars";

interface Props {
  car: Car;
  className?: string;
  size?: "card" | "hero";
}

// SVG silhouettes — stroke-based line drawing per body type
function SedanSVG({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 300 105" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path strokeWidth="2.2" d="M 20 72 L 20 60 C 22 54 28 52 36 52 L 52 52 C 60 40 78 26 107 22 L 185 22 C 206 22 226 35 240 52 L 252 54 C 262 55 268 60 268 68 L 268 72 L 246 72 A 18 18 0 0 1 210 72 L 90 72 A 18 18 0 0 1 54 72 Z" />
      <circle cx="72" cy="84" r="16" strokeWidth="2.2" />
      <circle cx="228" cy="84" r="16" strokeWidth="2.2" />
      <path strokeWidth="1.5" opacity="0.55" d="M 55 52 C 64 40 80 26 108 23 L 128 23 L 128 52 Z" />
      <path strokeWidth="1.5" opacity="0.55" d="M 132 52 L 132 23 L 183 23 C 205 23 222 36 238 52 Z" />
      <line x1="128" y1="23" x2="128" y2="52" strokeWidth="1.5" opacity="0.35" />
    </svg>
  );
}

function SUVSVG({ large }: { large?: boolean }) {
  const roofY = large ? 14 : 18;
  return (
    <svg viewBox="0 0 300 105" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
      <path strokeWidth="2.2" d={`M 20 72 L 20 58 C 22 52 28 50 36 50 L 52 50 C 56 36 68 ${roofY + 6} 90 ${roofY} L 195 ${roofY} C 218 ${roofY} 234 32 244 50 L 252 52 C 264 53 270 58 270 66 L 270 72 L 248 72 A 18 18 0 0 1 212 72 L 88 72 A 18 18 0 0 1 52 72 Z`} />
      <circle cx="70" cy="84" r="16" strokeWidth="2.2" />
      <circle cx="230" cy="84" r="16" strokeWidth="2.2" />
      <path strokeWidth="1.5" opacity="0.55" d={`M 54 50 L 68 ${roofY + 2} L 130 ${roofY + 2} L 130 50 Z`} />
      <path strokeWidth="1.5" opacity="0.55" d={`M 134 50 L 134 ${roofY + 2} L 192 ${roofY + 2} L 240 50 Z`} />
      <line x1="130" y1={roofY + 2} x2="130" y2="50" strokeWidth="1.5" opacity="0.35" />
    </svg>
  );
}

function TruckSVG() {
  return (
    <svg viewBox="0 0 300 105" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
      {/* Cab */}
      <path strokeWidth="2.2" d="M 20 72 L 20 56 C 22 50 28 48 36 48 L 52 48 C 56 36 68 20 90 18 L 150 18 C 164 18 174 24 178 36 L 180 48 L 188 48 L 188 72" />
      {/* Bed */}
      <path strokeWidth="2.2" d="M 188 48 L 270 48 L 270 72" />
      {/* Bed details */}
      <path strokeWidth="1.5" opacity="0.4" d="M 188 48 L 188 72" />
      <path strokeWidth="1.5" opacity="0.3" d="M 220 48 L 220 72 M 248 48 L 248 72" />
      {/* Floor */}
      <path strokeWidth="2.2" d="M 20 72 L 46 72 A 18 18 0 0 1 82 72 L 148 72 A 18 18 0 0 1 184 72 L 188 72 L 248 72 A 18 18 0 0 1 272 72" />
      {/* Wheels */}
      <circle cx="64" cy="84" r="16" strokeWidth="2.2" />
      <circle cx="166" cy="84" r="16" strokeWidth="2.2" />
      <circle cx="260" cy="84" r="16" strokeWidth="2.2" />
      {/* Cab windows */}
      <path strokeWidth="1.5" opacity="0.55" d="M 54 48 L 68 22 L 88 20 L 148 20 C 162 20 172 26 175 38 L 176 48 Z" />
    </svg>
  );
}

function HatchbackSVG() {
  return (
    <svg viewBox="0 0 300 105" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
      <path strokeWidth="2.2" d="M 20 72 L 20 60 C 22 54 28 52 36 52 L 52 52 C 58 40 74 24 100 20 L 180 20 C 208 20 228 38 240 52 L 252 54 C 262 55 268 60 268 68 L 268 72 L 246 72 A 18 18 0 0 1 210 72 L 90 72 A 18 18 0 0 1 54 72 Z" />
      <circle cx="72" cy="84" r="16" strokeWidth="2.2" />
      <circle cx="228" cy="84" r="16" strokeWidth="2.2" />
      {/* Steep rear hatch */}
      <path strokeWidth="1.5" opacity="0.55" d="M 54 52 C 62 38 76 24 102 22 L 130 22 L 130 52 Z" />
      {/* Front window */}
      <path strokeWidth="1.5" opacity="0.55" d="M 134 52 L 134 22 L 178 22 C 202 22 222 36 238 52 Z" />
      <line x1="130" y1="22" x2="130" y2="52" strokeWidth="1.5" opacity="0.35" />
    </svg>
  );
}

function CoupleSVG({ convertible }: { convertible?: boolean }) {
  return (
    <svg viewBox="0 0 300 105" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
      {convertible ? (
        // Convertible - just a windshield stub
        <path strokeWidth="2.2" d="M 20 72 L 20 64 C 22 58 28 56 38 56 L 60 56 C 66 46 80 38 100 36 L 185 36 C 200 36 216 42 228 52 L 238 56 C 250 58 264 60 266 68 L 266 72 L 244 72 A 18 18 0 0 1 208 72 L 90 72 A 18 18 0 0 1 54 72 Z" />
      ) : (
        // Coupe - low fastback roofline
        <path strokeWidth="2.2" d="M 20 72 L 20 64 C 22 58 28 56 36 56 L 50 56 C 56 44 72 26 106 22 L 195 22 C 218 22 238 38 250 56 L 262 58 C 268 60 272 66 270 72 L 248 72 A 18 18 0 0 1 212 72 L 90 72 A 18 18 0 0 1 54 72 Z" />
      )}
      <circle cx="72" cy="84" r="16" strokeWidth="2.2" />
      <circle cx="230" cy="84" r="16" strokeWidth="2.2" />
      {!convertible && (
        <>
          <path strokeWidth="1.5" opacity="0.55" d="M 52 56 C 62 42 78 26 108 23 L 160 23 L 160 56 Z" />
          <path strokeWidth="1.5" opacity="0.55" d="M 164 56 L 164 23 L 193 23 C 216 23 236 38 248 56 Z" />
          <line x1="160" y1="23" x2="160" y2="56" strokeWidth="1.5" opacity="0.35" />
        </>
      )}
      {convertible && (
        <path strokeWidth="1.5" opacity="0.55" d="M 62 56 C 68 46 80 38 102 36 L 183 36 C 198 36 214 42 226 52 L 236 56 Z" />
      )}
    </svg>
  );
}

function VanSVG() {
  return (
    <svg viewBox="0 0 300 105" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
      <path strokeWidth="2.2" d="M 20 72 L 20 30 C 20 22 26 18 36 18 L 245 18 C 258 18 268 22 270 30 L 270 72 L 248 72 A 18 18 0 0 1 212 72 L 90 72 A 18 18 0 0 1 54 72 Z" />
      <circle cx="72" cy="84" r="16" strokeWidth="2.2" />
      <circle cx="230" cy="84" r="16" strokeWidth="2.2" />
      {/* Front windows */}
      <path strokeWidth="1.5" opacity="0.55" d="M 22 28 L 22 54 L 96 54 L 96 24 L 38 24 Z" />
      {/* Rear + middle side windows */}
      <path strokeWidth="1.5" opacity="0.45" d="M 100 54 L 100 24 L 155 24 L 155 54 Z" />
      <path strokeWidth="1.5" opacity="0.45" d="M 158 54 L 158 24 L 212 24 L 212 54 Z" />
      {/* Rear window */}
      <path strokeWidth="1.5" opacity="0.45" d="M 215 54 L 215 24 L 248 24 L 248 54" />
    </svg>
  );
}

function getBodySVG(bodyStyle: string) {
  const bs = bodyStyle.toLowerCase();
  if (bs.includes("van") || bs.includes("minivan")) return <VanSVG />;
  if (bs.includes("truck")) return <TruckSVG />;
  if (bs.includes("suv - large")) return <SUVSVG large />;
  if (bs.includes("suv")) return <SUVSVG />;
  if (bs.includes("hatchback")) return <HatchbackSVG />;
  if (bs.includes("convertible")) return <CoupleSVG convertible />;
  if (bs.includes("coupe")) return <CoupleSVG />;
  return <SedanSVG />;
}

// Color gradient based on exterior color name
function getColorTint(colorName: string): string {
  const name = colorName.toLowerCase();
  if (name.includes("black") || name.includes("ebony") || name.includes("midnight")) return "from-slate-200 to-slate-300 dark:from-slate-800/80 dark:to-slate-900";
  if (name.includes("white") || name.includes("pearl") || name.includes("crystal") || name.includes("silver")) return "from-zinc-100 to-zinc-200 dark:from-zinc-700/60 dark:to-zinc-800";
  if (name.includes("red") || name.includes("crimson") || name.includes("rosso")) return "from-red-100 to-rose-100 dark:from-red-900/40 dark:to-rose-900/30";
  if (name.includes("blue") || name.includes("tasman") || name.includes("riptide")) return "from-blue-100 to-sky-100 dark:from-blue-900/40 dark:to-sky-900/30";
  if (name.includes("green") || name.includes("launch") || name.includes("rally")) return "from-emerald-100 to-green-100 dark:from-emerald-900/40 dark:to-green-900/30";
  if (name.includes("gray") || name.includes("grey") || name.includes("silver") || name.includes("steel")) return "from-slate-100 to-gray-200 dark:from-slate-800/60 dark:to-gray-800";
  if (name.includes("brown") || name.includes("beige") || name.includes("tan") || name.includes("savile")) return "from-amber-100 to-stone-200 dark:from-amber-900/30 dark:to-stone-900/40";
  // Default warm
  return "from-[#f0e8de] to-[#e5d9cc] dark:from-[#2a2520] dark:to-[#1e1c18]";
}

function getSilhouetteColor(colorName: string): string {
  const name = colorName.toLowerCase();
  if (name.includes("black") || name.includes("ebony") || name.includes("midnight")) return "text-slate-500 dark:text-slate-400";
  if (name.includes("white") || name.includes("crystal") || name.includes("pearl") || name.includes("silver")) return "text-zinc-400 dark:text-zinc-500";
  if (name.includes("red") || name.includes("rosso")) return "text-rose-400/80 dark:text-rose-400/60";
  if (name.includes("blue") || name.includes("riptide") || name.includes("tasman")) return "text-blue-400/80 dark:text-blue-400/60";
  if (name.includes("green") || name.includes("launch") || name.includes("rally")) return "text-emerald-500/70 dark:text-emerald-400/60";
  return "text-[#a07850]/60 dark:text-[#cba070]/50";
}

export default function CarImagePlaceholder({ car, size = "card" }: Props) {
  const tint = getColorTint(car.color);
  const silhouetteColor = getSilhouetteColor(car.color);
  const isCard = size === "card";

  return (
    <div className={`relative overflow-hidden bg-gradient-to-br ${tint} ${isCard ? "h-48" : "aspect-video"} flex flex-col`}>
      {/* Subtle dot-grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.06] dark:opacity-[0.08]"
        style={{
          backgroundImage: "radial-gradient(circle, currentColor 1px, transparent 1px)",
          backgroundSize: "18px 18px",
        }}
      />

      {/* SVG silhouette */}
      <div className={`relative flex-1 flex items-end justify-center ${isCard ? "px-5 pb-2 pt-4" : "px-12 pb-6 pt-8"}`}>
        <div className={`w-full ${silhouetteColor}`}>
          {getBodySVG(car.bodyStyle)}
        </div>
      </div>

      {/* Make badge bottom-left */}
      <div className="absolute bottom-3 left-3">
        <p className="text-[11px] font-bold tracking-wider uppercase text-[#2d2926]/50 dark:text-[#e4ddd4]/40 font-sans">
          {car.make}
        </p>
      </div>

      {/* "Photo coming soon" - subtle */}
      <div className="absolute bottom-3 right-3">
        <p className="text-[9px] uppercase tracking-widest text-[#2d2926]/30 dark:text-[#e4ddd4]/25 font-sans">
          Photo soon
        </p>
      </div>
    </div>
  );
}
