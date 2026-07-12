"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { PURPOSES, type PurposeId } from "@/lib/engine";
import { encodePayload } from "@/lib/share";
import { OHAENG_HINT } from "@/lib/copy";
import type { ResultVM } from "@/lib/result/build";
import { AdSlot } from "@/components/AdSlot";
import { CrossPromo } from "@/components/CrossPromo";
import { Heatmap } from "./Heatmap";
import { ShareBar } from "./ShareBar";

const MEDALS = ["🥇", "🥈", "🥉"];

export function ResultView({
  data,
  name,
  birth,
  ogImageUrl,
  cardImageUrl,
}: {
  data: ResultVM;
  name: string;
  birth: string;
  ogImageUrl: string;
  cardImageUrl: string;
}) {
  const router = useRouter();
  const { purpose } = data;

  function repick(p: PurposeId) {
    if (p === purpose.id) return;
    router.push(`/result?d=${encodePayload({ n: name, b: birth, p })}`);
  }

  const best = data.top3[0];

  return (
    <div className="mx-auto w-full max-w-md px-5 pb-16 pt-6">
      <Link href="/" className="text-xs text-meok-faint">
        ← 처음으로
      </Link>

      {/* 캡처 대상 (PNG 저장) */}
      <div id="result-card" className="mt-3">
        <header className="text-center">
          <span className="text-3xl">{purpose.icon}</span>
          <h1 className="mt-1 font-serif text-2xl text-meok">
            {name}님의 {purpose.label} 좋은 날
          </h1>
          {best && (
            <p className="mt-1 text-sm text-meok-soft">
              가장 좋은 날은 <b className="text-meok">{best.labelKo}</b> 이에요
            </p>
          )}
        </header>

        {/* TOP 3 카드 */}
        <section className="mt-6 space-y-3">
          {data.top3.map((d, i) => {
            const hint = OHAENG_HINT[d.ganOhaeng as keyof typeof OHAENG_HINT];
            return (
              <article
                key={d.dateISO}
                className="rounded-2xl border border-hanji-deep bg-white/70 p-4"
                style={i === 0 ? { borderColor: purpose.color } : undefined}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{MEDALS[i]}</span>
                      <span className="font-serif text-xl text-meok">
                        {d.labelKo}
                      </span>
                    </div>
                    <div className="mt-1 flex flex-wrap items-center gap-1.5 text-[11px]">
                      <span className="rounded-full bg-hanji-soft px-2 py-0.5 text-meok-faint">
                        {d.dday === 0 ? "오늘" : `D-${d.dday}`}
                      </span>
                      <span
                        className="rounded-full px-2 py-0.5 text-white"
                        style={{ backgroundColor: hint?.hex }}
                      >
                        {d.gapjaName} · {hint?.label}
                      </span>
                      {d.isSonNal && (
                        <span className="rounded-full bg-[#8a6d3b] px-2 py-0.5 text-white">
                          손 없는 날
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <div
                      className="font-serif text-2xl leading-none"
                      style={{ color: purpose.color }}
                    >
                      {d.score}
                    </div>
                    <div className="text-[10px] text-meok-faint">{d.bandLabel}</div>
                  </div>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-meok-soft">
                  {d.headline}
                </p>
                <p className="mt-1.5 rounded-lg bg-hanji-soft px-3 py-2 text-xs text-meok-faint">
                  💡 {d.tip}
                </p>
              </article>
            );
          })}
        </section>
      </div>

      {/* 광고 슬롯 1 (TOP3 아래) */}
      <AdSlot slot="result-top" />

      {/* 피하면 좋은 날 */}
      {data.avoid.length > 0 && (
        <section className="mt-2">
          <h2 className="mb-2 text-sm font-semibold text-meok">
            굳이 고르자면, 이런 날은 살짝 피해요
          </h2>
          <div className="space-y-2">
            {data.avoid.map((d) => (
              <div
                key={d.dateISO}
                className="rounded-xl border border-hanji-deep bg-white/40 px-4 py-3"
              >
                <div className="flex items-center justify-between">
                  <span className="font-serif text-meok">{d.labelKo}</span>
                  <span className="text-[11px] text-meok-faint">
                    {d.dday === 0 ? "오늘" : `D-${d.dday}`}
                  </span>
                </div>
                <p className="mt-1 text-xs text-meok-faint">{d.headline}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 30일 히트맵 (블러 잠금) */}
      <div className="mt-8">
        <Heatmap cells={data.heatmap} />
      </div>

      {/* 광고 슬롯 2 (히트맵 아래) */}
      <AdSlot slot="result-bottom" />

      {/* 공유 */}
      <section className="mt-8">
        <h2 className="mb-2 text-sm font-semibold text-meok">결과 공유하기</h2>
        <ShareBar
          title={`${name}님의 ${purpose.label} 좋은 날`}
          description={best ? `${best.labelKo}이 가장 좋아요` : "좋은 날 추천"}
          ogImageUrl={ogImageUrl}
          cardImageUrl={cardImageUrl}
        />
      </section>

      {/* 다른 목적으로 다시 보기 (재방문 장치, 입력값 유지) */}
      <section className="mt-8">
        <h2 className="mb-2 text-sm font-semibold text-meok">
          다른 목적으로 다시 보기
        </h2>
        <div className="grid grid-cols-4 gap-2">
          {PURPOSES.map((p) => {
            const active = p.id === purpose.id;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => repick(p.id)}
                disabled={active}
                className={[
                  "flex flex-col items-center gap-1 rounded-xl border py-2 text-[11px] transition",
                  active
                    ? "border-transparent bg-hanji-deep text-meok-faint"
                    : "border-hanji-deep bg-white/50 text-meok-soft hover:bg-white",
                ].join(" ")}
              >
                <span className="text-lg">{p.icon}</span>
                {p.label}
              </button>
            );
          })}
        </div>
      </section>

      {/* 크로스 프로모션 */}
      <section className="mt-8">
        <CrossPromo />
      </section>
    </div>
  );
}
