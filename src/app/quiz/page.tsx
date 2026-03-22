"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ChevronLeft, Sparkles, Check, SkipForward } from "lucide-react";
import CarCard from "@/components/CarCard";
import { cars, formatPrice } from "@/lib/cars";

interface Step {
  id: string;
  question: string;
  subtitle?: string;
  type: "single" | "multi" | "range";
  options?: { label: string; value: string; emoji?: string }[];
  min?: number;
  max?: number;
  step?: number;
  prefix?: string;
}

const steps: Step[] = [
  {
    id: "budget",
    question: "What's your budget?",
    subtitle: "We'll only show vehicles within your range.",
    type: "single",
    options: [
      { label: "Under $15,000", value: "Under $15k", emoji: "💰" },
      { label: "$15,000 – $25,000", value: "$15k-$25k", emoji: "💵" },
      { label: "$25,000 – $40,000", value: "$25k-$40k", emoji: "💳" },
      { label: "$40,000 – $60,000", value: "$40k-$60k", emoji: "🏦" },
      { label: "$60,000 – $100,000", value: "$60k-$100k", emoji: "💎" },
      { label: "$100,000+", value: "$100k+", emoji: "👑" },
    ],
  },
  {
    id: "bodyStyle",
    question: "What body style suits you?",
    subtitle: "Pick all that appeal to you.",
    type: "multi",
    options: [
      { label: "SUV", value: "SUV", emoji: "🚙" },
      { label: "Sedan", value: "Sedan", emoji: "🚗" },
      { label: "Truck", value: "Truck", emoji: "🛻" },
      { label: "Coupe / Sports", value: "Coupe", emoji: "🏎️" },
      { label: "Hatchback", value: "Hatchback", emoji: "🚘" },
      { label: "Convertible", value: "Convertible", emoji: "🌞" },
      { label: "Minivan", value: "Van/Minivan", emoji: "🚌" },
    ],
  },
  {
    id: "passengers",
    question: "How many seats do you need?",
    subtitle: "Include everyone who regularly rides.",
    type: "single",
    options: [
      { label: "Just me", value: "2", emoji: "🙋" },
      { label: "Me + 1", value: "2", emoji: "👫" },
      { label: "Small family (4-5)", value: "4", emoji: "👨‍👩‍👦" },
      { label: "Large family (6-7)", value: "7", emoji: "👨‍👩‍👧‍👦" },
      { label: "8+ passengers", value: "8", emoji: "🚐" },
    ],
  },
  {
    id: "engine",
    question: "What powers your ride?",
    subtitle: "Your preference for fuel and performance.",
    type: "multi",
    options: [
      { label: "Gas", value: "Gas", emoji: "⛽" },
      { label: "Electric", value: "Electric", emoji: "⚡" },
      { label: "Hybrid", value: "Hybrid", emoji: "🌿" },
      { label: "Diesel", value: "Diesel", emoji: "🔧" },
    ],
  },
  {
    id: "performance",
    question: "How do you like to drive?",
    type: "single",
    options: [
      { label: "Comfort & smoothness", value: "Comfort", emoji: "🛋️" },
      { label: "Sporty & responsive", value: "Sport", emoji: "🏁" },
      { label: "Off-road adventures", value: "Off-road", emoji: "🏔️" },
      { label: "Eco-friendly & efficient", value: "Eco-friendly", emoji: "🌱" },
    ],
  },
  {
    id: "condition",
    question: "New or pre-owned?",
    type: "single",
    options: [
      { label: "New", value: "New", emoji: "✨" },
      { label: "Certified Pre-Owned", value: "Certified Pre-Owned", emoji: "🏆" },
      { label: "Used", value: "Used", emoji: "🔍" },
      { label: "Doesn't matter", value: "any", emoji: "🤷" },
    ],
  },
  {
    id: "origin",
    question: "Any preference on where it's made?",
    type: "multi",
    options: [
      { label: "American-made", value: "USA", emoji: "🇺🇸" },
      { label: "Japanese reliability", value: "Japan", emoji: "🇯🇵" },
      { label: "German engineering", value: "Germany", emoji: "🇩🇪" },
      { label: "British heritage", value: "Britain", emoji: "🇬🇧" },
      { label: "Scandinavian luxury", value: "Sweden", emoji: "🇸🇪" },
      { label: "No preference", value: "any", emoji: "🌎" },
    ],
  },
  {
    id: "features",
    question: "Must-have features?",
    subtitle: "Select everything that matters to you.",
    type: "multi",
    options: [
      { label: "Navigation", value: "Navigation", emoji: "🗺️" },
      { label: "Backup Camera", value: "Backup Camera", emoji: "📷" },
      { label: "CarPlay / Android Auto", value: "CarPlay/Android Auto", emoji: "📱" },
      { label: "Heated Seats", value: "Heated Seats", emoji: "🔥" },
      { label: "Sunroof / Moonroof", value: "Sunroof/Moonroof", emoji: "☀️" },
      { label: "Premium Sound", value: "Premium Sound", emoji: "🎵" },
      { label: "Leather Seats", value: "Leather", emoji: "🪑" },
    ],
  },
];

