import type { Config } from "tailwindcss";

// 좋은날 디자인 토큰: 한지 아이보리 배경 + 먹색 텍스트.
// 절기·달력 감성의 차분한 무드. 목적별 포인트 컬러는 Phase 4에서 확장한다.
const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // 한지 아이보리 배경 계열
        hanji: {
          DEFAULT: "#f7f3ea",
          soft: "#efe9db",
          deep: "#e4dcc8",
        },
        // 먹색 텍스트 계열
        meok: {
          DEFAULT: "#2b2b2b",
          soft: "#4a4a4a",
          faint: "#7a756a",
        },
        // shadcn 계열 토큰 (EDEN 표준 푸터 등이 사용) — 한지/먹 팔레트에 매핑
        border: "hsl(var(--border))",
        foreground: "hsl(var(--foreground))",
        "muted-foreground": "hsl(var(--muted-foreground))",
        primary: "hsl(var(--primary))",
      },
      fontFamily: {
        sans: ["Pretendard", "ui-sans-serif", "system-ui", "sans-serif"],
        // 날짜 숫자용 세리프 (대비)
        serif: ["'Noto Serif KR'", "ui-serif", "Georgia", "serif"],
      },
    },
  },
  plugins: [],
};

export default config;
