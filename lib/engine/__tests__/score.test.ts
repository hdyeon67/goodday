import { describe, expect, it } from "vitest";
import { buildProfile, generatingElement, scoreDate } from "../score";
import { getPurpose } from "../purposes";

const moving = getPurpose("moving")!;
const interview = getPurpose("interview")!;

describe("generatingElement — 나를 생해주는 오행", () => {
  it("화를 생하는 것은 목", () => {
    expect(generatingElement("화")).toBe("목");
  });
  it("목을 생하는 것은 수", () => {
    expect(generatingElement("목")).toBe("수");
  });
});

describe("scoreDate", () => {
  const user = buildProfile("홍길동", "1990-05-15");

  it("점수는 0~100 범위", () => {
    for (let d = 1; d <= 28; d++) {
      const iso = `2026-07-${String(d).padStart(2, "0")}`;
      const s = scoreDate(user, moving, iso).score;
      expect(s).toBeGreaterThanOrEqual(0);
      expect(s).toBeLessThanOrEqual(100);
    }
  });

  it("결정적: 같은 입력은 같은 점수", () => {
    const a = scoreDate(user, moving, "2026-07-22");
    const b = scoreDate(user, moving, "2026-07-22");
    expect(a).toEqual(b);
  });

  it("이사: 손없는 날(2026-07-22)의 전통택일 축이 높다", () => {
    const son = scoreDate(user, moving, "2026-07-22"); // 손없는 날
    const notSon = scoreDate(user, moving, "2026-07-11"); // 아님
    expect(son.axes.tradition).toBeGreaterThan(notSon.axes.tradition);
  });

  it("면접: 목적 축이 요일에 반응(평일 > 주말)", () => {
    // 2026-07-13(월) 평일 vs 2026-07-11(토) 주말
    const weekday = scoreDate(user, interview, "2026-07-13");
    const weekend = scoreDate(user, interview, "2026-07-11");
    expect(weekday.axes.purpose).toBeGreaterThan(weekend.axes.purpose);
  });
});
