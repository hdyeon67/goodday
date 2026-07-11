// 사용자 생년월일 → 일간(日干) / 오행 / 띠(연지) 도출
//
// 일간·오행은 gapja.ts 의 일진 계산을 그대로 재사용한다.
// 띠(연지)는 양력 연도 기준으로 계산한다.
//
// ※ 알려진 단순화: 전통적으로 띠는 입춘(양력 2/4 무렵)을 경계로 바뀌지만,
//   여기서는 엔터테인먼트 목적상 양력 연도만으로 산출한다. 1~2월 초 출생자는
//   실제 띠와 1칸 어긋날 수 있다. 정밀 택일이 아닌 재미·참고용이라는 서비스
//   포지셔닝에 부합하는 의도된 단순화다.

import type { Cheongan, Jiji, Ohaeng } from "./types";
import { JIJI } from "./constants";
import { dayCheongan, dayGanOhaeng } from "./gapja";

/** 생년월일("YYYY-MM-DD")의 일간 (천간) */
export function dayGan(birth: string): Cheongan {
  return dayCheongan(birth);
}

/** 생년월일의 일간 오행 */
export function dayOhaeng(birth: string): Ohaeng {
  return dayGanOhaeng(birth);
}

/** 생년 → 연지(띠) index. 서기 4년 = 자(쥐) 기준 */
export function ttiIndex(year: number): number {
  return (((year - 4) % 12) + 12) % 12;
}

/** 생년월일("YYYY-MM-DD") → 띠 index (0~11) */
export function tti(birth: string): number {
  const year = Number(birth.trim().slice(0, 4));
  if (Number.isNaN(year)) return 0;
  return ttiIndex(year);
}

/** 생년월일 → 띠 지지 */
export function ttiJiji(birth: string): Jiji {
  return JIJI[tti(birth)];
}
