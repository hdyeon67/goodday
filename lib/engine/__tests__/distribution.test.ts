import { describe, expect, it } from "vitest";
import { recommend } from "../recommend";
import { PURPOSES, getPurpose } from "../purposes";

const START = "2026-07-11";
const NAME = "김민지";
const BIRTH = "1993-11-02";

function top3Keys(purposeId: string): string {
  const res = recommend({
    name: NAME,
    birth: BIRTH,
    purpose: getPurpose(purposeId)!,
    startISO: START,
  });
  return res.top3.map((d) => d.dateISO).join(",");
}

describe("recommend 기본 성질", () => {
  it("30일 전부 점수화하고 TOP3 를 낸다", () => {
    const res = recommend({
      name: NAME,
      birth: BIRTH,
      purpose: PURPOSES[0],
      startISO: START,
    });
    expect(res.days).toHaveLength(30);
    expect(res.top3).toHaveLength(3);
    // 내림차순 정렬
    expect(res.top3[0].score).toBeGreaterThanOrEqual(res.top3[1].score);
    expect(res.top3[1].score).toBeGreaterThanOrEqual(res.top3[2].score);
  });

  it("결정적: 같은 입력 → 같은 TOP3", () => {
    expect(top3Keys("moving")).toBe(top3Keys("moving"));
  });

  it("TOP3 는 D-day 와 일진 정보를 포함", () => {
    const res = recommend({
      name: NAME,
      birth: BIRTH,
      purpose: PURPOSES[0],
      startISO: START,
    });
    const first = res.top3[0];
    expect(first.dday).toBeGreaterThanOrEqual(0);
    expect(first.iljin.gapjaName).toMatch(/^[가-힣]{2}$/);
  });
});

describe("목적별로 TOP3 가 달라진다 (핵심 검증)", () => {
  it("8개 목적의 TOP3 조합이 최소 4가지 이상으로 갈린다", () => {
    const distinct = new Set(PURPOSES.map((p) => top3Keys(p.id)));
    // 목적별 보정이 실제로 순위를 재편하는지 확인
    expect(distinct.size).toBeGreaterThanOrEqual(4);
  });

  it("이사 vs 면접의 TOP3 는 서로 다르다", () => {
    expect(top3Keys("moving")).not.toBe(top3Keys("interview"));
  });

  it("이사 TOP3 에는 손없는 날이 포함되는 경향", () => {
    const res = recommend({
      name: NAME,
      birth: BIRTH,
      purpose: getPurpose("moving")!,
      startISO: START,
    });
    // 이사는 손없는 날 강가점이므로 TOP3 중 최소 1개는 손없는 날
    expect(res.top3.some((d) => d.isSonNal)).toBe(true);
  });
});

describe("피하면 좋은 날", () => {
  it("avoid 는 최대 2개, TOP3 와 겹치지 않는다", () => {
    const res = recommend({
      name: NAME,
      birth: BIRTH,
      purpose: getPurpose("contract")!,
      startISO: START,
    });
    expect(res.avoid.length).toBeLessThanOrEqual(2);
    const topSet = new Set(res.top3.map((d) => d.dateISO));
    for (const a of res.avoid) expect(topSet.has(a.dateISO)).toBe(false);
  });
});
