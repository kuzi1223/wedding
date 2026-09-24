import { useCallback, useEffect, useRef, useState } from "react"
import { SERVER_URL } from "../../env"
import { Button } from "../button"
import { LazyDiv } from "../lazyDiv"
import "./index.scss"

const MAX_PHOTO_BYTES = 10 * 1024 * 1024
const PAGE_SIZE = 30
const TURNSTILE_SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY

type Turnstile = {
  render: (container: HTMLElement, options: {
    sitekey: string
    action: string
    theme: "light" | "dark" | "auto"
    callback: (token: string) => void
    "expired-callback": () => void
    "error-callback": () => void
  }) => string
  reset: (widgetId: string) => void
  remove: (widgetId: string) => void
}

declare global {
  interface Window {
    turnstile?: Turnstile
  }
}

type Photo = {
  id: string
  timestamp: number
}

/**
 * 하객이 사진을 올리고 함께 볼 수 있는 공개 사진첩입니다.
 */
export const PhotoShare = () => {
  const inputRef = useRef<HTMLInputElement>(null)
  const turnstileContainerRef = useRef<HTMLDivElement>(null)
  const turnstileWidgetRef = useRef<string | null>(null)
  const [photos, setPhotos] = useState<Photo[]>([])
  const [total, setTotal] = useState(0)
  const [uploading, setUploading] = useState(false)
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null)

  useEffect(() => {
    if (!TURNSTILE_SITE_KEY || !turnstileContainerRef.current) return

    const renderWidget = () => {
      if (!window.turnstile || !turnstileContainerRef.current || turnstileWidgetRef.current) return
      turnstileWidgetRef.current = window.turnstile.render(turnstileContainerRef.current, {
        sitekey: TURNSTILE_SITE_KEY,
        action: "photo-upload",
        theme: "light",
        callback: setTurnstileToken,
        "expired-callback": () => setTurnstileToken(null),
        "error-callback": () => setTurnstileToken(null),
      })
    }

    const script = document.createElement("script")
    script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
    script.async = true
    script.defer = true
    script.onload = renderWidget
    document.head.appendChild(script)
    renderWidget()

    return () => {
      if (turnstileWidgetRef.current && window.turnstile) window.turnstile.remove(turnstileWidgetRef.current)
      turnstileWidgetRef.current = null
      script.remove()
    }
  }, [])

  const loadPhotos = useCallback(async () => {
    try {
      const response = await fetch(`${SERVER_URL}/photos?offset=0&limit=${PAGE_SIZE}`)
      if (!response.ok) throw new Error(response.statusText)
      const data = await response.json()
      setPhotos(data.photos)
      setTotal(data.total)
    } catch (error) {
      console.error("Error loading shared photos:", error)
    }
  }, [])

  useEffect(() => {
    loadPhotos()
  }, [loadPhotos])

  const uploadPhoto = async (file: File) => {
    if (!turnstileToken) {
      alert("사진 업로드 확인이 아직 준비되지 않았습니다. 잠시 후 다시 시도해주세요.")
      return
    }
    if (!file.type.match(/^image\/(jpeg|png|webp)$/)) {
      alert("JPG, PNG, WebP 사진만 올릴 수 있습니다.")
      return
    }
    if (file.size > MAX_PHOTO_BYTES) {
      alert("사진은 10MB 이하만 올릴 수 있습니다.")
      return
    }

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("cf-turnstile-response", turnstileToken)
      const response = await fetch(`${SERVER_URL}/photos`, {
        method: "POST",
        body: formData,
      })
      if (!response.ok) throw new Error(await response.text())
      await loadPhotos()
      alert("사진이 공유 사진첩에 등록되었습니다.")
    } catch (error) {
      console.error("Error uploading shared photo:", error)
      alert("사진 업로드에 실패했습니다. 사진 형식과 용량을 확인해주세요.")
    } finally {
      setUploading(false)
      if (inputRef.current) inputRef.current.value = ""
      setTurnstileToken(null)
      if (turnstileWidgetRef.current && window.turnstile) window.turnstile.reset(turnstileWidgetRef.current)
    }
  }

  if (!SERVER_URL) return null

  return (
    <LazyDiv className="card photo-share">
      <h2 className="english">Photo Share</h2>
      <div className="break" />
      <p className="description">함께한 순간을 사진으로 나눠주세요.</p>

      <input
        ref={inputRef}
        className="photo-input"
        type="file"
        accept="image/jpeg,image/png,image/webp"
        disabled={uploading}
        onChange={(event) => {
          const file = event.target.files?.[0]
          if (file) void uploadPhoto(file)
        }}
      />
      <div ref={turnstileContainerRef} className="turnstile-widget" />
      <Button disabled={uploading || !turnstileToken} onClick={() => inputRef.current?.click()}>
        {uploading ? "사진 올리는 중..." : "사진 올리기"}
      </Button>
      <p className="hint">JPG, PNG, WebP · 최대 10MB</p>

      <div className="break" />
      <div className="photo-share-heading">
        <span>공유 사진첩</span>
        <span>{total}장</span>
      </div>
      {photos.length > 0 ? (
        <div className="photo-grid">
          {photos.map((photo) => (
            <a
              key={photo.id}
              href={`${SERVER_URL}/photos/${photo.id}`}
              target="_blank"
              rel="noreferrer"
              aria-label="공유 사진 크게 보기"
            >
              <img src={`${SERVER_URL}/photos/${photo.id}`} alt="하객이 공유한 사진" loading="lazy" />
            </a>
          ))}
        </div>
      ) : (
        <p className="empty">아직 공유된 사진이 없어요. 첫 사진을 올려주세요.</p>
      )}
      {total > photos.length && <p className="hint">최근 사진 {photos.length}장만 표시합니다.</p>}
    </LazyDiv>
  )
}
