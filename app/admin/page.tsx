"use client";

import AdminGuard from "@/app/admin/AdminGuard";
import AdminShell from "@/app/admin/AdminShell";

export default function AdminHomePage() {
  return (
    <AdminGuard>
      <AdminShell>
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-white/80">
          اینجا داشبورد پنل ادمین است. از منو بالا برو آگهی‌های Pending یا
          مجوزها.
        </div>
      </AdminShell>
    </AdminGuard>
  );
}
