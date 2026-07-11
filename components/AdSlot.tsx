"use client";

import { useEffect, useRef } from "react";
import { ADSENSE_CLIENT, ADSENSE_ENABLED } from "@/lib/config/flags";

/**
 * 애드센스 광고 슬롯 — env 로 온오프.
 *   NEXT_PUBLIC_ADSENSE_ENABLED=true 이고 NEXT_PUBLIC_ADSENSE_CLIENT 가 있어야 노출.
 * 비활성 시엔 아무것도 렌더하지 않아 레이아웃을 깨지 않는다.
 */
export function AdSlot({ slot, className = "" }: { slot: string; className?: string }) {
  const enabled = ADSENSE_ENABLED;
  const ref = useRef<HTMLModElement>(null);

  useEffect(() => {
    if (!enabled) return;
    try {
      // @ts-expect-error adsbygoogle 전역
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      /* noop */
    }
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div className={`my-6 text-center ${className}`}>
      <ins
        ref={ref}
        className="adsbygoogle block"
        style={{ display: "block" }}
        data-ad-client={ADSENSE_CLIENT}
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}
