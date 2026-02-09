"use client";

import { useEffect, useState } from "react";
import AdminGuard from "@/app/admin/AdminGuard";
import AdminShell from "@/app/admin/AdminShell";
import { api } from "@/lib/api";
import { useAuthStore } from "@/store/useAuthStore";

type PendingAd = {
  id: number;
  type: number;
  title: string;
  year: number;
  color: string;
  mileageKm: number;
  price: number;
  gearbox: number;
  chassisNumber: string;
  createdAt: string;
  userId: number;
};

export default function AdminPendingAdsPage() {
  const role = useAuthStore((s) => s.role);
  const isSuper = role === "SuperAdmin";

  const [items, setItems] = useState<PendingAd[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  async function load() {
    setErr(null);
    setLoading(true);
    try {
      const res = await api.get<PendingAd[]>("/api/carads/pending");
      setItems(res.data);
    } catch (e: any) {
      setErr(e?.response?.data || "خطا در دریافت لیست");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function approve(id: number) {
    await api.post(`/api/carads/${id}/approve`);
    setItems((p) => p.filter((x) => x.id !== id));
  }

  async function reject(id: number) {
    await api.post(`/api/carads/${id}/reject`);
    setItems((p) => p.filter((x) => x.id !== id));
  }

  return (
    <AdminGuard>
      <AdminShell>
        <div className="flex items-center justify-between mb-4">
          {/* <div className="text-white/90 text-lg">آگهی‌های در انتظار بررسی</div> */}
          {/* <button
            onClick={load}
            className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-white/70 hover:bg-white/8 transition"
          >
            رفرش لیست
          </button> */}
        </div>

        {!isSuper && (
          <div className="mb-4 rounded-2xl border border-amber-400/20 bg-amber-400/10 px-4 py-3 text-amber-200 text-sm">
            شما ادمین معمولی هستی؛ فقط مشاهده داری. تایید/رد فقط برای سوپرادمین
            فعال است.
          </div>
        )}

        {err && (
          <div className="mb-4 rounded-2xl border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-rose-200 text-sm">
            {err}
          </div>
        )}

        {loading ? (
          <div className="text-white/60">در حال دریافت...</div>
        ) : items.length === 0 ? (
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-white/70">
            فعلاً آگهی در انتظار نداریم.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {items.map((ad) => (
              <div
                key={ad.id}
                className="rounded-3xl border border-white/10 bg-white/5 p-5"
              >
                <div className="text-white/90 font-medium">{ad.title}</div>
                <div className="text-white/45 text-xs mt-2">
                  سال: {ad.year} • رنگ: {ad.color} • کارکرد: {ad.mileageKm}km
                </div>
                <div className="text-emerald-200 text-sm mt-3">
                  {ad.price} میلیون
                </div>

                <div className="mt-4 flex gap-2">
                  <button
                    disabled={!isSuper}
                    onClick={() => approve(ad.id)}
                    className="flex-1 rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-emerald-200
                               hover:bg-emerald-400/15 disabled:opacity-40 disabled:cursor-not-allowed transition"
                  >
                    تایید
                  </button>
                  <button
                    disabled={!isSuper}
                    onClick={() => reject(ad.id)}
                    className="flex-1 rounded-2xl border border-rose-400/20 bg-rose-400/10 px-4 py-2 text-rose-200
                               hover:bg-rose-400/15 disabled:opacity-40 disabled:cursor-not-allowed transition"
                  >
                    رد
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </AdminShell>
    </AdminGuard>
  );
}
