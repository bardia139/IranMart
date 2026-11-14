export interface Env {
  DB: D1Database;
  ADMIN_TOKEN: string;
  ALLOWED_ORIGIN?: string;
}

const SOURCES = [
  ["digikala","دیجی‌کالا","فروشگاه و بازارگاه","جست‌وجوی کالا"],
  ["technolife","تکنولایف","فروشگاه و بازارگاه","جست‌وجوی کالا"],
  ["banimode","بانی‌مد","فروشگاه و بازارگاه","جست‌وجوی کالا"],
  ["modiseh","مدیسه","فروشگاه و بازارگاه","جست‌وجوی کالا"],
  ["basalam","باسلام","فروشگاه و بازارگاه","جست‌وجوی کالا"],
  ["esam","ایسام","فروشگاه و بازارگاه","جست‌وجوی کالا"],
  ["torob","ترب","مقایسه قیمت","جست‌وجوی کالا"],
  ["emalls","ایمالز","مقایسه قیمت","جست‌وجوی کالا"],
  ["istgah","ایستگاه","عمده‌فروشی","جست‌وجوی کالا"],
  ["iran-tejarat","ایران تجارت","عمده‌فروشی","جست‌وجوی کالا"],
  ["vivastreet","ویوا استریت","فروشگاه و بازارگاه","جست‌وجوی کالا"],
  ["okala","اکالا","سوپرمارکت","جست‌وجوی کالا"],
  ["snapp-market","اسنپ‌مارکت","سوپرمارکت","جست‌وجوی کالا"],
  ["rubino","روبینو","فروشگاه و بازارگاه","جست‌وجوی کالا"],
  ["mobile140","موبایل۱۴۰","فروشگاه و بازارگاه","جست‌وجوی کالا"],
  ["khanoumi","خانومی","مد و زیبایی","جست‌وجوی کالا"],
  ["digistyle","دیجی‌استایل","مد و زیبایی","جست‌وجوی کالا"],
  ["divar","دیوار","آگهی و کالای دست‌دوم","جست‌وجوی آگهی"],
  ["sheypoor","شیپور","آگهی و کالای دست‌دوم","جست‌وجوی آگهی"],
  ["bama","باما","خودرو","جست‌وجوی آگهی"],
  ["hamrah-mechanic","همراه مکانیک","خودرو","جست‌وجوی آگهی"],
  ["khodro45","خودرو۴۵","خودرو","جست‌وجوی آگهی"],
  ["carmond","کارموند","خودرو","جست‌وجوی آگهی"],
  ["kilid","کیلید","ملک","جست‌وجوی ملک"],
  ["ihome","آی‌هوم","ملک","جست‌وجوی ملک"],
  ["melk118","ملک۱۱۸","ملک","جست‌وجوی ملک"],
  ["alibaba","علی‌بابا","سفر","جست‌وجوی کالا"],
  ["b2b-iran","B2B ایران","عمده‌فروشی","جست‌وجوی کالا"],
  ["bani-pakhsh","بانی پخش","عمده‌فروشی","جست‌وجوی کالا"],
  ["gisoom","گیسوم","کتاب و محتوا","جست‌وجوی کالا"],
  ["iran-ketab","ایران‌کتاب","کتاب و محتوا","جست‌وجوی کالا"],
  ["30book","۳۰بوک","کتاب و محتوا","جست‌وجوی کالا"],
  ["taaghche","طاقچه","کتاب و محتوا","اطلاعات و محتوا"],
  ["fidibo","فیدیبو","کتاب و محتوا","اطلاعات و محتوا"],
  ["zoomit","زومیت","فناوری و بررسی","اطلاعات و محتوا"],
  ["jobinja","جابینجا","استخدام و خدمات","جست‌وجوی شغل و خدمات"],
  ["irantalent","ایران‌تلنت","استخدام و خدمات","جست‌وجوی شغل و خدمات"],
  ["jobvision","جاب‌ویژن","استخدام و خدمات","جست‌وجوی شغل و خدمات"],
  ["ponisha","پونیشا","استخدام و خدمات","جست‌وجوی شغل و خدمات"],
  ["karlancer","کارلنسر","استخدام و خدمات","جست‌وجوی شغل و خدمات"]
] as const;

const json = (data: unknown, status = 200, origin = "*") =>
  new Response(JSON.stringify(data), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "access-control-allow-origin": origin,
      "access-control-allow-methods": "GET,POST,OPTIONS",
      "access-control-allow-headers": "Content-Type, Authorization",
      "cache-control": "no-store"
    }
  });

