import type { MetadataRoute } from "next";

const appUrl = process.env.APP_BASE_URL ?? "https://agent-shield-sigma.vercel.app";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/contact", "/sign-in"],
      disallow: ["/dashboard", "/agents", "/risk", "/policy", "/security", "/compliance", "/integrations", "/settings", "/api"],
    },
    sitemap: `${appUrl}/sitemap.xml`,
  };
}
