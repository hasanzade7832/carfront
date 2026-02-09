"use client";

import { useMemo, useState } from "react";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";

export default function LoginPage() {
  const router = useRouter();
  const setToken = useAuthStore((s) => s.setToken);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const canSubmit = useMemo(() => {
    return phone.trim() && password.trim().length >= 6;
  }, [phone, password]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!canSubmit) {
      setError("شماره تماس و رمز عبور را درست وارد کنید.");
      return;
    }

    try {
      setLoading(true);

      const res = await api.post("/api/auth/login", {
        phone: phone.trim(),
        password,
      });

      setToken(res.data.token);

      router.push("/");
    } catch (err: any) {
      const msg = err?.response?.data || err?.message || "خطا در ورود";
      setError(typeof msg === "string" ? msg : "خطا در ورود");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900">
      <div className="mx-auto max-w-md px-4 py-16">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-md">
          <div className="text-white/90 text-xl mb-1 text-center">ورود</div>
          <div className="text-white/45 text-sm text-center mb-6">
            با شماره تماس و رمز عبور وارد شو
          </div>

          {error && (
            <div className="mb-4 rounded-2xl border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-rose-200 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={onSubmit} className="space-y-3">
            <Field label="شماره تماس *">
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                inputMode="tel"
                className="w-full rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3 text-white outline-none focus:border-white/20"
              />
            </Field>

            <Field label="رمز عبور *">
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                className="w-full rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3 text-white outline-none focus:border-white/20"
              />
            </Field>

            <button
              disabled={!canSubmit || loading}
              className="w-full rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-emerald-200
                         hover:bg-emerald-400/15 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {loading ? "در حال ورود..." : "ورود"}
            </button>

            <button
              type="button"
              onClick={() => router.push("/register")}
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white/80 hover:bg-white/8 transition"
            >
              ثبت‌نام
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="text-white/60 text-xs mb-2">{label}</div>
      {children}
    </div>
  );
}
