// 기능 플래그 — env 로 제어. 서버·클라이언트 공용(NEXT_PUBLIC_* 만 클라이언트 노출).

/** 결제 기능 활성 여부 (false 면 프리미엄 UI 는 "준비 중" 상태) */
export const PAYMENT_ENABLED = process.env.PAYMENT_ENABLED === "true";

/** 애드센스 노출 여부 */
export const ADSENSE_ENABLED =
  process.env.NEXT_PUBLIC_ADSENSE_ENABLED === "true" &&
  !!process.env.NEXT_PUBLIC_ADSENSE_CLIENT;

/** 애드센스 퍼블리셔 client id (ca-pub-...) */
export const ADSENSE_CLIENT = process.env.NEXT_PUBLIC_ADSENSE_CLIENT ?? "";

// 카카오 애드핏 광고단위 ID (DAN-...). 없으면 해당 슬롯 미노출.
//   PC = 좌·우 세로 사이드바(160×600), 모바일 = 가로 배너(320×100)
export const ADFIT_UNIT_PC_LEFT = process.env.NEXT_PUBLIC_ADFIT_UNIT_PC_LEFT ?? "";
export const ADFIT_UNIT_PC_RIGHT = process.env.NEXT_PUBLIC_ADFIT_UNIT_PC_RIGHT ?? "";
export const ADFIT_UNIT_MOBILE = process.env.NEXT_PUBLIC_ADFIT_UNIT_MOBILE ?? "";

// ── Analytics (analytics-spec.md) ────────────────────────
/** PostHog 프로젝트 키(퍼블리시 가능). 없으면 계측 비활성 */
export const POSTHOG_KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY ?? "";
/** PostHog 호스트 (US 클라우드 기본) */
export const POSTHOG_HOST = process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://us.i.posthog.com";
/** Cloudflare Web Analytics 토큰(보조). 없으면 비활성 */
export const CF_BEACON_TOKEN = process.env.NEXT_PUBLIC_CF_BEACON_TOKEN ?? "";
