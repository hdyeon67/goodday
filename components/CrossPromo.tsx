import { PROMOS } from "@/lib/config/promos";

/** 결과 페이지 하단 크로스 프로모션 배너 (config 배열 기반) */
export function CrossPromo() {
  if (PROMOS.length === 0) return null;
  return (
    <div className="space-y-2">
      {PROMOS.map((p) => (
        <a
          key={p.id}
          href={p.href}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 rounded-2xl border border-hanji-deep bg-white/60 px-4 py-3 transition hover:bg-white"
        >
          <span
            className="flex size-9 items-center justify-center rounded-full text-lg"
            style={{ backgroundColor: `${p.color}22` }}
          >
            {p.emoji}
          </span>
          <span className="flex-1">
            <span className="block text-sm font-medium text-meok">{p.title}</span>
            <span className="block text-xs text-meok-faint">{p.desc}</span>
          </span>
          <span className="text-meok-faint">→</span>
        </a>
      ))}
    </div>
  );
}
