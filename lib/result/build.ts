// 결과 데이터 빌더 — 페이로드 + 시작일 → 직렬화 가능한 결과 뷰 모델.
// 결과 페이지(서버 컴포넌트)와 OG 이미지 라우트가 공유한다.

import {
  buildProfile,
  formatKo,
  getPurpose,
  recommend,
  weekdayKo,
  type Purpose,
} from "../engine";
import { selectCopy } from "../copy";
import type { SharePayload } from "../share";

export interface TopDayVM {
  dateISO: string;
  dday: number;
  score: number;
  gapjaName: string;
  ganOhaeng: string;
  weekday: string;
  labelKo: string; // "7월 24일 (금)"
  isSonNal: boolean;
  bandLabel: string;
  headline: string;
  tip: string;
}

export interface AvoidVM {
  dateISO: string;
  dday: number;
  score: number;
  labelKo: string;
  headline: string;
}

export interface HeatCell {
  dateISO: string;
  dday: number;
  score: number;
  /** TOP3 에 포함되어 공개되는 칸인지 (나머지는 블러) */
  revealed: boolean;
}

export interface ResultVM {
  name: string;
  purpose: Purpose;
  startISO: string;
  top3: TopDayVM[];
  avoid: AvoidVM[];
  heatmap: HeatCell[];
}

/** 페이로드가 유효하지 않으면 null */
export function buildResult(
  payload: SharePayload,
  startISO: string,
): ResultVM | null {
  const purpose = getPurpose(payload.p);
  if (!purpose) return null;

  const user = buildProfile(payload.n, payload.b);
  const res = recommend({
    name: payload.n,
    birth: payload.b,
    purpose,
    startISO,
  });

  const top3: TopDayVM[] = res.top3.map((d) => {
    const copy = selectCopy(d, purpose, user);
    return {
      dateISO: d.dateISO,
      dday: d.dday,
      score: d.score,
      gapjaName: d.iljin.gapjaName,
      ganOhaeng: d.iljin.ganOhaeng,
      weekday: weekdayKo(d.dateISO),
      labelKo: formatKo(d.dateISO),
      isSonNal: d.isSonNal,
      bandLabel: copy.bandLabel,
      headline: copy.headline,
      tip: copy.tip,
    };
  });

  const avoid: AvoidVM[] = res.avoid.map((d) => {
    const copy = selectCopy(d, purpose, user);
    return {
      dateISO: d.dateISO,
      dday: d.dday,
      score: d.score,
      labelKo: formatKo(d.dateISO),
      headline: copy.headline,
    };
  });

  const revealed = new Set(top3.map((d) => d.dateISO));
  // 히트맵은 날짜 순서
  const heatmap: HeatCell[] = [...res.days]
    .sort((a, b) => a.dday - b.dday)
    .map((d) => ({
      dateISO: d.dateISO,
      dday: d.dday,
      score: d.score,
      revealed: revealed.has(d.dateISO),
    }));

  return { name: payload.n, purpose, startISO, top3, avoid, heatmap };
}
