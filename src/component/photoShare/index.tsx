import { useCallback, useEffect, useRef, useState } from "react"
import { SERVER_URL } from "../../env"
import { Button } from "../button"
import { LazyDiv } from "../lazyDiv"
import { Modal } from "../modal"
import "./index.scss"

const MAX_PHOTO_BYTES = 10 * 1024 * 1024
const MAX_UPLOAD_COUNT = 20
const PAGE_SIZE = 30
const TURNSTILE_SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY

type Photo = { id: string; timestamp: number }

type Turnstile = {
  render: (container: HTMLElement, options: {
    sitekey: string
    action: string
    theme: "light" | "dark" | "auto"
    execution: "render" | "execute"
    appearance: "always" | "execute" | "interaction-only"
    callback: (token: string) => void
    "expired-callback": () => void
    "error-callback": () => void
  }) => string
  execute: (widgetId: string) => void
  reset: (widgetId: string) => void
  remove: (widgetId: string) => void
}

declare global {
  interface Window { turnstile?: Turnstile }
}

/** 하객 사진을 공개로 공유하고, 관리자만 삭제할 수 있는 사진첩입니다. */
export const PhotoShare = () => {
  const inputRef = useRef<HTMLInputElement>(null)
  const turnstileContainerRef = useRef<HTMLDivElement>(null)
  const turnstileWidgetRef = useRef<string | null>(null)
  const selectedFilesRef = useRef<File[]>([])
  const [photos, setPhotos] = useState<Photo[]>([])
  const [allPhotos, setAllPhotos] = useState<Photo[]>([])
  const [total, setTotal] = useState(0)
  const [featuredIndex, setFeaturedIndex] = useState(0)
  const [uploading, setUploading] = useState(false)
  const [checking, setChecking] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<{ completed: number; total: number } | null>(null)
  const [showManager, setShowManager] = useState(false)
  const [adminPassword, setAdminPassword] = useState("")
  const [deletingPhotoId, setDeletingPhotoId] = useState<string | null>(null)
  const photoModalState = useState(false)

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

  useEffect(() => { loadPhotos() }, [loadPhotos])

  useEffect(() => {
    if (featuredIndex >= photos.length) setFeaturedIndex(0)
  }, [featuredIndex, photos.length])

  const loadAllPhotos = async () => {
    const all: Photo[] = []
    for (let offset = 0; offset < total; offset += 50) {
      const response = await fetch(`${SERVER_URL}/photos?offset=${offset}&limit=50`)
      if (!response.ok) throw new Error(response.statusText)
      const data = await response.json()
      all.push(...data.photos)
    }
    setAllPhotos(all)
  }

  const openAllPhotos = async () => {
    photoModalState[1](true)
    try {
      await loadAllPhotos()
    } catch (error) {
      console.error("Error loading all shared photos:", error)
    }
  }

  const uploadNextPhoto = useCallback(async (turnstileToken: string) => {
    const file = selectedFilesRef.current[0]
    if (!file) return
    try {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("cf-turnstile-response", turnstileToken)
      const response = await fetch(`${SERVER_URL}/photos`, { method: "POST", body: formData })
      if (!response.ok) throw new Error(await response.text())
      selectedFilesRef.current.shift()
      setUploadProgress((progress) => progress && { ...progress, completed: progress.completed + 1 })

      if (selectedFilesRef.current.length > 0 && turnstileWidgetRef.current && window.turnstile) {
        window.turnstile.reset(turnstileWidgetRef.current)
        window.turnstile.execute(turnstileWidgetRef.current)
        return
      }

      await loadPhotos()
      alert("선택한 사진이 공유 사진첩에 등록되었습니다.")
    } catch (error) {
      console.error("Error uploading shared photo:", error)
      selectedFilesRef.current = []
      alert("사진 업로드에 실패했습니다. 업로드된 사진은 유지됩니다.")
    } finally {
      if (selectedFilesRef.current.length === 0) {
        setUploading(false)
        setChecking(false)
        setUploadProgress(null)
        if (inputRef.current) inputRef.current.value = ""
        if (turnstileWidgetRef.current && window.turnstile) window.turnstile.reset(turnstileWidgetRef.current)
      }
    }
  }, [loadPhotos])

  useEffect(() => {
    if (!TURNSTILE_SITE_KEY || !turnstileContainerRef.current) return
    const renderWidget = () => {
      if (!window.turnstile || !turnstileContainerRef.current || turnstileWidgetRef.current) return
      turnstileWidgetRef.current = window.turnstile.render(turnstileContainerRef.current, {
        sitekey: TURNSTILE_SITE_KEY,
        action: "photo-upload",
        theme: "light",
        execution: "execute",
        appearance: "execute",
        callback: (token) => {
          if (selectedFilesRef.current.length > 0) void uploadNextPhoto(token)
        },
        "expired-callback": () => setChecking(false),
        "error-callback": () => {
          selectedFilesRef.current = []
          setUploading(false)
          setChecking(false)
          setUploadProgress(null)
          alert("사진 업로드 확인에 실패했습니다. 잠시 후 다시 시도해주세요.")
        },
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
  }, [uploadNextPhoto])

  const verifyAndUploadPhotos = (files: File[]) => {
    if (files.length > MAX_UPLOAD_COUNT) {
      alert(`사진은 한 번에 최대 ${MAX_UPLOAD_COUNT}장까지 올릴 수 있습니다.`)
      return
    }
    if (files.some((file) => !file.type.match(/^image\/(jpeg|png|webp)$/))) {
      alert("JPG, PNG, WebP 사진만 올릴 수 있습니다.")
      return
    }
    if (files.some((file) => file.size > MAX_PHOTO_BYTES)) {
      alert("모든 사진은 10MB 이하여야 합니다.")
      return
    }
    if (!turnstileWidgetRef.current || !window.turnstile) {
      alert("사진 업로드 확인을 준비 중입니다. 잠시 후 다시 시도해주세요.")
      return
    }
    selectedFilesRef.current = files
    setUploading(true)
    setChecking(true)
    setUploadProgress({ completed: 0, total: files.length })
    window.turnstile.execute(turnstileWidgetRef.current)
  }

  const deletePhoto = async (photoId: string) => {
    if (!adminPassword || !window.confirm("이 사진을 완전히 삭제할까요?")) return
    setDeletingPhotoId(photoId)
    try {
      const response = await fetch(`${SERVER_URL}/photos/${photoId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: adminPassword }),
      })
      if (response.status === 403) throw new Error("password")
      if (!response.ok) throw new Error(await response.text())
      await loadPhotos()
    } catch (error) {
      console.error("Error deleting shared photo:", error)
      alert(error instanceof Error && error.message === "password" ? "관리 비밀번호가 올바르지 않습니다." : "사진 삭제에 실패했습니다.")
    } finally {
      setDeletingPhotoId(null)
    }
  }

  if (!SERVER_URL) return null

  const featuredPhoto = photos[featuredIndex]

  return <>
    <LazyDiv className="card photo-share">
      <h2 className="english">Photo Share</h2>
      <div className="break" />
      <p className="description">함께한 순간을 사진으로 나눠주세요.</p>
      <input
        ref={inputRef}
        className="photo-input"
        type="file"
        accept="image/jpeg,image/png,image/webp"
        multiple
        disabled={uploading || checking}
        onChange={(event) => {
          const files = Array.from(event.target.files ?? [])
          if (files.length > 0) verifyAndUploadPhotos(files)
        }}
      />
      <div ref={turnstileContainerRef} className="turnstile-widget" aria-hidden="true" />
      <Button disabled={uploading || checking} onClick={() => inputRef.current?.click()}>
        {uploading && uploadProgress ? `사진 올리는 중... (${uploadProgress.completed}/${uploadProgress.total})` : checking ? "사진 확인 중..." : "사진 올리기"}
      </Button>
      <p className="hint">JPG, PNG, WebP · 사진당 최대 10MB · 한 번에 최대 20장</p>
      <div className="break" />
      <div className="photo-share-heading"><span>공유 사진첩</span><span>{total}장</span></div>
      {photos.length > 0 ? (
        <div className="photo-carousel">
          <img src={`${SERVER_URL}/photos/${featuredPhoto.id}`} alt="하객이 공유한 사진" />
          {photos.length > 1 && <>
            <button className="photo-nav previous" type="button" aria-label="이전 사진" onClick={() => setFeaturedIndex((featuredIndex + photos.length - 1) % photos.length)}>‹</button>
            <button className="photo-nav next" type="button" aria-label="다음 사진" onClick={() => setFeaturedIndex((featuredIndex + 1) % photos.length)}>›</button>
          </>}
          {showManager && adminPassword && (
            <button className="photo-delete" type="button" disabled={deletingPhotoId === featuredPhoto.id} onClick={() => void deletePhoto(featuredPhoto.id)}>
              {deletingPhotoId === featuredPhoto.id ? "삭제 중" : "삭제"}
            </button>
          )}
        </div>
      ) : <p className="empty">아직 공유된 사진이 없어요. 첫 사진을 올려주세요.</p>}
      {total > photos.length && <p className="hint">최근 사진 {photos.length}장만 표시합니다.</p>}
      {photos.length > 0 && <Button onClick={() => void openAllPhotos()}>사진 전체보기</Button>}
      <div className="photo-manager">
        <button type="button" onClick={() => setShowManager((value) => !value)}>{showManager ? "사진 관리 닫기" : "사진 관리"}</button>
        {showManager && <>
          <label htmlFor="photo-admin-password">관리 비밀번호</label>
          <input id="photo-admin-password" type="password" value={adminPassword} onChange={(event) => setAdminPassword(event.target.value)} placeholder="사진 삭제 시에만 사용" />
          <p>비밀번호를 입력하면 각 사진 위에 삭제 버튼이 표시됩니다.</p>
        </>}
      </div>
    </LazyDiv>
    <Modal modalState={photoModalState} className="shared-photo-modal" closeOnClickBackground={true}>
      <div className="header"><div className="title">공유 사진첩 전체보기</div></div>
      <div className="content">
        <div className="all-photo-list">
          {allPhotos.map((photo) => (
            <a key={photo.id} href={`${SERVER_URL}/photos/${photo.id}`} target="_blank" rel="noreferrer" aria-label="공유 사진 크게 보기">
              <img src={`${SERVER_URL}/photos/${photo.id}`} alt="하객이 공유한 사진" loading="lazy" />
            </a>
          ))}
        </div>
      </div>
      <div className="footer"><Button buttonStyle="style2" onClick={() => photoModalState[1](false)}>닫기</Button></div>
    </Modal>
  </>
}
