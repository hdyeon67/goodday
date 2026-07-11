import { describe, expect, it } from "vitest";
import { gapjaIndex, iljin, dayCheongan, dayGanOhaeng } from "../gapja";

describe("gapjaIndex — 알려진 값 검증", () => {
  it("앵커: 1900-01-01 = 갑술(index 10)", () => {
    expect(gapjaIndex("1900-01-01")).toBe(10);
  });

  it("기준일: 2000-01-07 = 갑자(index 0)", () => {
    // 널리 쓰이는 만세력 기준일. 앵커가 맞으면 이 값이 나온다.
    expect(gapjaIndex("2000-01-07")).toBe(0);
  });

  it("2026-07-11 = 병술(index 22)", () => {
    expect(gapjaIndex("2026-07-11")).toBe(22);
  });
});

describe("iljin — 천간+지지 조합", () => {
  it("1900-01-01 → 갑술", () => {
    const r = iljin("1900-01-01");
    expect(r.gapjaName).toBe("갑술");
    expect(r.cheongan).toBe("갑");
    expect(r.jiji).toBe("술");
    expect(r.ganOhaeng).toBe("목"); // 갑 = 목
    expect(r.jiOhaeng).toBe("토"); // 술 = 토
  });

  it("2000-01-07 → 갑자", () => {
    const r = iljin("2000-01-07");
    expect(r.gapjaName).toBe("갑자");
    expect(r.jiOhaeng).toBe("수"); // 자 = 수
  });

  it("2026-07-11 → 병술", () => {
    expect(iljin("2026-07-11").gapjaName).toBe("병술");
  });
});

describe("일진 순환 성질", () => {
  it("다음날은 index +1 (mod 60)", () => {
    const a = gapjaIndex("2026-07-11");
    const b = gapjaIndex("2026-07-12");
    expect(b).toBe((a + 1) % 60);
  });

  it("60일 뒤는 같은 갑자", () => {
    // 2026-07-11 + 60일 = 2026-09-09
    expect(gapjaIndex("2026-09-09")).toBe(gapjaIndex("2026-07-11"));
  });

  it("index 는 항상 0~59 범위", () => {
    for (const d of ["1899-01-01", "1900-01-01", "2050-12-31", "2026-07-11"]) {
      const i = gapjaIndex(d);
      expect(i).toBeGreaterThanOrEqual(0);
      expect(i).toBeLessThan(60);
    }
  });
});

describe("결정성 & 안전값", () => {
  it("같은 날짜는 항상 같은 결과", () => {
    expect(iljin("2026-07-24")).toEqual(iljin("2026-07-24"));
  });

  it("파싱 실패 시 안전값(index 0)", () => {
    expect(gapjaIndex("not-a-date")).toBe(0);
    expect(gapjaIndex("")).toBe(0);
  });

  it("dayCheongan / dayGanOhaeng 도 일진과 일치", () => {
    expect(dayCheongan("2026-07-11")).toBe("병");
    expect(dayGanOhaeng("2026-07-11")).toBe("화"); // 병 = 화
  });
});
