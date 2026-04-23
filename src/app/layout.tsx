import type { Metadata } from "next";
import "./globals.css";
import ThemeProvider from "@/components/ThemeProvider";

export const metadata: Metadata = {
  title: "Keenan Serrao — Data Analyst & ML Engineer",
  description:
    "Portfolio of Keenan Serrao — Data Analyst at Toyota Financial Services, UCSD Data Science grad, building ML and data systems.",
  icons: { icon: "/favicon.svg" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className="min-h-screen antialiased selection:bg-violet-500/40"
        suppressHydrationWarning
      >
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
