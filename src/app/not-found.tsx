import Link from "next/link";
import { ChevronRight } from "lucide-react";

export default function NotFound() {
  return (
    <div className="bg-surface min-h-screen pt-16 flex items-center justify-center px-4">
      <div className="text-center">
        <p className="text-7xl mb-6">🚗</p>
        <h1 className="text-5xl font-serif font-bold mb-3 text-[#2d2926] dark:text-[#e4ddd4]">
          404 — <span className="text-gold">Lost the road</span>
        </h1>
        <p className="text-muted text-base mb-8 max-w-sm mx-auto">
          The page you&apos;re looking for doesn&apos;t exist. Let&apos;s get you back on track.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl gold-gradient text-white font-semibold text-sm hover:opacity-90 transition-opacity"
          >
            Back to Home
          </Link>
          <Link
            href="/browse"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-subtle font-semibold text-sm hover:bg-[#a07850]/8 transition-colors text-[#2d2926] dark:text-[#e4ddd4]"
          >
            Browse Cars <ChevronRight size={15} />
          </Link>
        </div>
      </div>
    </div>
  );
}
