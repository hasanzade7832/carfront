import Link from "next/link";
import type { PublicAd } from "@/lib/types";

function formatPriceMillion(n: number) {
  return `${n} میلیون تومان`;
}

function gearboxLabel(v: number) {
  if (v === 1) return "اتومات";
  if (v === 2) return "دنده‌ای";
  return "—";
}

export default function AdCard({ ad }: { ad: PublicAd }) {
  return (
    <Link href={`/ads/${ad.id}`} className="block">
      <div
        className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-4 backdrop-blur-md shadow-lg transition
                      hover:-translate-y-1 hover:bg-white/8 hover:shadow-2xl"
      >
        {/* Shine (subtle) */}
        <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        <div className="pointer-events-none absolute -left-24 -top-24 h-48 w-48 rounded-full bg-white/10 blur-3xl opacity-0 transition-opacity duration-300 group-hover:opacity-60" />

        {/* Gradient border hint */}
        <div className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-white/10" />
        <div
          className="pointer-events-none absolute inset-0 rounded-3xl opacity-0 transition-opacity duration-300 hover:opacity-100"
          style={{
            background:
              "radial-gradient(600px circle at var(--x,50%) var(--y,50%), rgba(16,185,129,0.12), transparent 40%)",
          }}
        />

        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-white/95 font-semibold leading-6">
              {ad.title}
            </div>
            <div className="mt-1 text-xs text-white/45">
              {new Date(ad.createdAt).toLocaleDateString("fa-IR")}
            </div>
          </div>

          <div className="shrink-0 rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-3 py-2 text-sm text-emerald-200">
            {formatPriceMillion(ad.price)}
          </div>
        </div>

        {/* Meta pills */}
        <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
          <Pill label="سال" value={String(ad.year)} />
          <Pill label="رنگ" value={ad.color} />
          <Pill label="کارکرد" value={`${ad.mileageKm.toLocaleString()} km`} />
          <Pill label="گیربکس" value={gearboxLabel(ad.gearbox)} />
        </div>

        {/* Footer hint */}
        <div className="mt-4 flex items-center justify-between">
          <div className="text-xs text-white/40">مشاهده جزئیات</div>
          <div className="text-xs text-white/40">#{ad.id}</div>
        </div>
      </div>
    </Link>
  );
}

function Pill({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-white/80">
      <div className="text-[11px] text-white/45 mb-0.5">{label}</div>
      <div className="text-sm text-white/90">{value}</div>
    </div>
  );
}
