"use client";

import { use } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { motion } from "framer-motion";
import {
  Star,
  Fuel,
  Zap,
  Users,
  MapPin,
  CheckCircle,
  XCircle,
  ChevronRight,
  BarChart2,
  Sparkles,
  ExternalLink,
  Search,
} from "lucide-react";
import { getCarById, cars, formatPrice, getManufacturerUrl, getDealerSearchUrl } from "@/lib/cars";
import CarCard from "@/components/CarCard";
import CarImagePlaceholder from "@/components/CarImagePlaceholder";

export default function CarDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const car = getCarById(id);

  if (!car) notFound();

  const score = 87;
  const isElectric = car.engine === "Electric";
  const related = cars.filter((c) => c.id !== car.id && (c.bodyStyle === car.bodyStyle || c.origin === car.origin)).slice(0, 4);

  return (
    <div className="bg-surface min-h-screen pt-16">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5">
        <div className="flex items-center gap-2 text-sm text-muted">
          <Link href="/" className="hover:text-gold transition-colors">Home</Link>
          <ChevronRight size={14} />
          <Link href="/browse" className="hover:text-gold transition-colors">Browse</Link>
          <ChevronRight size={14} />
          <span className="text-[#2d2926] dark:text-[#e4ddd4] font-medium">{car.make} {car.model}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Left: Image & match */}
          <div>
            {/* Hero image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="rounded-2xl overflow-hidden mb-5 border border-subtle"
            >
              <CarImagePlaceholder car={car} size="hero" />
            </motion.div>

            {/* Match score card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="bg-card rounded-2xl border border-subtle p-5 mb-5 shadow-card"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Sparkles size={18} className="text-gold" />
                  <h3 className="font-serif font-bold text-lg text-[#2d2926] dark:text-[#e4ddd4]">Match Analysis</h3>
                </div>
                <span className="text-2xl font-bold font-serif text-gold">{score}%</span>
              </div>

              <div className="space-y-3">
                {[
                  { label: "Budget fit", score: 92 },
                  { label: "Lifestyle match", score: 88 },
                  { label: "Feature alignment", score: 84 },
                  { label: "Performance needs", score: 79 },
                ].map((item) => (
                  <div key={item.label}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-muted">{item.label}</span>
                      <span className="font-semibold text-gold">{item.score}%</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-[#a07850]/12 dark:bg-[#cba070]/10 overflow-hidden">
                      <motion.div
                        className="h-full rounded-full gold-gradient"
                        initial={{ width: 0 }}
                        animate={{ width: `${item.score}%` }}
                        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <Link
                href="/quiz"
                className="mt-4 flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm font-semibold gold-gradient text-white hover:opacity-90 transition-opacity"
              >
                <Sparkles size={14} /> Personalize my match
              </Link>
            </motion.div>

            {/* Color swatch */}
            <div className="bg-card rounded-2xl border border-subtle p-4 shadow-card">
              <h4 className="text-sm font-semibold mb-3 text-[#2d2926] dark:text-[#e4ddd4]">Color</h4>
              <div className="flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-full border-2 border-white shadow-md"
                  style={{ backgroundColor: "#6b7280" }}
                />
                <div>
                  <p className="text-sm font-medium text-[#2d2926] dark:text-[#e4ddd4]">{car.color}</p>
                  <p className="text-xs text-muted">Exterior · {car.interiorColor} interior</p>
                </div>
              </div>
              <div className="mt-2 text-xs text-muted">Interior material: <span className="text-[#2d2926] dark:text-[#e4ddd4] font-medium">{car.interiorMaterial}</span></div>
            </div>
          </div>

          {/* Right: Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {/* Header */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-2">
                <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                  car.condition === "New"
                    ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                    : car.condition === "Certified Pre-Owned"
                    ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                    : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                }`}>
                  {car.condition}
                </span>
                <span className="text-xs px-2.5 py-1 rounded-full border border-subtle text-muted">{car.bodyStyle}</span>
              </div>
              <p className="text-sm text-muted font-medium">{car.make} · {car.year}</p>
              <h1 className="text-4xl font-serif font-bold text-[#2d2926] dark:text-[#e4ddd4] leading-tight mb-3">
                {car.model}
              </h1>
              <p className="text-3xl font-serif font-bold text-gold">{formatPrice(car.price)}</p>
              <p className="text-xs text-muted mt-1">MSRP / Estimated market value</p>
            </div>

            <p className="text-sm text-muted leading-relaxed mb-7 border-l-2 border-[#a07850]/30 pl-4 italic">
              {car.description}
            </p>

            {/* Key specs grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-7">
              {[
                { icon: Users, label: "Passengers", value: `${car.passengers} seats` },
                {
                  icon: isElectric ? Zap : Fuel,
                  label: isElectric ? "Range" : "Fuel Economy",
                  value: isElectric ? car.range ?? "—" : `${car.mpg} MPG`,
                  accent: isElectric,
                },
                { icon: BarChart2, label: "Horsepower", value: `${car.horsepower} HP` },
                { icon: MapPin, label: "Origin", value: car.origin },
                { icon: Star, label: "Performance", value: car.performance },
                { icon: Star, label: "Drivetrain", value: car.drivetrain },
              ].map(({ icon: Icon, label, value, accent }) => (
                <div key={label} className="bg-surface rounded-xl border border-subtle p-3">
                  <Icon size={14} className={`mb-1.5 ${accent ? "text-emerald-500" : "text-muted"}`} />
                  <p className="text-xs text-muted mb-0.5">{label}</p>
                  <p className="text-sm font-semibold text-[#2d2926] dark:text-[#e4ddd4]">{value}</p>
                </div>
              ))}
            </div>

            {/* Features */}
            <div className="mb-7">
              <h3 className="font-serif font-bold text-base mb-3 text-[#2d2926] dark:text-[#e4ddd4]">Included Features</h3>
              <div className="flex flex-wrap gap-2">
                {car.features.map((f) => (
                  <span key={f} className="text-xs px-3 py-1.5 rounded-full bg-[#a07850]/8 dark:bg-[#cba070]/10 text-[#a07850] dark:text-[#cba070] font-medium border border-[#a07850]/15 dark:border-[#cba070]/15">
                    {f}
                  </span>
                ))}
              </div>
            </div>

            {/* Pros & Cons */}
            <div className="grid grid-cols-2 gap-4 mb-7">
              <div className="bg-emerald-50 dark:bg-emerald-900/10 rounded-xl border border-emerald-200/50 dark:border-emerald-800/30 p-4">
                <h4 className="text-sm font-semibold text-emerald-700 dark:text-emerald-400 mb-2">Pros</h4>
                <ul className="space-y-1.5">
                  {car.pros.map((pro) => (
                    <li key={pro} className="flex items-start gap-1.5 text-xs text-[#2d2926] dark:text-[#e4ddd4]">
                      <CheckCircle size={12} className="text-emerald-500 mt-0.5 flex-shrink-0" />
                      {pro}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-red-50 dark:bg-red-900/10 rounded-xl border border-red-200/50 dark:border-red-800/30 p-4">
                <h4 className="text-sm font-semibold text-red-600 dark:text-red-400 mb-2">Cons</h4>
                <ul className="space-y-1.5">
                  {car.cons.map((con) => (
                    <li key={con} className="flex items-start gap-1.5 text-xs text-[#2d2926] dark:text-[#e4ddd4]">
                      <XCircle size={12} className="text-red-400 mt-0.5 flex-shrink-0" />
                      {con}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Engine detail */}
            <div className="bg-card rounded-2xl border border-subtle p-5 shadow-card mb-7">
              <h4 className="text-sm font-semibold mb-3 text-[#2d2926] dark:text-[#e4ddd4]">Powertrain</h4>
              <div className="grid grid-cols-2 gap-y-2 text-sm">
                {[
                  ["Engine", car.engine],
                  ["Transmission", car.transmission],
                  ["Drivetrain", car.drivetrain],
                  ["Power", `${car.horsepower} HP`],
                ].map(([label, val]) => (
                  <div key={label}>
                    <p className="text-xs text-muted">{label}</p>
                    <p className="font-medium text-[#2d2926] dark:text-[#e4ddd4]">{val}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* External links */}
            <div className="bg-card rounded-2xl border border-subtle p-5 shadow-card mb-5">
              <h4 className="text-sm font-semibold mb-3 text-[#2d2926] dark:text-[#e4ddd4]">Where to go next</h4>
              <div className="space-y-2">
                <a
                  href={getManufacturerUrl(car.make)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between w-full px-4 py-3 rounded-xl border border-subtle hover:bg-[#a07850]/6 dark:hover:bg-[#cba070]/6 transition-colors group"
                >
                  <div>
                    <p className="text-sm font-semibold text-[#2d2926] dark:text-[#e4ddd4]">{car.make} Official Site</p>
                    <p className="text-xs text-muted">Configure, price & locate dealers</p>
                  </div>
                  <ExternalLink size={15} className="text-muted group-hover:text-gold transition-colors" />
                </a>
                <a
                  href={getDealerSearchUrl(car)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between w-full px-4 py-3 rounded-xl border border-subtle hover:bg-[#a07850]/6 dark:hover:bg-[#cba070]/6 transition-colors group"
                >
                  <div>
                    <p className="text-sm font-semibold text-[#2d2926] dark:text-[#e4ddd4]">Search on Cars.com</p>
                    <p className="text-xs text-muted">Find this vehicle at dealers near you</p>
                  </div>
                  <ExternalLink size={15} className="text-muted group-hover:text-gold transition-colors" />
                </a>
                <a
                  href={`https://www.cargurus.com/Cars/new/nl?zip=&trim=&mileage=&sortDir=ASC&action=search&types%5B%5D=${car.condition === "New" ? "new" : "used"}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between w-full px-4 py-3 rounded-xl border border-subtle hover:bg-[#a07850]/6 dark:hover:bg-[#cba070]/6 transition-colors group"
                >
                  <div>
                    <p className="text-sm font-semibold text-[#2d2926] dark:text-[#e4ddd4]">Search on CarGurus</p>
                    <p className="text-xs text-muted">Compare prices & dealer ratings</p>
                  </div>
                  <ExternalLink size={15} className="text-muted group-hover:text-gold transition-colors" />
                </a>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/compare"
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border border-subtle font-semibold text-sm hover:bg-[#a07850]/8 dark:hover:bg-[#cba070]/8 transition-colors text-[#2d2926] dark:text-[#e4ddd4]"
              >
                <BarChart2 size={16} /> Compare
              </Link>
              <Link
                href="/quiz"
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl gold-gradient text-white font-semibold text-sm hover:opacity-90 transition-opacity"
              >
                <Sparkles size={16} /> Find Better Matches
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Related cars */}
        {related.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-serif font-bold mb-6 text-[#2d2926] dark:text-[#e4ddd4]">
              Similar <span className="text-gold">vehicles</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {related.map((c, i) => (
                <CarCard key={c.id} car={c} index={i} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
