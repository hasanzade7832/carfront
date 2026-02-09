"use client";

import { useEffect, useMemo, useState } from "react";
import { api, setAuthToken } from "@/lib/api";
import { getToken } from "@/lib/auth";
import { useRouter } from "next/navigation";
import RealtimeProvider from "@/components/RealtimeProvider";
import { useAdsStore, type MyAd } from "@/store/useAdsStore";

export default function MyAdsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState<string | null>(null);

  const myAds = useAdsStore((s) => s.myAds);
  const setMyAds = useAdsStore((s) => s.setMyAds);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      router.replace("/auth");
      return;
    }
    setAuthToken(token);

    (async () => {
      try {
        setLoading(true);
        const res = await api.get<MyAd[]>("/api/ads/mine");
        setMyAds(res.data);
      } catch (e: any) {
        setMsg(e?.response?.data ?? "خطا در دریافت آگهی‌ها");
      } finally {
        setLoading(false);
      }
    })();
  }, [setMyAds, router]);

  const sorted = useMemo(() => {
    return [...myAds].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [myAds]);

  return (
    <RealtimeProvider>
      <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 px-4 py-8">
        <div className="mx-auto max-w-4xl">
          <div className="flex items-center justify-between gap-3 mb-5">
            <div>
              <div className="text-white text-xl">آگهی‌های من</div>
              <div className="text-white/50 text-sm mt-1">
                وضعیت‌ها لحظه‌ای آپدیت می‌شوند
              </div>
            </div>
            <button
              onClick={() => router.push("/dashboard")}
              className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-white/80 hover:bg-white/8 transition"
            >
              برگشت
            </button>
          </div>

          {msg && (
            <div className="mb-4 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/80">
              {msg}
            </div>
          )}

          {loading ? (
            <div className="text-white/60">در حال بارگذاری...</div>
          ) : (
            <div className="space-y-3">
              {sorted.map((ad) => (
                <div
                  key={ad.id}
                  className="rounded-2xl border border-white/10 bg-white/5 p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-white font-medium">{ad.title}</div>
                      <div className="text-white/60 text-sm mt-1">
                        {ad.year} • {ad.color} • {ad.mileageKm.toLocaleString()}
                        km • {ad.price}M
                      </div>
                    </div>

                    <StatusPill status={ad.status} />
                  </div>
                </div>
              ))}

              {sorted.length === 0 && (
                <div className="text-white/60 text-sm">
                  هنوز آگهی ثبت نکردی.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </RealtimeProvider>
  );
}

function StatusPill({ status }: { status: string }) {
  const cls =
    status === "Approved"
      ? "border-emerald-400/25 bg-emerald-400/10 text-emerald-200"
      : status === "Rejected"
      ? "border-rose-400/25 bg-rose-400/10 text-rose-200"
      : "border-amber-400/25 bg-amber-400/10 text-amber-200";

  const label =
    status === "Approved"
      ? "تایید شد"
      : status === "Rejected"
      ? "رد شد"
      : "در انتظار";

  return (
    <div className={`rounded-2xl border px-3 py-2 text-sm ${cls}`}>{label}</div>
  );
}
