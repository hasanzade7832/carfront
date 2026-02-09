import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

function parseJwt(token: string): any | null {
  try {
    const base64 = token.split(".")[1];
    const json = Buffer.from(base64, "base64").toString("utf-8");
    return JSON.parse(json);
  } catch {
    return null;
  }
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (!pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  const token = req.cookies.get("token")?.value;

  // چون شما الان تو localStorage نگه می‌داری، middleware بهش دسترسی نداره.
  // پس فعلاً این middleware رو ساده می‌ذاریم و ریدایرکت رو داخل کلاینت انجام می‌دیم.
  // اگر خواستی حرفه‌ای کنیم، توکن رو می‌بریم cookie.
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
