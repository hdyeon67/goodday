import { describe, expect, it } from "vitest";
import { jijiRelation, jijiScore } from "../jiji";

describe("지지 관계 판정", () => {
  it("자·축 = 육합", () => {
    expect(jijiRelation("자", "축")).toBe("육합");
  });

  it("신·자·진 삼합", () => {
    expect(jijiRelation("신", "자")).toBe("삼합");
    expect(jijiRelation("자", "진")).toBe("삼합");
  });

  it("자·오 = 충 (6칸 차이)", () => {
    expect(jijiRelation("자", "오")).toBe("충");
    expect(jijiRelation("묘", "유")).toBe("충");
  });

  it("인·사 = 형", () => {
    expect(jijiRelation("인", "사")).toBe("형");
  });

  it("상성 없는 조합 = 무관", () => {
    expect(jijiRelation("인", "유")).toBe("무관");
  });
});

describe("지지 상성 점수", () => {
  it("육합(92) > 삼합(85) > 동일(72) > 그외(60) > 형(45) > 충(35)", () => {
    expect(jijiScore("자", "축")).toBe(92); // 육합
    expect(jijiScore("신", "진")).toBe(85); // 삼합
    expect(jijiScore("인", "유")).toBe(60); // 무관
    expect(jijiScore("자", "오")).toBe(35); // 충
  });

  it("숫자 index 입력도 허용", () => {
    expect(jijiScore(0, 1)).toBe(jijiScore("자", "축"));
  });
});
