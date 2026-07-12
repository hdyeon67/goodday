import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import { ADSENSE_CLIENT, ADSENSE_ENABLED } from "@/lib/config/flags";
import { siteUrl } from "@/lib/config/site";

const SITE_URL = siteUrl();

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "좋은날 · 택일 추천",
    template: "%s",
  },
  description:
    "이름과 생년월일, 목적을 입력하면 향후 30일 중 좋은 날 TOP 3를 추천해 드려요. 재미와 참고용 콘텐츠입니다.",
  // 랜딩·소개 등 기본 OG 이미지(로고). 결과 페이지는 자체 OG 카드로 덮어씀.
  // metadataBase(=SITE_URL) 기준으로 절대 URL 로 해석됨 (예: https://goodday.fineboll.com/logo.png)
  openGraph: {
    type: "website",
    siteName: "좋은날",
    images: ["/logo.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Noto+Serif+KR:wght@500;700&display=swap"
        />
      </head>
      <body className="min-h-screen bg-hanji text-meok antialiased">
        {children}
        {ADSENSE_ENABLED && (
          <Script
            id="adsbygoogle-init"
            async
            strategy="afterInteractive"
            crossOrigin="anonymous"
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`}
          />
        )}
      </body>
    </html>
  );
}
