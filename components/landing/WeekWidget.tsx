"use client";

import { useState } from "react";
import {
  bestThisWeek,
  formatKo,
  GENERAL_PURPOSE,
  todayKST,
} from "@/lib/engine";

const BIRTH_RE = /^\d{4}-\d{2}-\d{2}$/;

/** 생년월일만으로 이번 주(7일) 최고의 날 1개를 즉시 보여주는 재방문 위젯 */
export function WeekWidget() {
  const [birth, setBirth] = useState("");
  const [result, setResult] = useState<{ label: string; score: number } | null>(
    null,
  );

  function check(value: string) {
    setBirth(value);
    if (!BIRTH_RE.test(value)) {
      setResult(null);
      return;
    }
    const best = bestThisWeek({
      name: "이번주",
      birth: value,
      purpose: GENERAL_PURPOSE,
      startISO: todayKST(),
    });
    if (best) setResult({ label: formatKo(best.dateISO), score: best.score });
  }

  return (
    <section className="mt-10 rounded-2xl border border-hanji-deep bg-white/40 p-5">
      <h2 className="text-sm font-semibold text-meok">🗓️ 이번 주 나의 좋은 날</h2>
      <p className="mt-1 text-xs text-meok-faint">
        생년월일만 넣으면 이번 주 최고의 하루를 살짝 알려드려요.
      </p>
      <input
        type="date"
        value={birth}
        min="1900-01-01"
        max="2025-12-31"
        onChange={(e) => check(e.target.value)}
        className="mt-3 w-full rounded-xl border border-hanji-deep bg-white px-4 py-2.5 text-sm text-meok outline-none focus:border-meok-faint"
      />
      {result && (
        <div className="mt-3 rounded-xl bg-hanji-soft px-4 py-3 text-center">
          <p className="text-xs text-meok-faint">이번 주는</p>
          <p className="font-serif text-2xl text-meok">{result.label}</p>
          <p className="mt-0.5 text-xs text-meok-soft">
            컨디션 점수 {result.score}점 · 가볍게 참고하세요
          </p>
        </div>
      )}
    </section>
  );
}
