"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { sources as localSources } from "@/lib/sources";

const API_BASE = "https://iranmart-catalog-api.v80bk-85ck7f37a0-gpsy06m8h.workers.dev";
const categories = ["همه", "موبایل و دیجیتال", "مد و پوشاک", "خانه و آشپزخانه", "زیبایی و سلامت", "سوپرمارکت", "خودرو", "ملک", "استخدام", "کتاب", "خدمات"];

type LiveOffer = {
  id: number;
  sourceSlug: string;
  sourceName: string;
  sourceGroup: string;
  title: string;
  category: string | null;
  price: number;
  currency: "IRR" | "IRT";
  sellerName: string | null;
  productUrl: string;
  imageUrl: string | null;
  availability: string | null;
  condition: string;
  observedAt: string;
};

type ApiSource = {
  slug: string;
  name: string;
  group: string;
  integration: string;
  status: string;
  lastUpdated: string | null;
};

function formatPrice(price: number, currency: "IRR" | "IRT") {
  return `${new Intl.NumberFormat("fa-IR").format(Math.round(price))} ${currency === "IRT" ? "تومان" : "ریال"}`;
}

function sourceStatus(status: string) {
  if (status === "connected_with_data") return "داده دریافت شده";
  if (status === "connected") return "متصل";
  if (status === "paused") return "متوقف";
  return "نیازمند API، فید یا مجوز همکاری";
}

