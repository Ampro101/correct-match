"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ChevronLeft, Sparkles, Check, SkipForward, Loader2, AlertCircle } from "lucide-react";
import AICarCard from "@/components/AICarCard";
import { AIMatchResult } from "@/lib/ai-types";

interface Step {
  id: string;
  question: string;
  subtitle?: string;
  type: "single" | "multi";
  options: { label: string; value: string; detail?: string }[];
}

const steps: Step[] = [
  {
    id: "primaryUse",
    question: "How will you primarily use this vehicle?",
    subtitle: "This shapes every recommendation we make.",
    type: "single",
    options: [
      { label: "Daily commuting", value: "commute", detail: "City & highway driving, parking, efficiency" },
      { label: "Family transport", value: "family", detail: "School runs, road trips, cargo space" },
      { label: "Adventure & outdoors", value: "adventure", detail: "Off-road, camping, towing" },
      { label: "Business & luxury", value: "luxury", detail: "Prestige, comfort, client impressions" },
      { label: "Performance & driving enjoyment", value: "sport", detail: "Track days, twisty roads, power" },
      { label: "Eco-conscious daily driver", value: "eco", detail: "Low emissions, efficiency, sustainability" },
    ],
  },
  {
    id: "budget",
    question: "What is your total budget?",
    subtitle: "We'll only show vehicles that fit your range.",
    type: "single",
    options: [
      { label: "Under $15,000", value: "Under $15k", detail: "Used economy, reliable transport" },
      { label: "$15,000 – $25,000", value: "$15k-$25k", detail: "Entry-level new or quality used" },
      { label: "$25,000 – $40,000", value: "$25k-$40k", detail: "Mid-range new, certified pre-owned" },
      { label: "$40,000 – $60,000", value: "$40k-$60k", detail: "Near-luxury, performance options" },
      { label: "$60,000 – $100,000", value: "$60k-$100k", detail: "Luxury, high-performance" },
      { label: "$100,000 and above", value: "$100k+", detail: "Exotic, ultra-luxury, rare" },
    ],
  },
  {
    id: "bodyStyle",
    question: "Which body styles appeal to you?",
    subtitle: "Select all that you'd consider.",
    type: "multi",
    options: [
      { label: "SUV — Compact", value: "SUV - Compact", detail: "Versatile, practical, AWD-capable" },
      { label: "SUV — Large", value: "SUV - Large", detail: "3-row seating, maximum space" },
      { label: "Sedan", value: "Sedan", detail: "Classic 4-door, trunk, efficient" },
      { label: "Coupe / Sports", value: "Coupe", detail: "2 or 4-door, driver-focused" },
      { label: "Hatchback", value: "Hatchback", detail: "Compact with flexible cargo" },
      { label: "Convertible", value: "Convertible", detail: "Open-air, wind-in-hair experience" },
      { label: "Truck", value: "Truck", detail: "Towing, hauling, off-road" },
      { label: "Minivan", value: "Van/Minivan", detail: "Maximum family practicality" },
    ],
  },
  {
    id: "passengers",
    question: "How many seats do you regularly need?",
    type: "single",
    options: [
      { label: "1 – 2 people", value: "2", detail: "Solo or couple" },
      { label: "3 – 4 people", value: "4", detail: "Small family or carpool" },
      { label: "5 people", value: "5", detail: "Standard family sedan or SUV" },
      { label: "6 – 7 people", value: "7", detail: "Larger family, 3-row SUV" },
      { label: "8 or more", value: "8", detail: "Minivan or full-size SUV" },
    ],
  },
  {
    id: "engine",
    question: "What powertrain do you prefer?",
    subtitle: "Select all that interest you.",
    type: "multi",
    options: [
      { label: "Gasoline", value: "Gas", detail: "Widest availability, familiar refueling" },
      { label: "Fully Electric (BEV)", value: "Electric", detail: "Zero tailpipe emissions, low running cost" },
      { label: "Plug-in Hybrid (PHEV)", value: "Hybrid", detail: "Electric range + gas backup" },
      { label: "Traditional Hybrid (HEV)", value: "Hybrid", detail: "Self-charging, no plug needed" },
      { label: "Diesel", value: "Diesel", detail: "High torque, long-range efficiency" },
    ],
  },
  {
    id: "performance",
    question: "How would you describe your driving style?",
    type: "single",
    options: [
      { label: "Comfort-first — smooth and relaxed", value: "Comfort", detail: "Soft suspension, quiet cabin" },
      { label: "Sporty — engaged and responsive", value: "Sport", detail: "Sharp steering, firm suspension" },
      { label: "Off-road — rugged and capable", value: "Off-road", detail: "4WD, ground clearance, skid plates" },
      { label: "Eco — efficiency above all", value: "Eco-friendly", detail: "High MPG, low emissions" },
    ],
  },
  {
    id: "condition",
    question: "New, certified pre-owned, or used?",
    type: "single",
    options: [
      { label: "New — latest model, full warranty", value: "New", detail: "0 miles, manufacturer warranty" },
      { label: "Certified Pre-Owned — inspected & warranted", value: "Certified Pre-Owned", detail: "Dealer-backed, lower price" },
      { label: "Used — best value per dollar", value: "Used", detail: "Higher mileage, lowest cost" },
      { label: "No preference", value: "any", detail: "Show me the best matches regardless" },
    ],
  },
  {
    id: "origin",
    question: "Any preference for where the vehicle is manufactured?",
    subtitle: "Select all that apply — or skip if no preference.",
    type: "multi",
    options: [
      { label: "American-made", value: "USA", detail: "Ford, Tesla, Rivian, GM, RAM" },
      { label: "Japanese engineering", value: "Japan", detail: "Toyota, Honda, Mazda, Subaru, Lexus" },
      { label: "German precision", value: "Germany", detail: "BMW, Mercedes-Benz, Audi, Porsche" },
      { label: "Korean innovation", value: "Korea", detail: "Hyundai, Kia, Genesis" },
      { label: "British heritage", value: "Britain", detail: "Land Rover, Bentley, Rolls-Royce" },
      { label: "Scandinavian luxury", value: "Sweden", detail: "Volvo" },
      { label: "Italian passion", value: "Italy", detail: "Ferrari, Lamborghini, Alfa Romeo" },
      { label: "No preference", value: "any", detail: "Origin doesn't factor into my decision" },
    ],
  },
  {
    id: "features",
    question: "Which features are non-negotiable for you?",
    subtitle: "Select everything that matters.",
    type: "multi",
    options: [
      { label: "Navigation / GPS", value: "Navigation" },
      { label: "Backup Camera", value: "Backup Camera" },
      { label: "Apple CarPlay / Android Auto", value: "CarPlay/Android Auto" },
      { label: "Heated Front Seats", value: "Heated Seats" },
      { label: "Ventilated / Cooled Seats", value: "Ventilated Seats" },
      { label: "Sunroof or Moonroof", value: "Sunroof/Moonroof" },
      { label: "Panoramic Sunroof", value: "Panoramic Sunroof" },
      { label: "Premium Sound System", value: "Premium Sound" },
      { label: "Leather or Faux-Leather Seats", value: "Leather" },
      { label: "Powered / Memory Seats", value: "Powered Seats" },
    ],
  },
];

