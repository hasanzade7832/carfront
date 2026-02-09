"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { getUsernameFromToken } from "@/lib/jwt";

function NavItem({ href, label }: { href: string; label: string }) {
  const path = usePathname();
  const active = path === href;

  return (
    <Link
      href={href}
      className={[
        "rounded-2xl border px-4 py-2 text-sm transition",
        active
          ? "border-white/30 bg-white/10 text-white"
          : "border-white/15 bg-white/5 text-white hover:bg-white/10",
      ].join(" ")}
    >
      {label}
    </Link>
  );
}

export default function AdminShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const role = useAuthStore((s) => s.role);
  const token = useAuthStore((s) => s.token);
  const logout = useAuthStore((s) => s.logout);

  const username = getUsernameFromToken(token);
  const centerTitle =
    role === "SuperAdmin" ? "SUPER ADMIN" : username ? username : "ADMIN";

  return (
    <div
      dir="rtl"
      className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900 text-right"
    >
      <header className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/60 backdrop-blur-xl">
        <div className="mx-auto max-w-6xl px-4 py-5 flex items-center justify-between">
          <div className="flex-1" />

          {/* ✅ Center Title */}
          <div className="flex flex-col items-center justify-center flex-none">
            <div className="text-white text-xl font-semibold tracking-[0.2em]">
              {centerTitle}
            </div>
            <div className="mt-2 h-px w-36 bg-white/25" />
          </div>

          {/* ✅ Logout Red */}
          <div className="flex-1 flex justify-end">
            <button
              onClick={() => {
                logout();
                location.href = "/login";
              }}
              className="rounded-2xl border border-rose-400/25 bg-rose-400/10 px-4 py-2 text-white hover:bg-rose-400/15 transition"
            >
              خروج
            </button>
          </div>
        </div>

        <div className="mx-auto max-w-6xl px-4 pb-4">
          <div className="flex flex-wrap justify-center gap-2">
            <NavItem href="/admin" label="داشبورد" />
            <NavItem href="/admin/ads" label="آگهی‌های در انتظار" />
            <NavItem
              href="/admin/license?tab=pending"
              label="مجوزهای در انتظار"
            />
            <NavItem
              href="/admin/license?tab=approved"
              label="مجوزهای تایید شده"
            />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
    </div>
  );
}
