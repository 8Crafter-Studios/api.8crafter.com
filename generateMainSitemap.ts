import { readFileSync, rmSync, writeFileSync } from "fs";
import SitemapGenerator from "sitemap-generator";

// create generator
const generator = SitemapGenerator("https://docs.api.8crafter.com/", {
    stripQuerystring: false,
    lastMod: true,
    filepath: "./docs/sitemap-temp.xml",
});

const crawler = generator.getCrawler();
const sitemap = generator.getSitemap();

generator.on("add", (url: string): void => {
    console.log(url);
    // log url
});

generator.on("done", (): void => {
    // Format the XML file properly.
    writeFileSync(
        "./docs/sitemap-temp.xml",
        readFileSync("./docs/sitemap-temp.xml", "binary")
            .replaceAll(/(?<=\n|^) {2,}/g, "$&$&")
            .replace('standalone="yes" ?>', 'standalone="yes"?>')
    );
    if (readFileSync("./docs/sitemap.xml", "binary") !== readFileSync("./docs/sitemap-temp.xml", "binary")) {
        writeFileSync("./docs/sitemap.xml", readFileSync("./docs/sitemap-temp.xml", "binary"), "binary");
    }
    rmSync("./docs/sitemap-temp.xml");
});

// start the crawler
generator.start();
