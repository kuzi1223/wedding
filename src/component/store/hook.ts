/* eslint-disable @typescript-eslint/no-explicit-any */

import { useContext, useEffect } from "react"
import { StoreContext } from "./context"
import { KAKAO_SDK_JS_KEY, NAVER_MAP_CLIENT_ID } from "../../env"

// 네이버 지도 및 카카오 SDK를 로드하기 위한 외부 스크립트 URL
const NAVER_MAP_URL = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${NAVER_MAP_CLIENT_ID}`
const KAKAO_SDK_URL = "https://t1.kakaocdn.net/kakao_js_sdk/2.7.1/kakao.min.js"

/**
 * 네이버 지도 SDK를 로드하고 사용할 수 있게 해주는 Hook입니다.
 *
 * @returns {any} 네이버 지도 SDK 객체 (로딩 전에는 null)
 */
export const useNaver = () => {
  const { naver, setNaver } = useContext(StoreContext)
  useEffect(() => {
    // 클라이언트 ID가 없으면 중단
    if (!NAVER_MAP_CLIENT_ID) {
      return
    }

    const initializeNaver = () => {
      const naverSdk = (window as any).naver
      if (naverSdk?.maps) {
        setNaver(naverSdk)
      }
    }

    // SDK가 이미 로드된 경우 즉시 상태에 반영합니다.
    if ((window as any).naver?.maps) {
      initializeNaver()
      return
    }

    // 기존 스크립트가 있으면 로드 완료를 기다리고, 없으면 새로 추가합니다.
    let script = document.querySelector<HTMLScriptElement>(
      `script[src="${NAVER_MAP_URL}"]`,
    )
    const shouldAppendScript = !script
    if (!script) {
      script = document.createElement("script")
      script.src = NAVER_MAP_URL
    }

    script.addEventListener("load", initializeNaver)
    if (shouldAppendScript) {
      document.head.appendChild(script)
    }

    return () => {
      script?.removeEventListener("load", initializeNaver)
    }
  }, [setNaver])

  return naver
}

/**
 * 카카오 SDK를 로드하고 사용할 수 있게 해주는 Hook입니다.
 *
 * @returns {any} 카카오 SDK 객체 (로딩 전에는 null)
 */
export const useKakao = () => {
  const { kakao, setKakao } = useContext(StoreContext)
  useEffect(() => {
    // SDK 키가 없으면 중단
    if (!KAKAO_SDK_JS_KEY) {
      return
    }

    const initializeKakao = () => {
      const kakaoSdk = (window as any).Kakao
      if (!kakaoSdk) {
        return
      }

      if (!kakaoSdk.isInitialized()) {
        kakaoSdk.init(KAKAO_SDK_JS_KEY)
      }
      setKakao(kakaoSdk)
    }

    // SDK가 이미 로드된 경우 즉시 초기화합니다.
    if ((window as any).Kakao) {
      initializeKakao()
      return
    }

    // 기존 스크립트가 있으면 로드 완료를 기다리고, 없으면 새로 추가합니다.
    let script = document.querySelector<HTMLScriptElement>(
      `script[src="${KAKAO_SDK_URL}"]`,
    )
    const shouldAppendScript = !script
    if (!script) {
      script = document.createElement("script")
      script.crossOrigin = "anonymous"
      script.src = KAKAO_SDK_URL
    }

    script.addEventListener("load", initializeKakao)
    if (shouldAppendScript) {
      document.head.appendChild(script)
    }

    return () => {
      script?.removeEventListener("load", initializeKakao)
    }
  }, [setKakao])

  return kakao
}
