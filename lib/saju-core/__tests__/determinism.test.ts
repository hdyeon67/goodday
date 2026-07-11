import { describe, expect, it } from "vitest";
import { fnv1a, mulberry32, seededJitter } from "../hash";
import { iljin } from "../gapja";
import { ttiJiji } from "../birth";

describe("결정성 — 같은 입력은 항상 같은 출력", () => {
  it("fnv1a / mulberry32 재현성", () => {
    const s = fnv1a("홍길동1990-05-152026-07-11");
    expect(fnv1a("홍길동1990-05-152026-07-11")).toBe(s);
    expect(mulberry32(s)).toBe(mulberry32(s));
  });

  it("seededJitter 는 [-range, +range] 정수", () => {
    for (let seed = 0; seed < 500; seed++) {
      const j = seededJitter(fnv1a(`seed${seed}`), 2);
      expect(Number.isInteger(j)).toBe(true);
      expect(j).toBeGreaterThanOrEqual(-2);
      expect(j).toBeLessThanOrEqual(2);
    }
  });

  it("일진/띠 계산은 다회 호출에도 완전 동일", () => {
    for (let i = 0; i < 5; i++) {
      expect(iljin("2026-07-24")).toEqual(iljin("2026-07-24"));
      expect(ttiJiji("1990-05-15")).toBe("오");
    }
  });

  it("시드가 다르면(이름/날짜 변경) 지터도 분포함", () => {
    const values = new Set<number>();
    for (const name of ["A", "B", "C", "D", "E", "F", "G"]) {
      values.add(seededJitter(fnv1a(`${name}2026-07-11`), 2));
    }
    // 서로 다른 시드가 최소 2가지 이상의 지터 값을 만들어야 한다 (상수 아님)
    expect(values.size).toBeGreaterThan(1);
  });
});
