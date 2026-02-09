"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import AdminGuard from "@/app/admin/AdminGuard";
import AdminShell from "@/app/admin/AdminShell";
import { api } from "@/lib/api";
import { useAuthStore } from "@/store/useAuthStore";

type LicenseItem = {
  id: number;
  username: string;
  phone: string;
  imageUrl: string;
  createdAt: string;
};

type TabKey = "pending" | "approved";

function fmtDate(iso: string) {
  try {
    const d = new Date(iso);
    return d.toLocaleString("fa-IR", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  } catch {
    return iso;
  }
}

export default function AdminLicensePage() {
  const role = useAuthStore((s) => s.role);
  const isSuper = role === "SuperAdmin";

  const sp = useSearchParams();
  const initialTab = (sp.get("tab") as TabKey) || "pending";

  const [tab, setTab] = useState<TabKey>(initialTab);
  const [pending, setPending] = useState<LicenseItem[]>([]);
  const [approved, setApproved] = useState<LicenseItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  const baseApi = "http://localhost:5197";

  async function loadAll() {
    setErr(null);
    try {
      const [pRes, aRes] = await Promise.all([
        api.get<LicenseItem[]>("/api/license/pending"),
        api.get<LicenseItem[]>("/api/license/approved"),
      ]);
      setPending(pRes.data ?? []);
      setApproved(aRes.data ?? []);
    } catch (e: any) {
      setErr(e?.response?.data || "خطا در دریافت لیست مجوزها");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAll();
    const t = setInterval(loadAll, 3000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    setTab(initialTab);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sp]);

  const items = useMemo(
    () => (tab === "pending" ? pending : approved),
    [tab, pending, approved]
  );

  async function approveLicense(id: number) {
    await api.post(`/api/license/${id}/approve`);
    const item = pending.find((x) => x.id === id);
    setPending((p) => p.filter((x) => x.id !== id));
    if (item) setApproved((a) => [item, ...a]);
  }

  async function rejectLicense(id: number) {
    await api.post(`/api/license/${id}/reject`);
    setPending((p) => p.filter((x) => x.id !== id));
  }

  async function downloadLicense(id: number) {
    const res = await api.get(`/api/license/${id}/download`, {
      responseType: "blob",
    });

    const blob = new Blob([res.data]);
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `license_${id}`;
    document.body.appendChild(a);
    a.click();

    a.remove();
    window.URL.revokeObjectURL(url);
  }

  return (
    <AdminGuard>
      <AdminShell>
        {err && (
          <div className="mb-4 rounded-2xl border border-rose-400/25 bg-rose-400/10 px-4 py-3 text-white text-sm text-center">
            {err}
          </div>
        )}

        {/* ✅ تب‌های پایین حذف شد (همین!) */}

        <div className="flex justify-center">
          <div className="w-full max-w-4xl">
            {loading ? (
              <div className="rounded-3xl border border-white/15 bg-white/5 p-8 text-white text-center">
                در حال دریافت لیست...
              </div>
            ) : items.length === 0 ? (
              <div className="rounded-3xl border border-white/15 bg-white/5 p-8 text-white text-center">
                {tab === "pending"
                  ? "مجوز Pending نداریم."
                  : "فعلاً مجوز تایید شده‌ای نداریم."}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {items.map((x) => {
                  const imgUrl = `${baseApi}${x.imageUrl}`;

                  return (
                    <div
                      key={x.id}
                      className="rounded-3xl border border-white/15 bg-white/6 p-5 shadow-2xl shadow-black/25"
                    >
                      <div className="text-center">
                        <div className="text-white font-semibold text-lg">
                          {x.username}
                        </div>
                        <div className="text-white text-sm mt-2">{x.phone}</div>
                        <div className="text-white/80 text-xs mt-2">
                          {fmtDate(x.createdAt)}
                        </div>
                      </div>

                      <div className="mt-5 grid grid-cols-2 gap-2">
                        <a
                          href={imgUrl}
                          target="_blank"
                          className="rounded-2xl border border-white/20 bg-white/8 px-4 py-2 text-white text-sm hover:bg-white/12 transition text-center"
                        >
                          مشاهده
                        </a>

                        <button
                          type="button"
                          onClick={() => downloadLicense(x.id)}
                          className="rounded-2xl border border-white/20 bg-white/8 px-4 py-2 text-white text-sm hover:bg-white/12 transition"
                        >
                          دانلود
                        </button>
                      </div>

                      {tab === "pending" && isSuper && (
                        <div className="mt-3 flex gap-2">
                          <button
                            onClick={() => approveLicense(x.id)}
                            className="flex-1 rounded-2xl border border-emerald-400/25 bg-emerald-400/10 px-4 py-2 text-white hover:bg-emerald-400/15 transition"
                          >
                            تایید
                          </button>
                          <button
                            onClick={() => rejectLicense(x.id)}
                            className="flex-1 rounded-2xl border border-rose-400/25 bg-rose-400/10 px-4 py-2 text-white hover:bg-rose-400/15 transition"
                          >
                            رد
                          </button>
                        </div>
                      )}

                      {tab === "approved" && (
                        <div className="mt-3 rounded-2xl border border-emerald-400/25 bg-emerald-400/10 px-4 py-2 text-white text-sm text-center">
                          تایید شده ✅
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </AdminShell>
    </AdminGuard>
  );
}