type Answers = Record<string, string | string[]>;

export default function QuizPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [completed, setCompleted] = useState(false);
  const [aiResult, setAiResult] = useState<AIMatchResult | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  const step = steps[currentStep];
  const progress = (currentStep / steps.length) * 100;

  const select = (value: string) => {
    if (step.type === "single") {
      setAnswers((a) => ({ ...a, [step.id]: value }));
    } else {
      const current = (answers[step.id] as string[]) ?? [];
      const next = current.includes(value) ? current.filter((v) => v !== value) : [...current, value];
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

  const submitToAI = async (finalAnswers: Answers) => {
    setAiLoading(true);
    setAiError(null);
    try {
      const res = await fetch("/api/ai-match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers: finalAnswers }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Match failed");
      setAiResult(data);
    } catch (err) {
      setAiError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setAiLoading(false);
    }
  };

  const next = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((s) => s + 1);
    } else {
      setCompleted(true);
      submitToAI(answers);
    }
  };

  const back = () => {
    if (currentStep > 0) setCurrentStep((s) => s - 1);
  };

  const skip = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((s) => s + 1);
    } else {
      setCompleted(true);
      submitToAI(answers);
    }
  };

  const retake = () => {
    setCompleted(false);
    setCurrentStep(0);
    setAnswers({});
    setAiResult(null);
    setAiError(null);
  };

  if (completed) {
    return (
      <div className="bg-surface min-h-screen pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            {aiLoading ? (
              <>
                <div className="w-14 h-14 rounded-2xl gold-gradient flex items-center justify-center mx-auto mb-5 shadow-md">
                  <Loader2 size={24} className="text-white animate-spin" />
                </div>
                <h1 className="text-4xl font-serif font-bold mb-3 text-[#2d2926] dark:text-[#e4ddd4]">
                  Finding your <span className="text-gold">matches...</span>
                </h1>
                <p className="text-[#5a4a38] dark:text-[#9c8a72] text-base max-w-lg mx-auto">
                  Our AI is analyzing your preferences and searching for the perfect vehicles.
                </p>
              </>
            ) : aiError ? (
              <>
                <div className="w-14 h-14 rounded-2xl bg-red-100 dark:bg-red-900/20 flex items-center justify-center mx-auto mb-5">
                  <AlertCircle size={24} className="text-red-500" />
                </div>
                <h1 className="text-3xl font-serif font-bold mb-3 text-[#2d2926] dark:text-[#e4ddd4]">Something went wrong</h1>
                <p className="text-[#5a4a38] dark:text-[#9c8a72] text-sm max-w-md mx-auto mb-4">{aiError}</p>
                <button
                  onClick={() => submitToAI(answers)}
                  className="px-6 py-2.5 rounded-xl gold-gradient text-white text-sm font-semibold hover:opacity-90 transition-opacity"
                >
                  Try again
                </button>
              </>
            ) : aiResult ? (
              <>
                <div className="w-14 h-14 rounded-2xl gold-gradient flex items-center justify-center mx-auto mb-5 shadow-md">
                  <Sparkles size={24} className="text-white" />
                </div>
                <h1 className="text-4xl sm:text-5xl font-serif font-bold mb-3 text-[#2d2926] dark:text-[#e4ddd4]">
                  Your top <span className="text-gold">matches</span>
                </h1>
                <p className="text-[#5a4a38] dark:text-[#9c8a72] text-base max-w-2xl mx-auto">
                  {aiResult.summary}
                </p>
                <button onClick={retake} className="mt-4 text-sm text-muted hover:text-gold transition-colors underline underline-offset-2">
                  Retake quiz
                </button>
              </>
            ) : null}
          </motion.div>

          {/* Loading skeleton */}
          {aiLoading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
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

          {/* Top picks */}
          {aiResult && (
            <>
              <div className="mb-10">
                <h2 className="text-xl font-serif font-bold mb-5 text-[#2d2926] dark:text-[#e4ddd4]">
                  <span className="text-gold">Top picks</span> for you
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {aiResult.topPicks.map((car, i) => (
                    <AICarCard
                      key={`top-${car.make}-${car.model}-${i}`}
                      car={car}
                      index={i}
                      badge={i === 0 ? "Best Match" : i === 1 ? "Great Choice" : "Strong Pick"}
                    />
                  ))}
                </div>
              </div>

              {/* Advice */}
              <div className="bg-card rounded-2xl border border-subtle p-5 mb-10 flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl gold-gradient flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Sparkles size={16} className="text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#2d2926] dark:text-[#e4ddd4] mb-1">AI Advisor Note</p>
                  <p className="text-sm text-muted leading-relaxed">{aiResult.advice}</p>
                </div>
              </div>

              {/* Alternative picks */}
              {aiResult.alternativePicks.length > 0 && (
                <div>
                  <h2 className="text-xl font-serif font-bold mb-5 text-[#2d2926] dark:text-[#e4ddd4]">
                    Worth considering
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {aiResult.alternativePicks.map((car, i) => (
                      <AICarCard
                        key={`alt-${car.make}-${car.model}-${i}`}
                        car={car}
                        index={i}
                        badge="Alternative"
                      />
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-surface min-h-screen pt-16 flex flex-col">
      <div className="max-w-2xl mx-auto w-full px-4 sm:px-6 py-12 flex-1">
        {/* Progress */}
        <div className="mb-10">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="text-[#5a4a38] dark:text-[#9c8a72] font-medium">Step {currentStep + 1} of {steps.length}</span>
            <button onClick={skip} className="flex items-center gap-1 text-muted hover:text-gold transition-colors">
              Skip this step <SkipForward size={13} />
            </button>
          </div>
          <div className="h-1 rounded-full bg-[#a07850]/12 dark:bg-[#cba070]/10 overflow-hidden">
            <motion.div
              className="h-full rounded-full gold-gradient"
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            />
          </div>
          {/* Step dots */}
          <div className="flex gap-1.5 mt-3 justify-center">
            {steps.map((_, i) => (
              <div
                key={i}
                className={`h-1 rounded-full transition-all duration-300 ${
                  i < currentStep ? "bg-[#a07850] dark:bg-[#cba070] w-4" :
                  i === currentStep ? "bg-[#a07850] dark:bg-[#cba070] w-6" : "bg-[#a07850]/20 dark:bg-[#cba070]/15 w-3"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Question */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 28 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -28 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          >
            <h2 className="text-2xl sm:text-3xl font-serif font-bold mb-2 text-[#2d2926] dark:text-[#e4ddd4]">
              {step.question}
            </h2>
            {step.subtitle && (
              <p className="text-sm text-[#5a4a38] dark:text-[#9c8a72] mb-7">{step.subtitle}</p>
            )}
            {!step.subtitle && <div className="mb-7" />}

            <div className={`grid gap-2.5 ${step.options.length > 5 ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1"}`}>
              {step.options.map((opt) => (
                <button
                  key={opt.value + opt.label}
                  onClick={() => select(opt.value)}
                  className={`flex items-start gap-3 p-4 rounded-xl border text-left transition-all duration-200 ${
                    isSelected(opt.value)
                      ? "border-[#a07850] dark:border-[#cba070] bg-[#a07850]/6 dark:bg-[#cba070]/8 shadow-sm"
                      : "border-subtle bg-card hover:border-[#a07850]/45 dark:hover:border-[#cba070]/40 hover:bg-[#a07850]/3 dark:hover:bg-[#cba070]/4"
                  }`}
                >
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-[#2d2926] dark:text-[#e4ddd4]">{opt.label}</p>
                    {opt.detail && (
                      <p className="text-xs text-[#6a5540] dark:text-[#9c8a72] mt-0.5">{opt.detail}</p>
                    )}
                  </div>
                  <div className={`mt-0.5 w-5 h-5 rounded-full border flex items-center justify-center flex-shrink-0 transition-all ${
                    isSelected(opt.value)
                      ? "gold-gradient border-transparent"
                      : "border-subtle"
                  }`}>
                    {isSelected(opt.value) && <Check size={11} className="text-white" />}
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-10 pt-6 border-t border-subtle">
          <button
            onClick={back}
            disabled={currentStep === 0}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-subtle text-sm font-medium disabled:opacity-30 hover:bg-[#a07850]/6 transition-colors text-[#2d2926] dark:text-[#e4ddd4]"
          >
            <ChevronLeft size={16} /> Back
          </button>

          <button
            onClick={next}
            disabled={!canProceed}
            className="flex items-center gap-2 px-7 py-2.5 rounded-xl gold-gradient text-white text-sm font-semibold disabled:opacity-35 hover:opacity-90 transition-opacity shadow-sm"
          >
            {currentStep === steps.length - 1 ? (
              <><Sparkles size={14} /> See my matches</>
            ) : (
              <>Next <ChevronRight size={16} /></>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
