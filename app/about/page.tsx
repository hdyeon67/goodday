import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter } from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: "서비스 소개 | 좋은날",
  description: "좋은날은 어떻게 날을 고르나요? 재미와 참고용 택일 콘텐츠 안내.",
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-hanji">
      <div className="mx-auto w-full max-w-md px-5 pb-16 pt-8">
        <Link href="/" className="text-xs text-meok-faint">
          ← 처음으로
        </Link>

        <header className="mt-4">
          <h1 className="font-serif text-2xl text-meok">좋은날 소개</h1>
        </header>

        <section className="mt-6 space-y-5 text-sm leading-relaxed text-meok-soft">
          <div>
            <h2 className="mb-1 font-semibold text-meok">어떤 서비스인가요?</h2>
            <p>
              이름·생년월일과 목적을 넣으면, 향후 30일 중 그 일에 어울리는 좋은
              날 세 개와 살짝 피하면 좋은 날을 골라 드려요. 이사, 계약, 면접,
              고백, 개업, 여행, 병원, 머리 자르기까지 여덟 가지 목적을 지원해요.
            </p>
          </div>

          <div>
            <h2 className="mb-1 font-semibold text-meok">어떻게 고르나요?</h2>
            <p>
              만세력으로 각 날의 일진(천간·지지)을 구하고, 사용자 일간의 오행과의
              상생·상극, 띠와 지지의 삼합·육합·충, 손 없는 날 같은 전통 택일
              규칙, 그리고 목적별 유리한 기운과 요일을 종합해 0~100점으로
              계산해요. 모든 계산은 정해진 규칙에 따르며, 같은 입력이면 항상 같은
              결과가 나와요.
            </p>
          </div>

          <div>
            <h2 className="mb-1 font-semibold text-meok">개인정보를 저장하나요?</h2>
            <p>
              아니요. 데이터베이스가 없어요. 입력하신 값은 결과 링크 안에만
              담기고 서버에 저장되지 않아요.
            </p>
          </div>

          <div className="rounded-2xl border border-hanji-deep bg-white/50 p-4">
            <h2 className="mb-1 font-semibold text-meok">꼭 알아두세요</h2>
            <p className="text-meok-faint">
              좋은날은 재미와 참고를 위한 엔터테인먼트 콘텐츠예요. 의료·투자·법률
              등 중요한 결정의 근거로 삼지 마세요. 좋은 날은 거들 뿐, 결정은 늘
              당신의 몫이에요.
            </p>
          </div>
        </section>
      </div>
      <SiteFooter />
    </main>
  );
}
