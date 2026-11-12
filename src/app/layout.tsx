import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ایران‌مارت | جست‌وجو و مقایسه",
  description: "جست‌وجو و مقایسه کالاها و خدمات در منابع ایرانی",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="fa" dir="rtl"><body>{children}</body></html>;
}
