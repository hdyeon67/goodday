// 추천 엔진 — 향후 N일 점수화 → TOP3 + 피하면 좋은 날
//
// 결정적: 같은 입력(이름·생년월일·목적·시작일)이면 항상 같은 추천을 낸다.

import { addDays, dDay } from "./dates";
import type { Purpose } from "./purposes";
import { buildProfile, scoreDate, type DayScore } from "./score";
import { AVOID_THRESHOLD, DEFAULT_HORIZON_DAYS } from "./weights";

/** 추천 입력 */
export interface RecommendInput {
  name: string;
  birth: string;
  purpose: Purpose;
  /** 조회 시작일 "YYYY-MM-DD" (기본: 호출 측에서 오늘 주입) */
  startISO: string;
  /** 조회 일수 (기본 30) */
  horizon?: number;
}

/** D-day 가 붙은 하루 결과 */
export interface RankedDay extends DayScore {
  dday: number;
}

export interface RecommendResult {
  /** 점수순 정렬된 전체 N일 (히트맵용) */
  days: RankedDay[];
  /** 좋은 날 TOP 3 (점수 내림차순) */
  top3: RankedDay[];
  /** 피하면 좋은 날 1~2개 (점수 오름차순, 임계 이하만) */
  avoid: RankedDay[];
}

// 동점 시 결정적 정렬: 점수 desc → 날짜 asc (가까운 날 우선)
function byScoreDesc(a: RankedDay, b: RankedDay): number {
  if (b.score !== a.score) return b.score - a.score;
  return a.dday - b.dday;
}

export function recommend(input: RecommendInput): RecommendResult {
  const horizon = input.horizon ?? DEFAULT_HORIZON_DAYS;
  const user = buildProfile(input.name, input.birth);

  const days: RankedDay[] = [];
  for (let i = 0; i < horizon; i++) {
    const dateISO = addDays(input.startISO, i);
    const ds = scoreDate(user, input.purpose, dateISO);
    days.push({ ...ds, dday: dDay(input.startISO, dateISO) });
  }

  const ranked = [...days].sort(byScoreDesc);
  const top3 = ranked.slice(0, 3);

  // 피할 날: 임계 이하 중 최저 점수부터 최대 2개. TOP3 와 겹치지 않게.
  const topSet = new Set(top3.map((d) => d.dateISO));
  const avoid = [...ranked]
    .reverse()
    .filter((d) => d.score <= AVOID_THRESHOLD && !topSet.has(d.dateISO))
    .slice(0, 2);

  return { days: ranked, top3, avoid };
}

/**
 * "이번 주 나의 좋은 날" 미니 위젯용 — 생년월일만으로 이번 주(7일) 최고 날 1개.
 * 목적은 균형값(중립)이 필요하므로 오행·지지 위주로만 평가하도록 임의 목적 대신
 * 가장 범용적인 목적을 주입해 사용한다(호출 측에서 purpose 지정).
 */
export function bestThisWeek(input: RecommendInput): RankedDay | null {
  const res = recommend({ ...input, horizon: 7 });
  return res.top3[0] ?? null;
}
