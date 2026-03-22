"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  SlidersHorizontal,
  ArrowRight,
  Sparkles,
  ChevronRight,
  DollarSign,
  Car,
  Zap,
  Star,
  Shield,
  Globe,
  Gauge,
  Palette,
  TrendingUp,
  Heart,
} from "lucide-react";
import CarCard from "@/components/CarCard";
import ScrollReveal from "@/components/ScrollReveal";
import { cars, getTrendingCars } from "@/lib/cars";

function useTypewriter(words: string[], speed = 60, pause = 1800) {
  const [display, setDisplay] = useState("");
  const [wordIdx, setWordIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const word = words[wordIdx];
    let timeout: ReturnType<typeof setTimeout>;

    if (!deleting && charIdx < word.length) {
      timeout = setTimeout(() => setCharIdx((c) => c + 1), speed);
    } else if (!deleting && charIdx === word.length) {
      timeout = setTimeout(() => setDeleting(true), pause);
    } else if (deleting && charIdx > 0) {
      timeout = setTimeout(() => setCharIdx((c) => c - 1), speed / 2);
    } else {
      setDeleting(false);
      setWordIdx((i) => (i + 1) % words.length);
    }

    setDisplay(word.slice(0, charIdx));
    return () => clearTimeout(timeout);
  }, [charIdx, deleting, wordIdx, words, speed, pause]);

  return display;
}

const filterPills = ["All", "SUV", "Sedan", "Electric", "Hybrid", "Luxury", "Under $30k", "Truck", "Sports"];

const categories = [
  { icon: DollarSign, label: "Budget", description: "Find cars in your price range", color: "from-emerald-400 to-emerald-600", href: "/browse?filter=budget" },
  { icon: Car, label: "Body Style", description: "SUV, sedan, coupe & more", color: "from-blue-400 to-blue-600", href: "/browse?filter=body" },
  { icon: Zap, label: "Engine", description: "Gas, electric, hybrid & diesel", color: "from-yellow-400 to-orange-500", href: "/browse?filter=engine" },
  { icon: Star, label: "Convenience", description: "Luxury features & fuel economy", color: "from-purple-400 to-purple-600", href: "/browse?filter=convenience" },
  { icon: Heart, label: "Interior", description: "Tech, comfort & materials", color: "from-pink-400 to-rose-500", href: "/browse?filter=interior" },
  { icon: Globe, label: "Origin", description: "USA, Japan, Germany & more", color: "from-cyan-400 to-cyan-600", href: "/browse?filter=origin" },
  { icon: Gauge, label: "Performance", description: "Sport, comfort & off-road", color: "from-red-400 to-red-600", href: "/browse?filter=performance" },
  { icon: Palette, label: "Colors", description: "Exterior & interior shades", color: "from-indigo-400 to-indigo-600", href: "/browse?filter=colors" },
];

