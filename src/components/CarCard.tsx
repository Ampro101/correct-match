"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Zap, Fuel, Users, Star } from "lucide-react";
import { Car, formatPrice } from "@/lib/cars";

interface CarCardProps {
  car: Car;
  matchScore?: number;
  index?: number;
}

export default function CarCard({ car, matchScore, index = 0 }: CarCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / (rect.width / 2);
    const dy = (e.clientY - cy) / (rect.height / 2);
    setTilt({ x: dy * -8, y: dx * 8 });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
    setHovered(false);
  };

  const score = matchScore ?? Math.floor(Math.random() * 25 + 72);
  const isElectric = car.engine === "Electric";
  const isHybrid = car.engine.includes("Hybrid");

  const conditionColor =
    car.condition === "New"
      ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
      : car.condition === "Certified Pre-Owned"
      ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
      : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400";

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link href={`/cars/${car.id}`}>
        <motion.div
          ref={cardRef}
          className="group relative bg-card rounded-[14px] overflow-hidden border border-subtle shadow-card cursor-pointer select-none"
          style={{
            transformStyle: "preserve-3d",
            transform: hovered
              ? `perspective(800px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translateY(-6px) scale(1.01)`
              : "perspective(800px) rotateX(0deg) rotateY(0deg) translateY(0px) scale(1)",
            transition: hovered ? "transform 0.05s ease-out, box-shadow 0.3s ease" : "transform 0.5s ease, box-shadow 0.3s ease",
            boxShadow: hovered
              ? "0 24px 64px rgba(45,41,38,0.18)"
              : "0 4px 24px rgba(45,41,38,0.07)",
          }}
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={handleMouseLeave}
        >
          {/* Car image placeholder */}
          <div className="relative h-48 overflow-hidden bg-gradient-to-br from-[#f0e8de] to-[#e2d5c5] dark:from-[#2a2520] dark:to-[#1e1c18]">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-6xl mb-2">🚗</div>
                <p className="text-xs text-muted font-medium">
                  {car.year} {car.make}
                </p>
              </div>
            </div>

            {/* Match score badge */}
            <div className="absolute top-3 right-3">
              <div className="flex items-center gap-1 px-2.5 py-1 rounded-full gold-gradient text-white text-xs font-bold shadow-sm">
                <Star size={10} fill="white" />
                {score}% match
              </div>
            </div>

            {/* Condition badge */}
            <div className="absolute top-3 left-3">
              <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${conditionColor}`}>
                {car.condition}
              </span>
            </div>

            {/* Color dot */}
            <div
              className="absolute bottom-3 left-3 w-4 h-4 rounded-full border-2 border-white shadow-sm"
              style={{ backgroundColor: getColorHex(car.color) }}
              title={car.color}
            />
          </div>

          {/* Card content */}
          <div className="p-4">
            <div className="mb-3">
              <p className="text-xs text-muted font-medium mb-0.5">{car.make}</p>
              <h3 className="font-serif text-lg font-bold leading-tight text-[#2d2926] dark:text-[#e4ddd4]">
                {car.model}
              </h3>
              <p className="text-xs text-muted mt-0.5">{car.year} · {car.bodyStyle}</p>
            </div>

            {/* Match bar */}
            <div className="mb-4">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs text-muted">Match Score</span>
                <span className="text-xs font-bold text-gold">{score}%</span>
              </div>
              <div className="h-1.5 rounded-full bg-[#a07850]/15 dark:bg-[#cba070]/10 overflow-hidden">
                <motion.div
                  className="h-full rounded-full gold-gradient"
                  initial={{ width: 0 }}
                  whileInView={{ width: `${score}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: index * 0.07 + 0.3 }}
                />
              </div>
            </div>

            {/* Quick stats */}
            <div className="grid grid-cols-3 gap-2 mb-4 text-center">
              <div className="rounded-lg bg-[#a07850]/6 dark:bg-[#cba070]/8 p-2">
                <Users size={13} className="mx-auto mb-0.5 text-muted" />
                <p className="text-xs font-semibold">{car.passengers}</p>
                <p className="text-[10px] text-muted">seats</p>
              </div>
              <div className="rounded-lg bg-[#a07850]/6 dark:bg-[#cba070]/8 p-2">
                {isElectric ? (
                  <Zap size={13} className="mx-auto mb-0.5 text-emerald-500" />
                ) : (
                  <Fuel size={13} className="mx-auto mb-0.5 text-muted" />
                )}
                <p className="text-xs font-semibold">
                  {isElectric ? car.range?.replace(" miles", "") : car.mpg?.split("/")[0]}
                </p>
                <p className="text-[10px] text-muted">{isElectric ? "mi range" : "city mpg"}</p>
              </div>
              <div className="rounded-lg bg-[#a07850]/6 dark:bg-[#cba070]/8 p-2">
                <div className="text-[10px] text-gold font-bold text-center mb-0.5">HP</div>
                <p className="text-xs font-semibold">{car.horsepower}</p>
                <p className="text-[10px] text-muted">power</p>
              </div>
            </div>

            {/* Price and tags */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted">Starting at</p>
                <p className="text-lg font-bold font-serif text-[#2d2926] dark:text-[#e4ddd4]">
                  {formatPrice(car.price)}
                </p>
              </div>
              <div className="flex flex-wrap gap-1 justify-end max-w-[120px]">
                {isElectric && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 font-medium">
                    Electric
                  </span>
                )}
                {isHybrid && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 font-medium">
                    Hybrid
                  </span>
                )}
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#a07850]/10 text-[#a07850] dark:bg-[#cba070]/10 dark:text-[#cba070] font-medium">
                  {car.origin}
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </Link>
    </motion.div>
  );
}

function getColorHex(colorName: string): string {
  const colorMap: Record<string, string> = {
    "Midnight Black": "#1a1a1a",
    "Pearl White": "#f5f5f0",
    "Oxford White": "#f2f0ed",
    "Alpine White": "#f8f8f5",
    "Soul Red Crystal": "#a51c2c",
    "Grabber Blue": "#1a6bb5",
    "Guards Red": "#c0272d",
    "Launch Green": "#2d5a27",
    "Sonic Gray Pearl": "#8a8f8f",
    "Magnetic Gray": "#6b7280",
    "Iridium Silver": "#c0bfbc",
    "Mineral White": "#e8e4de",
    "Savile Silver": "#9ca3af",
    "Tasman Blue": "#4a7a9b",
    "Rosso Roma": "#c0272d",
    "Brilliant Silver": "#c8c8c8",
    "Riptide Blue": "#2b7fb8",
    "Geyser Blue": "#4a8aaa",
    "Mythos Black": "#1c1c1e",
    "Diamond Black": "#1a1a1a",
    "Machine Gray": "#5c5f62",
    "Wind Chill Pearl": "#e8eeee",
    "Crystal White": "#f8f8f8",
    "Cloudburst Gray": "#6b6f72",
    "Firecracker Red": "#d32f2f",
    "Snow White Pearl": "#f5f5f0",
    "Atlas White": "#f2f2ee",
    "Blue Crush Metallic": "#2a5f9e",
    "Modern Steel": "#6b6f72",
    "Rally Green": "#2d5a27",
  };
  return colorMap[colorName] || "#a0a0a0";
}
