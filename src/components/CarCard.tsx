"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Zap, Fuel, Users, Star } from "lucide-react";
import { Car, formatPrice } from "@/lib/cars";
import CarImagePlaceholder from "./CarImagePlaceholder";

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
    setTilt({ x: dy * -7, y: dx * 7 });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
    setHovered(false);
  };

  const score = matchScore ?? Math.floor(Math.random() * 22 + 74);
  const isElectric = car.engine === "Electric";
  const isHybrid = car.engine.includes("Hybrid");

  const conditionStyle =
    car.condition === "New"
      ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/25 dark:text-emerald-400"
      : car.condition === "Certified Pre-Owned"
      ? "bg-blue-100 text-blue-700 dark:bg-blue-900/25 dark:text-blue-400"
      : "bg-amber-100 text-amber-700 dark:bg-amber-900/25 dark:text-amber-400";

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link href={`/cars/${car.id}`}>
        <motion.div
          ref={cardRef}
          className="group relative bg-card rounded-[14px] overflow-hidden border border-subtle cursor-pointer select-none"
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
          <div className="relative">
            <CarImagePlaceholder car={car} />

            {/* Match score */}
            <div className="absolute top-3 right-3">
              <div className="flex items-center gap-1 px-2.5 py-1 rounded-full gold-gradient text-white text-xs font-bold shadow-sm">
                <Star size={9} fill="white" />
                {score}%
              </div>
            </div>

            {/* Condition */}
            <div className="absolute top-3 left-3">
              <span className={`text-[11px] px-2.5 py-1 rounded-full font-semibold ${conditionStyle}`}>
                {car.condition}
              </span>
            </div>
          </div>

          {/* Card body */}
          <div className="p-4">
            <div className="mb-3">
              <p className="text-[11px] text-muted font-semibold tracking-wide uppercase mb-0.5">{car.make}</p>
              <h3 className="font-serif text-[17px] font-bold leading-tight text-[#2d2926] dark:text-[#e4ddd4]">
                {car.model}
              </h3>
              <p className="text-xs text-muted mt-0.5">{car.year} · {car.bodyStyle}</p>
            </div>

            {/* Match bar */}
            <div className="mb-4">
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-[11px] text-muted font-medium">Match Score</span>
                <span className="text-[11px] font-bold text-gold">{score}%</span>
              </div>
              <div className="h-1 rounded-full bg-[#a07850]/12 dark:bg-[#cba070]/10 overflow-hidden">
                <motion.div
                  className="h-full rounded-full gold-gradient"
                  initial={{ width: 0 }}
                  whileInView={{ width: `${score}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.3, ease: [0.22, 1, 0.36, 1], delay: index * 0.06 + 0.25 }}
                />
              </div>
            </div>

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
                  {isElectric ? car.range?.replace(" miles", "") : car.mpg?.split("/")[0]}
                </p>
                <p className="text-[10px] text-muted">{isElectric ? "mi range" : "city mpg"}</p>
              </div>
              <div className="rounded-lg bg-[#a07850]/5 dark:bg-[#cba070]/7 p-2 text-center">
                <p className="text-[10px] font-bold text-gold text-center mb-1">HP</p>
                <p className="text-xs font-bold text-[#2d2926] dark:text-[#e4ddd4]">{car.horsepower}</p>
                <p className="text-[10px] text-muted">power</p>
              </div>
            </div>

            {/* Price + tags */}
            <div className="flex items-end justify-between gap-2">
              <div>
                <p className="text-[11px] text-muted mb-0.5">Starting at</p>
                <p className="text-[17px] font-bold font-serif text-[#2d2926] dark:text-[#e4ddd4] leading-none">
                  {formatPrice(car.price)}
                </p>
              </div>
              <div className="flex flex-wrap gap-1 justify-end">
                {isElectric && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/25 dark:text-emerald-400 font-semibold">
                    EV
                  </span>
                )}
                {isHybrid && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/25 dark:text-blue-400 font-semibold">
                    Hybrid
                  </span>
                )}
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#a07850]/8 text-[#a07850] dark:bg-[#cba070]/10 dark:text-[#cba070] font-semibold">
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
