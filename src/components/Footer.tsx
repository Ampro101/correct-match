import Link from "next/link";
import { Sparkles, Twitter, Instagram, Youtube } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-subtle bg-surface mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-xl gold-gradient flex items-center justify-center">
                <Sparkles size={16} className="text-white" />
              </div>
              <span className="text-lg font-serif font-bold">
                CarFect<span className="text-gold"> Match</span>
              </span>
            </div>
            <p className="text-sm text-muted leading-relaxed">
              Premium car matching for the discerning driver. Find your perfect vehicle with confidence.
            </p>
            <div className="flex items-center gap-3 mt-4">
              {[Twitter, Instagram, Youtube].map((Icon, i) => (
                <button
                  key={i}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-muted hover:text-gold transition-colors border border-subtle"
                >
                  <Icon size={15} />
                </button>
              ))}
            </div>
          </div>

          {/* Platform */}
          <div>
            <h4 className="text-sm font-semibold mb-3 text-[#2d2926] dark:text-[#e4ddd4]">Platform</h4>
            <ul className="space-y-2 text-sm text-muted">
              {["Browse Cars", "Match Quiz", "Compare", "Trending"].map((item) => (
                <li key={item}>
                  <Link href="#" className="hover:text-gold transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-sm font-semibold mb-3 text-[#2d2926] dark:text-[#e4ddd4]">Categories</h4>
            <ul className="space-y-2 text-sm text-muted">
              {["SUVs", "Sedans", "Electric", "Luxury", "Trucks", "Sports Cars"].map((item) => (
                <li key={item}>
                  <Link href="#" className="hover:text-gold transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-sm font-semibold mb-3 text-[#2d2926] dark:text-[#e4ddd4]">Company</h4>
            <ul className="space-y-2 text-sm text-muted">
              {[
                { label: "About Us", href: "/about" },
                { label: "Privacy Policy", href: "#" },
                { label: "Terms of Service", href: "#" },
                { label: "Contact", href: "#" },
              ].map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="hover:text-gold transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-subtle mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted">
          <p>© 2024 CarFect Match. All rights reserved.</p>
          <p>Crafted with care for car enthusiasts everywhere.</p>
        </div>
      </div>
    </footer>
  );
}
