"use client";

import { useMemo, useState } from "react";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const [licenseImage, setLicenseImage] = useState<File | null>(null);

  const canSubmit = useMemo(() => {
    return (
      firstName.trim() &&
      lastName.trim() &&
      username.trim() &&
      email.trim() &&
      phone.trim() &&
      password.trim().length >= 6 &&
      licenseImage
    );
  }, [firstName, lastName, username, email, phone, password, licenseImage]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!canSubmit) {
      setError("همه فیلدهای اجباری را کامل کنید (پسورد حداقل ۶ کاراکتر).");
      return;
    }

    try {
      setLoading(true);

      const form = new FormData();
      form.append("firstName", firstName.trim());
      form.append("lastName", lastName.trim());
      form.append("username", username.trim());
      form.append("email", email.trim());
      form.append("phone", phone.trim());
      form.append("password", password);
      form.append("licenseImage", licenseImage!);

      await api.post("/api/auth/register", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      router.push("/pending");
    } catch (err: any) {
      const msg = err?.response?.data || err?.message || "خطا در ثبت‌نام";
      setError(typeof msg === "string" ? msg : "خطا در ثبت‌نام");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900">
      <div className="mx-auto max-w-lg px-4 py-10">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-md">
          <div className="text-white/90 text-xl mb-1 text-center">ثبت‌نام</div>
          <div className="text-white/45 text-sm text-center mb-6">
            اطلاعات را کامل وارد کن و تصویر مجوز را آپلود کن.
          </div>

          {error && (
            <div className="mb-4 rounded-2xl border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-rose-200 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={onSubmit} className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <Field label="نام *">
                <input
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3 text-white outline-none focus:border-white/20"
                />
              </Field>

              <Field label="نام خانوادگی *">
                <input
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3 text-white outline-none focus:border-white/20"
                />
              </Field>
            </div>

            <Field label="نام کاربری *">
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3 text-white outline-none focus:border-white/20"
              />
            </Field>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <Field label="ایمیل *">
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  inputMode="email"
                  className="w-full rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3 text-white outline-none focus:border-white/20"
                />
              </Field>

              <Field label="شماره تماس *">
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  inputMode="tel"
                  className="w-full rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3 text-white outline-none focus:border-white/20"
                />
              </Field>
            </div>

            <Field label="رمز عبور * (حداقل ۶ کاراکتر)">
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                className="w-full rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3 text-white outline-none focus:border-white/20"
              />
            </Field>

            <Field label="تصویر مجوز * (jpg/png/webp)">
              <input
                type="file"
                accept=".jpg,.jpeg,.png,.webp"
                onChange={(e) => setLicenseImage(e.target.files?.[0] ?? null)}
                className="block w-full text-white/70 text-sm
                           file:mr-3 file:rounded-2xl file:border-0
                           file:bg-emerald-400/10 file:px-4 file:py-2
                           file:text-emerald-200 hover:file:bg-emerald-400/15"
              />
              {licenseImage && (
                <div className="mt-2 text-white/45 text-xs">
                  فایل انتخاب‌شده: {licenseImage.name}
                </div>
              )}
            </Field>

            <button
              disabled={!canSubmit || loading}
              className="w-full rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-emerald-200
                         hover:bg-emerald-400/15 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {loading ? "در حال ثبت‌نام..." : "ثبت‌نام"}
            </button>

            <button
              type="button"
              onClick={() => router.push("/login")}
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white/80 hover:bg-white/8 transition"
            >
              قبلاً ثبت‌نام کردی؟ ورود
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