export default function HomePage() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const placeholder = useTypewriter([
    "Search for an SUV under $35k...",
    "Find a hybrid for city driving...",
    "Looking for a sports car?",
    "Show me family-friendly vehicles...",
    "Electric cars with 300+ mile range...",
  ]);

  const filteredCars = cars
    .filter((car) => {
      if (activeFilter === "All") return true;
      if (activeFilter === "SUV") return car.bodyStyle.includes("SUV");
      if (activeFilter === "Sedan") return car.bodyStyle === "Sedan";
      if (activeFilter === "Electric") return car.engine === "Electric";
      if (activeFilter === "Hybrid") return car.engine.includes("Hybrid");
      if (activeFilter === "Luxury") return car.price >= 50000;
      if (activeFilter === "Under $30k") return car.price < 30000;
      if (activeFilter === "Truck") return car.bodyStyle === "Truck";
      if (activeFilter === "Sports") return car.performance === "Sport" && car.price > 35000;
      return true;
    })
    .slice(0, 8);

  const trendingCars = getTrendingCars();

  return (
    <div className="bg-surface min-h-screen">
      {/* HERO */}
      <section className="relative min-h-screen flex items-center overflow-hidden pt-16">
        {/* Ambient orbs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute animate-float" style={{ top: "15%", left: "8%", width: 400, height: 400 }}>
            <div className="w-full h-full rounded-full bg-[#a07850]/10 dark:bg-[#cba070]/8 blur-3xl animate-pulse-glow" />
          </div>
          <div className="absolute animate-float2" style={{ top: "50%", right: "5%", width: 320, height: 320 }}>
            <div className="w-full h-full rounded-full bg-[#c07840]/8 dark:bg-[#cba070]/6 blur-3xl animate-pulse-glow" />
          </div>
          <div className="absolute animate-float" style={{ bottom: "10%", left: "40%", width: 260, height: 260 }}>
            <div className="w-full h-full rounded-full bg-[#d0a060]/6 dark:bg-[#a07850]/8 blur-3xl" />
          </div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 w-full py-24 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-subtle bg-card mb-6 text-sm font-medium text-[#5a4a38] dark:text-[#9c8a72]"
            >
              <Sparkles size={14} className="text-gold" />
              <span>30+ vehicles matched to your lifestyle</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="text-5xl sm:text-6xl lg:text-7xl font-serif font-bold leading-[1.08] tracking-tight mb-5 text-[#2d2926] dark:text-[#e4ddd4]"
            >
              Find the car
              <br />
              <span className="text-gold">made for you.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="text-lg text-[#5a4a38] dark:text-[#9c8a72] max-w-xl mx-auto mb-10 leading-relaxed"
            >
              CarFect Match analyzes your lifestyle, budget, and preferences to surface vehicles that truly fit — not just what&apos;s popular.
            </motion.p>

            {/* Search bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="relative max-w-xl mx-auto"
            >
              <div className="relative flex items-center bg-white dark:bg-[#242118] rounded-2xl border border-[#a07850]/25 dark:border-[#cba070]/20 shadow-[0_4px_28px_rgba(45,41,38,0.10)] dark:shadow-[0_4px_28px_rgba(0,0,0,0.35)] overflow-hidden">
                <Search size={18} className="absolute left-4 text-[#8b7355] dark:text-[#9c8a72] pointer-events-none" />
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={`${placeholder}|`}
                  className="w-full pl-11 pr-28 py-4 bg-transparent text-[#2d2926] dark:text-[#e4ddd4] placeholder-[#a09080] dark:placeholder-[#7a6a5a] text-sm outline-none"
                />
                <Link
                  href={`/browse?q=${encodeURIComponent(searchQuery)}`}
                  className="absolute right-2 flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold text-white gold-gradient hover:opacity-90 transition-opacity"
                >
                  Search <ArrowRight size={14} />
                </Link>
              </div>
            </motion.div>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-wrap items-center justify-center gap-3 mt-6"
            >
              <Link href="/quiz" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm text-white gold-gradient hover:opacity-90 transition-opacity shadow-sm">
                <Sparkles size={15} /> Take the Match Quiz
              </Link>
              <Link href="/browse" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm bg-white dark:bg-[#242118] border border-[#a07850]/30 dark:border-[#cba070]/25 hover:border-[#a07850]/60 transition-colors text-[#2d2926] dark:text-[#e4ddd4] shadow-sm">
                Browse All Cars <ChevronRight size={15} />
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="flex flex-wrap items-center justify-center gap-8 mt-12"
            >
              {[{ label: "Vehicles catalogued", value: "30+" }, { label: "Filter dimensions", value: "8" }, { label: "Match accuracy", value: "94%" }].map(({ label, value }) => (
                <div key={label} className="text-center">
                  <p className="font-bold text-[#2d2926] dark:text-[#e4ddd4] text-2xl font-serif">{value}</p>
                  <p className="text-xs text-[#5a4a38] dark:text-[#9c8a72] mt-0.5">{label}</p>
                </div>
              ))}
            </motion.div>
        </div>
      </section>

      {/* FILTER PILLS */}
      <section className="py-5 border-y border-subtle bg-card sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-2 overflow-x-auto pb-0.5" style={{ scrollbarWidth: "none" }}>
            <SlidersHorizontal size={16} className="text-muted flex-shrink-0" />
            {filterPills.map((pill) => (
              <button
                key={pill}
                onClick={() => setActiveFilter(pill)}
                className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium border transition-all duration-200 ${
                  activeFilter === pill
                    ? "gold-gradient text-white border-transparent shadow-sm"
                    : "border-subtle text-[#2d2926] dark:text-[#e4ddd4] hover:bg-[#a07850]/8 dark:hover:bg-[#cba070]/8"
                }`}
              >
                {pill}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* MATCHED FOR YOU */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6">
        <ScrollReveal>
          <div className="flex items-center justify-between mb-8">
            <div>
              <p className="text-sm text-gold font-medium mb-1">Curated for you</p>
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#2d2926] dark:text-[#e4ddd4]">
                Matched <span className="text-gold">for you</span>
              </h2>
            </div>
            <Link href="/browse" className="hidden sm:flex items-center gap-1 text-sm font-medium text-muted hover:text-gold transition-colors">
              View all <ChevronRight size={16} />
            </Link>
          </div>
        </ScrollReveal>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeFilter}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
          >
            {filteredCars.map((car, i) => (
              <CarCard key={car.id} car={car} index={i} />
            ))}
          </motion.div>
        </AnimatePresence>

        <div className="flex justify-center mt-10 sm:hidden">
          <Link href="/browse" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm border border-subtle hover:bg-[#a07850]/8 transition-colors text-[#2d2926] dark:text-[#e4ddd4]">
            View all vehicles <ChevronRight size={15} />
          </Link>
        </div>
      </section>

      {/* CATEGORY TILES */}
      <section className="py-16 bg-card border-y border-subtle">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <ScrollReveal>
            <div className="text-center mb-12">
              <p className="text-sm text-gold font-medium mb-2">Explore by what matters</p>
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#2d2926] dark:text-[#e4ddd4]">
                Refine your <span className="text-gold">match</span>
              </h2>
              <p className="text-muted mt-3 max-w-lg mx-auto text-sm">
                Whether it&apos;s budget, style, or performance — dive into the category that speaks to you.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {categories.map((cat, i) => {
              const Icon = cat.icon;
              return (
                <ScrollReveal key={cat.label} delay={i * 0.06}>
                  <Link href={cat.href}>
                    <div className="group relative rounded-2xl border border-subtle bg-surface hover:shadow-hover overflow-hidden cursor-pointer p-5 transition-all duration-300 hover:-translate-y-1">
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${cat.color} flex items-center justify-center mb-3 shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                        <Icon size={20} className="text-white" />
                      </div>
                      <h3 className="font-serif font-bold text-base mb-1 text-[#2d2926] dark:text-[#e4ddd4]">{cat.label}</h3>
                      <p className="text-xs text-muted leading-relaxed">{cat.description}</p>
                      <ChevronRight size={16} className="absolute bottom-4 right-4 text-muted group-hover:text-gold group-hover:translate-x-0.5 transition-all duration-200" />
                    </div>
                  </Link>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* TRENDING */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6">
        <ScrollReveal>
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp size={16} className="text-gold" />
                <p className="text-sm text-gold font-medium">What&apos;s hot right now</p>
              </div>
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#2d2926] dark:text-[#e4ddd4]">
                Trending <span className="text-gold">vehicles</span>
              </h2>
            </div>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {trendingCars.slice(0, 6).map((car, i) => (
            <CarCard key={car.id} car={car} index={i} />
          ))}
        </div>
      </section>

      {/* QUIZ CTA BANNER */}
      <section className="py-20 px-4 sm:px-6">
        <ScrollReveal>
          <div className="max-w-4xl mx-auto rounded-3xl overflow-hidden relative">
            <div className="absolute inset-0 gold-gradient opacity-95" />
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl" />
            </div>
            <div className="relative z-10 px-8 sm:px-16 py-16 text-white text-center">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/15 text-white/90 text-sm mb-6">
                <Sparkles size={14} />
                <span>Personalized matching in 2 minutes</span>
              </div>
              <h2 className="text-3xl sm:text-5xl font-serif font-bold mb-4 leading-tight">
                Not sure where to start?
              </h2>
              <p className="text-white/80 text-base sm:text-lg max-w-xl mx-auto mb-8 leading-relaxed">
                Take our guided quiz and we&apos;ll match you with your perfect vehicle based on your lifestyle, driving habits, and budget.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link href="/quiz" className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-white text-[#a07850] font-bold text-base hover:shadow-lg hover:scale-[1.02] transition-all duration-200">
                  <Sparkles size={17} /> Start My Match Quiz
                </Link>
                <Link href="/browse" className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl border-2 border-white/40 text-white font-semibold text-base hover:bg-white/10 transition-colors">
                  Browse Manually <ChevronRight size={16} />
                </Link>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* TRUST BAR */}
      <section className="py-16 border-t border-subtle bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 text-center">
            {[
              { icon: Shield, title: "Unbiased Matching", desc: "We don't get paid by dealers. Our matches are based purely on what's right for you." },
              { icon: Star, title: "Real Specifications", desc: "Every vehicle is populated with accurate specs, pricing, and features — no fluff." },
              { icon: Sparkles, title: "Curated Database", desc: "Hand-selected vehicles from every segment, condition, and budget range." },
            ].map(({ icon: Icon, title, desc }, i) => (
              <ScrollReveal key={title} delay={i * 0.1}>
                <div className="flex flex-col items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl gold-gradient flex items-center justify-center shadow-sm">
                    <Icon size={22} className="text-white" />
                  </div>
                  <h3 className="font-serif font-bold text-lg text-[#2d2926] dark:text-[#e4ddd4]">{title}</h3>
                  <p className="text-sm text-muted leading-relaxed max-w-xs">{desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
