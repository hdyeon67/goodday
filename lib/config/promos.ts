// 크로스 프로모션 대상 앱 목록 (config 배열).
// 앞으로 앱이 늘면 여기에 항목만 추가하면 배너가 자동 노출된다.

export interface PromoApp {
  id: string;
  emoji: string;
  title: string;
  desc: string;
  href: string;
  /** 배너 배경 힌트 컬러 */
  color: string;
}

export const PROMOS: PromoApp[] = [
  {
    id: "chemicheck",
    emoji: "💞",
    title: "궁합도 궁금하다면?",
    desc: "이름과 생년월일로 보는 케미체크",
    href: "https://chemicheck.vercel.app",
    color: "#ff5db1",
  },
];
