// 음력 변환 + 손없는 날 판정
//
// 검증된 npm 패키지 korean-lunar-calendar 로 양력→음력을 변환한다.
// 손없는 날 = 음력 날짜 끝수가 9 또는 0인 날(음력 9·10·19·20·29·30).
// "손(損)"이라는 방해 귀신이 없는 날로, 전통적으로 이사·개업에 길일로 친다.

import KoreanLunarCalendar from "korean-lunar-calendar";

export interface LunarDate {
  year: number;
  month: number;
  day: number;
  /** 윤달 여부 */
  isLeap: boolean;
}

/** "YYYY-MM-DD" 파싱 (실패 시 null) */
function parse(dateISO: string): { y: number; m: number; d: number } | null {
  const m = /^(\d{4})-(\d{1,2})-(\d{1,2})$/.exec(dateISO.trim());
  if (!m) return null;
  return { y: Number(m[1]), m: Number(m[2]), d: Number(m[3]) };
}

/** 양력 "YYYY-MM-DD" → 음력 날짜. 변환 실패 시 null */
export function toLunar(dateISO: string): LunarDate | null {
  const p = parse(dateISO);
  if (!p) return null;
  const cal = new KoreanLunarCalendar();
  const ok = cal.setSolarDate(p.y, p.m, p.d);
  if (!ok) return null;
  const lunar = cal.getLunarCalendar();
  if (!lunar) return null;
  return {
    year: lunar.year,
    month: lunar.month,
    day: lunar.day,
    isLeap: Boolean(lunar.intercalation),
  };
}

/**
 * 손없는 날 여부. 음력 일(日)의 끝수가 9 또는 0이면 true.
 * (음력 9·10·19·20·29·30일)
 */
export function isSonEomneunNal(dateISO: string): boolean {
  const lunar = toLunar(dateISO);
  if (!lunar) return false;
  const last = lunar.day % 10;
  return last === 9 || last === 0;
}
