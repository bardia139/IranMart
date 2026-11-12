"use client";

import { useMemo, useState } from "react";
import { sources } from "@/lib/sources";

const categories = ["همه", "موبایل و دیجیتال", "مد و پوشاک", "خانه و آشپزخانه", "زیبایی و سلامت", "سوپرمارکت", "خودرو", "ملک", "استخدام", "کتاب", "خدمات"];
const demoItems = [
  { title: "گوشی هوشمند (نمونه نمایشی)", category: "موبایل و دیجیتال", price: "قیمت نمونه", seller: "فروشنده آزمایشی", source: "فروشگاه نمونه" },
  { title: "هدفون بی‌سیم (نمونه نمایشی)", category: "موبایل و دیجیتال", price: "قیمت نمونه", seller: "فروشنده آزمایشی", source: "فروشگاه نمونه" },
  { title: "کفش روزمره (نمونه نمایشی)", category: "مد و پوشاک", price: "قیمت نمونه", seller: "فروشنده آزمایشی", source: "فروشگاه نمونه" },
];

export default function Home() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("همه");
  const results = useMemo(() => demoItems.filter(x =>
    (category === "همه" || x.category === category) &&
    (x.title.includes(query.trim()) || !query.trim())
  ), [query, category]);

  return <main className="min-h-screen">
    <header className="bg-white border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-5 py-5 flex items-center justify-between gap-4">
        <a href="/" className="text-2xl font-black text-indigo-700">ایران‌مارت</a>
        <span className="text-sm text-slate-500">جست‌وجو و مقایسه در منابع ایرانی</span>
      </div>
    </header>
    <section className="max-w-6xl mx-auto px-5 pt-14 pb-10">
      <div className="rounded-3xl bg-gradient-to-l from-indigo-700 to-violet-600 text-white p-8 md:p-12">
        <p className="text-indigo-100 mb-3">یک جست‌وجو، چندین منبع</p>
        <h1 className="text-3xl md:text-5xl font-black leading-tight mb-5">قبل از خرید، همه‌جا را مقایسه کن</h1>
        <p className="text-indigo-100 mb-8">کالا، آگهی، ملک و فرصت‌های شغلی را در دسته‌های جداگانه جست‌وجو کن.</p>
        <div className="flex flex-col sm:flex-row gap-3">
          <input value={query} onChange={e => setQuery(e.target.value)} placeholder="نام کالا یا عبارت جست‌وجو..." className="flex-1 rounded-xl px-5 py-4 text-slate-900 outline-none" />
          <button className="rounded-xl bg-amber-300 text-slate-900 font-bold px-8 py-4" onClick={() => document.getElementById("results")?.scrollIntoView({ behavior: "smooth" })}>جست‌وجو</button>
        </div>
      </div>
    </section>
    <section className="max-w-6xl mx-auto px-5 pb-12">
      <h2 className="text-xl font-bold mb-4">دسته‌بندی‌ها</h2>
      <div className="flex flex-wrap gap-2">{categories.map(c => <button key={c} onClick={() => setCategory(c)} className={`px-4 py-2 rounded-full border text-sm ${category === c ? "bg-indigo-700 text-white border-indigo-700" : "bg-white border-slate-200"}`}>{c}</button>)}</div>
    </section>
    <section id="results" className="max-w-6xl mx-auto px-5 pb-14">
      <div className="flex justify-between items-center mb-4"><h2 className="text-xl font-bold">نتایج جست‌وجو</h2><span className="text-xs text-slate-500">اطلاعات آزمایشی</span></div>
      <div className="grid md:grid-cols-3 gap-4">{results.length ? results.map((item, i) => <article key={i} className="bg-white rounded-2xl border border-slate-200 p-5">
        <div className="h-28 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 mb-4">تصویر کالا</div>
        <p className="font-bold mb-2">{item.title}</p><p className="text-sm text-slate-500 mb-3">{item.category}</p>
        <p className="text-indigo-700 font-bold mb-2">{item.price}</p><p className="text-xs text-slate-500">{item.seller} · {item.source}</p>
      </article>) : <p className="text-slate-500">نتیجه آزمایشی برای این عبارت پیدا نشد.</p>}</div>
      <p className="mt-5 text-xs leading-6 text-slate-500">توجه: این نسخه صرفاً رابط اولیه است. قیمت‌ها، فروشندگان، امتیازها و نظرات واقعی نیستند و هنوز هیچ منبع خارجی به سامانه متصل نشده است.</p>
    </section>
    <section className="max-w-6xl mx-auto px-5 pb-16"><h2 className="text-xl font-bold mb-4">منابع در برنامه اتصال</h2><div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">{sources.map(s => <div key={s.name} className="bg-white border border-slate-200 rounded-xl p-4"><div className="font-bold">{s.name}</div><div className="text-xs text-slate-500 mt-1">{s.type} · {s.status}</div></div>)}</div></section>
    <footer className="text-center text-xs text-slate-500 py-7 border-t border-slate-200">ایران‌مارت · نسخه اولیه</footer>
  </main>;
}
