import type { Metadata } from "next";
import Link from "next/link";
import { NotifyForm } from "@/components/NotifyForm";
import { SiteFooter } from "@/components/SiteFooter";
import { PAYMENT_ENABLED } from "@/lib/config/flags";

export const metadata: Metadata = {
  title: "프리미엄 30일 캘린더 | 좋은날",
  description: "30일 전체를 컬러 캘린더로 — 곧 만나요.",
};

export default function CalendarPage() {
  return (
    <main className="min-h-screen bg-hanji">
      <div className="mx-auto w-full max-w-md px-5 pb-16 pt-8">
        <Link href="/" className="text-xs text-meok-faint">
          ← 처음으로
        </Link>

        <header className="mt-4 text-center">
          <span className="text-3xl">🗓️</span>
          <h1 className="mt-2 font-serif text-2xl text-meok">
            프리미엄 30일 캘린더
          </h1>
          <p className="mt-1 text-sm text-meok-soft">
            상위 3일만이 아니라, 30일 전부를 한눈에.
          </p>
        </header>

        {/* 잠금 데모 — 블러 처리된 풀 캘린더 미리보기 */}
        <div className="relative mt-6">
          <div className="grid grid-cols-6 gap-1.5" aria-hidden>
            {Array.from({ length: 30 }).map((_, i) => (
              <div
                key={i}
                className="flex aspect-square items-center justify-center rounded-lg bg-hanji-deep text-[10px] text-meok-faint"
                style={{ filter: "blur(2px)", opacity: 0.6 }}
              >
                {i + 1}
              </div>
            ))}
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="rounded-full bg-meok/90 px-4 py-2 text-xs font-medium text-hanji">
              🔒 프리미엄에서 공개
            </span>
          </div>
        </div>

        <ul className="mt-6 space-y-2 text-sm text-meok-soft">
          <li>· 30일 전체 점수 컬러 캘린더</li>
          <li>· 목적별 좋은 날 모아보기</li>
          <li>· 손 없는 날·주말 필터</li>
          <li>· 결과 PDF 저장</li>
        </ul>

        <div className="mt-8">
          {PAYMENT_ENABLED ? (
            <button
              type="button"
              className="w-full rounded-xl bg-meok py-3.5 text-sm font-medium text-hanji"
            >
              프리미엄 시작하기
            </button>
          ) : (
            <div className="rounded-2xl border border-hanji-deep bg-white/50 p-4">
              <p className="mb-3 text-center text-sm text-meok-soft">
                아직 준비 중이에요. 출시되면 알려드릴게요.
              </p>
              <NotifyForm />
            </div>
          )}
        </div>
      </div>
      <SiteFooter />
    </main>
  );
}
