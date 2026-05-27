/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: "https://www.wholara.org",
  generateRobotsTxt: true,
  generateIndexSitemap: false,
  exclude: ["/*", "/**"],
  additionalPaths: async (config) => {
    const paths = [
      "/",
      "/ask",
      "/corporate-wellness",
      "/individual-consulting",
      "/packages",
      "/about",
      "/work-with-me",
      "/consultation",
    ];
    return paths.map((loc) => ({
      loc,
      changefreq: config.changefreq,
      priority: loc === "/" ? 1.0 : config.priority,
      lastmod: new Date().toISOString(),
    }));
  },
};
