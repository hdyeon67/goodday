# 좋은날 (goodday)

이름·생년월일과 **목적**을 입력하면, 향후 30일 중 그 일에 좋은 날 **TOP 3**와
피하면 좋은 날을 추천하는 무료 택일(擇日) 웹 서비스.

- 목적 8종: 이사 / 계약·큰 결제 / 면접·시험 / 고백·소개팅 / 개업·출시 / 여행 출발 / 병원·시술 / 머리 자르기
- **DB 없음, 실시간 AI 호출 없음** — 모든 계산은 결정적(deterministic) 로직. 운영비 0원 지향
- 결과는 입력값을 base64url 로 인코딩한 `?d=` 쿼리에만 담김 (개인정보 미저장)
- 재미·참고용 엔터테인먼트 콘텐츠 (의료·투자·법률 조언 아님)

## 기술 스택
Next.js 14 (App Router) · TypeScript · Tailwind CSS · Vitest · Vercel 배포
유일한 런타임 의존성: `korean-lunar-calendar`(음력 변환), `html-to-image`(결과 PNG 저장)

## 프로젝트 구조
```
lib/
  saju-core/   만세력·오행 공용 모듈 (일진·천간·지지·오행·음력·손없는날). 프레임워크 무관
  engine/      날짜 점수 엔진 (오행40·지지25·전통택일20·목적보정15) + 목적 매트릭스
  copy/        해석 문구 풀 200개+ (구간5×목적8×변형5) + 결정적 선택 로직
  share/       base64url 공유 코덱 + 카카오 SDK 로더
  result/      결과 뷰모델 빌더 (결과 페이지 · OG 이미지 공용)
  config/      기능 플래그 · 크로스 프로모션 목록
app/
  page.tsx           랜딩 (목적 그리드 → 입력 → 결과, 이번 주 위젯)
  result/page.tsx    결과 (TOP3 · 피할 날 · 30일 히트맵 · 공유 · 재선택)
  calendar/page.tsx  프리미엄 미리보기 (잠금 데모 + 알림 신청)
  about/page.tsx     서비스 소개 · 엔터테인먼트 고지
  api/og/route.tsx   동적 OG 이미지 (@vercel/og)
components/          UI (랜딩·결과·푸터·광고·크로스프로모션)
```

> `lib/saju-core` 는 케미체크의 검증된 계산 모듈을 재사용·확장한 것으로, 다른 앱과
> 공유할 수 있도록 순수 TS 로 유지한다. 추후 `packages/saju-core` 로 승격 가능.

## 로컬 실행
```bash
npm install
npm test        # 단위 테스트 (saju-core / engine / copy)
npm run dev     # http://localhost:3000
```

## 환경 변수 (`.env.local`, `.env.example` 참고)
| 변수 | 기본 | 설명 |
|------|------|------|
| `PAYMENT_ENABLED` | `false` | 프리미엄 결제 플래그. false 면 UI 만 노출(비활성) |
| `NEXT_PUBLIC_ADSENSE_ENABLED` | `false` | 애드센스 온오프 |
| `NEXT_PUBLIC_ADSENSE_CLIENT` | — | `ca-pub-…` 퍼블리셔 ID |
| `NEXT_PUBLIC_KAKAO_JS_KEY` | — | 카카오 공유 JS 키 (없으면 링크 복사로 폴백) |
| `NEXT_PUBLIC_NOTIFY_FORM_ENDPOINT` | — | Formspree 등 알림 신청 폼 엔드포인트 |
| `NEXT_PUBLIC_SITE_URL` | `http://localhost:3000` | OG 이미지 절대경로 생성용 배포 도메인 |

## 배포 (Vercel)
1. GitHub 저장소로 푸시 후 [Vercel](https://vercel.com) 에서 **New Project → Import**.
2. 프레임워크는 자동으로 **Next.js** 인식. 빌드 명령/출력 디렉터리 기본값 그대로.
3. **Environment Variables** 에 위 표의 값 등록. 최소 `NEXT_PUBLIC_SITE_URL` 을 배포
   도메인(예: `https://goodday.vercel.app`)으로 설정해야 OG·공유 링크가 정확해진다.
4. **Deploy**. 배포 후 `/result?d=…` 결과 페이지와 `/api/og?d=…` OG 이미지가
   정상 동작하는지 확인.
5. (선택) 로고: `public/logo.png` 추가 시 푸터에 로고 노출. 없으면 자동으로 숨김.
6. (선택) 애드센스 승인 후 `NEXT_PUBLIC_ADSENSE_*` 등록, 카카오/Formspree 키 등록.

## 프리미엄(결제) 활성화
`PAYMENT_ENABLED=true` 로 바꾸면 `/calendar` 의 "프리미엄 시작하기" 버튼이
노출된다. 실제 결제 연동(PG)은 인터페이스만 준비되어 있으므로, 결제 위젯을
버튼 핸들러에 연결하면 된다. 기본값 `false` 로 출시해도 알림 신청 폼이 대신 노출된다.

## 크로스 프로모션
`lib/config/promos.ts` 의 `PROMOS` 배열에 항목만 추가하면 결과 페이지 하단 배너에
자동 노출된다. (현재: 케미체크)

---
© EDEN APPWORKS · designed & built by eden
