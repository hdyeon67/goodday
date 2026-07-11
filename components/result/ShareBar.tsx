"use client";

import { useState } from "react";
import { shareKakao } from "@/lib/share";

/** 공유 바 — 카카오톡 / 링크 복사 / 결과 카드 PNG 저장 */
export function ShareBar({
  captureId,
  title,
  description,
  ogImageUrl,
}: {
  captureId: string;
  title: string;
  description: string;
  ogImageUrl: string;
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

  async function savePng() {
    setBusy(true);
    try {
      const el = document.getElementById(captureId);
      if (!el) return;
      const { toPng } = await import("html-to-image");
      const dataUrl = await toPng(el, {
        pixelRatio: 2,
        backgroundColor: "#f7f3ea",
      });
      const a = document.createElement("a");
      a.href = dataUrl;
      a.download = "goodday.png";
      a.click();
    } catch {
      /* noop */
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
        onClick={savePng}
        disabled={busy}
        className="rounded-xl border border-hanji-deep bg-white py-3 text-sm font-medium text-meok-soft disabled:opacity-50"
      >
        {busy ? "저장 중…" : "이미지 저장"}
      </button>
    </div>
  );
}
