"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useTheme } from "@/lib/theme";
import { Sun, Moon, Menu, X, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { label: "Browse", href: "/browse" },
  { label: "Quiz", href: "/quiz" },
  { label: "Compare", href: "/compare" },
  { label: "About", href: "/about" },
];

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? "glass border-b border-subtle shadow-sm" : "bg-transparent"
        }`}
      >
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-xl gold-gradient flex items-center justify-center shadow-sm">
              <Sparkles size={16} className="text-white" />
            </div>
            <span className="text-xl font-serif font-bold text-[#2d2926] dark:text-[#e4ddd4] tracking-tight">
              CarFect<span className="text-gold"> Match</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-4 py-2 rounded-xl text-sm font-medium text-[#2d2926] dark:text-[#e4ddd4] hover:bg-[#a07850]/10 dark:hover:bg-[#cba070]/10 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="w-9 h-9 rounded-xl flex items-center justify-center hover:bg-[#a07850]/10 dark:hover:bg-[#cba070]/10 transition-colors text-[#a07850] dark:text-[#cba070]"
              aria-label="Toggle theme"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={theme}
                  initial={{ rotate: -30, opacity: 0, scale: 0.8 }}
                  animate={{ rotate: 0, opacity: 1, scale: 1 }}
                  exit={{ rotate: 30, opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.2 }}
                >
                  {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
                </motion.div>
              </AnimatePresence>
            </button>

            <Link
              href="/quiz"
              className="hidden md:inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white gold-gradient hover:opacity-90 transition-opacity shadow-sm"
            >
              <Sparkles size={14} />
              Find My Match
            </Link>

            {/* Mobile menu toggle */}
            <button
              className="md:hidden w-9 h-9 rounded-xl flex items-center justify-center hover:bg-[#a07850]/10 transition-colors"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-0 top-16 z-40 glass border-b border-subtle shadow-lg md:hidden"
          >
            <div className="px-4 py-4 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="block px-4 py-3 rounded-xl text-sm font-medium hover:bg-[#a07850]/10 transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/quiz"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2 mt-2 px-4 py-3 rounded-xl text-sm font-semibold text-white gold-gradient"
              >
                <Sparkles size={14} />
                Find My Match
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