type Answers = Record<string, string | string[]>;

function scoreCarForAnswers(car: typeof cars[0], answers: Answers): number {
  let score = 70;

  // Budget
  if (answers.budget) {
    const map: Record<string, [number, number]> = {
      "Under $15k": [0, 15000],
      "$15k-$25k": [15000, 25000],
      "$25k-$40k": [25000, 40000],
      "$40k-$60k": [40000, 60000],
      "$60k-$100k": [60000, 100000],
      "$100k+": [100000, Infinity],
    };
    const range = map[answers.budget as string];
    if (range && car.price >= range[0] && car.price <= range[1]) score += 10;
    else if (range && car.price < range[0]) score += 4;
    else score -= 5;
  }

  // Body style
  if (answers.bodyStyle && Array.isArray(answers.bodyStyle)) {
    if (answers.bodyStyle.some((b) => car.bodyStyle.includes(b))) score += 8;
  }

  // Engine
  if (answers.engine && Array.isArray(answers.engine)) {
    if (answers.engine.some((e) => car.engine.includes(e))) score += 6;
  }

  // Performance
  if (answers.performance && car.performance === answers.performance) score += 5;

  // Condition
  if (answers.condition && answers.condition !== "any" && car.condition === answers.condition) score += 4;

  // Origin
  if (answers.origin && Array.isArray(answers.origin)) {
    if (!answers.origin.includes("any") && answers.origin.includes(car.origin)) score += 4;
  }

  // Features
  if (answers.features && Array.isArray(answers.features)) {
    const matched = answers.features.filter((f) =>
      car.features.some((cf) => cf.includes(f) || f.includes(cf))
    );
    score += Math.min(matched.length * 2, 8);
  }

  return Math.min(score, 99);
}

