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
  openGraph: { type: "website", siteName: "좋은날" },
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