export default function Home() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("همه");
  const [liveResults, setLiveResults] = useState<LiveOffer[]>([]);
  const [remoteSources, setRemoteSources] = useState<ApiSource[]>([]);
  const [searching, setSearching] = useState(false);
  const [searched, setSearched] = useState(false);
  const [apiReady, setApiReady] = useState(false);
  const [apiMessage, setApiMessage] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    Promise.all([
      fetch(`${API_BASE}/health`, { signal: controller.signal }).then(r => r.ok ? r.json() : Promise.reject()),
      fetch(`${API_BASE}/sources`, { signal: controller.signal }).then(r => r.ok ? r.json() : Promise.reject())
    ]).then(([health, sourceData]) => {
      setApiReady(Boolean(health.ok));
      setRemoteSources(Array.isArray(sourceData.sources) ? sourceData.sources : []);
    }).catch(() => {
      setApiReady(false);
      setApiMessage("اتصال به سرویس جست‌وجو موقتاً برقرار نشد.");
    });
    return () => controller.abort();
  }, []);

  const sourceRows = useMemo(() => remoteSources.length ? remoteSources : localSources, [remoteSources]);

  async function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const term = query.trim();
    if (term.length < 2) {
      setApiMessage("برای جست‌وجو حداقل دو نویسه وارد کن.");
      return;
    }
    setSearching(true);
    setSearched(true);
    setApiMessage("");
    try {
      const params = new URLSearchParams({ q: term });
      if (category !== "همه") params.set("category", category);
      const response = await fetch(`${API_BASE}/search?${params.toString()}`);
      if (!response.ok) throw new Error("search_failed");
      const data = await response.json();
      setLiveResults(Array.isArray(data.offers) ? data.offers : []);
    } catch {
      setLiveResults([]);
      setApiMessage("ارتباط با سرویس جست‌وجو برقرار نشد. کمی بعد دوباره تلاش کن.");
    } finally {
      setSearching(false);
    }
  }

  return <main className="min-h-screen">
    <header className="bg-white border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-5 py-5 flex items-center justify-between gap-4">
        <a href="/" className="text-2xl font-black text-indigo-700">ایران‌مارت</a>
        <div className="flex flex-col items-end gap-1">
          <span className="text-sm text-slate-500">جست‌وجو و مقایسه در منابع ایرانی</span>
          <span className={`text-xs ${apiReady ? "text-emerald-700" : "text-amber-700"}`}>{apiReady ? "سرویس جست‌وجو متصل است" : "در حال اتصال به سرویس جست‌وجو"}</span>
        </div>
      </div>
    </header>

    <section className="max-w-6xl mx-auto px-5 pt-14 pb-10">
      <div className="rounded-3xl bg-gradient-to-l from-indigo-700 to-violet-600 text-white p-8 md:p-12">
        <p className="text-indigo-100 mb-3">یک جست‌وجو، چندین منبع</p>
        <h1 className="text-3xl md:text-5xl font-black leading-tight mb-5">قبل از خرید، همه‌جا را مقایسه کن</h1>
        <p className="text-indigo-100 mb-8">کالا، آگهی، ملک و فرصت‌های شغلی را در دسته‌های جداگانه جست‌وجو کن.</p>
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
          <input value={query} onChange={e => setQuery(e.target.value)} placeholder="نام کالا یا عبارت جست‌وجو..." className="flex-1 rounded-xl px-5 py-4 text-slate-900 outline-none" />
          <button type="submit" disabled={searching} className="rounded-xl bg-amber-300 text-slate-900 font-bold px-8 py-4 disabled:opacity-60">{searching ? "در حال جست‌وجو..." : "جست‌وجو"}</button>
        </form>
      </div>
    </section>

    <section className="max-w-6xl mx-auto px-5 pb-12">
      <h2 className="text-xl font-bold mb-4">دسته‌بندی‌ها</h2>
      <div className="flex flex-wrap gap-2">{categories.map(c => <button key={c} onClick={() => setCategory(c)} className={`px-4 py-2 rounded-full border text-sm ${category === c ? "bg-indigo-700 text-white border-indigo-700" : "bg-white border-slate-200"}`}>{c}</button>)}</div>
    </section>

    <section id="results" className="max-w-6xl mx-auto px-5 pb-14">
      <div className="flex justify-between items-center mb-4 gap-3">
        <h2 className="text-xl font-bold">نتایج جست‌وجوی زنده</h2>
        <span className="text-xs text-slate-500">{searched ? `${liveResults.length} نتیجه` : "منتظر عبارت جست‌وجو"}</span>
      </div>
      {apiMessage && <p className="mb-4 text-sm text-amber-700">{apiMessage}</p>}
      {searched && !searching && liveResults.length === 0 && <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center">
        <p className="font-bold mb-2">فعلاً نتیجه زنده‌ای برای این جست‌وجو نداریم.</p>
        <p className="text-sm text-slate-500">منابع در حال ثبت و اتصال هستند. به محض فراهم‌شدن دسترسی مجاز و دریافت داده، پیشنهادهای واقعی اینجا نمایش داده می‌شوند.</p>
      </div>}
      {!searched && <p className="text-sm text-slate-500">عبارت موردنظرت را جست‌وجو کن؛ فقط پیشنهادهایی نمایش داده می‌شوند که از منبع واقعی دریافت شده باشند.</p>}
      <div className="grid md:grid-cols-3 gap-4">{liveResults.map(item => <article key={item.id} className="bg-white rounded-2xl border border-slate-200 p-5">
        {item.imageUrl ? <img src={item.imageUrl} alt={item.title} className="h-40 w-full object-contain rounded-xl bg-white mb-4" /> : <div className="h-28 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 mb-4">تصویر موجود نیست</div>}
        <p className="font-bold mb-2">{item.title}</p>
        <p className="text-sm text-slate-500 mb-3">{item.category || item.sourceGroup}</p>
        <p className="text-indigo-700 font-bold mb-2">{formatPrice(item.price, item.currency)}</p>
        <p className="text-xs text-slate-500 mb-3">{item.sellerName || item.sourceName} · {item.sourceName}</p>
        <a href={item.productUrl} target="_blank" rel="noopener noreferrer" className="inline-block text-sm font-bold text-indigo-700 hover:underline">مشاهده در منبع اصلی ↗</a>
        <p className="mt-3 text-xs text-slate-400">آخرین بررسی: {new Date(item.observedAt).toLocaleString("fa-IR")}</p>
      </article>)}</div>
    </section>

    <section className="max-w-6xl mx-auto px-5 pb-16">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <h2 className="text-xl font-bold">همه منابع ایران‌مارت</h2>
        <span className="text-xs text-slate-500">{sourceRows.length} منبع ثبت‌شده</span>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">{sourceRows.map(s => <div key={s.slug || s.name} className="bg-white border border-slate-200 rounded-xl p-4">
        <div className="font-bold">{s.name}</div>
        <div className="text-xs text-slate-500 mt-1">{s.group} · {s.integration}</div>
        <div className={`text-xs mt-2 ${s.status === "connected_with_data" ? "text-emerald-700" : "text-amber-700"}`}>{sourceStatus(s.status)}</div>
      </div>)}</div>
      <p className="mt-5 text-xs leading-6 text-slate-500">توجه: ثبت منبع به معنی اتصال زنده نیست. اطلاعات قیمت، موجودی و فروشنده فقط پس از دریافت و اعتبارسنجی داده از API، فید یا همکاری مجاز نمایش داده می‌شود. آگهی، ملک، خودرو و استخدام در گروه‌های جداگانه نگهداری می‌شوند.</p>
    </section>

    <footer className="text-center text-xs text-slate-500 py-7 border-t border-slate-200">ایران‌مارت · جست‌وجو و مقایسه منابع ایرانی</footer>
  </main>;
}
