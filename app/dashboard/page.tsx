"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const auth = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    auth.hydrate();
    if (!auth.token) router.replace("/auth");
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 px-4 py-10">
      <div className="mx-auto max-w-3xl rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md p-6">
        <div className="text-white text-lg">پنل کاربر</div>
        <div className="text-white/60 text-sm mt-2">
          Role: {auth.role ?? "-"}
        </div>

        <div className="mt-5 flex gap-2">
          <button
            onClick={() => router.push("/dashboard/new")}
            className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-white/80 hover:bg-white/8"
          >
            ثبت آگهی جدید
          </button>

          <button
            onClick={() => router.push("/dashboard/my-ads")}
            className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-white/80 hover:bg-white/8"
          >
            آگهی‌های من
          </button>

          <button
            onClick={() => auth.logout()}
            className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-white/80 hover:bg-white/8"
          >
            خروج
          </button>
        </div>
      </div>
    </div>
  );
}
