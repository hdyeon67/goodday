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

  // 폴백: 페이로드 해석 실패 시 브랜드 카드
  if (!payload) {
    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#f7f3ea",
            color: "#2b2b2b",
            fontSize: 72,
          }}
        >
          좋은날
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
