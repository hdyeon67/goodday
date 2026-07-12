"use client";

import { useState } from "react";
import { shareKakao } from "@/lib/share";

/** 공유 바 — 카카오톡 / 링크 복사 / 결과 카드 PNG 저장 */
export function ShareBar({
  title,
  description,
  ogImageUrl,
  cardImageUrl,
}: {
  title: string;
  description: string;
  /** 카카오 공유용 OG 이미지 (1200×630) */
  ogImageUrl: string;
  /** 저장용 세로형 카드 이미지 (서버 렌더링) */
  cardImageUrl: string;
}) {
  const [copied, setCopied] = useState(false);
  const [busy, setBusy] = useState(false);

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* noop */
    }
  }

  // 서버에서 렌더한 카드 PNG를 내려받는다 (html-to-image 는 기기별로 깨져 미사용).
  async function saveImage() {
    setBusy(true);
    try {
      const res = await fetch(cardImageUrl);
      if (!res.ok) throw new Error("card fetch failed");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "goodday.png";
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch {
      // 폴백: 새 탭으로 이미지 열기 (사용자가 길게 눌러 저장)
      window.open(cardImageUrl, "_blank");
    } finally {
      setBusy(false);
    }
  }

  async function kakao() {
    const ok = await shareKakao({
      title,
      description,
      imageUrl: ogImageUrl,
      linkUrl: typeof window !== "undefined" ? window.location.href : "",
    });
    if (!ok) copyLink(); // 카카오 미설정 시 링크 복사로 폴백
  }

  return (
    <div className="grid grid-cols-3 gap-2">
      <button
        type="button"
        onClick={kakao}
        className="rounded-xl bg-[#FEE500] py-3 text-sm font-medium text-[#3c1e1e]"
      >
        카카오톡
      </button>
      <button
        type="button"
        onClick={copyLink}
        className="rounded-xl border border-hanji-deep bg-white py-3 text-sm font-medium text-meok-soft"
      >
        {copied ? "복사됨 ✓" : "링크 복사"}
      </button>
      <button
        type="button"
        onClick={saveImage}
        disabled={busy}
        className="rounded-xl border border-hanji-deep bg-white py-3 text-sm font-medium text-meok-soft disabled:opacity-50"
      >
        {busy ? "저장 중…" : "이미지 저장"}
      </button>
    </div>
  );
}
