// 날짜별 점수 합산 엔진 (0~100, 결정적)
//
// 4개 축을 가중 합산한다:
//   (a) 오행 40% — 사용자 일간 오행 vs 날짜 일진 천간 오행
//   (b) 지지 25% — 사용자 띠 vs 날짜 지지 (삼합·육합·충·형)
//   (c) 전통택일 20% — 손없는 날 (목적별 반영 강도)
//   (d) 목적보정 15% — 유리한 오행·요일
// 마지막에 시드(이름+생년월일+날짜) 기반 ±2점 미세 변동을 더하되 재계산 시 동일.

import {
  dayOhaeng,
  fnv1a,
  iljin,
  isSonEomneunNal,
  ohaengScore,
  OHAENG_ORDER,
  seededJitter,
  ttiJiji,
  jijiScore,
  type Iljin,
  type Ohaeng,
} from "../saju-core";
import { isWeekend } from "./dates";
import type { Purpose } from "./purposes";
import { JITTER_RANGE, WEIGHTS } from "./weights";

/** 사용자 프로필 (생년월일에서 1회 도출) */
export interface UserProfile {
  name: string;
  birth: string;
  /** 일간 오행 */
  ohaeng: Ohaeng;
  /** 띠 지지 */
  tti: ReturnType<typeof ttiJiji>;
}

export function buildProfile(name: string, birth: string): UserProfile {
  return {
    name,
    birth,
    ohaeng: dayOhaeng(birth),
    tti: ttiJiji(birth),
  };
}

/** 오행 X 를 生(생)해주는 오행 (X 의 바로 앞 단계). 예: 화 → 목 */
export function generatingElement(x: Ohaeng): Ohaeng {
  const i = OHAENG_ORDER.indexOf(x);
  return OHAENG_ORDER[(i + 4) % 5];
}

/** 각 축 세부 점수 (0~100, 디버깅·시각화용) */
export interface AxisScores {
  ohaeng: number;
  jiji: number;
  tradition: number;
  purpose: number;
}

/** 한 날짜의 점수 결과 */
export interface DayScore {
  dateISO: string;
  score: number;
  axes: AxisScores;
  iljin: Iljin;
  isSonNal: boolean;
}

// (c) 전통택일: 손없는 날 점수 (목적의 sonNal 강도에 따라)
function traditionScore(isSonNal: boolean, purpose: Purpose): number {
  switch (purpose.sonNal) {
    case "strong":
      return isSonNal ? 100 : 38;
    case "mild":
      return isSonNal ? 82 : 55;
    case "none":
    default:
      return 60; // 손없는 날 무관
  }
}

// (d) 목적보정: 유리한 오행 + 요일
function purposeScore(
  user: UserProfile,
  dateISO: string,
  ij: Iljin,
  purpose: Purpose,
): number {
  let s = 60; // 중립 기준

  // 유리한 오행 매칭
  if (purpose.favorOhaeng) {
    const target: Ohaeng =
      purpose.favorOhaeng === "generatesUser"
        ? generatingElement(user.ohaeng)
        : purpose.favorOhaeng;
    if (ij.ganOhaeng === target) s += 28;
    else if (ij.jiOhaeng === target) s += 14; // 지지 오행도 부분 반영
    else s -= 6;
  }

  // 요일 선호
  const weekend = isWeekend(dateISO);
  if (purpose.weekday === "weekend") s += weekend ? 16 : -10;
  else if (purpose.weekday === "weekday") s += weekend ? -18 : 12;
  // "any" 는 요일 보정 없음

  return Math.max(0, Math.min(100, s));
}

/** 한 날짜의 종합 점수 계산 */
export function scoreDate(
  user: UserProfile,
  purpose: Purpose,
  dateISO: string,
): DayScore {
  const ij = iljin(dateISO);
  const isSonNal = isSonEomneunNal(dateISO);

  const axes: AxisScores = {
    ohaeng: ohaengScore(user.ohaeng, ij.ganOhaeng),
    jiji: jijiScore(user.tti, ij.jiji),
    tradition: traditionScore(isSonNal, purpose),
    purpose: purposeScore(user, dateISO, ij, purpose),
  };

  const base =
    axes.ohaeng * WEIGHTS.ohaeng +
    axes.jiji * WEIGHTS.jiji +
    axes.tradition * WEIGHTS.tradition +
    axes.purpose * WEIGHTS.purpose;

  // 결정적 미세 변동: 같은 (이름+생년월일+목적+날짜) 면 항상 동일
  const seed = fnv1a(`${user.name}|${user.birth}|${purpose.id}|${dateISO}`);
  const jitter = seededJitter(seed, JITTER_RANGE);

  const score = Math.max(0, Math.min(100, Math.round(base + jitter)));

  return { dateISO, score, axes, iljin: ij, isSonNal };
}
