export function decodeJwt(token: string): any | null {
  try {
    const payload = token.split(".")[1];
    const json = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(json);
  } catch {
    return null;
  }
}

export function getRoleFromToken(token: string): string | null {
  const p = decodeJwt(token);
  if (!p) return null;

  // بعضی JWTها role را اینجا می‌گذارند:
  // "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
  return (
    p["role"] ||
    p["Role"] ||
    p["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] ||
    null
  );
}

export function getUsernameFromToken(token: string | null): string | null {
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    // ما تو بک‌اند claim "username" گذاشتیم
    return payload.username || payload.unique_name || payload.name || null;
  } catch {
    return null;
  }
}
