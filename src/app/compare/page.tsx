"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Plus, X, ChevronDown, Check, Minus, BarChart2 } from "lucide-react";
import { cars, formatPrice, Car } from "@/lib/cars";

const compareFields: { label: string; key: keyof Car | string; format?: (v: unknown) => string }[] = [
  { label: "Price", key: "price", format: (v) => formatPrice(v as number) },
  { label: "Year", key: "year" },
  { label: "Condition", key: "condition" },
  { label: "Body Style", key: "bodyStyle" },
  { label: "Passengers", key: "passengers", format: (v) => `${v} seats` },
  { label: "Engine", key: "engine" },
  { label: "Horsepower", key: "horsepower", format: (v) => `${v} HP` },
  { label: "Transmission", key: "transmission" },
  { label: "Drivetrain", key: "drivetrain" },
  { label: "Fuel / Range", key: "_fuelRange" },
  { label: "Origin", key: "origin" },
  { label: "Performance", key: "performance" },
  { label: "Interior", key: "interiorMaterial" },
  { label: "Color", key: "color" },
];

function getFieldValue(car: Car, key: string): string {
  if (key === "_fuelRange") {
    if (car.engine === "Electric") return car.range ?? "—";
    return car.mpg ? `${car.mpg} MPG` : "—";
  }
  const val = car[key as keyof Car];
  if (val === undefined || val === null) return "—";
  return String(val);
}

