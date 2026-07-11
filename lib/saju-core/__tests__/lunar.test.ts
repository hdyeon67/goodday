import { describe, expect, it } from "vitest";
import { isSonEomneunNal, toLunar } from "../lunar";

describe("양력 → 음력 변환", () => {
  it("2020-01-25(설날) = 음력 2020/1/1", () => {
    expect(toLunar("2020-01-25")).toEqual({
      year: 2020,
      month: 1,
      day: 1,
      isLeap: false,
    });
  });

  it("2024-02-10(설날) = 음력 2024/1/1", () => {
    const l = toLunar("2024-02-10");
    expect(l?.month).toBe(1);
    expect(l?.day).toBe(1);
  });

  it("파싱 실패 시 null", () => {
    expect(toLunar("bad-date")).toBeNull();
  });
});

describe("손없는 날 판정 (음력 끝수 9·0)", () => {
  it("참: 2026-07-22(음력 6/9), 2026-07-23(음력 6/10)", () => {
    expect(isSonEomneunNal("2026-07-22")).toBe(true);
    expect(isSonEomneunNal("2026-07-23")).toBe(true);
  });

  it("거짓: 2026-07-11 (끝수 9·0 아님)", () => {
    expect(isSonEomneunNal("2026-07-11")).toBe(false);
  });

  it("판정은 toLunar 의 일(day) 끝수와 일치", () => {
    const l = toLunar("2026-07-03");
    const last = (l?.day ?? -1) % 10;
    expect(isSonEomneunNal("2026-07-03")).toBe(last === 9 || last === 0);
  });
});
