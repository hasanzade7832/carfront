"use client";

import { motion } from "framer-motion";

export default function SearchDock({ onOpen }: { onOpen: () => void }) {
  return (
    <motion.button
      type="button"
      onClick={onOpen}
      whileTap={{ scale: 0.99 }}
      className="w-full"
    >
      <div className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 px-4 py-4 text-left shadow-lg backdrop-blur-md transition hover:bg-white/8">
        {/* subtle glow */}
        <div className="pointer-events-none absolute -left-20 -top-20 h-40 w-40 rounded-full bg-emerald-400/10 blur-3xl opacity-0 transition-opacity duration-300 group-hover:opacity-60" />
        <div className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-white/10" />

        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="text-white/85 text-sm">جستجو در آگهی‌ها</div>
            <div className="text-white/40 text-xs mt-1">
              عنوان، رنگ، سال، گیربکس، نوع آگهی...
            </div>
          </div>

          <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-emerald-200 text-sm">
            جستجو
          </div>
        </div>

        <div className="mt-3">
          <div className="rounded-2xl border border-white/10 bg-slate-950/30 px-4 py-3 text-white/40 text-sm">
            مثلا: سوناتا 2018 سفید اتومات
          </div>
        </div>
      </div>
    </motion.button>
  );
}
