// 날짜 유틸 (UTC 기준 — saju-core 와 동일하게 타임존 비결정성 제거)

const MS_PER_DAY = 24 * 60 * 60 * 1000;

/** "YYYY-MM-DD" → UTC 타임스탬프 (실패 시 NaN) */
export function parseISO(dateISO: string): number {
  const m = /^(\d{4})-(\d{1,2})-(\d{1,2})$/.exec(dateISO.trim());
  if (!m) return NaN;
  return Date.UTC(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
}

/** UTC 타임스탬프 → "YYYY-MM-DD" */
export function toISO(utc: number): string {
  const d = new Date(utc);
  const y = d.getUTCFullYear();
  const mo = String(d.getUTCMonth() + 1).padStart(2, "0");
  const da = String(d.getUTCDate()).padStart(2, "0");
  return `${y}-${mo}-${da}`;
}

/** 날짜에 n일 더한 "YYYY-MM-DD" */
export function addDays(dateISO: string, n: number): string {
  return toISO(parseISO(dateISO) + n * MS_PER_DAY);
}

/** 요일 (0=일 … 6=토) */
export function dayOfWeek(dateISO: string): number {
  return new Date(parseISO(dateISO)).getUTCDay();
}

/** 주말(토·일) 여부 */
export function isWeekend(dateISO: string): boolean {
  const d = dayOfWeek(dateISO);
  return d === 0 || d === 6;
}

/** 요일 한글 한 글자 */
export function weekdayKo(dateISO: string): string {
  return ["일", "월", "화", "수", "목", "금", "토"][dayOfWeek(dateISO)];
}

/** start 로부터 date 까지의 일수 차 (D-day 계산: 0=오늘) */
export function dDay(startISO: string, dateISO: string): number {
  return Math.round((parseISO(dateISO) - parseISO(startISO)) / MS_PER_DAY);
}

/**
 * 오늘 날짜(한국시각 KST 기준) "YYYY-MM-DD".
 * 서버·클라이언트 어디서 호출해도 KST 자정 경계로 일관되게 동작한다.
 */
export function todayKST(now: number = Date.now()): string {
  return toISO(now + 9 * 60 * 60 * 1000);
}

/** "7월 24일 (금)" 형태의 한글 표시 */
export function formatKo(dateISO: string): string {
  const d = new Date(parseISO(dateISO));
  return `${d.getUTCMonth() + 1}월 ${d.getUTCDate()}일 (${weekdayKo(dateISO)})`;
}
