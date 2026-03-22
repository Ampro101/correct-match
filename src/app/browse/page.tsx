"use client";

import { useState, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Search, SlidersHorizontal, X, ChevronDown, ChevronUp } from "lucide-react";
import CarCard from "@/components/CarCard";
import { cars } from "@/lib/cars";

const budgetOptions = ["Under $15k", "$15k-$25k", "$25k-$40k", "$40k-$60k", "$60k-$100k", "$100k+"];
const bodyStyles = ["SUV - Large", "SUV - Compact", "Sedan", "Coupe - 2-Door", "Coupe - 4-Door", "Convertible", "Hatchback", "Van/Minivan", "Truck"];
const conditions = ["New", "Used", "Certified Pre-Owned"];
const engines = ["Gas - 4-Cylinder", "Gas - V6", "Gas - V8", "Electric", "Hybrid (Gas/Plug-in)", "Diesel"];
const origins = ["USA", "Japan", "Germany", "Korea", "Britain", "Sweden", "Italy"];
const performances = ["Comfort", "Sport", "Off-road", "Eco-friendly"];
const passengers = [2, 4, 5, 7, 8];

interface Filters {
  budget: string;
  bodyStyle: string;
  condition: string;
  engine: string;
  origin: string;
  performance: string;
  minPassengers: number;
  search: string;
}

