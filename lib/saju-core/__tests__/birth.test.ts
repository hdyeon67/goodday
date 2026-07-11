import { describe, expect, it } from "vitest";
import { dayGan, dayOhaeng, tti, ttiIndex, ttiJiji } from "../birth";

describe("생년월일 → 일간/오행", () => {
  it("1990-05-15 → 일간 경, 오행 금", () => {
    expect(dayGan("1990-05-15")).toBe("경");
    expect(dayOhaeng("1990-05-15")).toBe("금");
  });

  it("2000-01-07 → 일간 갑, 오행 목", () => {
    expect(dayGan("2000-01-07")).toBe("갑");
    expect(dayOhaeng("2000-01-07")).toBe("목");
  });
});

describe("띠(연지) 매핑", () => {
  it("ttiIndex 공식 (서기 4년 = 자)", () => {
    expect(ttiIndex(4)).toBe(0); // 자
    expect(ttiIndex(1990)).toBe(6); // 오
  });

  it("대표 연도 띠", () => {
    expect(ttiJiji("1990-05-15")).toBe("오"); // 말띠(경오년)
    expect(ttiJiji("2000-01-07")).toBe("진"); // 용띠(경진년)
    expect(ttiJiji("1988-09-09")).toBe("진"); // 용띠(무진년)
  });

  it("tti 는 생월·생일과 무관하게 연도로 결정", () => {
    expect(tti("1990-01-01")).toBe(tti("1990-12-31"));
  });
});
