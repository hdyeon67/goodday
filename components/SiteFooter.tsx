import { Footer } from "./footer";

/** 좋은날 서비스 표준 푸터 — EDEN 표준 푸터에 서비스별 링크·고지만 지정 */
export function SiteFooter() {
  return (
    <Footer
      logoSrc="/logo.png"
      logoChipBg="transparent"
      links={[
        { label: "서비스 소개", href: "/about" },
        { label: "프리미엄", href: "/calendar" },
      ]}
      note="재미·참고용 콘텐츠 · 입력값 미저장"
    />
  );
}
