import { Redis } from "@upstash/redis";

export type TravelPin = {
  id: string;
  name: string;
  city?: string;
  coords: [number, number]; // [lon, lat]
  caption?: string;
  images: string[];
  createdAt: string;
};

const KV_KEY = "travel:pins:v1";

function client(): Redis | null {
  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  return new Redis({ url, token });
}

export async function getPins(): Promise<TravelPin[]> {
  const r = client();
  if (!r) return [];
  const data = (await r.get<TravelPin[]>(KV_KEY)) ?? [];
  return data;
}

export async function savePins(pins: TravelPin[]): Promise<void> {
  const r = client();
  if (!r) throw new Error("KV not configured");
  await r.set(KV_KEY, pins);
}

export async function addPin(pin: TravelPin): Promise<TravelPin[]> {
  const pins = await getPins();
  pins.push(pin);
  await savePins(pins);
  return pins;
}

export async function deletePin(id: string): Promise<TravelPin[]> {
  const pins = (await getPins()).filter((p) => p.id !== id);
  await savePins(pins);
  return pins;
}
