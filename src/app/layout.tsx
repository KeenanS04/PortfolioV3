import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Keenan Serrao — Data Analyst & ML Engineer",
  description:
    "Portfolio of Keenan Serrao — Data Analyst at Toyota Financial Services, UCSD Data Science grad, building ML and data systems.",
  icons: { icon: "/favicon.svg" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body
        className="min-h-screen antialiased selection:bg-violet-500/40"
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
