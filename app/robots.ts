import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/config/site";

export default function robots(): MetadataRoute.Robots {
  const base = siteUrl();
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // 결과 페이지는 개인 입력(생년월일 등)이 URL에 담기므로 색인 제외
      disallow: "/result",
    },
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
