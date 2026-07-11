"use client";

import Link from "next/link";
import type { HeatCell } from "@/lib/result/build";

// 점수 → 컬러 강도 (공개 칸만). 잠긴 칸은 블러+회색.
function tone(score: number): string {
  if (score >= 80) return "#8a6d3b";
  if (score >= 68) return "#a8843f";
  if (score >= 54) return "#c9b382";
  if (score >= 45) return "#d9cfb4";
  return "#e4dcc8";
}

/** 30일 히트맵 — TOP3만 컬러 공개, 나머지는 블러 잠금 (프리미엄 유도) */
export function Heatmap({ cells }: { cells: HeatCell[] }) {
  return (
    <section>
      <div className="mb-2 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-meok">30일 한눈에 보기</h2>
        <span className="text-[11px] text-meok-faint">상위 3일만 공개</span>
      </div>

      <div className="relative">
        <div className="grid grid-cols-6 gap-1.5">
          {cells.map((c) => {
            const d = new Date(c.dateISO + "T00:00:00Z").getUTCDate();
            return (
              <div
                key={c.dateISO}
                className="flex aspect-square flex-col items-center justify-center rounded-lg text-[10px]"
                style={{
                  backgroundColor: c.revealed ? tone(c.score) : "#e7e0d0",
                  color: c.revealed && c.score >= 60 ? "#fff" : "#7a756a",
                  filter: c.revealed ? "none" : "blur(1.5px)",
                  opacity: c.revealed ? 1 : 0.55,
                }}
                aria-hidden={!c.revealed}
              >
                <span className="font-serif text-xs leading-none">{d}</span>
                {c.revealed && (
                  <span className="mt-0.5 leading-none">{c.score}</span>
                )}
              </div>
            );
          })}
        </div>

        {/* 블러 영역 클릭 유도 오버레이 */}
        <Link
          href="/calendar"
          className="absolute inset-x-0 bottom-0 top-[36%] flex items-end justify-center rounded-b-xl bg-gradient-to-t from-hanji via-hanji/80 to-transparent pb-2"
        >
          <span className="rounded-full bg-meok/90 px-4 py-1.5 text-xs font-medium text-hanji shadow-sm">
            🔒 30일 전체 캘린더 열어보기
          </span>
        </Link>
      </div>
    </section>
  );
}
