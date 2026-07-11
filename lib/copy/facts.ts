// 근거 클로즈 — 그 날이 좋은/아쉬운 "이유"를 일진에서 뽑아 한 조각 문장으로.
//
// 오행 상생·상극, 손없는 날, 지지 삼합·육합·충 등 실제 계산 근거를 인용한다.
// 톤: 가볍고 다정하게, 불안 조장 금지.

import {
  ohaengRelation,
  jijiRelation,
  type Ohaeng,
} from "../saju-core";
import type { DayScore } from "../engine";
import type { UserProfile } from "../engine";

/**
 * 그 날의 가장 두드러진 근거 한 조각을 반환.
 * 추천 쪽(긍정)과 피함 쪽(부드러운 완곡)으로 톤을 나눈다.
 */
export function factNote(day: DayScore, user: UserProfile): string {
  const positive = day.score >= 54;

  // 1) 손없는 날은 가장 눈에 띄는 전통 근거
  if (day.isSonNal && positive) {
    return "예부터 길일로 치는 ‘손 없는 날’이에요";
  }

  // 2) 오행 상생/상극 (사용자 일간 오행 vs 날짜 천간 오행)
  const oh: Ohaeng = day.iljin.ganOhaeng;
  const rel = ohaengRelation(user.ohaeng, oh);
  if (positive && (rel === "생받음" || rel === "생함")) {
    return rel === "생받음"
      ? `${oh}(${oh})의 기운이 당신을 살며시 북돋아 줘요`
      : `당신의 기운이 이날의 ${oh} 기운과 순하게 이어져요`;
  }
  if (positive && rel === "동일") {
    return `당신과 같은 ${oh} 기운이 흐르는 편안한 날이에요`;
  }

  // 3) 지지 삼합·육합 (띠와 그 날 지지)
  const jr = jijiRelation(user.tti, day.iljin.jiji);
  if (positive && (jr === "육합" || jr === "삼합")) {
    return `당신의 띠와 ${jr}으로 잘 어울리는 지지의 날이에요`;
  }

  // ── 부드러운 완곡 (피함 쪽) ──
  if (!positive) {
    if (jr === "충") return "당신의 띠와 살짝 부딪히는 지지라 분주할 수 있어요";
    if (rel === "극받음" || rel === "극함") {
      return "오행 흐름이 조금 엇갈려 힘이 더 들 수 있어요";
    }
    return "기운이 특별히 받쳐주진 않는 평범한 날이에요";
  }

  // 4) 그 외 긍정 기본값
  return "전체적으로 흐름이 순하게 맞는 날이에요";
}
