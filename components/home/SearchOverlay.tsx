"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import { useAdsStore } from "@/store/useAdsStore";
import { CarAdType, GearboxType } from "@/lib/types";
import Link from "next/link";

export type SearchFilters = {
  q: string;
  type: CarAdType | "all";
  gearbox: GearboxType | "all";
  yearFrom: string;
  yearTo: string;
  priceFrom: string; // میلیون
  priceTo: string; // میلیون
};

function toNum(v: string): number | null {
  const t = v.trim();
  if (!t) return null;
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
}

function typeLabel(t: CarAdType) {
  switch (t) {
    case CarAdType.UsedSale:
      return "کارکرده";
    case CarAdType.ZeroSale:
      return "صفر";
    case CarAdType.CoopSale:
      return "همکاری";
    case CarAdType.BuyRequest:
      return "درخواست خرید";
    default:
      return "—";
  }
}

function gearboxLabel(g: GearboxType) {
  switch (g) {
    case GearboxType.Automatic:
      return "اتومات";
    case GearboxType.Manual:
      return "دنده‌ای";
    default:
      return "—";
  }
}

export default function SearchOverlay({
  open,
  onClose,
  onSubmit,
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: (filters: SearchFilters) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const homeAds = useAdsStore((s) => s.homeAds);

  const [filters, setFilters] = useState<SearchFilters>({
    q: "",
    type: "all",
    gearbox: "all",
    yearFrom: "",
    yearTo: "",
    priceFrom: "",
    priceTo: "",
  });

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 50);
  }, [open]);

  const results = useMemo(() => {
    const q = filters.q.trim().toLowerCase();
    const yearFrom = toNum(filters.yearFrom);
    const yearTo = toNum(filters.yearTo);
    const priceFrom = toNum(filters.priceFrom);
    const priceTo = toNum(filters.priceTo);

    return homeAds
      .filter((ad) => {
        if (filters.type !== "all" && ad.type !== filters.type) return false;

        if (filters.gearbox !== "all" && ad.gearbox !== filters.gearbox)
          return false;

        if (yearFrom !== null && ad.year < yearFrom) return false;
        if (yearTo !== null && ad.year > yearTo) return false;

        if (priceFrom !== null && ad.price < priceFrom) return false;
        if (priceTo !== null && ad.price > priceTo) return false;

        if (!q) return true;

        // سرچ روی title + color + year + gearbox + type
        const hay = [
          ad.title,
          ad.color,
          String(ad.year),
          gearboxLabel(ad.gearbox),
          typeLabel(ad.type),
        ]
          .join(" ")
          .toLowerCase();

        return hay.includes(q);
      })
      .slice(0, 9);
  }, [homeAds, filters]);

  function applyAndClose() {
    onSubmit(filters);
    onClose();
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-50 bg-black/45 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            className="fixed left-1/2 top-1/2 z-50 w-[92vw] max-w-3xl -translate-x-1/2 -translate-y-1/2"
            initial={{ opacity: 0, scale: 0.96, y: 14 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: 10 }}
            transition={{ type: "spring", stiffness: 260, damping: 22 }}
          >
            <div className="rounded-3xl border border-white/10 bg-slate-950/75 p-4 shadow-2xl">
              {/* Header */}
              <div className="flex items-center justify-between mb-3">
                <div>
                  <div className="text-white/90 text-sm">جستجو و فیلتر</div>
                  <div className="text-white/45 text-xs mt-0.5">
                    نتایج داخل همین پنجره لحظه‌ای آپدیت می‌شن
                  </div>
                </div>

                <button
                  onClick={onClose}
                  className="rounded-xl px-3 py-2 text-white/70 hover:text-white hover:bg-white/5 transition"
                >
                  بستن
                </button>
              </div>

              {/* Search */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  applyAndClose();
                }}
              >
                <input
                  ref={inputRef}
                  value={filters.q}
                  onChange={(e) =>
                    setFilters((p) => ({ ...p, q: e.target.value }))
                  }
                  placeholder="مثلاً: سوناتا 2018 سفید اتومات"
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-white outline-none placeholder:text-white/40 focus:border-white/20"
                />

                {/* Filters */}
                <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-2">
                  {/* Type */}
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                    <div className="text-xs text-white/50 mb-2">نوع آگهی</div>
                    <div className="grid grid-cols-2 gap-2">
                      <Chip
                        active={filters.type === "all"}
                        onClick={() =>
                          setFilters((p) => ({ ...p, type: "all" }))
                        }
                      >
                        همه
                      </Chip>

                      <Chip
                        active={filters.type === CarAdType.UsedSale}
                        onClick={() =>
                          setFilters((p) => ({
                            ...p,
                            type: CarAdType.UsedSale,
                          }))
                        }
                      >
                        کارکرده
                      </Chip>

                      <Chip
                        active={filters.type === CarAdType.ZeroSale}
                        onClick={() =>
                          setFilters((p) => ({
                            ...p,
                            type: CarAdType.ZeroSale,
                          }))
                        }
                      >
                        صفر
                      </Chip>

                      <Chip
                        active={filters.type === CarAdType.CoopSale}
                        onClick={() =>
                          setFilters((p) => ({
                            ...p,
                            type: CarAdType.CoopSale,
                          }))
                        }
                      >
                        همکاری
                      </Chip>

                      <Chip
                        active={filters.type === CarAdType.BuyRequest}
                        onClick={() =>
                          setFilters((p) => ({
                            ...p,
                            type: CarAdType.BuyRequest,
                          }))
                        }
                      >
                        درخواست خرید
                      </Chip>
                    </div>
                  </div>

                  {/* More filters */}
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                    <div className="text-xs text-white/50 mb-2">
                      فیلترهای بیشتر
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <select
                        value={filters.gearbox}
                        onChange={(e) =>
                          setFilters((p) => ({
                            ...p,
                            gearbox:
                              e.target.value === "all"
                                ? "all"
                                : (Number(e.target.value) as GearboxType),
                          }))
                        }
                        className="w-full rounded-2xl border border-white/10 bg-slate-950/40 px-3 py-3 text-white/80 outline-none focus:border-white/20"
                      >
                        <option value="all">گیربکس (همه)</option>
                        <option value={GearboxType.Automatic}>اتومات</option>
                        <option value={GearboxType.Manual}>دنده‌ای</option>
                      </select>

                      <div className="grid grid-cols-2 gap-2">
                        <input
                          value={filters.yearFrom}
                          onChange={(e) =>
                            setFilters((p) => ({
                              ...p,
                              yearFrom: e.target.value,
                            }))
                          }
                          inputMode="numeric"
                          placeholder="سال از"
                          className="w-full rounded-2xl border border-white/10 bg-slate-950/40 px-3 py-3 text-white/80 outline-none placeholder:text-white/30 focus:border-white/20"
                        />

                        <input
                          value={filters.yearTo}
                          onChange={(e) =>
                            setFilters((p) => ({
                              ...p,
                              yearTo: e.target.value,
                            }))
                          }
                          inputMode="numeric"
                          placeholder="سال تا"
                          className="w-full rounded-2xl border border-white/10 bg-slate-950/40 px-3 py-3 text-white/80 outline-none placeholder:text-white/30 focus:border-white/20"
                        />
                      </div>

                      <div className="col-span-2 grid grid-cols-2 gap-2">
                        <input
                          value={filters.priceFrom}
                          onChange={(e) =>
                            setFilters((p) => ({
                              ...p,
                              priceFrom: e.target.value,
                            }))
                          }
                          inputMode="decimal"
                          placeholder="قیمت از (میلیون)"
                          className="w-full rounded-2xl border border-white/10 bg-slate-950/40 px-3 py-3 text-white/80 outline-none placeholder:text-white/30 focus:border-white/20"
                        />

                        <input
                          value={filters.priceTo}
                          onChange={(e) =>
                            setFilters((p) => ({
                              ...p,
                              priceTo: e.target.value,
                            }))
                          }
                          inputMode="decimal"
                          placeholder="قیمت تا (میلیون)"
                          className="w-full rounded-2xl border border-white/10 bg-slate-950/40 px-3 py-3 text-white/80 outline-none placeholder:text-white/30 focus:border-white/20"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-3 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      setFilters({
                        q: "",
                        type: "all",
                        gearbox: "all",
                        yearFrom: "",
                        yearTo: "",
                        priceFrom: "",
                        priceTo: "",
                      })
                    }
                    className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-white/70 hover:bg-white/8 transition"
                  >
                    پاک کردن
                  </button>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={onClose}
                      className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-white/80 hover:bg-white/8 transition"
                    >
                      بستن
                    </button>

                    <button
                      type="submit"
                      className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-emerald-200 hover:bg-emerald-400/15 transition"
                    >
                      اعمال روی صفحه
                    </button>
                  </div>
                </div>
              </form>

              {/* Results */}
              <div className="mt-4">
                <div className="text-xs text-white/50 mb-2">
                  نتایج ({results.length})
                </div>

                {results.length === 0 ? (
                  <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/70">
                    نتیجه‌ای پیدا نشد.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {results.map((ad) => (
                      <Link
                        key={ad.id}
                        href={`/ads/${ad.id}`}
                        onClick={onClose}
                        className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 hover:bg-white/8 transition"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <div className="text-white/90 text-sm font-medium">
                              {ad.title}
                            </div>
                            <div className="text-white/45 text-xs mt-1">
                              {typeLabel(ad.type)} • {ad.year} • {ad.color} •{" "}
                              {gearboxLabel(ad.gearbox)}
                            </div>
                          </div>

                          <div className="text-emerald-200 text-xs whitespace-nowrap">
                            {ad.price}M
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "rounded-2xl border px-3 py-2 text-sm transition",
        active
          ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-200"
          : "border-white/10 bg-white/5 text-white/70 hover:bg-white/8",
      ].join(" ")}
    >
      {children}
    </button>
  );
}
