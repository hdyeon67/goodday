import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { decodePayload } from "@/lib/share";
import { todayKST } from "@/lib/engine";
import { buildResult } from "@/lib/result/build";
import { ResultView } from "@/components/result/ResultView";
import { SiteFooter } from "@/components/SiteFooter";
import { siteUrl } from "@/lib/config/site";

// Next 15: searchParams 는 Promise 로 전달된다.
type SearchParams = Promise<{ d?: string }>;

export async function generateMetadata({
  searchParams,
}: {
  searchParams: SearchParams;
}): Promise<Metadata> {
  const { d: dParam } = await searchParams;
  const payload = decodePayload(dParam);
  if (!payload) return { title: "좋은날" };
  const vm = buildResult(payload, todayKST());
  if (!vm) return { title: "좋은날" };

  const best = vm.top3[0];
  const title = `${vm.name}님의 ${vm.purpose.label} 좋은 날`;
  const desc = best ? `${best.labelKo}이 가장 좋아요` : "향후 30일 좋은 날 추천";
  const og = `${siteUrl()}/api/og?d=${encodeURIComponent(dParam ?? "")}`;

  return {
    title,
    description: desc,
    openGraph: {
      title,
      description: desc,
      images: [{ url: og, width: 1200, height: 630 }],
    },
    twitter: { card: "summary_large_image", title, description: desc, images: [og] },
  };
}

export default async function ResultPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { d: dParam } = await searchParams;
  const payload = decodePayload(dParam);
  if (!payload) redirect("/");

  const vm = buildResult(payload, todayKST());
  if (!vm) redirect("/");

  const d = encodeURIComponent(dParam ?? "");
  const og = `${siteUrl()}/api/og?d=${d}`;
  const card = `/api/card?d=${d}`;

  return (
    <main className="min-h-screen bg-hanji">
      <ResultView
        data={vm}
        name={payload.n}
        birth={payload.b}
        ogImageUrl={og}
        cardImageUrl={card}
      />
      <SiteFooter />
    </main>
  );
}
