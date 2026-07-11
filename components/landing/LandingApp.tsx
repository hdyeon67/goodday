"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { PURPOSES, type PurposeId } from "@/lib/engine";
import { encodePayload } from "@/lib/share";
import { WeekWidget } from "./WeekWidget";

const BIRTH_RE = /^\d{4}-\d{2}-\d{2}$/;

export function LandingApp() {
  const router = useRouter();
  const [purpose, setPurpose] = useState<PurposeId | null>(null);
  const [name, setName] = useState("");
  const [birth, setBirth] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const valid = useMemo(
    () => Boolean(purpose) && name.trim().length > 0 && BIRTH_RE.test(birth),
    [purpose, name, birth],
  );

  function submit() {
    if (!valid || !purpose) return;
    setSubmitting(true);
    const d = encodePayload({ n: name.trim(), b: birth, p: purpose });
    router.push(`/result?d=${d}`);
  }

  return (
    <div className="mx-auto w-full max-w-md px-5 pb-16 pt-8">
      <header className="text-center">
        <h1 className="font-serif text-4xl tracking-tight text-meok">좋은날</h1>
        <p className="mt-2 text-sm text-meok-soft">
          무엇을 하려고 하세요? 향후 30일 중 좋은 날을 골라 드려요.
        </p>
      </header>

      {/* 1) 목적 선택 그리드 */}
      <section className="mt-8">
        <h2 className="mb-3 text-xs font-medium text-meok-faint">목적 선택</h2>
        <div className="grid grid-cols-4 gap-2">
          {PURPOSES.map((p) => {
            const active = purpose === p.id;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => setPurpose(p.id)}
                aria-pressed={active}
                className={[
                  "flex aspect-square flex-col items-center justify-center gap-1 rounded-2xl border text-center transition",
                  active
                    ? "border-transparent text-white shadow-sm"
                    : "border-hanji-deep bg-white/50 text-meok-soft hover:bg-white",
                ].join(" ")}
                style={active ? { backgroundColor: p.color } : undefined}
              >
                <span className="text-2xl leading-none">{p.icon}</span>
                <span className="px-1 text-[11px] font-medium leading-tight">
                  {p.label}
                </span>
              </button>
            );
          })}
        </div>
        {purpose && (
          <p className="mt-2 text-center text-xs text-meok-faint">
            {PURPOSES.find((p) => p.id === purpose)?.tagline}
          </p>
        )}
      </section>

      {/* 2) 이름·생년월일 입력 */}
      <section className="mt-7 space-y-3">
        <div>
          <label className="mb-1 block text-xs font-medium text-meok-faint">
            이름
          </label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="이름 (별명도 좋아요)"
            maxLength={16}
            className="w-full rounded-xl border border-hanji-deep bg-white px-4 py-3 text-meok outline-none placeholder:text-meok-faint/60 focus:border-meok-faint"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-meok-faint">
            생년월일
          </label>
          <input
            type="date"
            value={birth}
            min="1900-01-01"
            max="2025-12-31"
            onChange={(e) => setBirth(e.target.value)}
            className="w-full rounded-xl border border-hanji-deep bg-white px-4 py-3 text-meok outline-none focus:border-meok-faint"
          />
        </div>

        <button
          type="button"
          disabled={!valid || submitting}
          onClick={submit}
          className="mt-2 w-full rounded-xl bg-meok py-3.5 text-center font-medium text-hanji transition disabled:cursor-not-allowed disabled:opacity-40"
        >
          {submitting ? "좋은 날 고르는 중…" : "내 좋은 날 보기"}
        </button>
        <p className="text-center text-[11px] text-meok-faint">
          입력값은 저장되지 않아요. 결과는 링크에만 담겨요.
        </p>
      </section>

      {/* 3) 이번 주 나의 좋은 날 미니 위젯 */}
      <WeekWidget />

      <p className="mt-10 text-center text-[11px] leading-relaxed text-meok-faint">
        재미와 참고용 엔터테인먼트 콘텐츠예요.
        <br />
        의료·투자·법률 결정의 근거로 삼지 마세요.
      </p>
    </div>
  );
}
