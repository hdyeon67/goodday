// 크로스 프로모션 대상 앱 목록 (config 배열).
// 앞으로 앱이 늘면 여기에 항목만 추가하면 배너가 자동 노출된다.
//
// href 는 안정 커스텀 도메인(fineboll.com 서브도메인)을 쓴다. 이 도메인은 호스팅
// (Vercel→Cloudflare 컷오버)과 무관하게 동일하게 유지되므로 컷오버 전후 그대로 동작.

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
    // 날 잡았으면 봉투 차례 — 경조사 실용 흐름으로 연결 (크로스프로모 스펙 v2: 좋은날 → 축의금, 출시 후)
    id: "bongtu",
    emoji: "💌",
    title: "날 잡았으면, 봉투 차례?",
    desc: "관계·상황별 축의금 3초 계산",
    href: "https://bongtu.fineboll.com",
    color: "#e0a458",
  },
  {
    id: "chemicheck",
    emoji: "💞",
    title: "궁합도 궁금하다면?",
    desc: "이름과 생년월일로 보는 케미체크",
    href: "https://chemicheck.fineboll.com",
    color: "#ff5db1",
  },
  {
    id: "saju",
    emoji: "🔮",
    title: "내 사주가 궁금하다면?",
    desc: "생년월일로 보는 사주풀이",
    href: "https://saju.fineboll.com",
    color: "#7c5cff",
  },
];
