// Tells the deployed veritygear client to drop its cache for specific pages
// right after a content save, instead of waiting out the normal ISR window
// (60s–300s depending on the page). Best-effort: never throws, so a
// misconfigured or unreachable client site never blocks an admin save.
async function revalidateClient(input: { paths?: string[]; layoutPaths?: string[] }): Promise<void> {
  const baseUrl = process.env.CLIENT_SITE_URL;
  const secret = process.env.REVALIDATE_SECRET;
  if (!baseUrl || !secret) return;

  try {
    await fetch(`${baseUrl.replace(/\/+$/, "")}/api/revalidate`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-revalidate-secret": secret },
      body: JSON.stringify(input),
    });
  } catch (err) {
    console.error("Failed to revalidate client site:", err);
  }
}

function withLocales(path: string): string[] {
  return [path, `/en${path === "/" ? "" : path}`];
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
  return revalidateClient({ paths, layoutPaths: ["/"] });
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
export function revalidateSiteWide(): Promise<void> {
  return revalidateClient({ layoutPaths: ["/"] });
}
