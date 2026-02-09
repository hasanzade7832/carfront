"use client";

import { useEffect, useMemo, useState } from "react";
import { api } from "@/lib/api";
import type { PublicAd } from "@/lib/types";
import { useAdsStore } from "@/store/useAdsStore";
import RealtimeProvider from "@/components/RealtimeProvider";
import SearchDock from "@/components/home/SearchDock";
import SearchOverlay, {
  type SearchFilters,
} from "@/components/home/SearchOverlay";
import AdsGrid from "@/components/ads/AdsGrid";
import { CarAdType, GearboxType } from "@/lib/types";

function gearboxLabel(v: number) {
  if (v === 1) return "اتومات";
  if (v === 2) return "دنده‌ای";
  return "—";
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

function toNum(v: string): number | null {
  const t = v.trim();
  if (!t) return null;
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
}

export default function HomePage() {
  const [searchOpen, setSearchOpen] = useState(false);

  const [filters, setFilters] = useState<SearchFilters>({
    q: "",
    type: "all",
    gearbox: "all",
    yearFrom: "",
    yearTo: "",
    priceFrom: "",
    priceTo: "",
  });

  const homeAds = useAdsStore((s) => s.homeAds);
  const setHomeAds = useAdsStore((s) => s.setHomeAds);

  useEffect(() => {
    (async () => {
      const res = await api.get<PublicAd[]>("/api/ads");
      setHomeAds(res.data);
    })();
  }, [setHomeAds]);

  const filtered = useMemo(() => {
    const q = filters.q.trim().toLowerCase();
    const yearFrom = toNum(filters.yearFrom);
    const yearTo = toNum(filters.yearTo);
    const priceFrom = toNum(filters.priceFrom);
    const priceTo = toNum(filters.priceTo);

    return homeAds.filter((ad) => {
      // type
      if (filters.type !== "all" && ad.type !== filters.type) return false;

      // gearbox
      if (filters.gearbox !== "all" && ad.gearbox !== filters.gearbox)
        return false;

      // year range
      if (yearFrom !== null && ad.year < yearFrom) return false;
      if (yearTo !== null && ad.year > yearTo) return false;

      // price range
      if (priceFrom !== null && ad.price < priceFrom) return false;
      if (priceTo !== null && ad.price > priceTo) return false;

      // search on title + color + year + gearbox + type
      if (!q) return true;

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
    });
  }, [homeAds, filters]);

  return (
    <RealtimeProvider>
      <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900">
        <header className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/70 backdrop-blur-md">
          <div className="mx-auto max-w-6xl px-4 py-4">
            <div className="text-white/90 text-lg mb-3 text-center">
              بانک خودرو همکاران
            </div>

            {/* سرچ بالای صفحه */}
            <SearchDock onOpen={() => setSearchOpen(true)} />
          </div>
        </header>

        <SearchOverlay
          open={searchOpen}
          onClose={() => setSearchOpen(false)}
          onSubmit={(f) => setFilters(f)}
        />

        <main className="mx-auto max-w-6xl px-4 py-8">
          <div className="mb-4 text-white/70 text-sm flex items-center justify-between gap-3">
            <div>{filtered.length.toLocaleString("fa-IR")} آگهی تایید شده</div>

            {/* خلاصه فیلترها */}
            <button
              onClick={() => setSearchOpen(true)}
              className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-white/70 hover:bg-white/8 transition"
            >
              فیلتر/جستجو
            </button>
          </div>

          <AdsGrid ads={filtered} />
        </main>
      </div>
    </RealtimeProvider>
  );
}
