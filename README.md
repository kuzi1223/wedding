# 모바일 청첩장

최휘재 ❤️ 최원화의 모바일 청첩장입니다.

배포 페이지: [https://kuzi1223.github.io/wedding/](https://kuzi1223.github.io/wedding/)

## 주요 기능

- 모바일·데스크톱 반응형 화면
- 커버 이미지 자동 페이드 전환
- 눈꽃 배경 효과
- 웨딩 사진 갤러리와 전체보기
- 네이버 지도 및 카카오내비 연결
- 카카오톡 공유
- 연락처 및 계좌 안내
- Cloudflare Workers와 연동된 방명록
- GitHub Pages 자동 배포
- 페이지 전체 우클릭·길게 누르기·드래그·텍스트 선택 방지

> 우클릭 방지는 일반적인 이미지 저장을 어렵게 만드는 기능입니다. 개발자 도구, 화면 캡처 등까지 완전히 차단할 수는 없습니다.

## 기술 구성

- React 19
- TypeScript
- Vite 7
- SCSS
- Day.js
- Naver Maps API
- Kakao JavaScript SDK
- Cloudflare Workers
- GitHub Pages / GitHub Actions

## 로컬에서 실행하기

Node.js 22 사용을 권장합니다.

```bash
git clone https://github.com/kuzi1223/wedding.git
cd wedding
npm install
npm run dev
```

개발 서버는 기본적으로 `http://127.0.0.1:3000/wedding`에서 확인할 수 있습니다.

## 환경변수

개인 키와 운영 설정은 소스에 직접 작성하지 말고 로컬에서는 `.env.local`, GitHub에서는 Actions의 Secrets 또는 Variables를 사용합니다.

로컬의 `.env.local` 예시:

```dotenv
VITE_NAVER_MAP_CLIENT_ID=
VITE_KAKAO_SDK_JS_KEY=
VITE_SERVER_URL=
VITE_STATIC_ONLY=false
```

| 환경변수 | 용도 | GitHub 설정 위치 |
| --- | --- | --- |
| `VITE_NAVER_MAP_CLIENT_ID` | 네이버 지도 클라이언트 ID | Actions Secret |
| `VITE_KAKAO_SDK_JS_KEY` | 카카오 JavaScript 키 | Actions Secret |
| `VITE_SERVER_URL` | 방명록 백엔드 API 주소 | Actions Variable |
| `VITE_STATIC_ONLY` | `true`이면 방명록 등 서버 기능 비활성화 | Actions Variable |

전화번호나 계좌번호처럼 공개 저장소에 남기면 안 되는 값도 GitHub Actions Secrets로 관리해야 합니다. 단, 브라우저에 표시되는 값은 최종 배포 파일과 화면에서 확인할 수 있으므로 완전한 비공개 정보로 간주하면 안 됩니다.

## 내용 수정

주요 예식 정보는 [`src/const.ts`](src/const.ts)에서 관리합니다.

- 신랑·신부 및 양가 부모님 이름
- 결혼식 날짜와 시간
- 예식장 이름과 주소
- 지도 좌표 및 장소 ID
- 연락처와 계좌 안내

화면에 표시되는 문구는 `src/component/` 아래의 각 컴포넌트에서 수정할 수 있습니다.

## 사진 수정

- 커버 및 갤러리 사진: `src/images/`
- 카카오톡·SNS 공유 미리보기: `public/preview_image.webp`

PNG와 WebP 형식을 모두 사용할 수 있습니다. 로딩 속도를 위해 사진은 WebP 사용과 파일당 1MB 이하를 권장합니다.

## 빌드 확인

```bash
npm run lint
npm run build
```

빌드 결과는 `build/` 폴더에 생성됩니다.

## GitHub Pages 배포

1. 저장소의 **Settings → Pages**에서 Source를 **GitHub Actions**로 설정합니다.
2. **Settings → Secrets and variables → Actions**에 필요한 Secrets와 Variables를 등록합니다.
3. `main` 브랜치에 변경 사항을 올리면 `.github/workflows/deploy.yml`이 자동으로 빌드하고 배포합니다.
4. Actions의 **Deploy** 작업이 성공하면 배포 페이지에서 결과를 확인합니다.

## 프로젝트 구조

```text
wedding/
├─ .github/workflows/deploy.yml
├─ public/
│  └─ preview_image.webp
├─ src/
│  ├─ component/
│  ├─ images/
│  ├─ App.tsx
│  ├─ App.scss
│  ├─ const.ts
│  └─ env.ts
├─ package.json
├─ vite.config.ts
└─ README.md
```

## 참고

- `VITE_STATIC_ONLY=true`로 배포하면 방명록이 표시되지 않습니다.
- 지도와 카카오톡 공유 기능은 각 개발자 콘솔에 실제 배포 도메인이 등록되어 있어야 합니다.
- 사진 저장 방지 기능은 콘텐츠 보호를 보조할 뿐 완전한 복제 방지 기능은 아닙니다.
