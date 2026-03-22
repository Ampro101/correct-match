"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles, Heart, Shield, Target, Zap, ChevronRight } from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";

const values = [
  {
    icon: Target,
    title: "Precision Matching",
    desc: "We use a multi-dimensional scoring system that weighs budget, lifestyle, performance needs, and feature preferences to surface your ideal vehicle.",
    color: "from-blue-400 to-blue-600",
  },
  {
    icon: Shield,
    title: "Unbiased Results",
    desc: "We're not paid by dealerships or manufacturers. Every result is purely based on algorithmic fit — no sponsored placements, no favoritism.",
    color: "from-emerald-400 to-emerald-600",
  },
  {
    icon: Heart,
    title: "Built for Drivers",
    desc: "Car shopping should feel exciting, not overwhelming. We designed CarFect Match to bring joy back to the process of finding your perfect vehicle.",
    color: "from-pink-400 to-rose-500",
  },
  {
    icon: Zap,
    title: "Always Accurate",
    desc: "Our vehicle database is regularly updated with real specs, current pricing, and honest assessments — no inflated numbers, no outdated information.",
    color: "from-yellow-400 to-orange-500",
  },
];

const team = [
  { name: "Alex Rivera", role: "Founder & Car Enthusiast", emoji: "👤" },
  { name: "Jordan Kim", role: "Head of Data", emoji: "👤" },
  { name: "Sam Chen", role: "UX Designer", emoji: "👤" },
  { name: "Taylor Brooks", role: "Automotive Analyst", emoji: "👤" },
];

const stats = [
  { label: "Vehicles in database", value: "30+" },
  { label: "Filter dimensions", value: "8" },
  { label: "Match categories", value: "50+" },
  { label: "Accuracy rate", value: "94%" },
];

export default function AboutPage() {
  return (
    <div className="bg-surface min-h-screen pt-16">
      {/* Hero */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#a07850]/8 dark:bg-[#cba070]/6 rounded-full -translate-y-1/2 translate-x-1/4 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-[#cba070]/6 dark:bg-[#a07850]/8 rounded-full translate-y-1/2 -translate-x-1/4 blur-3xl" />
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-subtle bg-card mb-6 text-sm text-muted"
          >
            <Sparkles size={14} className="text-gold" />
            <span>Our story</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-5xl sm:text-6xl font-serif font-bold leading-tight mb-6 text-[#2d2926] dark:text-[#e4ddd4]"
          >
            We believe finding the
            <br />
            <span className="text-gold">right car</span> should be joyful.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg text-muted max-w-2xl mx-auto leading-relaxed"
          >
            CarFect Match was born from frustration. We were tired of car shopping tools that buried us in irrelevant results, pushed dealer inventory, and treated us like numbers. So we built something better.
          </motion.p>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 border-y border-subtle bg-card">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
            {stats.map(({ label, value }, i) => (
              <ScrollReveal key={label} delay={i * 0.08}>
                <div>
                  <p className="text-4xl font-serif font-bold text-gold mb-1">{value}</p>
                  <p className="text-sm text-muted">{label}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <ScrollReveal>
            <div className="bg-card rounded-3xl border border-subtle p-8 sm:p-12 shadow-card">
              <p className="text-sm text-gold font-medium mb-3">Our mission</p>
              <h2 className="text-3xl sm:text-4xl font-serif font-bold mb-5 text-[#2d2926] dark:text-[#e4ddd4]">
                Match, don&apos;t just search.
              </h2>
              <div className="space-y-4 text-muted text-base leading-relaxed">
                <p>
                  Traditional car search engines ask you to filter and scroll endlessly. CarFect Match flips the script — we ask you about <em>your life</em>, and we surface vehicles that fit seamlessly into it.
                </p>
                <p>
                  Whether you&apos;re a weekend adventurer who needs serious off-road capability, a daily commuter prioritizing fuel efficiency, or a growing family needing space without sacrificing style — we have a match for you.
                </p>
                <p>
                  Our scoring system considers dozens of factors across 8 core dimensions, weighing each against your specific priorities. The result? A ranked, personalized list of vehicles that are genuinely right for you.
                </p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-card border-y border-subtle">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <ScrollReveal>
            <div className="text-center mb-12">
              <p className="text-sm text-gold font-medium mb-2">What we stand for</p>
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#2d2926] dark:text-[#e4ddd4]">
                Our <span className="text-gold">values</span>
              </h2>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {values.map((val, i) => {
              const Icon = val.icon;
              return (
                <ScrollReveal key={val.title} delay={i * 0.08}>
                  <div className="bg-surface rounded-2xl border border-subtle p-6 hover:shadow-hover transition-shadow duration-300">
                    <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${val.color} flex items-center justify-center mb-4 shadow-sm`}>
                      <Icon size={20} className="text-white" />
                    </div>
                    <h3 className="font-serif font-bold text-lg mb-2 text-[#2d2926] dark:text-[#e4ddd4]">{val.title}</h3>
                    <p className="text-sm text-muted leading-relaxed">{val.desc}</p>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <ScrollReveal>
            <div className="text-center mb-12">
              <p className="text-sm text-gold font-medium mb-2">The people behind it</p>
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#2d2926] dark:text-[#e4ddd4]">
                Our <span className="text-gold">team</span>
              </h2>
              <p className="text-muted text-sm mt-3 max-w-lg mx-auto">
                We&apos;re a small team of car enthusiasts, data nerds, and designers who believe software should feel like craftsmanship.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
            {team.map((member, i) => (
              <ScrollReveal key={member.name} delay={i * 0.08}>
                <div className="bg-card rounded-2xl border border-subtle p-5 text-center hover:shadow-hover transition-shadow duration-300">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#f0e8de] to-[#e2d5c5] dark:from-[#2a2520] dark:to-[#1e1c18] flex items-center justify-center mx-auto mb-3 text-3xl border border-subtle">
                    {member.emoji}
                  </div>
                  <p className="font-serif font-bold text-sm text-[#2d2926] dark:text-[#e4ddd4]">{member.name}</p>
                  <p className="text-xs text-muted mt-0.5">{member.role}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 sm:px-6 border-t border-subtle bg-card">
        <div className="max-w-2xl mx-auto text-center">
          <ScrollReveal>
            <div className="w-14 h-14 rounded-2xl gold-gradient flex items-center justify-center mx-auto mb-5 shadow-md">
              <Sparkles size={24} className="text-white" />
            </div>
            <h2 className="text-3xl font-serif font-bold mb-3 text-[#2d2926] dark:text-[#e4ddd4]">
              Ready to find your match?
            </h2>
            <p className="text-muted text-base mb-7 max-w-md mx-auto">
              Take our 2-minute quiz and we&apos;ll surface the vehicles that genuinely fit your life.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link href="/quiz" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl gold-gradient text-white font-semibold hover:opacity-90 transition-opacity shadow-sm">
                <Sparkles size={16} /> Start the Quiz
              </Link>
              <Link href="/browse" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl border border-subtle font-semibold text-sm hover:bg-[#a07850]/8 transition-colors text-[#2d2926] dark:text-[#e4ddd4]">
                Browse Vehicles <ChevronRight size={15} />
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
