import { ImageResponse } from "next/og";
import { decodePayload } from "@/lib/share";
import { todayKST } from "@/lib/engine";
import { buildResult } from "@/lib/result/build";

export const runtime = "nodejs";

const FONT_URL =
  "https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/public/static/Pretendard-Bold.otf";

async function loadFont(): Promise<ArrayBuffer | null> {
  try {
    const res = await fetch(FONT_URL, { cache: "force-cache" });
    if (!res.ok) return null;
    return await res.arrayBuffer();
  } catch {
    return null;
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const payload = decodePayload(searchParams.get("d"));
  const font = await loadFont();

  const fonts = font
    ? [{ name: "Pretendard", data: font, weight: 700 as const, style: "normal" as const }]
    : undefined;

  // 폴백(홈/기본 공유): 한지+절기 톤 브랜드 카드
  if (!payload) {
    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            background: "#f7f3ea",
            padding: 48,
            fontFamily: "Pretendard",
          }}
        >
          <div
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              border: "3px solid #2b2b2b",
              padding: "56px 64px",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
              <div style={{ display: "flex", fontSize: 30, color: "#a9762e", letterSpacing: 6 }}>
                이사 · 행사 택일
              </div>
              <div style={{ display: "flex", fontSize: 120, fontWeight: 700, color: "#2b2b2b", marginTop: 14 }}>
                좋은날
              </div>
              <div style={{ display: "flex", fontSize: 36, color: "#6b6358", marginTop: 22 }}>
                오늘부터 30일, 좋은 날 TOP 3를 골라드려요
              </div>
              <div style={{ display: "flex", gap: 12, marginTop: 40 }}>
                {Array.from({ length: 7 }).map((_, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: 64,
                      height: 64,
                      borderRadius: 10,
                      border: "2px solid #d8cdb2",
                      background: i === 3 ? "#a9762e" : "#f7f3ea",
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      ),
      { width: 1200, height: 630, fonts },
    );
  }

  const vm = buildResult(payload, todayKST());
  const best = vm?.top3[0];

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "#f7f3ea",
          color: "#2b2b2b",
        }}
      >
        <div style={{ display: "flex", fontSize: 40, color: "#7a756a" }}>
          {vm?.purpose.icon} {vm?.name}님의 {vm?.purpose.label} 좋은 날
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 132,
            fontWeight: 700,
            marginTop: 24,
            color: vm?.purpose.color ?? "#2b2b2b",
          }}
        >
          {best ? best.labelKo : "좋은 날 추천"}
        </div>
        {best && (
          <div style={{ display: "flex", fontSize: 40, marginTop: 16, color: "#4a4a4a" }}>
            추천 점수 {best.score}점 · {best.gapjaName}
            {best.isSonNal ? " · 손 없는 날" : ""}
          </div>
        )}
        <div
          style={{
            display: "flex",
            fontSize: 28,
            marginTop: 48,
            color: "#a8843f",
            letterSpacing: 6,
          }}
        >
          좋은날 · 택일 추천
        </div>
      </div>
    ),
    { width: 1200, height: 630, fonts },
  );
}
