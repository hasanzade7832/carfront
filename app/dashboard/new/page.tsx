"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { api, setAuthToken } from "@/lib/api";
import { getToken } from "@/lib/auth";
import { useAuthStore } from "@/store/useAuthStore";
import { CarAdType, GearboxType } from "@/lib/types";

type CreateCarAdDto = {
  type: CarAdType;
  title: string;
  year: number;
  color: string;
  mileageKm: number;
  insuranceMonths?: number | null;
  gearbox: GearboxType;
  chassisNumber: string;
  price: number; // میلیون تومان
  description?: string;
};

const TABS: { label: string; value: CarAdType; hint: string }[] = [
  {
    label: "فروش کارکرده",
    value: CarAdType.UsedSale,
    hint: "آگهی فروش خودرو کارکرده",
  },
  {
    label: "فروش همکاری",
    value: CarAdType.CoopSale,
    hint: "آگهی فروش به صورت همکاری",
  },
  {
    label: "درخواست خرید",
    value: CarAdType.BuyRequest,
    hint: "اگر دنبال خرید هستی",
  },
  { label: "فروش صفر", value: CarAdType.ZeroSale, hint: "آگهی فروش خودرو صفر" },
];

function toNumberSafe(v: string) {
  const n = Number(v);
  return Number.isFinite(n) ? n : NaN;
}

