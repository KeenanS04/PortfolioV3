import { cookies } from "next/headers";

export const ADMIN_COOKIE = "admin-token";

export async function isAdmin(): Promise<boolean> {
  const pw = process.env.ADMIN_PASSWORD;
  if (!pw) return false;
  const jar = await cookies();
  const token = jar.get(ADMIN_COOKIE)?.value;
  if (!token) return false;
  return timingSafeEqual(token, pw);
}

export function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let out = 0;
  for (let i = 0; i < a.length; i++) out |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return out === 0;
}
