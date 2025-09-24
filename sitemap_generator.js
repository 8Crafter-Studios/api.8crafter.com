import SitemapGenerator from "sitemap-generator";

// create generator
const generator = SitemapGenerator("https://docs.api.8crafter.com/", {
    stripQuerystring: false,
    lastMod: true
});

const crawler = generator.getCrawler();
const sitemap = generator.getSitemap();

sitemap.addURL("https://docs.api.8crafter.com/andexdb/index.html");

sitemap.addURL("https://docs.api.8crafter.com/mcbe-leveldb/index.html");

generator.on("add", (url) => {
    console.log(url);
    // log url
});

// register event listeners
generator.on("done", () => {
    // sitemaps created
});

// start the crawler
generator.start();
