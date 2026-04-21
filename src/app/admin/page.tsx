import { isAdmin } from "@/lib/auth";
import AdminClient from "./AdminClient";
import LoginClient from "./LoginClient";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const authed = await isAdmin();
  return (
    <main className="min-h-screen px-4 pt-28 pb-16">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-semibold tracking-tight mb-6">Admin · Travel</h1>
        {authed ? <AdminClient /> : <LoginClient />}
      </div>
    </main>
  );
}
