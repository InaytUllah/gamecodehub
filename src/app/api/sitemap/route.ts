import { NextResponse } from "next/server";
import { SITE_URL, GAMES } from "@/lib/constants";
import { locales } from "@/i18n/routing";

export async function GET() {
  const now = new Date().toISOString();

  const staticPages = ["", "/about", "/contact", "/privacy"];
  const gamePages = GAMES.flatMap((game) => [
    `/${game.slug}`,
    `/${game.slug}/codes`,
    `/${game.slug}/server-status`,
    `/${game.slug}/banners`,
  ]);

  const allPaths = [...staticPages, ...gamePages];

  const urls = allPaths.flatMap((path) =>
    locales.map((locale) => {
      const url = `${SITE_URL}/${locale}${path}`;
      const alternates = locales
        .map(
          (l) =>
            `<xhtml:link rel="alternate" hreflang="${l}" href="${SITE_URL}/${l}${path}" />`
        )
        .join("\n      ");

      return `
  <url>
    <loc>${url}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>${path.includes("/codes") ? "hourly" : "daily"}</changefreq>
    <priority>${path === "" ? "1.0" : path.includes("/codes") ? "0.9" : "0.7"}</priority>
    ${alternates}
  </url>`;
    })
  );

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls.join("\n")}
</urlset>`;

  return new NextResponse(sitemap, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
