// Kakao JS SDK 로더 (선택) — NEXT_PUBLIC_KAKAO_JS_KEY 없으면 비활성.
// (케미체크 패턴 재사용)

declare global {
  interface Window {
    Kakao?: {
      isInitialized?: () => boolean;
      init?: (key: string) => void;
      Share?: {
        sendDefault?: (opts: unknown) => void;
      };
    };
  }
}

const KAKAO_KEY = process.env.NEXT_PUBLIC_KAKAO_JS_KEY;

/** SDK 로드 + 초기화. 키가 없으면 false. */
export async function ensureKakao(): Promise<boolean> {
  if (!KAKAO_KEY) return false;
  if (typeof window === "undefined") return false;

  if (!window.Kakao) {
    await new Promise<void>((resolve, reject) => {
      const s = document.createElement("script");
      s.src = "https://t1.kakaocdn.net/kakao_js_sdk/2.7.2/kakao.min.js";
      s.integrity =
        "sha384-TiCUE00h649CAMonG018J2ujOgDKW/kVWlChEuu4jK2vxfAAD0eZxzCKakxg55G4";
      s.crossOrigin = "anonymous";
      s.onload = () => resolve();
      s.onerror = () => reject(new Error("kakao sdk load failed"));
      document.head.appendChild(s);
    }).catch(() => undefined);
  }

  const k = window.Kakao;
  if (!k?.init) return false;
  if (!k.isInitialized?.()) k.init(KAKAO_KEY);
  return true;
}

/** 카카오 공유 (SDK 없으면 무시) */
export async function shareKakao(opts: {
  title: string;
  description: string;
  imageUrl: string;
  linkUrl: string;
}): Promise<boolean> {
  const ok = await ensureKakao();
  if (!ok || !window.Kakao?.Share?.sendDefault) return false;
  window.Kakao.Share.sendDefault({
    objectType: "feed",
    content: {
      title: opts.title,
      description: opts.description,
      imageUrl: opts.imageUrl,
      link: { mobileWebUrl: opts.linkUrl, webUrl: opts.linkUrl },
    },
    buttons: [
      {
        title: "내 좋은 날 보기",
        link: { mobileWebUrl: opts.linkUrl, webUrl: opts.linkUrl },
      },
    ],
  });
  return true;
}
