// 문구 선택 로직 — 결정적으로 (근거 + 이유 + 팁)을 조합한다.
//
// 같은 (사용자·목적·날짜)면 항상 같은 문구가 나오도록 시드 기반으로 변형을 고른다.
// AI 호출 없음. 사전 생성된 풀에서만 뽑는다.

import { fnv1a, type Ohaeng } from "../saju-core";
import type { DayScore, Purpose, UserProfile } from "../engine";
import { bandOf, BAND_LABEL, type Band } from "./bands";
import { REASONS } from "./reasons";
import { TIPS } from "./tips";
import { factNote } from "./facts";

export interface DayCopy {
  band: Band;
  bandLabel: string;
  /** 근거 클로즈 (오행/손없는날 등 실제 계산 인용) */
  fact: string;
  /** "왜 이 날인가" 본문 */
  reason: string;
  /** 행동 팁 */
  tip: string;
  /** 근거 + 이유를 이은 완성 문장 */
  headline: string;
}

/** 시드로 배열에서 하나 고르기 (결정적) */
function pick<T>(arr: T[], seed: number): T {
  return arr[seed % arr.length];
}

/**
 * 한 날짜의 해석 문구 생성.
 * salt 로 이유/팁 변형에 서로 다른 시드를 줘 문구가 단조롭지 않게 한다.
 */
export function selectCopy(
  day: DayScore,
  purpose: Purpose,
  user: UserProfile,
): DayCopy {
  const band = bandOf(day.score);
  const base = fnv1a(`${user.name}|${user.birth}|${purpose.id}|${day.dateISO}`);

  const reasonPool = REASONS[purpose.id][band];
  const tipPool = TIPS[purpose.id];

  const reason = pick(reasonPool, base);
  const tip = pick(tipPool, Math.floor(base / 7) + 3); // 이유와 다른 시드 축
  const fact = factNote(day, user);

  // 근거를 앞세워 자연스럽게 잇는다: "…예요. …"
  const headline = `${fact}. ${reason}`;

  return {
    band,
    bandLabel: BAND_LABEL[band],
    fact,
    reason,
    tip,
    headline,
  };
}

/** 오행 한 글자 → 색 힌트 (결과 UI 배지용). copy 계층에 두어 재사용. */
export const OHAENG_HINT: Record<Ohaeng, { label: string; hex: string }> = {
  목: { label: "목(木)", hex: "#4a7c59" },
  화: { label: "화(火)", hex: "#c0563b" },
  토: { label: "토(土)", hex: "#a8843f" },
  금: { label: "금(金)", hex: "#8a8f99" },
  수: { label: "수(水)", hex: "#3f6fa8" },
};