export default function NewAdPage() {
  const router = useRouter();
  const auth = useAuthStore();

  const [tab, setTab] = useState<CarAdType>(CarAdType.UsedSale);

  const [title, setTitle] = useState("");
  const [year, setYear] = useState("");
  const [color, setColor] = useState("");
  const [mileageKm, setMileageKm] = useState("");
  const [insuranceMonths, setInsuranceMonths] = useState("");
  const [gearbox, setGearbox] = useState<GearboxType>(GearboxType.None);
  const [chassisNumber, setChassisNumber] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    auth.hydrate();
    const token = getToken();
    if (!token) {
      router.replace("/auth");
      return;
    }
    setAuthToken(token);
  }, []);

  const activeHint = useMemo(
    () => TABS.find((t) => t.value === tab)?.hint ?? "",
    [tab]
  );

  const validation = useMemo(() => {
    const y = toNumberSafe(year);
    const km = toNumberSafe(mileageKm);
    const p = toNumberSafe(price);
    const ins = insuranceMonths.trim() ? toNumberSafe(insuranceMonths) : null;

    const errors: string[] = [];
    if (!title.trim()) errors.push("نام خودرو را وارد کن");
    if (!Number.isInteger(y) || y <= 0)
      errors.push("سال ساخت باید عدد صحیح باشد");
    if (!color.trim()) errors.push("رنگ را وارد کن");
    if (!Number.isInteger(km) || km < 0)
      errors.push("کارکرد باید عدد (0 یا بیشتر) باشد");
    if (ins !== null && (!Number.isInteger(ins) || ins < 0))
      errors.push("مهلت بیمه باید عدد (ماه) باشد");
    if (gearbox === GearboxType.None) errors.push("نوع گیربکس را انتخاب کن");
    if (!chassisNumber.trim()) errors.push("شماره شاسی را وارد کن");
    if (!Number.isFinite(p) || p <= 0)
      errors.push("قیمت را به میلیون تومان وارد کن (مثلاً 12 یا 120.5)");

    return {
      ok: errors.length === 0,
      errors,
      dto: {
        type: tab,
        title: title.trim(),
        year: y,
        color: color.trim(),
        mileageKm: km,
        insuranceMonths: ins,
        gearbox,
        chassisNumber: chassisNumber.trim(),
        price: p,
        description: description?.trim() ?? "",
      } as CreateCarAdDto,
    };
  }, [
    tab,
    title,
    year,
    color,
    mileageKm,
    insuranceMonths,
    gearbox,
    chassisNumber,
    price,
    description,
  ]);

  async function submit() {
    setMsg(null);
    if (!validation.ok) {
      setMsg(validation.errors[0]);
      return;
    }

    setLoading(true);
    try {
      await api.post("/api/ads", validation.dto);
      // بدون رفرش: ادمین‌ها رویداد CarAdPending رو همون لحظه می‌گیرن.
      // کاربر هم می‌ره my-ads و بعداً با CarAdStatusChanged آپدیت می‌شه.
      router.push("/dashboard/my-ads");
    } catch (e: any) {
      setMsg(e?.response?.data ?? "خطا در ثبت آگهی");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 px-4 py-8">
      <div className="mx-auto max-w-4xl">
        <div className="flex items-center justify-between gap-3 mb-5">
          <div>
            <div className="text-white text-xl">ثبت آگهی جدید</div>
            <div className="text-white/50 text-sm mt-1">{activeHint}</div>
          </div>
          <button
            onClick={() => router.push("/dashboard")}
            className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-white/80 hover:bg-white/8 transition"
          >
            برگشت
          </button>
        </div>

        {/* Tabs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-5">
          {TABS.map((t) => (
            <button
              key={t.value}
              onClick={() => setTab(t.value)}
              className={[
                "rounded-2xl px-4 py-3 border text-sm transition",
                tab === t.value
                  ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-200"
                  : "border-white/10 bg-white/5 text-white/70 hover:bg-white/8",
              ].join(" ")}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Form Card */}
        <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md p-5 shadow-2xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Field label="نام خودرو *">
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="مثلاً: سوناتا LF"
                className={inputCls}
              />
            </Field>

            <Field label="سال ساخت * (عدد)">
              <input
                value={year}
                onChange={(e) => setYear(e.target.value)}
                inputMode="numeric"
                placeholder="مثلاً: 1401 یا 2018"
                className={inputCls}
              />
            </Field>

            <Field label="رنگ *">
              <input
                value={color}
                onChange={(e) => setColor(e.target.value)}
                placeholder="مثلاً: سفید"
                className={inputCls}
              />
            </Field>

            <Field label="کارکرد (کیلومتر) *">
              <input
                value={mileageKm}
                onChange={(e) => setMileageKm(e.target.value)}
                inputMode="numeric"
                placeholder="مثلاً: 0 یا 85000"
                className={inputCls}
              />
            </Field>

            <Field label="مهلت بیمه (ماه)">
              <input
                value={insuranceMonths}
                onChange={(e) => setInsuranceMonths(e.target.value)}
                inputMode="numeric"
                placeholder="مثلاً: 6"
                className={inputCls}
              />
            </Field>

            <Field label="گیربکس *">
              <select
                value={gearbox}
                onChange={(e) =>
                  setGearbox(Number(e.target.value) as GearboxType)
                }
                className={inputCls}
              >
                <option value={GearboxType.None}>انتخاب کنید</option>
                <option value={GearboxType.Automatic}>اتومات</option>
                <option value={GearboxType.Manual}>دنده ای</option>
              </select>
            </Field>

            <Field label="شماره شاسی *">
              <input
                value={chassisNumber}
                onChange={(e) => setChassisNumber(e.target.value)}
                placeholder="VIN / شماره شاسی"
                className={inputCls}
              />
            </Field>

            <Field label="قیمت * (میلیون تومان)">
              <input
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                inputMode="decimal"
                placeholder="مثلاً: 12 یا 120.5"
                className={inputCls}
              />
              <div className="text-xs text-white/40 mt-1">
                ورودی شما بر اساس «میلیون تومان» ذخیره می‌شود.
              </div>
            </Field>
          </div>

          <div className="mt-4">
            <div className="text-white/70 text-sm mb-2">توضیحات</div>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={5}
              placeholder="وضعیت فنی، بدنه، رنگ‌شدگی، آپشن‌ها و..."
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-white/40 focus:border-white/20"
            />
          </div>

          {msg && (
            <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/80">
              {msg}
            </div>
          )}

          <div className="mt-5 flex items-center justify-between gap-3">
            <div className="text-xs text-white/40">
              بعد از ثبت، آگهی برای ادمین‌ها در لحظه ارسال می‌شود.
            </div>
            <button
              disabled={!validation.ok || loading}
              onClick={submit}
              className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-6 py-3 text-emerald-200 hover:bg-emerald-400/15 disabled:opacity-50 disabled:hover:bg-emerald-400/10 transition"
            >
              {loading ? "در حال ثبت..." : "ثبت آگهی"}
            </button>
          </div>

          {!validation.ok && validation.errors.length > 0 && (
            <div className="mt-3 text-xs text-white/35">
              {validation.errors.join(" • ")}
            </div>
          )}
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
      <div className="text-white/70 text-sm mb-2">{label}</div>
      {children}
    </div>
  );
}

const inputCls =
  "w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-white/40 focus:border-white/20";
