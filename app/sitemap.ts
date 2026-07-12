import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/config/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteUrl();
  // 결과 페이지는 개인 입력이 담긴 동적 URL이라 색인 대상에서 제외
  return [
    { url: `${base}/`, changeFrequency: "monthly", priority: 1 },
    { url: `${base}/calendar`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${base}/about`, changeFrequency: "yearly", priority: 0.5 },
  ];
}
