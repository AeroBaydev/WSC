export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/admin/", "/_next/", "/private/"],
      },
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: ["/api/", "/admin/", "/_next/", "/private/"],
      },
    ],
    sitemap: "https://worldskillchallenge.com/sitemap.xml",
    host: "https://worldskillchallenge.com",
  }
}
