"use client";
import { useState } from "react";

export default function LoginClient() {
  const [pw, setPw] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErr(null);
    const r = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: pw }),
    });
    if (r.ok) {
      window.location.reload();
    } else {
      setErr("Wrong password.");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="glass noise p-6 max-w-sm">
      <label className="block text-xs uppercase tracking-[0.22em] text-white/50 mb-2">
        Password
      </label>
      <input
        type="password"
        autoFocus
        value={pw}
        onChange={(e) => setPw(e.target.value)}
        className="w-full bg-white/5 border border-white/10 rounded-md px-3 py-2 text-sm text-white outline-none focus:border-white/30"
      />
      {err && <div className="mt-2 text-xs text-rose-300">{err}</div>}
      <button
        type="submit"
        disabled={loading}
        className="mt-4 w-full glass px-4 py-2 text-sm font-medium text-white hover:bg-white/10 disabled:opacity-50"
      >
        {loading ? "…" : "Unlock"}
      </button>
    </form>
  );
}