function safeHttpsUrl(value: unknown): string | null {
  if (typeof value !== "string" || value.length > 2048) return null;
  try {
    const u = new URL(value);
    if (u.protocol !== "https:" || u.username || u.password) return null;
    const host = u.hostname.toLowerCase();
    if (host === "localhost" || host.endsWith(".localhost") || host === "127.0.0.1" || host === "::1" || host.startsWith("10.") || host.startsWith("192.168.") || host.startsWith("172.")) return null;
    return u.toString();
  } catch { return null; }
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const origin = request.headers.get("Origin") || "";
    const allowed = env.ALLOWED_ORIGIN || "https://bardia139.github.io";
    const corsOrigin = origin === allowed ? allowed : allowed;

    if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: {
      "access-control-allow-origin": corsOrigin,
      "access-control-allow-methods": "GET,POST,OPTIONS",
      "access-control-allow-headers": "Content-Type, Authorization",
      "access-control-max-age": "86400"
    }});

    if (url.pathname === "/health" && request.method === "GET") {
      try {
        const row = await env.DB.prepare("SELECT COUNT(*) AS count FROM sources").first<{count:number}>();
        return json({ ok: true, service: "iranmart-catalog-api", sourceCount: row?.count ?? 0 }, 200, corsOrigin);
      } catch {
        return json({ ok: false, error: "database_not_initialized" }, 503, corsOrigin);
      }
    }

    if (url.pathname === "/sources" && request.method === "GET") {
      const rows = await env.DB.prepare(`
        SELECT s.slug, s.name, s.group_name AS "group", s.integration,
          CASE WHEN EXISTS (SELECT 1 FROM offers o WHERE o.source_slug=s.slug) THEN 'connected_with_data'
               ELSE s.status END AS status,
          (SELECT MAX(o.observed_at) FROM offers o WHERE o.source_slug=s.slug) AS lastUpdated
        FROM sources s ORDER BY s.group_name, s.name
      `).all();
      return json({ sources: rows.results, count: rows.results.length }, 200, corsOrigin);
    }

    if (url.pathname === "/search" && request.method === "GET") {
      const q = (url.searchParams.get("q") || "").trim().slice(0, 120);
      if (q.length < 2) return json({ offers: [], count: 0, message: "برای جست‌وجو حداقل دو نویسه وارد کنید." }, 200, corsOrigin);
      const category = url.searchParams.get("category")?.slice(0, 80) || null;
      const group = url.searchParams.get("group")?.slice(0, 80) || null;
      const rows = await env.DB.prepare(`
        SELECT o.id, o.source_slug AS sourceSlug, s.name AS sourceName, s.group_name AS sourceGroup,
          o.title, o.category, o.price, o.currency, o.seller_name AS sellerName, o.product_url AS productUrl,
          o.image_url AS imageUrl, o.availability, o.condition, o.observed_at AS observedAt
        FROM offers o JOIN sources s ON s.slug=o.source_slug
        WHERE o.price IS NOT NULL AND o.title LIKE ?1
          AND (?2 IS NULL OR o.category=?2)
          AND (?3 IS NULL OR s.group_name=?3)
        ORDER BY o.price ASC LIMIT 100
      `).bind(`%${q}%`, category, group).all();
      return json({ offers: rows.results, count: rows.results.length, query: q }, 200, corsOrigin);
    }

    if (url.pathname === "/admin/import" && request.method === "POST") {
      if (!env.ADMIN_TOKEN || request.headers.get("Authorization") !== `Bearer ${env.ADMIN_TOKEN}`) {
        return json({ error: "unauthorized" }, 401, corsOrigin);
      }
      let body: any;
      try { body = await request.json(); } catch { return json({ error: "invalid_json" }, 400, corsOrigin); }
      const sourceSlug = typeof body?.sourceSlug === "string" ? body.sourceSlug : "";
      const source = await env.DB.prepare("SELECT slug FROM sources WHERE slug=?").bind(sourceSlug).first();
      if (!source || !Array.isArray(body.items) || body.items.length < 1 || body.items.length > 500) {
        return json({ error: "invalid_source_or_items" }, 400, corsOrigin);
      }
      const statements = [];
      for (const item of body.items) {
        const title = typeof item?.title === "string" ? item.title.trim().slice(0, 300) : "";
        const productUrl = safeHttpsUrl(item?.productUrl);
        const externalId = typeof item?.externalId === "string" ? item.externalId.slice(0, 160) : "";
        const price = item?.price === null || item?.price === undefined ? null : Number(item.price);
        if (!title || !productUrl || !externalId || (price !== null && (!Number.isFinite(price) || price < 0))) continue;
        const currency = item.currency === "IRT" ? "IRT" : "IRR";
        const imageUrl = item.imageUrl ? safeHttpsUrl(item.imageUrl) : null;
        statements.push(env.DB.prepare(`
          INSERT INTO offers (source_slug, external_id, title, category, price, currency, seller_name, product_url, image_url, availability, condition, observed_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          ON CONFLICT(source_slug, external_id) DO UPDATE SET
            title=excluded.title, category=excluded.category, price=excluded.price, currency=excluded.currency,
            seller_name=excluded.seller_name, product_url=excluded.product_url, image_url=excluded.image_url,
            availability=excluded.availability, condition=excluded.condition, observed_at=excluded.observed_at
        `).bind(sourceSlug, externalId, title, String(item.category || "").slice(0,80) || null, price, currency,
          String(item.sellerName || "").slice(0,160) || null, productUrl, imageUrl,
          String(item.availability || "").slice(0,80) || null,
          ["new","used","unknown"].includes(item.condition) ? item.condition : "unknown",
          typeof item.observedAt === "string" ? item.observedAt : new Date().toISOString()));
      }
      if (!statements.length) return json({ imported: 0, error: "no_valid_items" }, 400, corsOrigin);
      await env.DB.batch(statements);
      return json({ imported: statements.length, sourceSlug }, 200, corsOrigin);
    }

    return json({ error: "not_found" }, 404, corsOrigin);
  }
};
