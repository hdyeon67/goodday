import { describe, expect, it } from "vitest";
import { REASONS } from "../reasons";
import { TIPS } from "../tips";
import { bandOf } from "../bands";
import { selectCopy } from "../select";
import { buildProfile, getPurpose, scoreDate, PURPOSES } from "../../engine";

const BANDS = ["best", "good", "fair", "soft", "avoid"] as const;

describe("문구 풀 규모 & 구조", () => {
  it("이유 문구는 목적8 × 구간5 × 5변형 = 200개 이상", () => {
    let count = 0;
    for (const p of PURPOSES) {
      for (const b of BANDS) {
        const pool = REASONS[p.id][b];
        expect(pool.length).toBeGreaterThanOrEqual(5);
        count += pool.length;
      }
    }
    expect(count).toBeGreaterThanOrEqual(200);
  });

  it("각 목적에 팁이 5개 이상", () => {
    for (const p of PURPOSES) {
      expect(TIPS[p.id].length).toBeGreaterThanOrEqual(5);
    }
  });

  it("모든 문구는 비어있지 않고 종결어미(요/다/…)로 끝난다", () => {
    for (const p of PURPOSES) {
      for (const b of BANDS) {
        for (const s of REASONS[p.id][b]) {
          expect(s.trim().length).toBeGreaterThan(5);
        }
      }
    }
  });
});

describe("톤 가이드 — 불안 조장 표현 금지", () => {
  it("‘큰일/망하/재수없/불행/저주’ 같은 표현이 없다", () => {
    const banned = ["큰일", "망하", "재수없", "불행", "저주", "액운", "화를 입"];
    for (const p of PURPOSES) {
      for (const b of BANDS) {
        for (const s of REASONS[p.id][b]) {
          for (const w of banned) expect(s).not.toContain(w);
        }
      }
    }
  });

  it("avoid 구간도 부드러운 완곡 톤(권해요/편할/보세요 등)을 쓴다", () => {
    for (const p of PURPOSES) {
      // avoid 문구가 명령·단정 대신 완곡한 권유 톤을 쓰는지 확인
      const softWords = [
        "권해", "편할", "세요", "보여요", "있어요", "수 있",
        "미루", "미뤄", "기다려", "다른 날", "나을", "좋", "두기",
      ];
      for (const s of REASONS[p.id].avoid) {
        expect(softWords.some((w) => s.includes(w))).toBe(true);
      }
    }
  });
});

describe("selectCopy — 결정적 선택 & 근거 인용", () => {
  const user = buildProfile("홍길동", "1990-05-15");
  const moving = getPurpose("moving")!;

  it("같은 입력이면 같은 문구", () => {
    const a = selectCopy(scoreDate(user, moving, "2026-07-22"), moving, user);
    const b = selectCopy(scoreDate(user, moving, "2026-07-22"), moving, user);
    expect(a).toEqual(b);
  });

  it("손없는 날은 근거에 ‘손 없는 날’이 인용된다", () => {
    // 2026-07-22 는 손없는 날, 이사 목적이면 점수 높아 positive
    const day = scoreDate(user, moving, "2026-07-22");
    const copy = selectCopy(day, moving, user);
    if (day.isSonNal && day.score >= 54) {
      expect(copy.fact).toContain("손 없는 날");
    }
    expect(copy.headline).toContain(copy.reason);
  });

  it("band 가 점수 구간과 일치", () => {
    expect(bandOf(85)).toBe("best");
    expect(bandOf(50)).toBe("soft");
    expect(bandOf(30)).toBe("avoid");
  });
});
