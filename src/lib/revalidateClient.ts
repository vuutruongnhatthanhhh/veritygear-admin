// Tells the deployed veritygear client to drop its cache for specific pages
// right after a content save, instead of waiting out the normal ISR window
// (60s–300s depending on the page). Best-effort: never throws, so a
// misconfigured or unreachable client site never blocks an admin save.
async function revalidateClient(input: { paths?: string[]; layoutPaths?: string[] }): Promise<void> {
  const baseUrl = process.env.CLIENT_SITE_URL;
  const secret = process.env.REVALIDATE_SECRET;
  if (!baseUrl || !secret) {
    console.error("Skipping client revalidation: CLIENT_SITE_URL or REVALIDATE_SECRET is not set.");
    return;
  }

  try {
    const res = await fetch(`${baseUrl.replace(/\/+$/, "")}/api/revalidate`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-revalidate-secret": secret },
      body: JSON.stringify(input),
    });
    if (!res.ok) {
      const body = await res.text().catch(() => "");
      console.error(`Client revalidation failed: HTTP ${res.status} ${body}`.trim());
      return;
    }
    console.log("Client revalidation ok:", JSON.stringify(input));
  } catch (err) {
    console.error("Failed to revalidate client site:", err);
  }
}

// The client's URLs are unprefixed for Vietnamese (next-intl "as-needed"
// prefix: "/gioi-thieu") but the actual route files — and therefore the
// Next.js cache keys revalidatePath() must match — always live under
// app/[locale]/..., so the internal path for Vietnamese still needs the
// "/vi" segment even though it never appears in the public URL.
function withLocales(path: string): string[] {
  const suffix = path === "/" ? "" : path;
  return [`/vi${suffix}`, `/en${suffix}`];
}

export function revalidateHome(): Promise<void> {
  return revalidateClient({ paths: withLocales("/") });
}

export function revalidateShop(): Promise<void> {
  return revalidateClient({ paths: [...withLocales("/"), ...withLocales("/san-pham")] });
}

export function revalidateProduct(slug: string): Promise<void> {
  return revalidateClient({
    paths: [...withLocales("/"), ...withLocales("/san-pham"), ...withLocales(`/san-pham/${slug}`)],
  });
}

// The 3 trust badges render on every product detail page (an unbounded,
// per-slug route that can't be enumerated like revalidateProduct(slug)) —
// a full layout-wide nuke is the simplest way to reach all of them at once.
export function revalidateProductGuarantees(): Promise<void> {
  return revalidateClient({ layoutPaths: ["/[locale]"] });
}

export function revalidateNewsList(): Promise<void> {
  return revalidateClient({ paths: [...withLocales("/"), ...withLocales("/tin-tuc")] });
}

export function revalidateArticle(slug: string): Promise<void> {
  return revalidateClient({
    paths: [...withLocales("/"), ...withLocales("/tin-tuc"), ...withLocales(`/tin-tuc/${slug}`)],
  });
}

// Custom pages are linked from the footer, which renders on every page — so
// in addition to the page itself, do a full layout-wide revalidation to
// refresh that footer link list everywhere right away.
export function revalidateCustomPage(slug?: string): Promise<void> {
  const paths = slug ? [...withLocales("/"), ...withLocales(`/${slug}`)] : withLocales("/");
  return revalidateClient({ paths, layoutPaths: ["/[locale]"] });
}

export function revalidateAbout(): Promise<void> {
  // "Thống kê" and "CTA cuối trang" are shared components also rendered on /cot-moc.
  return revalidateClient({ paths: [...withLocales("/gioi-thieu"), ...withLocales("/cot-moc")] });
}

export function revalidateMilestones(): Promise<void> {
  return revalidateClient({ paths: withLocales("/cot-moc") });
}

export function revalidateContact(): Promise<void> {
  return revalidateClient({ paths: withLocales("/lien-he") });
}

// Footer tagline, social links, and site-wide SEO defaults render in the root
// layout on every single page — only a layout-wide revalidation reaches all of them.
// "/[locale]" is the literal file-structure pattern for the root layout
// (app/[locale]/layout.tsx) — this purges every page under it, in one call,
// for both locales at once (see the revalidatePath docs' "revalidating all
// data" example, adapted for this app's locale-segmented root layout).
export function revalidateSiteWide(): Promise<void> {
  return revalidateClient({ layoutPaths: ["/[locale]"] });
}
