모바일 청첩장 | Wedding Invitation

최휘재 ❤️ 최원화의 모바일 청첩장입니다.

✨ 주요 기능

- 📱 반응형 디자인 — 모바일 및 데스크톱 지원
- 🎞️ 웨딩 사진 갤러리
- 🗺️ 웨딩홀 위치 지도
- 💌 방명록
- 💬 카카오톡 공유
- 🎯 참석 의사 전달
- 🚀 GitHub Pages 배포 지원

🛠️ 기술 스택

- React
- TypeScript
- Vite
- SCSS
- Day.js
- Naver Maps
- Kakao SDK

🚀 시작하기

1. 저장소 복제

git clone https://github.com/kuzi1223/wedding.git
cd wedding

2. 의존성 설치

npm install

3. 환경변수 설정

환경변수 샘플은 ".env.example" 파일에 저장되어 있습니다.
이 파일을 복사하여 ".env" 파일을 생성하고 각 환경변수를 수정합니다.

cp .env.example .env

필요한 환경변수:

- "VITE_NAVER_MAP_CLIENT_ID"
  
  - 웨딩홀 위치를 표시하기 위한 네이버 지도 ID
  - Naver Cloud Platform에서 발급할 수 있습니다.

- "VITE_KAKAO_SDK_JS_KEY"
  
  - 카카오톡 공유하기 기능을 위한 Kakao SDK API 키
  - Kakao Developers에서 발급할 수 있습니다.

- "VITE_SERVER_URL"
  
  - 방명록과 참석 의사 전달 등을 위한 서버 URL
  - 설정하지 않을 경우 소스코드에 고정된 방명록만 표시할 수 있습니다.

- "VITE_STATIC_ONLY"
  
  - 방명록 및 참석 의사 전달 기능을 사용하지 않고 정적 웹사이트로 운영하려면 "true"로 설정합니다.

4. 개발 서버 실행

npm run dev

⚙️ 커스터마이징

웨딩 관련 정보는 다음 파일에서 수정할 수 있습니다.

src/const.ts

수정할 수 있는 정보:

- 신랑·신부 이름
- 신랑·신부 및 양가 부모님 이름
- 결혼식 날짜 및 시간
- 예식장 이름
- 예식장 주소
- 지도 좌표
- 네이버 지도 장소 ID
- 카카오 지도 장소 ID
- 연락처
- 계좌 정보

이미지 변경

웨딩 사진은 다음 위치에서 변경할 수 있습니다.

src/images/

SNS 공유용 미리보기 이미지는 다음 파일을 사용합니다.

public/preview_image.png

이미지가 너무 크면 웹사이트 로딩 속도에 영향을 줄 수 있으므로 적절한 크기로 리사이징하는 것을 권장합니다.

✏️ 글귀 수정

각 컴포넌트 디렉토리에서 청첩장에 표시되는 글귀를 수정할 수 있습니다.

예를 들어:

src/component/location/

예식장 위치와 관련된 글귀를 수정할 수 있습니다.

src/component/information/

식사 안내와 관련된 글귀를 수정할 수 있습니다.

그 외의 문구는 각각의 컴포넌트 디렉토리에서 수정할 수 있습니다.

🎨 스타일 수정

프로젝트는 SCSS를 사용하여 스타일을 구성합니다.

Root의 "font-size"가 화면 크기에 따라 변경되므로 반응형 디자인을 위해 "rem" 단위를 사용하는 것을 권장합니다.

가능하면 "px"와 같은 절대 단위의 사용은 지양합니다.

🌐 배포하기

GitHub Pages

1. GitHub 저장소의 Settings → Pages로 이동합니다.
2. Build and deployment의 Source를 GitHub Actions로 설정합니다.
3. Settings → Actions → General에서 Workflow permissions를 Read and write permissions로 설정합니다.
4. 필요한 환경변수를 Settings → Secrets and variables → Actions에 추가합니다.
5. "package.json"의 "homepage"가 실제 GitHub Pages 주소와 맞는지 확인합니다.

필요한 환경변수:

Secrets

- "VITE_NAVER_MAP_CLIENT_ID"
- "VITE_KAKAO_SDK_JS_KEY"

Variables

- "VITE_SERVER_URL"
- "VITE_STATIC_ONLY"

다른 호스팅 플랫폼

이 프로젝트는 정적 웹사이트이므로 정적 파일을 제공하는 다양한 호스팅 플랫폼에서 사용할 수 있습니다.

1. "package.json"의 "homepage"를 실제 호스팅 플랫폼 URL에 맞게 수정합니다.
2. 필요한 환경변수를 설정합니다.
3. 프로젝트를 빌드합니다.

npm run build

4. 생성된 "build" 디렉토리의 내용을 호스팅 플랫폼에 배포합니다.

📁 프로젝트 구조

wedding/
├── public/
│   └── preview_image.png
├── src/
│   ├── component/
│   ├── images/
│   ├── const.ts
│   └── ...
├── .env.example
├── package.json
├── vite.config.ts
└── README.md

📝 참고

이 프로젝트는 React와 Vite를 기반으로 제작된 모바일 청첩장입니다.

웨딩 정보와 디자인은 프로젝트의 목적에 맞게 자유롭게 수정할 수 있습니다.