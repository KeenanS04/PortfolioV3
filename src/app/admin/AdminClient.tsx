"use client";
import { useEffect, useState } from "react";
import { Marker } from "react-simple-maps";
import { Trash2, LogOut, Upload, Search, Wand2 } from "lucide-react";
import { canonicalCountry } from "@/lib/countryAliases";
import { upload } from "@vercel/blob/client";
import WorldMap from "@/components/WorldMap";
import type { TravelPin } from "@/lib/travel";

type GeoResult = {
  label: string;
  city: string;
  country?: string;
  lon: number;
  lat: number;
};

export default function AdminClient() {
  const [pins, setPins] = useState<TravelPin[]>([]);
  const [coords, setCoords] = useState<[number, number] | null>(null);
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [caption, setCaption] = useState("");
  const [files, setFiles] = useState<FileList | null>(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const [searchQ, setSearchQ] = useState("");
  const [searchResults, setSearchResults] = useState<GeoResult[]>([]);
  const [searching, setSearching] = useState(false);

  const load = async () => {
    const r = await fetch("/api/travel", { cache: "no-store" });
    const j = await r.json();
    setPins(j.pins ?? []);
  };
  useEffect(() => {
    load();
  }, []);

  const runSearch = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!searchQ.trim()) return;
    setSearching(true);
    try {
      const r = await fetch(`/api/geocode?q=${encodeURIComponent(searchQ)}`);
      const j = await r.json();
      setSearchResults(j.results ?? []);
    } finally {
      setSearching(false);
    }
  };

  const pickResult = (r: GeoResult) => {
    setCoords([r.lon, r.lat]);
    setCity(r.city);
    setCountry(r.country ?? "");
    setSearchResults([]);
    setSearchQ(r.city);
  };

  const onMapClick = async (c: [number, number]) => {
    setCoords(c);
    try {
      const r = await fetch(`/api/geocode/reverse?lon=${c[0]}&lat=${c[1]}`);
      if (!r.ok) return;
      const j = (await r.json()) as { city?: string; country?: string };
      if (j.city && !city.trim()) setCity(j.city);
      if (j.country) setCountry(j.country);
    } catch {
      /* non-fatal */
    }
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!coords || !name.trim()) {
      setMsg("Set a location (search or click the map) and enter a trip name.");
      return;
    }
    setBusy(true);
    setMsg(null);
    try {
      const urls: string[] = [];
      if (files && files.length) {
        const list = Array.from(files);
        for (let i = 0; i < list.length; i++) {
          const f = list[i];
          setMsg(`Uploading ${i + 1}/${list.length}…`);
          const ext = (f.name.split(".").pop() || "jpg").toLowerCase();
          const pathname = `travel/${Date.now()}-${i}.${ext}`;
          const blob = await upload(pathname, f, {
            access: "public",
            handleUploadUrl: "/api/travel/upload",
            contentType: f.type || "image/jpeg",
          });
          urls.push(blob.url);
        }
      }

      setMsg("Saving pin…");
      const r = await fetch("/api/travel/pins", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          city,
          country,
          lon: coords[0],
          lat: coords[1],
          caption,
          imageUrls: urls,
        }),
      });
      const text = await r.text();
      let j: { pins?: TravelPin[]; error?: string } = {};
      try {
        j = JSON.parse(text);
      } catch {
        throw new Error(text || `HTTP ${r.status}`);
      }
      if (!r.ok) throw new Error(j.error || `HTTP ${r.status}`);
      setPins(j.pins ?? []);
      setName("");
      setCity("");
      setCountry("");
      setCaption("");
      setCoords(null);
      setSearchQ("");
      setFiles(null);
      const fi = document.getElementById("files") as HTMLInputElement | null;
      if (fi) fi.value = "";
      setMsg("Pin saved.");
    } catch (e) {
      setMsg((e as Error).message);
    } finally {
      setBusy(false);
    }
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this pin?")) return;
    const r = await fetch(`/api/travel/pins?id=${encodeURIComponent(id)}`, { method: "DELETE" });
    const j = await r.json();
    if (r.ok) setPins(j.pins ?? []);
  };

  const logout = async () => {
    await fetch("/api/admin/login", { method: "DELETE" });
    window.location.reload();
  };

  const backfill = async () => {
    const missing = pins.filter((p) => !p.country).length;
    if (missing === 0) {
      setMsg("All pins already have a country.");
      return;
    }
    if (!confirm(`Reverse-geocode ${missing} pin(s) without a country? Takes ~${missing * 1.1}s.`)) {
      return;
    }
    setBusy(true);
    setMsg(`Backfilling ${missing} pin(s)…`);
    try {
      const r = await fetch("/api/travel/backfill", { method: "POST" });
      const j = await r.json();
      if (!r.ok) throw new Error(j.error || `HTTP ${r.status}`);
      setPins(j.pins ?? []);
      setMsg(`Backfilled ${j.touched} of ${j.total}.`);
    } catch (e) {
      setMsg((e as Error).message);
    } finally {
      setBusy(false);
    }
  };

  const canonicalVisited = Array.from(
    new Set(pins.map((p) => canonicalCountry(p.country)).filter((c): c is string => !!c))
  ).sort();

  return (
    <div className="grid lg:grid-cols-2 gap-6 items-start">
      <div className="glass noise overflow-hidden">
        <WorldMap onClick={onMapClick}>
          {pins.map((p) => (
            <Marker key={p.id} coordinates={p.coords}>
              <circle r={2.5} fill="#22d3ee" />
            </Marker>
          ))}
          {coords && (
            <Marker coordinates={coords}>
              <circle r={6} fill="#f472b6" fillOpacity={0.3} />
              <circle r={3} fill="#f472b6" />
            </Marker>
          )}
        </WorldMap>
        <div className="px-3 py-2 text-xs text-white/50 border-t border-white/5">
          Search for a city or click the map to drop a marker.
          {coords && (
            <span className="ml-2 text-pink-300">
              {coords[1].toFixed(2)}, {coords[0].toFixed(2)}
            </span>
          )}
        </div>
      </div>

      <form onSubmit={submit} className="glass noise p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-medium text-white">New pin</h2>
          <button
            type="button"
            onClick={logout}
            className="text-xs text-white/50 hover:text-white inline-flex items-center gap-1"
          >
            <LogOut size={12} /> Logout
          </button>
        </div>

        <div className="relative">
          <Field label="Search city">
            <div className="flex gap-2">
              <input
                value={searchQ}
                onChange={(e) => setSearchQ(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    runSearch();
                  }
                }}
                placeholder="San Francisco, Tokyo, …"
                className="flex-1 bg-white/5 border border-white/10 rounded-md px-3 py-2 text-sm outline-none focus:border-white/30"
              />
              <button
                type="button"
                onClick={() => runSearch()}
                disabled={searching || !searchQ.trim()}
                className="glass px-3 py-2 text-sm text-white/80 hover:text-white hover:bg-white/10 disabled:opacity-50 inline-flex items-center gap-1"
              >
                <Search size={14} />
                {searching ? "…" : "Find"}
              </button>
            </div>
          </Field>
          {searchResults.length > 0 && (
            <ul className="absolute z-10 mt-1 left-0 right-0 glass noise max-h-60 overflow-y-auto divide-y divide-white/5">
              {searchResults.map((r, i) => (
                <li key={i}>
                  <button
                    type="button"
                    onClick={() => pickResult(r)}
                    className="w-full text-left px-3 py-2 text-sm text-white/80 hover:bg-white/10"
                  >
                    <div className="truncate">{r.city}{r.country ? `, ${r.country}` : ""}</div>
                    <div className="text-[11px] text-white/40 truncate">{r.label}</div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <Field label="Trip name (shown on the pin)">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="SF 2026 with Alex"
            className="w-full bg-white/5 border border-white/10 rounded-md px-3 py-2 text-sm outline-none focus:border-white/30"
          />
        </Field>

        <Field label="City (groups trips with the same city)">
          <input
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="San Francisco"
            className="w-full bg-white/5 border border-white/10 rounded-md px-3 py-2 text-sm outline-none focus:border-white/30"
          />
        </Field>

        <Field label="Country (highlights on the map)">
          <input
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            placeholder="United States"
            className="w-full bg-white/5 border border-white/10 rounded-md px-3 py-2 text-sm outline-none focus:border-white/30"
          />
        </Field>

        <Field label="Caption (optional)">
          <textarea
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            rows={2}
            placeholder="A few words about this trip"
            className="w-full bg-white/5 border border-white/10 rounded-md px-3 py-2 text-sm outline-none focus:border-white/30 resize-none"
          />
        </Field>

        <Field label="Images">
          <input
            id="files"
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => setFiles(e.target.files)}
            className="w-full text-sm text-white/70 file:mr-3 file:px-3 file:py-1.5 file:rounded-md file:border file:border-white/10 file:bg-white/5 file:text-white/80 file:text-xs hover:file:bg-white/10"
          />
        </Field>

        <button
          type="submit"
          disabled={busy || !coords || !name.trim()}
          className="w-full glass gradient-border px-4 py-2.5 text-sm font-medium text-white hover:bg-white/10 disabled:opacity-50 inline-flex items-center justify-center gap-2"
        >
          <Upload size={14} />
          {busy ? "Saving…" : "Save pin"}
        </button>
        {msg && <div className="text-xs text-white/60">{msg}</div>}
      </form>

      <div className="lg:col-span-2 glass noise p-5">
        <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
          <div className="text-xs uppercase tracking-[0.22em] text-cyan-300/80">
            Existing pins ({pins.length})
          </div>
          <button
            type="button"
            onClick={backfill}
            disabled={busy || pins.every((p) => p.country)}
            className="text-xs glass px-2.5 py-1 text-white/80 hover:text-white hover:bg-white/10 disabled:opacity-40 inline-flex items-center gap-1.5"
          >
            <Wand2 size={12} /> Backfill countries
          </button>
        </div>
        {canonicalVisited.length > 0 && (
          <div className="mb-4 text-[11px] text-white/40">
            Highlighted on map: {canonicalVisited.join(" · ")}
          </div>
        )}
        {pins.length === 0 ? (
          <div className="text-sm text-white/50">No pins yet.</div>
        ) : (
          <ul className="divide-y divide-white/5">
            {pins.map((p) => (
              <li key={p.id} className="py-3 flex items-center gap-4">
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-white truncate">{p.name}</div>
                  <div className="text-xs text-white/50 truncate">
                    {[p.city, p.country].filter(Boolean).join(", ")}
                    {p.city || p.country ? " · " : ""}
                    {p.coords[1].toFixed(2)}, {p.coords[0].toFixed(2)} · {p.images.length} image
                    {p.images.length === 1 ? "" : "s"}
                  </div>
                </div>
                {p.images[0] && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={p.images[0]} alt="" className="h-10 w-10 rounded-md object-cover" />
                )}
                <button
                  onClick={() => remove(p.id)}
                  className="h-8 w-8 grid place-items-center rounded-full text-rose-300/80 hover:text-rose-200 hover:bg-rose-500/10"
                  aria-label="Delete"
                >
                  <Trash2 size={14} />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <div className="text-[10px] uppercase tracking-[0.22em] text-white/50 mb-1.5">{label}</div>
      {children}
    </label>
  );
}
