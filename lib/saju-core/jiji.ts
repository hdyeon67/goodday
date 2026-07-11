// 지지(地支) 관계 판정 및 점수
//
// 케미체크 zodiac.ts 의 삼합/육합/충 로직을 별자리 부분과 분리해 지지 순수
// 로직으로 일반화했다. 좋은날에서는 사용자 띠(연지) vs 해당 날짜 일지(日支)의
// 상성을 점수화하는 데 쓴다.

import type { GanjiRelation, Jiji } from "./types";
import { HYEONG, JAHYEONG, JIJI, SAMHAP, YUKHAP } from "./constants";

const JIJI_IDX: Record<Jiji, number> = {
  자: 0, 축: 1, 인: 2, 묘: 3, 진: 4, 사: 5,
  오: 6, 미: 7, 신: 8, 유: 9, 술: 10, 해: 11,
};

function toIndex(j: Jiji | number): number {
  return typeof j === "number" ? j : JIJI_IDX[j];
}

function inSameSamhap(a: number, b: number): boolean {
  return SAMHAP.some((g) => g.includes(a) && g.includes(b));
}

function isYukhap(a: number, b: number): boolean {
  return YUKHAP.some(([x, y]) => (x === a && y === b) || (x === b && y === a));
}

function isChung(a: number, b: number): boolean {
  // 충: 정반대(6칸 차이)
  return Math.abs(a - b) === 6;
}

function isHyeong(a: number, b: number): boolean {
  if (a === b) return JAHYEONG.includes(a); // 자형
  return HYEONG.some(([x, y]) => (x === a && y === b) || (x === b && y === a));
}

/**
 * 두 지지의 관계 유형.
 * 우선순위: 육합 > 삼합 > 충 > 형 > 무관.
 * (합이 형보다 우선, 충이 형보다 우선 — 길흉 판정에서 합/충을 먼저 본다)
 */
export function jijiRelation(a: Jiji | number, b: Jiji | number): GanjiRelation {
  const ia = toIndex(a);
  const ib = toIndex(b);
  if (isYukhap(ia, ib)) return "육합";
  if (inSameSamhap(ia, ib)) return "삼합";
  if (isChung(ia, ib)) return "충";
  if (isHyeong(ia, ib)) return "형";
  return "무관";
}

/** 두 지지의 상성 점수 (0~100) */
export function jijiScore(a: Jiji | number, b: Jiji | number): number {
  const ia = toIndex(a);
  const ib = toIndex(b);
  if (isYukhap(ia, ib)) return 92; // 육합: 최고 상성
  if (inSameSamhap(ia, ib)) return 85; // 삼합: 높은 상성
  if (isChung(ia, ib)) return 35; // 충: 낮은 상성
  if (isHyeong(ia, ib)) return 45; // 형: 낮은 편
  if (ia === ib) return 72; // 동일 지지: 중간+
  return 60; // 그 외: 중간
}

export { JIJI };
