"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useParams, useRouter } from "next/navigation";

export default function AdDetailsPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get(`/api/ads/${params.id}`);
        setData(res.data);
      } catch (e: any) {
        setErr(e?.response?.data ?? "آگهی پیدا نشد");
      }
    })();
  }, [params.id]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 px-4 py-10">
      <div className="mx-auto max-w-3xl">
        <button
          onClick={() => router.back()}
          className="mb-4 rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-white/80 hover:bg-white/8 transition"
        >
          برگشت
        </button>

        {err && (
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-white/80">
            {err}
          </div>
        )}

        {data && (
          <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-white text-2xl font-semibold">
                  {data.title}
                </div>
                <div className="text-white/45 text-sm mt-1">
                  {new Date(data.createdAt).toLocaleDateString("fa-IR")}
                </div>
              </div>

              <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-emerald-200">
                {data.price} میلیون تومان
              </div>
            </div>

            <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-3 text-white/80">
              <Info label="سال ساخت" value={data.year} />
              <Info label="رنگ" value={data.color} />
              <Info
                label="کارکرد"
                value={`${Number(data.mileageKm).toLocaleString()} km`}
              />
              <Info
                label="گیربکس"
                value={
                  data.gearbox === 1
                    ? "اتومات"
                    : data.gearbox === 2
                    ? "دنده‌ای"
                    : "—"
                }
              />
              <Info label="مهلت بیمه" value={data.insuranceMonths ?? "—"} />
              <Info label="شماره شاسی" value={data.chassisNumber} />
            </div>

            <div className="mt-6">
              <div className="text-white/60 text-sm mb-2">توضیحات</div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-white/80 whitespace-pre-wrap">
                {data.description || "—"}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Info({ label, value }: { label: string; value: any }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
      <div className="text-xs text-white/45 mb-1">{label}</div>
      <div className="text-white/90">{String(value)}</div>
    </div>
  );
}
