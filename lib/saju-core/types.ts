// saju-core 공용 타입 정의
//
// 여러 앱(케미체크·좋은날 등)이 공유하는 만세력/오행 계산 모듈의 타입.
// 프레임워크(React/Next) 의존이 전혀 없어야 하며, 나중에 packages/saju-core 로
// 그대로 승격 가능하도록 순수 TS 만 사용한다.

/** 오행 (목·화·토·금·수) */
export type Ohaeng = "목" | "화" | "토" | "금" | "수";

/** 천간 (10간, 甲乙丙丁戊己庚辛壬癸) */
export type Cheongan =
  | "갑"
  | "을"
  | "병"
  | "정"
  | "무"
  | "기"
  | "경"
  | "신"
  | "임"
  | "계";

/** 12지지 (子丑寅卯辰巳午未申酉戌亥) */
export type Jiji =
  | "자"
  | "축"
  | "인"
  | "묘"
  | "진"
  | "사"
  | "오"
  | "미"
  | "신"
  | "유"
  | "술"
  | "해";

/** 두 지지(띠) 사이의 관계 유형 */
export type GanjiRelation = "삼합" | "육합" | "충" | "형" | "무관";

/** 오행 상생/상극 관계 (A 기준 → B 를 어떻게 대하는가) */
export type OhaengRelation = "생함" | "생받음" | "동일" | "극함" | "극받음";

/**
 * 하루의 일진(日辰) — 천간 + 지지 한 쌍.
 * index 는 60갑자 순환 위치(0~59, 0=갑자).
 */
export interface Iljin {
  /** 60갑자 index (0~59) */
  index: number;
  /** 일간 (천간) */
  cheongan: Cheongan;
  /** 일지 (지지) */
  jiji: Jiji;
  /** "갑술"처럼 조합된 간지 이름 */
  gapjaName: string;
  /** 천간의 오행 */
  ganOhaeng: Ohaeng;
  /** 지지의 오행 */
  jiOhaeng: Ohaeng;
}
