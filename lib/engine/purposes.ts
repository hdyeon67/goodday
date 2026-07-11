// 목적 카테고리 8종 + 목적별 보정 매트릭스
//
// 각 목적마다 (1) 손없는 날 반영 강도, (2) 유리한 오행, (3) 요일 선호를 정의한다.
// 이 매트릭스가 목적별로 TOP3를 다르게 만드는 핵심이다.

import type { Ohaeng } from "../saju-core";

/** 목적 식별자 */
export type PurposeId =
  | "moving" // 이사
  | "contract" // 계약·큰 결제
  | "interview" // 면접·시험
  | "confession" // 고백·소개팅
  | "opening" // 개업·출시
  | "travel" // 여행 출발
  | "hospital" // 병원·시술
  | "haircut"; // 머리 자르기

/** 손없는 날 반영 강도 */
export type SonNalWeight = "strong" | "mild" | "none";

/** 요일 선호 */
export type WeekdayPref = "weekend" | "weekday" | "any";

/**
 * 유리한 오행 지정 방식.
 *   - Ohaeng: 해당 오행의 날(일진 천간 오행)이 유리
 *   - "generatesUser": 사용자 일간을 生(생)해주는 오행의 날이 유리 (면접·시험)
 *   - null: 오행 보정 없음
 */
export type FavorOhaeng = Ohaeng | "generatesUser" | null;

export interface Purpose {
  id: PurposeId;
  /** 한글 라벨 */
  label: string;
  /** 랜딩 아이콘 (이모지) */
  icon: string;
  /** 한 줄 설명 */
  tagline: string;
  /** 포인트 컬러 (Tailwind 임의값용 hex) */
  color: string;
  sonNal: SonNalWeight;
  favorOhaeng: FavorOhaeng;
  weekday: WeekdayPref;
}

/** 목적 8종 정의 (표시 순서 = 배열 순서) */
export const PURPOSES: Purpose[] = [
  {
    id: "moving",
    label: "이사",
    icon: "📦",
    tagline: "새 보금자리로 옮기는 날",
    color: "#8a6d3b",
    sonNal: "strong", // 이사는 손없는 날을 크게 본다
    favorOhaeng: "토", // 안정·터전
    weekday: "weekend",
  },
  {
    id: "contract",
    label: "계약·큰 결제",
    icon: "📝",
    tagline: "도장 찍고 결정하는 날",
    color: "#4a5a6a",
    sonNal: "mild",
    favorOhaeng: "금", // 결단·매듭
    weekday: "weekday",
  },
  {
    id: "interview",
    label: "면접·시험",
    icon: "🎯",
    tagline: "실력을 보여주는 날",
    color: "#3b6ea5",
    sonNal: "none",
    favorOhaeng: "generatesUser", // 나를 북돋아 주는 기운
    weekday: "weekday",
  },
  {
    id: "confession",
    label: "고백·소개팅",
    icon: "💗",
    tagline: "마음을 전하는 날",
    color: "#c85a7c",
    sonNal: "none",
    favorOhaeng: "화", // 따뜻함·설렘
    weekday: "any",
  },
  {
    id: "opening",
    label: "개업·출시",
    icon: "🎊",
    tagline: "새로 시작을 알리는 날",
    color: "#b8860b",
    sonNal: "strong",
    favorOhaeng: "금", // 재물·번창
    weekday: "any",
  },
  {
    id: "travel",
    label: "여행 출발",
    icon: "✈️",
    tagline: "길을 나서는 날",
    color: "#2e8b8b",
    sonNal: "mild",
    favorOhaeng: "화", // 활력·즐거움
    weekday: "weekend",
  },
  {
    id: "hospital",
    label: "병원·시술",
    icon: "🩺",
    tagline: "몸을 돌보는 날",
    color: "#5a8a5a",
    sonNal: "none",
    favorOhaeng: "수", // 회복·유연
    weekday: "weekday",
  },
  {
    id: "haircut",
    label: "머리 자르기",
    icon: "✂️",
    tagline: "가볍게 기분 전환",
    color: "#7a6f9b",
    sonNal: "none",
    favorOhaeng: "목", // 새로 자라남
    weekday: "any",
  },
];

/**
 * "이번 주 나의 좋은 날" 위젯용 중립 목적.
 * 특정 목적 편향 없이 오행·지지·전통택일만 담담히 반영한다. 그리드에는 노출 안 함.
 */
export const GENERAL_PURPOSE: Purpose = {
  id: "haircut", // id 는 문구/시드용 — 그리드 미노출이므로 표시엔 영향 없음
  label: "이번 주",
  icon: "🗓️",
  tagline: "이번 주 나의 좋은 날",
  color: "#8a6d3b",
  sonNal: "mild",
  favorOhaeng: null,
  weekday: "any",
};

const PURPOSE_MAP: Record<PurposeId, Purpose> = Object.fromEntries(
  PURPOSES.map((p) => [p.id, p]),
) as Record<PurposeId, Purpose>;

/** id 로 목적 조회 (없으면 null) */
export function getPurpose(id: string): Purpose | null {
  return PURPOSE_MAP[id as PurposeId] ?? null;
}

/** 유효한 목적 id 인지 */
export function isPurposeId(id: string): id is PurposeId {
  return id in PURPOSE_MAP;
}
