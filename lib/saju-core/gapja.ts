// 일진(日辰) 계산 — 60갑자 순환
//
// 1900-01-01 을 甲戌(60갑자 index 10)일로 보고 일진을 순환 계산한다.
// 60갑자 index 는 천간(index%10)과 지지(index%12)를 모두 인코딩하므로,
// 케미체크가 노출하지 않던 일지(日支)까지 여기서 도출한다.
// 날짜 산술은 UTC 기준으로 수행해 타임존에 따른 비결정성을 제거한다.
//
// 검증: 2000-01-07 = 갑자(index 0), 2026-07-11 = 병술(index 22).

import type { Cheongan, Iljin, Ohaeng } from "./types";
import {
  BASE_GAPJA_INDEX,
  BASE_UTC,
  CHEONGAN,
  CHEONGAN_OHAENG,
  JIJI,
  JIJI_OHAENG,
  MS_PER_DAY,
} from "./constants";

/** "YYYY-MM-DD" → UTC 자정 타임스탬프 (파싱 실패 시 NaN) */
function parseDateUTC(dateISO: string): number {
  const m = /^(\d{4})-(\d{1,2})-(\d{1,2})$/.exec(dateISO.trim());
  if (!m) return NaN;
  const y = Number(m[1]);
  const mo = Number(m[2]);
  const d = Number(m[3]);
  return Date.UTC(y, mo - 1, d);
}

/**
 * 날짜의 60갑자 index (0~59). 파싱 실패 시 0.
 * 생년월일이든 임의의 미래 날짜든 동일하게 동작한다.
 */
export function gapjaIndex(dateISO: string): number {
  const utc = parseDateUTC(dateISO);
  if (Number.isNaN(utc)) return 0;
  const daysDiff = Math.round((utc - BASE_UTC) / MS_PER_DAY);
  return (((BASE_GAPJA_INDEX + daysDiff) % 60) + 60) % 60;
}

/** 일간 (천간) */
export function dayCheongan(dateISO: string): Cheongan {
  return CHEONGAN[gapjaIndex(dateISO) % 10];
}

/** 일간의 오행 */
export function dayGanOhaeng(dateISO: string): Ohaeng {
  return CHEONGAN_OHAENG[gapjaIndex(dateISO) % 10];
}

/** 날짜의 완전한 일진(천간 + 지지 + 오행) */
export function iljin(dateISO: string): Iljin {
  const index = gapjaIndex(dateISO);
  const cheongan = CHEONGAN[index % 10];
  const jiji = JIJI[index % 12];
  return {
    index,
    cheongan,
    jiji,
    gapjaName: `${cheongan}${jiji}`,
    ganOhaeng: CHEONGAN_OHAENG[index % 10],
    jiOhaeng: JIJI_OHAENG[index % 12],
  };
}
