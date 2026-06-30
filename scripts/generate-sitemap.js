import { createClient } from "@sanity/client";
import { writeFileSync } from "fs";
import "dotenv/config";

const SITE_URL = "https://hyodoproductions.com";

const client = createClient({
	projectId: process.env.VITE_SANITY_PROJECT_ID,
	dataset: process.env.VITE_SANITY_DATASET || "production",
	apiVersion: process.env.VITE_SANITY_API_VERSION || "2024-01-01",
	useCdn: false,
});

const STATIC_ROUTES = [
	{ path: "/", priority: "1.0" },
	{ path: "/work", priority: "0.9" },
	{ path: "/about", priority: "0.7" },
	{ path: "/contact", priority: "0.6" },
];

async function generate() {
	const works = await client.fetch(
		`*[_type == "work" && defined(projectId)]{ projectId, _updatedAt }`
	);

	const urls = [
		...STATIC_ROUTES.map((r) => ({
			loc: `${SITE_URL}${r.path}`,
			priority: r.priority,
		})),
		...works.map((w) => ({
			loc: `${SITE_URL}/work/${w.projectId}`,
			lastmod: w._updatedAt?.split("T")[0],
			priority: "0.8",
		})),
	];

	const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
	.map(
		(u) => `  <url>
    <loc>${u.loc}</loc>
${u.lastmod ? `    <lastmod>${u.lastmod}</lastmod>\n` : ""}    <priority>${u.priority}</priority>
  </url>`
	)
	.join("\n")}
</urlset>
`;

	writeFileSync("public/sitemap.xml", xml);
	console.log(`Generated sitemap.xml with ${urls.length} URLs`);
}

generate().catch((err) => {
	console.error("Failed to generate sitemap:", err);
	process.exitCode = 1;
});
