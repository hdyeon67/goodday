import { ImageResponse } from "next/og";
import { decodePayload } from "@/lib/share";
import { todayKST } from "@/lib/engine";
import { buildResult } from "@/lib/result/build";
import { OHAENG_HINT } from "@/lib/copy";

export const runtime = "nodejs";

// 결과 카드 저장용 세로형 이미지 (헤더 + TOP3, 하단 마진 포함).
// html-to-image(클라이언트 DOM 캡처)는 기기에 따라 깨지므로, OG와 동일한
// 서버 렌더링(Satori)으로 안정적으로 생성한다.

const FONT_BOLD =
  "https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/public/static/Pretendard-Bold.otf";
const FONT_REG =
  "https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/public/static/Pretendard-Regular.otf";

async function font(url: string): Promise<ArrayBuffer | null> {
  try {
    const r = await fetch(url, { cache: "force-cache" });
    return r.ok ? await r.arrayBuffer() : null;
  } catch {
    return null;
  }
}

const MEDAL_BG = ["#d4a017", "#9ca3af", "#b06a3b"];

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const payload = decodePayload(searchParams.get("d"));
  const [bold, reg] = await Promise.all([font(FONT_BOLD), font(FONT_REG)]);
  const fonts = [
    ...(bold
      ? [{ name: "Pretendard", data: bold, weight: 700 as const, style: "normal" as const }]
      : []),
    ...(reg
      ? [{ name: "Pretendard", data: reg, weight: 400 as const, style: "normal" as const }]
      : []),
  ];

  const vm = payload ? buildResult(payload, todayKST()) : null;

  if (!vm) {
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
            fontSize: 64,
          }}
        >
          좋은날
        </div>
      ),
      { width: 800, height: 400, fonts: fonts.length ? fonts : undefined },
    );
  }

  const best = vm.top3[0];

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: "#f7f3ea",
          padding: "44px 40px 56px", // 하단 마진 넉넉히
          fontFamily: "Pretendard",
          color: "#2b2b2b",
        }}
      >
        {/* 헤더 */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div style={{ display: "flex", fontSize: 40, fontWeight: 700 }}>
            {vm.name}님의 {vm.purpose.label} 좋은 날
          </div>
          {best && (
            <div style={{ display: "flex", fontSize: 24, marginTop: 8, color: "#4a4a4a" }}>
              가장 좋은 날은 {best.labelKo}
            </div>
          )}
        </div>

        {/* TOP3 카드 */}
        <div style={{ display: "flex", flexDirection: "column", marginTop: 28 }}>
          {vm.top3.map((d, i) => {
            const hint = OHAENG_HINT[d.ganOhaeng as keyof typeof OHAENG_HINT];
            return (
              <div
                key={d.dateISO}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  background: "#ffffff",
                  border: `2px solid ${i === 0 ? vm.purpose.color : "#e4dcc8"}`,
                  borderRadius: 20,
                  padding: "20px 22px",
                  marginBottom: 18,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: 34,
                        height: 34,
                        borderRadius: 17,
                        background: MEDAL_BG[i],
                        color: "#fff",
                        fontSize: 18,
                        fontWeight: 700,
                        marginRight: 12,
                      }}
                    >
                      {i + 1}
                    </div>
                    <div style={{ display: "flex", fontSize: 30, fontWeight: 700 }}>
                      {d.labelKo}
                    </div>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
                    <div style={{ display: "flex", fontSize: 34, fontWeight: 700, color: vm.purpose.color }}>
                      {d.score}
                    </div>
                    <div style={{ display: "flex", fontSize: 14, color: "#7a756a" }}>{d.bandLabel}</div>
                  </div>
                </div>

                {/* 배지 */}
                <div style={{ display: "flex", marginTop: 10 }}>
                  <div
                    style={{
                      display: "flex",
                      fontSize: 15,
                      color: "#7a756a",
                      background: "#efe9db",
                      borderRadius: 12,
                      padding: "2px 10px",
                      marginRight: 8,
                    }}
                  >
                    {d.dday === 0 ? "오늘" : `D-${d.dday}`}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      fontSize: 15,
                      color: "#fff",
                      background: hint?.hex ?? "#7a756a",
                      borderRadius: 12,
                      padding: "2px 10px",
                      marginRight: 8,
                    }}
                  >
                    {d.gapjaName} · {hint?.label}
                  </div>
                  {d.isSonNal && (
                    <div
                      style={{
                        display: "flex",
                        fontSize: 15,
                        color: "#fff",
                        background: "#8a6d3b",
                        borderRadius: 12,
                        padding: "2px 10px",
                      }}
                    >
                      손 없는 날
                    </div>
                  )}
                </div>

                {/* 이유 */}
                <div style={{ display: "flex", fontSize: 19, marginTop: 12, color: "#4a4a4a", lineHeight: 1.4 }}>
                  {d.headline}
                </div>
              </div>
            );
          })}
        </div>

        {/* 브랜드 푸터 */}
        <div style={{ display: "flex", justifyContent: "center", marginTop: 6 }}>
          <div style={{ display: "flex", fontSize: 18, color: "#a8843f", letterSpacing: 4 }}>
            좋은날 · 택일 추천
          </div>
        </div>
      </div>
    ),
    { width: 800, height: 980, fonts: fonts.length ? fonts : undefined },
  );
}
