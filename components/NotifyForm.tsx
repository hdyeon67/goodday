"use client";

import { useState } from "react";

/**
 * 프리미엄 알림 신청 폼 — Formspree 등 무료 폼 엔드포인트로 이메일만 전송.
 *   NEXT_PUBLIC_NOTIFY_FORM_ENDPOINT 없으면 "준비 중" 안내만 노출.
 */
export function NotifyForm() {
  const endpoint = process.env.NEXT_PUBLIC_NOTIFY_FORM_ENDPOINT;
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">(
    "idle",
  );

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!endpoint || !email) return;
    setState("sending");
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ email, service: "goodday-premium" }),
      });
      setState(res.ok ? "done" : "error");
    } catch {
      setState("error");
    }
  }

  if (state === "done") {
    return (
      <p className="rounded-xl bg-hanji-soft px-4 py-3 text-center text-sm text-meok-soft">
        신청 완료! 준비되면 가장 먼저 알려드릴게요 🙌
      </p>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-2">
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="이메일 주소"
        className="w-full rounded-xl border border-hanji-deep bg-white px-4 py-3 text-sm text-meok outline-none focus:border-meok-faint"
      />
      <button
        type="submit"
        disabled={!endpoint || state === "sending"}
        className="w-full rounded-xl bg-meok py-3 text-sm font-medium text-hanji disabled:opacity-40"
      >
        {!endpoint
          ? "알림 신청 준비 중"
          : state === "sending"
            ? "신청 중…"
            : "출시되면 알림 받기"}
      </button>
      {state === "error" && (
        <p className="text-center text-xs text-[#c0563b]">
          잠시 후 다시 시도해 주세요.
        </p>
      )}
    </form>
  );
}
