/**
 * 네이버 지도 클라이언트 ID
 * .env 파일의 VITE_NAVER_MAP_CLIENT_ID에서 가져옵니다.
 */
export const NAVER_MAP_CLIENT_ID = import.meta.env?.VITE_NAVER_MAP_CLIENT_ID

/**
 * 카카오 SDK 자바스크립트 키
 * .env 파일의 VITE_KAKAO_SDK_JS_KEY에서 가져옵니다.
 */
export const KAKAO_SDK_JS_KEY = import.meta.env?.VITE_KAKAO_SDK_JS_KEY

/**
 * 백엔드 서버 URL (방명록 기능 등에 사용)
 * .env 파일의 VITE_SERVER_URL에서 가져옵니다.
 */
export const SERVER_URL = import.meta.env?.VITE_SERVER_URL

/**
 * 정적 페이지 모드 여부
 * true일 경우 서버 연동 기능(방명록 등)이 비활성화됩니다.
 */
export const STATIC_ONLY = import.meta.env?.VITE_STATIC_ONLY === "true"

/**
 * 연락처와 계좌번호
 * 공개 저장소에 개인정보가 포함되지 않도록 로컬 환경변수 또는 GitHub Secrets에서 가져옵니다.
 */
export const BRIDE_PHONE = import.meta.env?.VITE_BRIDE_PHONE ?? ""
export const BRIDE_ACCOUNT = import.meta.env?.VITE_BRIDE_ACCOUNT ?? ""
export const BRIDE_FATHER_PHONE =
  import.meta.env?.VITE_BRIDE_FATHER_PHONE ?? ""
export const BRIDE_FATHER_ACCOUNT =
  import.meta.env?.VITE_BRIDE_FATHER_ACCOUNT ?? ""
export const BRIDE_MOTHER_PHONE =
  import.meta.env?.VITE_BRIDE_MOTHER_PHONE ?? ""
export const BRIDE_MOTHER_ACCOUNT =
  import.meta.env?.VITE_BRIDE_MOTHER_ACCOUNT ?? ""
export const GROOM_PHONE = import.meta.env?.VITE_GROOM_PHONE ?? ""
export const GROOM_ACCOUNT = import.meta.env?.VITE_GROOM_ACCOUNT ?? ""
export const GROOM_FATHER_PHONE =
  import.meta.env?.VITE_GROOM_FATHER_PHONE ?? ""
export const GROOM_FATHER_ACCOUNT =
  import.meta.env?.VITE_GROOM_FATHER_ACCOUNT ?? ""
export const GROOM_MOTHER_PHONE =
  import.meta.env?.VITE_GROOM_MOTHER_PHONE ?? ""
export const GROOM_MOTHER_ACCOUNT =
  import.meta.env?.VITE_GROOM_MOTHER_ACCOUNT ?? ""
