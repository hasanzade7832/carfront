"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";

export default function AdminGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const hydrate = useAuthStore((s) => s.hydrate);
  const role = useAuthStore((s) => s.role);
  const token = useAuthStore((s) => s.token);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  useEffect(() => {
    if (token === null) return; // هنوز hydrate نشده
    if (!token) router.replace("/login");
  }, [token, router]);

  // نقش‌ها: "Admin" یا "SuperAdmin"
  const isAdmin = role === "Admin" || role === "SuperAdmin";

  useEffect(() => {
    if (token && !isAdmin) router.replace("/");
  }, [token, isAdmin, router]);

  if (!token || !isAdmin) return null;

  return <>{children}</>;
}
