// 점수 구간 5단계
//
// best/good/fair 는 추천 쪽, soft/avoid 는 "굳이 고르자면 피하세요" 쪽.
// 경계값을 바꾸면 문구 톤 배분이 달라진다.

export type Band = "best" | "good" | "fair" | "soft" | "avoid";

export function bandOf(score: number): Band {
  if (score >= 80) return "best";
  if (score >= 68) return "good";
  if (score >= 54) return "fair";
  if (score >= 45) return "soft";
  return "avoid";
}

/** 구간의 짧은 한글 라벨 (배지 등 표시용) */
export const BAND_LABEL: Record<Band, string> = {
  best: "아주 좋은 날",
  good: "좋은 날",
  fair: "무난한 날",
  soft: "살짝 아쉬운 날",
  avoid: "굳이면 피할 날",
};
