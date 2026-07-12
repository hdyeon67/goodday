# Vercel → Cloudflare 이전 레시피 (검증됨)

goodday를 Vercel에서 **Cloudflare Workers(OpenNext 어댑터)** 로 이전한 실전 절차.
케미체크·사주풀이도 이 순서 그대로 각자 방(디렉터리)에서 진행하면 된다.
**핵심: 광고=상업적 이용이라 Vercel Hobby 약관 대상이 아니고, Cloudflare Workers 무료 티어는 상업 이용 허용 → 0원 유지.**

## 사전 요구
- Cloudflare 계정 + 도메인이 Cloudflare DNS에 있음 (이미 fineboll.com 세팅됨)
- `wrangler login` 1회 (브라우저 OAuth)

## 1. Next 15 업그레이드 (OpenNext 필수)
`@opennextjs/cloudflare@1.x`는 **Next 15+** 필요.
```
npm install next@^15 react@^19 react-dom@^19
npm install -D @types/react@^19 @types/react-dom@^19
```
Next 15 브레이킹: **`searchParams`/`params`가 Promise**가 됨. 페이지·generateMetadata를
`async`로 바꾸고 `const { d } = await searchParams;` 형태로 수정.
→ `npm run build` + `npm test`로 확인.

## 2. OpenNext 어댑터 설치·설정
```
npm install -D @opennextjs/cloudflare wrangler
```
- `open-next.config.ts`:
  ```ts
  import { defineCloudflareConfig } from "@opennextjs/cloudflare";
  export default defineCloudflareConfig();
  ```
- `wrangler.jsonc`:
  ```jsonc
  {
    "name": "<app>",
    "main": ".open-next/worker.js",
    "compatibility_date": "2025-03-25",
    "compatibility_flags": ["nodejs_compat"],
    "assets": { "directory": ".open-next/assets", "binding": "ASSETS" },
    "routes": [{ "pattern": "<app>-test.fineboll.com", "custom_domain": true }]
  }
  ```
- `package.json` scripts: `"cf:build": "opennextjs-cloudflare build"`, `"cf:deploy": "opennextjs-cloudflare deploy"`
- `.gitignore`에 `.open-next`, `.wrangler`, `.dev.vars` 추가

## 3. 환경변수 (빌드타임 함정 주의)
`NEXT_PUBLIC_*`는 **빌드 시 인라인**된다. `.env.local`(gitignore)에 넣어야 배포 빌드에 박힌다:
```
NEXT_PUBLIC_SITE_URL=https://<app>.fineboll.com
# 앱별 추가 변수 (Formspree, 애드핏 등)
```
검증: `npm run cf:build` 후 `grep -rl "<app>.fineboll.com" .open-next/` 로 인라인 확인.

## 4. 로컬 실측 (관문: next/og 이미지)
```
npx wrangler dev --port 8799 --local
```
→ 실제 workerd 런타임에서 `/`, `/result`, **`/api/og`·`/api/card`(있으면)** 전부 확인.
한글 폰트 렌더까지 눈으로 확인 (curl로 PNG 저장 후 열어보기).

## 5. 테스트 도메인 배포 → 검증
```
npx wrangler login   # 1회
npx wrangler deploy  # <app>-test.fineboll.com 로 (config의 route)
```
`https://<app>-test.fineboll.com` 전 라우트·이미지·OG 확인.

## 6. 실도메인 컷오버
1. Cloudflare DNS에서 기존 **Vercel CNAME**(`<app>` → `cname.vercel-dns.com`) **삭제**
2. `wrangler.jsonc` route를 `<app>.fineboll.com`으로 변경
3. `npx wrangler deploy` → Worker 커스텀 도메인 자동 연결(+DNS/SSL)
4. `curl -sI https://<app>.fineboll.com` → `server: cloudflare` 확인
5. `vercel git disconnect --yes` (Vercel 자동배포 중단)

## 함정 모음 (실제로 겪음)
- **Windows `EBUSY: rmdir .open-next\assets`**: 이전 `workerd.exe`가 폴더 잠금.
  `taskkill //F //IM workerd.exe && rm -rf .open-next` 후 재빌드.
- **`.env.local` 없이 배포하면 OG가 localhost로 박힘**: 빌드 전 반드시 세팅.
- **커스텀 도메인 연결 실패(triggers failed / domains/records)**: 그 호스트에 기존 DNS
  레코드가 있음 → 먼저 삭제해야 함(6-1단계).

## 남은 선택 작업
- **GitHub→Cloudflare 자동배포**: Cloudflare 대시보드 → Workers & Pages → 해당 Worker →
  Settings → Build → Connect Git. 빌드 커맨드 `npx opennextjs-cloudflare build`,
  배포 `npx wrangler deploy`, **NEXT_PUBLIC_* 를 Build 환경변수로 등록**.
- Vercel 프로젝트 삭제(정리).