function BrowseContent() {
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get("q") ?? "";

  const [filters, setFilters] = useState<Filters>({
    budget: "",
    bodyStyle: "",
    condition: "",
    engine: "",
    origin: "",
    performance: "",
    minPassengers: 0,
    search: initialSearch,
  });
  const [showFilters, setShowFilters] = useState(true);

  const update = (key: keyof Filters, value: string | number) =>
    setFilters((f) => ({ ...f, [key]: f[key] === value ? (typeof value === "string" ? "" : 0) : value }));

  const filtered = useMemo(() => {
    return cars.filter((car) => {
      if (filters.search) {
        const q = filters.search.toLowerCase();
        if (
          !car.make.toLowerCase().includes(q) &&
          !car.model.toLowerCase().includes(q) &&
          !car.bodyStyle.toLowerCase().includes(q) &&
          !car.engine.toLowerCase().includes(q) &&
          !car.category.toLowerCase().includes(q)
        )
          return false;
      }
      if (filters.budget) {
        const map: Record<string, [number, number]> = {
          "Under $15k": [0, 15000],
          "$15k-$25k": [15000, 25000],
          "$25k-$40k": [25000, 40000],
          "$40k-$60k": [40000, 60000],
          "$60k-$100k": [60000, 100000],
          "$100k+": [100000, Infinity],
        };
        const range = map[filters.budget];
        if (range && (car.price < range[0] || car.price > range[1])) return false;
      }
      if (filters.bodyStyle && !car.bodyStyle.includes(filters.bodyStyle)) return false;
      if (filters.condition && car.condition !== filters.condition) return false;
      if (filters.engine && !car.engine.includes(filters.engine.split(" ")[0]) && !car.engine.includes(filters.engine)) return false;
      if (filters.origin && car.origin !== filters.origin) return false;
      if (filters.performance && car.performance !== filters.performance) return false;
      if (filters.minPassengers && car.passengers < filters.minPassengers) return false;
      return true;
    });
  }, [filters]);

  const activeCount = Object.entries(filters).filter(([k, v]) => k !== "search" && v && v !== 0).length;

  const clearAll = () =>
    setFilters({ budget: "", bodyStyle: "", condition: "", engine: "", origin: "", performance: "", minPassengers: 0, search: "" });

  return (
    <div className="bg-surface min-h-screen pt-16">
      {/* Header */}
      <div className="border-b border-subtle bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#2d2926] dark:text-[#e4ddd4] mb-2">
            Browse <span className="text-gold">All Vehicles</span>
          </h1>
          <p className="text-muted text-sm">{filtered.length} vehicles found</p>

          {/* Search bar */}
          <div className="relative mt-4 max-w-lg">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
            <input
              value={filters.search}
              onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value }))}
              placeholder="Search make, model, or category..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-surface border border-subtle text-sm text-[#2d2926] dark:text-[#e4ddd4] placeholder-[#8b7355] outline-none focus:border-[#a07850]/50 transition-colors"
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Filter toggle bar */}
        <div className="flex items-center justify-between mb-5">
          <button
            onClick={() => setShowFilters((v) => !v)}
            className="flex items-center gap-2 text-sm font-medium text-[#2d2926] dark:text-[#e4ddd4] hover:text-gold transition-colors"
          >
            <SlidersHorizontal size={16} />
            Filters
            {activeCount > 0 && (
              <span className="w-5 h-5 rounded-full gold-gradient text-white text-xs flex items-center justify-center font-bold">
                {activeCount}
              </span>
            )}
            {showFilters ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
          {activeCount > 0 && (
            <button onClick={clearAll} className="flex items-center gap-1 text-xs text-muted hover:text-gold transition-colors">
              <X size={13} /> Clear all
            </button>
          )}
        </div>

        {/* Filters panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden"
            >
              <div className="bg-card rounded-2xl border border-subtle p-5 mb-8 shadow-card">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  <FilterGroup label="Budget" options={budgetOptions} selected={filters.budget} onSelect={(v) => update("budget", v)} />
                  <FilterGroup label="Body Style" options={bodyStyles} selected={filters.bodyStyle} onSelect={(v) => update("bodyStyle", v)} />
                  <FilterGroup label="Condition" options={conditions} selected={filters.condition} onSelect={(v) => update("condition", v)} />
                  <FilterGroup label="Engine Type" options={engines} selected={filters.engine} onSelect={(v) => update("engine", v)} />
                  <FilterGroup label="Origin" options={origins} selected={filters.origin} onSelect={(v) => update("origin", v)} />
                  <FilterGroup label="Performance" options={performances} selected={filters.performance} onSelect={(v) => update("performance", v)} />
                </div>

                {/* Passengers */}
                <div className="mt-4 pt-4 border-t border-subtle">
                  <p className="text-xs font-semibold text-muted uppercase tracking-wide mb-2">Min. Passengers</p>
                  <div className="flex flex-wrap gap-2">
                    {passengers.map((p) => (
                      <button
                        key={p}
                        onClick={() => update("minPassengers", p)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                          filters.minPassengers === p
                            ? "gold-gradient text-white border-transparent"
                            : "border-subtle text-muted hover:border-[#a07850]/40"
                        }`}
                      >
                        {p}+ seats
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results */}
        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">🔍</div>
            <h3 className="text-xl font-serif font-bold mb-2 text-[#2d2926] dark:text-[#e4ddd4]">No matches found</h3>
            <p className="text-muted text-sm mb-5">Try adjusting your filters to see more vehicles.</p>
            <button onClick={clearAll} className="px-6 py-2.5 rounded-xl gold-gradient text-white text-sm font-semibold">
              Clear all filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map((car, i) => (
              <CarCard key={car.id} car={car} index={i} hideScore />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function FilterGroup({
  label,
  options,
  selected,
  onSelect,
}: {
  label: string;
  options: string[];
  selected: string;
  onSelect: (v: string) => void;
}) {
  return (
    <div>
      <p className="text-xs font-semibold text-muted uppercase tracking-wide mb-2">{label}</p>
      <div className="flex flex-wrap gap-1.5">
        {options.map((opt) => (
          <button
            key={opt}
            onClick={() => onSelect(opt)}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-all ${
              selected === opt
                ? "gold-gradient text-white border-transparent"
                : "border-subtle text-muted hover:border-[#a07850]/40 text-[#2d2926] dark:text-[#e4ddd4]"
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}

function BrowsePageLoading() {
  return (
    <div className="min-h-screen bg-surface pt-16">
      <div className="border-b border-subtle bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <div className="h-8 w-48 bg-[#a07850]/10 rounded-lg animate-pulse mb-2" />
          <div className="h-4 w-24 bg-[#a07850]/8 rounded animate-pulse" />
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="rounded-[14px] border border-subtle bg-card overflow-hidden animate-pulse">
              <div className="h-48 bg-[#a07850]/8" />
              <div className="p-4 space-y-3">
                <div className="h-3 bg-[#a07850]/10 rounded w-1/3" />
                <div className="h-5 bg-[#a07850]/10 rounded w-2/3" />
                <div className="h-3 bg-[#a07850]/10 rounded w-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function BrowsePage() {
  return (
    <Suspense fallback={<BrowsePageLoading />}>
      <BrowseContent />
    </Suspense>
  );
}
