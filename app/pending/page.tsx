"use client";

import { useRouter } from "next/navigation";

export default function PendingPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900">
      <div className="mx-auto max-w-lg px-4 py-16">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-7 shadow-2xl backdrop-blur-md text-center">
          <div className="text-white/90 text-xl mb-2">✅ ثبت‌نام انجام شد</div>
          <div className="text-white/50 text-sm leading-7">
            مجوز شما در انتظار بررسی است. بعد از تایید سوپرادمین، می‌تونی وارد
            بشی و آگهی ثبت کنی.
          </div>

          <div className="mt-6 flex gap-2 justify-center">
            <button
              onClick={() => router.push("/login")}
              className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-5 py-3 text-emerald-200 hover:bg-emerald-400/15 transition"
            >
              رفتن به صفحه ورود
            </button>

            <button
              onClick={() => router.push("/")}
              className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-white/80 hover:bg-white/8 transition"
            >
              صفحه اصلی
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