export default function QuizPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [completed, setCompleted] = useState(false);

  const step = steps[currentStep];
  const progress = ((currentStep) / steps.length) * 100;

  const select = (value: string) => {
    if (step.type === "single") {
      setAnswers((a) => ({ ...a, [step.id]: value }));
    } else {
      const current = (answers[step.id] as string[]) ?? [];
      const next = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];
      setAnswers((a) => ({ ...a, [step.id]: next }));
    }
  };

  const isSelected = (value: string) => {
    const ans = answers[step.id];
    if (!ans) return false;
    if (Array.isArray(ans)) return ans.includes(value);
    return ans === value;
  };

  const canProceed = !!answers[step.id] && (Array.isArray(answers[step.id]) ? (answers[step.id] as string[]).length > 0 : true);

  const next = () => {
    if (currentStep < steps.length - 1) setCurrentStep((s) => s + 1);
    else setCompleted(true);
  };

  const back = () => {
    if (currentStep > 0) setCurrentStep((s) => s - 1);
  };

  const skip = () => {
    if (currentStep < steps.length - 1) setCurrentStep((s) => s + 1);
    else setCompleted(true);
  };

  const results = completed
    ? [...cars]
        .map((car) => ({ car, score: scoreCarForAnswers(car, answers) }))
        .sort((a, b) => b.score - a.score)
        .slice(0, 9)
    : [];

  if (completed) {
    return (
      <div className="bg-surface min-h-screen pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="w-16 h-16 rounded-2xl gold-gradient flex items-center justify-center mx-auto mb-5 shadow-md">
              <Sparkles size={28} className="text-white" />
            </div>
            <h1 className="text-4xl sm:text-5xl font-serif font-bold mb-3 text-[#2d2926] dark:text-[#e4ddd4]">
              Your top <span className="text-gold">matches</span>
            </h1>
            <p className="text-muted text-base max-w-lg mx-auto">
              Based on your answers, we&apos;ve ranked {results.length} vehicles perfectly suited for you.
            </p>
            <button
              onClick={() => { setCompleted(false); setCurrentStep(0); setAnswers({}); }}
              className="mt-4 text-sm text-muted hover:text-gold transition-colors underline underline-offset-2"
            >
              Retake quiz
            </button>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {results.map(({ car, score }, i) => (
              <CarCard key={car.id} car={car} matchScore={score} index={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-surface min-h-screen pt-16 flex flex-col">
      <div className="max-w-2xl mx-auto w-full px-4 sm:px-6 py-10 flex-1">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between text-xs text-muted mb-2">
            <span>Step {currentStep + 1} of {steps.length}</span>
            <button onClick={skip} className="flex items-center gap-1 hover:text-gold transition-colors">
              Skip <SkipForward size={13} />
            </button>
          </div>
          <div className="h-1.5 rounded-full bg-[#a07850]/12 dark:bg-[#cba070]/10 overflow-hidden">
            <motion.div
              className="h-full rounded-full gold-gradient"
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            />
          </div>
        </div>

        {/* Question */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <h2 className="text-2xl sm:text-3xl font-serif font-bold mb-2 text-[#2d2926] dark:text-[#e4ddd4]">
              {step.question}
            </h2>
            {step.subtitle && <p className="text-sm text-muted mb-6">{step.subtitle}</p>}
            {!step.subtitle && <div className="mb-6" />}

            {step.type !== "range" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {step.options?.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => select(opt.value)}
                    className={`flex items-center gap-3 p-4 rounded-2xl border text-left transition-all duration-200 ${
                      isSelected(opt.value)
                        ? "border-[#a07850] dark:border-[#cba070] bg-[#a07850]/8 dark:bg-[#cba070]/8"
                        : "border-subtle bg-card hover:border-[#a07850]/40 dark:hover:border-[#cba070]/40 hover:bg-[#a07850]/4"
                    }`}
                  >
                    <span className="text-2xl flex-shrink-0">{opt.emoji}</span>
                    <span className="text-sm font-medium text-[#2d2926] dark:text-[#e4ddd4]">{opt.label}</span>
                    {isSelected(opt.value) && (
                      <div className="ml-auto w-5 h-5 rounded-full gold-gradient flex items-center justify-center flex-shrink-0">
                        <Check size={11} className="text-white" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-subtle">
          <button
            onClick={back}
            disabled={currentStep === 0}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-subtle text-sm font-medium disabled:opacity-30 hover:bg-[#a07850]/8 transition-colors text-[#2d2926] dark:text-[#e4ddd4]"
          >
            <ChevronLeft size={16} /> Back
          </button>

          <button
            onClick={next}
            disabled={!canProceed}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl gold-gradient text-white text-sm font-semibold disabled:opacity-40 hover:opacity-90 transition-opacity shadow-sm"
          >
            {currentStep === steps.length - 1 ? (
              <>
                <Sparkles size={15} /> See my matches
              </>
            ) : (
              <>
                Next <ChevronRight size={16} />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
