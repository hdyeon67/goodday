// 기능 플래그 — env 로 제어. 서버·클라이언트 공용(NEXT_PUBLIC_* 만 클라이언트 노출).

/** 결제 기능 활성 여부 (false 면 프리미엄 UI 는 "준비 중" 상태) */
export const PAYMENT_ENABLED = process.env.PAYMENT_ENABLED === "true";

/** 애드센스 노출 여부 */
export const ADSENSE_ENABLED =
  process.env.NEXT_PUBLIC_ADSENSE_ENABLED === "true" &&
  !!process.env.NEXT_PUBLIC_ADSENSE_CLIENT;

/** 애드센스 퍼블리셔 client id (ca-pub-...) */
export const ADSENSE_CLIENT = process.env.NEXT_PUBLIC_ADSENSE_CLIENT ?? "";

/** 카카오 애드핏 광고단위 ID (DAN-...). 없으면 해당 슬롯 미노출 */
export const ADFIT_UNIT_TOP = process.env.NEXT_PUBLIC_ADFIT_UNIT_TOP ?? "";
export const ADFIT_UNIT_BOTTOM = process.env.NEXT_PUBLIC_ADFIT_UNIT_BOTTOM ?? "";