function CarSelector({
  selected,
  onSelect,
  onRemove,
  excluded,
  slot,
}: {
  selected: Car | null;
  onSelect: (car: Car) => void;
  onRemove: () => void;
  excluded: string[];
  slot: number;
}) {
  const [open, setOpen] = useState(false);
  const available = cars.filter((c) => !excluded.includes(c.id) || c.id === selected?.id);

  if (selected) {
    return (
      <div className="bg-card rounded-2xl border border-subtle overflow-hidden">
        <div className="bg-gradient-to-br from-[#f0e8de] to-[#e2d5c5] dark:from-[#2a2520] dark:to-[#1e1c18] h-40 flex items-center justify-center relative">
          <div className="text-5xl">🚗</div>
          <button
            onClick={onRemove}
            className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/80 dark:bg-black/50 flex items-center justify-center hover:bg-red-100 transition-colors"
          >
            <X size={13} />
          </button>
        </div>
        <div className="p-4">
          <p className="text-xs text-muted">{selected.make} · {selected.year}</p>
          <h3 className="font-serif font-bold text-base text-[#2d2926] dark:text-[#e4ddd4]">{selected.model}</h3>
          <p className="text-gold font-bold text-sm mt-0.5">{formatPrice(selected.price)}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full h-52 rounded-2xl border-2 border-dashed border-subtle hover:border-[#a07850]/50 dark:hover:border-[#cba070]/40 flex flex-col items-center justify-center gap-2 transition-colors bg-card/50 group"
      >
        <div className="w-10 h-10 rounded-xl gold-gradient flex items-center justify-center group-hover:scale-110 transition-transform">
          <Plus size={20} className="text-white" />
        </div>
        <p className="text-sm font-medium text-muted">Add vehicle {slot}</p>
        <p className="text-xs text-muted/70 flex items-center gap-1">
          Choose from {available.length} options <ChevronDown size={12} />
        </p>
      </button>

      {open && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-card rounded-2xl border border-subtle shadow-hover z-20 max-h-72 overflow-y-auto">
          {available.map((car) => (
            <button
              key={car.id}
              onClick={() => { onSelect(car); setOpen(false); }}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[#a07850]/6 dark:hover:bg-[#cba070]/6 text-left transition-colors border-b border-subtle last:border-0"
            >
              <span className="text-xl">🚗</span>
              <div>
                <p className="text-xs text-muted">{car.year} {car.make}</p>
                <p className="text-sm font-medium text-[#2d2926] dark:text-[#e4ddd4]">{car.model}</p>
              </div>
              <span className="ml-auto text-xs text-gold font-semibold">{formatPrice(car.price)}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function ComparePage() {
  const [slots, setSlots] = useState<(Car | null)[]>([null, null, null]);

  const selectedIds = slots.filter(Boolean).map((c) => c!.id);
  const activeCars = slots.filter(Boolean) as Car[];

  const updateSlot = (i: number, car: Car | null) => {
    setSlots((prev) => prev.map((s, idx) => (idx === i ? car : s)));
  };

  const getWinner = (field: string): number | null => {
    if (activeCars.length < 2) return null;
    if (field === "price") {
      const prices = activeCars.map((c) => c.price);
      const min = Math.min(...prices);
      return activeCars.findIndex((c) => c.price === min);
    }
    if (field === "horsepower") {
      const vals = activeCars.map((c) => c.horsepower);
      const max = Math.max(...vals);
      return activeCars.findIndex((c) => c.horsepower === max);
    }
    if (field === "_fuelRange") {
      const mpgVals = activeCars.map((c) => {
        if (c.engine === "Electric") return parseInt(c.range ?? "0");
        return parseInt(c.mpg?.split("/")[0] ?? "0");
      });
      const max = Math.max(...mpgVals);
      if (max === 0) return null;
      return mpgVals.indexOf(max);
    }
    return null;
  };

  return (
    <div className="bg-surface min-h-screen pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <BarChart2 size={20} className="text-gold" />
            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#2d2926] dark:text-[#e4ddd4]">
              Side-by-Side <span className="text-gold">Compare</span>
            </h1>
          </div>
          <p className="text-muted text-sm">Select up to 3 vehicles to compare specs side by side.</p>
        </div>

        {/* Car selectors */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          {slots.map((car, i) => (
            <CarSelector
              key={i}
              slot={i + 1}
              selected={car}
              onSelect={(c) => updateSlot(i, c)}
              onRemove={() => updateSlot(i, null)}
              excluded={selectedIds.filter((id) => id !== car?.id)}
            />
          ))}
        </div>

        {/* Comparison table */}
        {activeCars.length >= 2 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card rounded-2xl border border-subtle overflow-hidden shadow-card"
          >
            {/* Header row */}
            <div
              className="grid border-b border-subtle"
              style={{ gridTemplateColumns: `200px repeat(${activeCars.length}, 1fr)` }}
            >
              <div className="p-4 bg-surface/50 border-r border-subtle">
                <p className="text-xs font-semibold text-muted uppercase tracking-wide">Specification</p>
              </div>
              {activeCars.map((car, i) => (
                <div key={i} className={`p-4 ${i < activeCars.length - 1 ? "border-r border-subtle" : ""}`}>
                  <p className="text-xs text-muted">{car.make}</p>
                  <p className="font-serif font-bold text-sm text-[#2d2926] dark:text-[#e4ddd4]">{car.model}</p>
                </div>
              ))}
            </div>

            {/* Data rows */}
            {compareFields.map((field, rowIdx) => {
              const winner = getWinner(field.key);
              return (
                <div
                  key={field.key}
                  className={`grid border-b border-subtle last:border-0 ${rowIdx % 2 === 0 ? "" : "bg-[#a07850]/3 dark:bg-[#cba070]/3"}`}
                  style={{ gridTemplateColumns: `200px repeat(${activeCars.length}, 1fr)` }}
                >
                  <div className="p-4 border-r border-subtle bg-surface/30">
                    <p className="text-xs font-semibold text-muted">{field.label}</p>
                  </div>
                  {activeCars.map((car, colIdx) => {
                    const raw = car[field.key as keyof Car];
                    const val = field.format ? field.format(raw) : getFieldValue(car, field.key);
                    const isWinner = winner === colIdx;
                    return (
                      <div
                        key={colIdx}
                        className={`p-4 flex items-center gap-2 ${colIdx < activeCars.length - 1 ? "border-r border-subtle" : ""} ${isWinner ? "bg-[#a07850]/6 dark:bg-[#cba070]/6" : ""}`}
                      >
                        <span className={`text-sm font-medium ${isWinner ? "text-gold font-semibold" : "text-[#2d2926] dark:text-[#e4ddd4]"}`}>
                          {val}
                        </span>
                        {isWinner && <Check size={13} className="text-gold" />}
                      </div>
                    );
                  })}
                </div>
              );
            })}

            {/* Features comparison */}
            <div
              className="grid border-t border-subtle"
              style={{ gridTemplateColumns: `200px repeat(${activeCars.length}, 1fr)` }}
            >
              <div className="p-4 bg-surface/30 border-r border-subtle">
                <p className="text-xs font-semibold text-muted">Features</p>
              </div>
              {activeCars.map((car, colIdx) => {
                const allFeatures = [...new Set(activeCars.flatMap((c) => c.features))];
                return (
                  <div key={colIdx} className={`p-4 ${colIdx < activeCars.length - 1 ? "border-r border-subtle" : ""}`}>
                    <div className="space-y-1.5">
                      {allFeatures.map((f) => (
                        <div key={f} className="flex items-center gap-1.5">
                          {car.features.includes(f) ? (
                            <Check size={12} className="text-emerald-500 flex-shrink-0" />
                          ) : (
                            <Minus size={12} className="text-muted flex-shrink-0" />
                          )}
                          <span className={`text-xs ${car.features.includes(f) ? "text-[#2d2926] dark:text-[#e4ddd4]" : "text-muted"}`}>
                            {f}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        ) : (
          <div className="text-center py-20 text-muted">
            <div className="text-5xl mb-4">⚖️</div>
            <h3 className="text-xl font-serif font-bold mb-2 text-[#2d2926] dark:text-[#e4ddd4]">Add vehicles to compare</h3>
            <p className="text-sm">Select at least 2 vehicles above to see a detailed comparison.</p>
          </div>
        )}

        {/* Browse CTA */}
        <div className="mt-10 text-center">
          <Link
            href="/browse"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-subtle text-sm font-medium hover:bg-[#a07850]/8 transition-colors text-[#2d2926] dark:text-[#e4ddd4]"
          >
            Browse all vehicles to add
          </Link>
        </div>
      </div>
    </div>
  );
}
