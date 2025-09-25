import { existsSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";

const sitemapFiles: { path: string; lastmod: string }[] = [];

for (const project of readdirSync("./docs", {
    withFileTypes: true,
})) {
    if (!project.isDirectory() || project.name === "assets") continue;
    for (const version of readdirSync(`./docs/${project.name}`, {
        withFileTypes: true,
    })) {
        if (!version.isDirectory() || !existsSync(`./docs/${project.name}/${version.name}/sitemap.xml`)) continue;
        sitemapFiles.push({
            path: `/${project.name}/${version.name}/sitemap.xml`,
            lastmod: statSync(`./docs/${project.name}/${version.name}/sitemap.xml`).mtime.toISOString() /* .split("T")[0] */,
        });
    }
}

if (existsSync("./docs/sitemap.xml")) {
    sitemapFiles.unshift({
        path: "/sitemap.xml",
        lastmod: statSync("./docs/sitemap.xml").mtime.toISOString() /* .split("T")[0] */,
    });
}

const sitemapContents = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${sitemapFiles.length > 0 ? "\n" : ""}${sitemapFiles
    .map(
        (sitemap) =>
            `    <sitemap>
        <loc>https://docs.api.8crafter.com${sitemap.path}</loc>
        <lastmod>${sitemap.lastmod}</lastmod>
    </sitemap>`
    )
    .join("\n")}
</sitemapindex>` as const;

if (sitemapContents !== readFileSync("./docs/sitemap_index.xml", "binary")) {
    writeFileSync("./docs/sitemap_index.xml", sitemapContents, "binary");
}
