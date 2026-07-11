import { describe, expect, it } from "vitest";
import { ohaengRelation, ohaengScore } from "../ohaeng";

describe("오행 상생/상극 점수", () => {
  it("목생화 = 87.5 (상생)", () => {
    expect(ohaengScore("목", "화")).toBe(87.5);
  });

  it("목극토 = 37.5 (상극)", () => {
    expect(ohaengScore("목", "토")).toBe(37.5);
  });

  it("동일 오행(비화) = 65", () => {
    expect(ohaengScore("목", "목")).toBe(65);
  });

  it("점수는 대칭 (방향 평균)", () => {
    expect(ohaengScore("화", "목")).toBe(ohaengScore("목", "화"));
  });
});

describe("오행 관계 유형", () => {
  it("목→화 = 생함", () => {
    expect(ohaengRelation("목", "화")).toBe("생함");
  });
  it("화→목 = 생받음", () => {
    expect(ohaengRelation("화", "목")).toBe("생받음");
  });
  it("목→토 = 극함", () => {
    expect(ohaengRelation("목", "토")).toBe("극함");
  });
  it("토→목 = 극받음", () => {
    expect(ohaengRelation("토", "목")).toBe("극받음");
  });
  it("동일 오행 = 동일", () => {
    expect(ohaengRelation("수", "수")).toBe("동일");
  });
});
