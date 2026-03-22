"use client";

import { useState, useEffect, useRef } from "react";
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
  Loader2,
  X,
} from "lucide-react";
import CarCard from "@/components/CarCard";
import AICarCard from "@/components/AICarCard";
import ScrollReveal from "@/components/ScrollReveal";
import { cars, getTrendingCars } from "@/lib/cars";
import { AISearchResult } from "@/lib/ai-types";

// --- Rotating example queries ---
const EXAMPLE_QUERIES = [
  "Family SUV under $45k",
  "Electric car with 300+ mile range",
  "Sports coupe under $55k",
  "Hybrid for city driving",
  "Luxury sedan with AWD",
  "Reliable truck for work and weekends",
  "Best crossover for road trips",
];

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

// Static badges for pre-interaction cards (no match scores)
const STATIC_BADGES = ["Popular", "Editor's Pick", "Trending", "Top Rated", "Best Value", "Staff Pick", "Trending", "Popular"];

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
  const [aiResult, setAiResult] = useState<AISearchResult | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const searchResultsRef = useRef<HTMLDivElement>(null);

  const placeholder = useTypewriter(EXAMPLE_QUERIES.map((q) => `Try: "${q}"`));

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

  async function handleSearch(query: string) {
    const q = query.trim();
    if (!q || q.length < 2) return;

    setAiLoading(true);
    setAiError(null);
    setAiResult(null);

    try {
      const res = await fetch("/api/ai-search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: q }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Search failed");
      setAiResult(data);
      // Scroll to results
      setTimeout(() => searchResultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
    } catch (err) {
      setAiError(err instanceof Error ? err.message : "Search failed. Please try again.");
    } finally {
      setAiLoading(false);
    }
  }

  function clearSearch() {
    setAiResult(null);
    setAiError(null);
    setSearchQuery("");
  }

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
            <span>AI-powered car matching for every lifestyle</span>
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
            Describe what you need in plain English. Our AI finds and explains exactly which cars match your lifestyle and budget.
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
                onKeyDown={(e) => e.key === "Enter" && handleSearch(searchQuery)}
                placeholder={`${placeholder}|`}
                className="w-full pl-11 pr-28 py-4 bg-transparent text-[#2d2926] dark:text-[#e4ddd4] placeholder-[#a09080] dark:placeholder-[#7a6a5a] text-sm outline-none"
              />
              <button
                onClick={() => handleSearch(searchQuery)}
                disabled={aiLoading}
                className="absolute right-2 flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold text-white gold-gradient hover:opacity-90 transition-opacity disabled:opacity-60"
              >
                {aiLoading ? <Loader2 size={14} className="animate-spin" /> : <><ArrowRight size={14} /></>}
                {aiLoading ? "Searching" : "Search"}
              </button>
            </div>

            {/* Example query pills */}
            <div className="flex flex-wrap items-center justify-center gap-2 mt-3">
              {EXAMPLE_QUERIES.slice(0, 4).map((q) => (
                <button
                  key={q}
                  onClick={() => { setSearchQuery(q); handleSearch(q); }}
                  className="text-[11px] px-3 py-1 rounded-full bg-white/60 dark:bg-[#242118]/60 border border-[#a07850]/20 dark:border-[#cba070]/15 text-[#5a4a38] dark:text-[#9c8a72] hover:border-[#a07850]/50 hover:text-[#2d2926] dark:hover:text-[#e4ddd4] transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>
          </motion.div>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-wrap items-center justify-center gap-3 mt-8"
          >
            <Link href="/quiz" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm text-white gold-gradient hover:opacity-90 transition-opacity shadow-sm">
              <Sparkles size={15} /> Take the Match Quiz
            </Link>
            <Link href="/browse" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm bg-white dark:bg-[#242118] border border-[#a07850]/30 dark:border-[#cba070]/25 hover:border-[#a07850]/60 transition-colors text-[#2d2926] dark:text-[#e4ddd4] shadow-sm">
              Browse All Cars <ChevronRight size={15} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* AI SEARCH RESULTS */}
      <AnimatePresence>
        {(aiLoading || aiResult || aiError) && (
          <motion.section
            ref={searchResultsRef}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.4 }}
            className="py-12 max-w-7xl mx-auto px-4 sm:px-6"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                {aiLoading ? (
                  <div className="flex items-center gap-2">
                    <Loader2 size={18} className="text-gold animate-spin" />
                    <p className="text-base font-semibold text-[#2d2926] dark:text-[#e4ddd4]">
                      Finding your matches...
                    </p>
                  </div>
                ) : aiResult ? (
                  <>
                    <p className="text-xs text-gold font-medium mb-1 uppercase tracking-wide">AI Search Results</p>
                    <h2 className="text-2xl font-serif font-bold text-[#2d2926] dark:text-[#e4ddd4]">
                      {aiResult.totalFound} matches for &ldquo;{aiResult.query}&rdquo;
                    </h2>
                    <p className="text-sm text-muted mt-1 italic">{aiResult.interpretation}</p>
                  </>
                ) : null}
              </div>
              {(aiResult || aiError) && (
                <button
                  onClick={clearSearch}
                  className="flex items-center gap-1.5 text-sm text-muted hover:text-[#2d2926] dark:hover:text-[#e4ddd4] transition-colors"
                >
                  <X size={15} /> Clear
                </button>
              )}
            </div>

            {/* Error */}
            {aiError && (
              <div className="rounded-xl border border-red-200 dark:border-red-900/40 bg-red-50 dark:bg-red-900/10 px-4 py-3 text-sm text-red-600 dark:text-red-400">
                {aiError}
              </div>
            )}

            {/* Loading skeleton */}
            {aiLoading && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="rounded-[14px] border border-subtle bg-card overflow-hidden animate-pulse">
                    <div className="h-44 bg-[#a07850]/8 dark:bg-[#cba070]/8" />
                    <div className="p-4 space-y-3">
                      <div className="h-3 bg-[#a07850]/10 rounded w-1/3" />
                      <div className="h-5 bg-[#a07850]/10 rounded w-2/3" />
                      <div className="h-3 bg-[#a07850]/10 rounded w-full" />
                      <div className="h-3 bg-[#a07850]/10 rounded w-5/6" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Results */}
            {aiResult && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {aiResult.cars.map((car, i) => (
                    <AICarCard
                      key={`${car.make}-${car.model}-${i}`}
                      car={car}
                      index={i}
                      badge={i === 0 ? "Best Match" : i === 1 ? "Great Choice" : undefined}
                    />
                  ))}
                </div>

                {/* Suggestions */}
                {aiResult.searchSuggestions && aiResult.searchSuggestions.length > 0 && (
                  <div className="mt-8 p-4 rounded-2xl border border-subtle bg-card">
                    <p className="text-xs text-muted font-medium mb-2 uppercase tracking-wide">You might also try</p>
                    <div className="flex flex-wrap gap-2">
                      {aiResult.searchSuggestions.map((s) => (
                        <button
                          key={s}
                          onClick={() => { setSearchQuery(s); handleSearch(s); }}
                          className="text-xs px-3 py-1.5 rounded-full border border-[#a07850]/20 text-[#a07850] dark:text-[#cba070] hover:bg-[#a07850]/8 transition-colors"
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </motion.section>
        )}
      </AnimatePresence>

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

      {/* BROWSE SECTION */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6">
        <ScrollReveal>
          <div className="flex items-center justify-between mb-8">
            <div>
              <p className="text-sm text-gold font-medium mb-1">Hand-picked vehicles</p>
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#2d2926] dark:text-[#e4ddd4]">
                Browse <span className="text-gold">our collection</span>
              </h2>
              <p className="text-sm text-muted mt-1">Take the quiz or search above for personalized match scores.</p>
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
              <div key={car.id} className="relative">
                {/* Static editorial badge — no match score before quiz/search */}
                <div className="absolute top-3 left-3 z-10">
                  <span className="text-[10px] px-2.5 py-1 rounded-full bg-[#a07850]/12 dark:bg-[#cba070]/15 text-[#a07850] dark:text-[#cba070] font-semibold border border-[#a07850]/20 dark:border-[#cba070]/20">
                    {STATIC_BADGES[i] ?? "Popular"}
                  </span>
                </div>
                <CarCard key={car.id} car={car} index={i} hideScore />
              </div>
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
                Refine your <span className="text-gold">search</span>
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
                <p className="text-sm text-gold font-medium">What&apos;s popular right now</p>
              </div>
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#2d2926] dark:text-[#e4ddd4]">
                Trending <span className="text-gold">vehicles</span>
              </h2>
            </div>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {trendingCars.slice(0, 6).map((car, i) => (
            <CarCard key={car.id} car={car} index={i} hideScore />
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
                <span>AI-powered matching in 2 minutes</span>
              </div>
              <h2 className="text-3xl sm:text-5xl font-serif font-bold mb-4 leading-tight">
                Not sure where to start?
              </h2>
              <p className="text-white/80 text-base sm:text-lg max-w-xl mx-auto mb-8 leading-relaxed">
                Take our guided quiz and Claude AI will match you with your perfect vehicle based on your lifestyle, driving habits, and budget.
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
              { icon: Shield, title: "Unbiased Matching", desc: "We don't get paid by dealers. Our AI matches are based purely on what's right for you." },
              { icon: Star, title: "Real Specifications", desc: "Every vehicle is populated with accurate specs, pricing, and features — no fluff." },
              { icon: Sparkles, title: "Powered by Claude AI", desc: "Our AI advisor understands natural language, so you can search the way you think." },
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
