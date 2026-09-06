import {
  BRIDE_FULLNAME,
  GROOM_FULLNAME,
  LOCATION,
  WEDDING_DATE,
  WEDDING_DATE_FORMAT,
} from "../../const"
import { COVER_IMAGE, COVER_IMAGE_2 } from "../../images"
import { LazyDiv } from "../lazyDiv"

const DAY_OF_WEEK = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
]

/**
 * 초대장의 메인 커버 섹션입니다.
 * 예식 일시, 신랑/신부 이름, 장소를 표시합니다.
 *
 * @returns {JSX.Element} 커버 섹션
 */
export const Cover = () => {
  const [isSecondCover, setIsSecondCover] = useState(false)

  useEffect(() => {
    const timer = window.setTimeout(() => setIsSecondCover(true), 5000)

    return () => window.clearTimeout(timer)
  }, [])

  return (
    <LazyDiv className="card cover">
      {/* 상단 날짜 표시 */}
      <div className="wedding-date">
        {WEDDING_DATE.format("YYYY")}
        <div className="divider" />
        {WEDDING_DATE.format("MM")}
        <div className="divider" />
        {WEDDING_DATE.format("DD")}
      </div>
      {/* 요일 표시 (영어) */}
      <div className="wedding-day-of-week">
        {DAY_OF_WEEK[WEDDING_DATE.day()]}
      </div>
      {/* 커버 이미지 */}
      <div className="image-wrapper">
        <img
          className={isSecondCover ? "is-hidden" : "is-visible"}
          src={COVER_IMAGE}
          alt="웨딩 커버 이미지"
        />
        <img
          className={isSecondCover ? "is-visible" : "is-hidden"}
          src={COVER_IMAGE_2}
          alt="웨딩 커버 이미지"
        />
      </div>
      <div className="subtitle">Save the date for the wedding of</div>
      {/* 이름 표시 */}
      <div className="names">
        {GROOM_FULLNAME}
        <div className="divider" />
        {BRIDE_FULLNAME}
      </div>
      {/* 예식 정보 (포맷팅된 날짜 및 장소) */}
      <div className="info">{WEDDING_DATE.format(WEDDING_DATE_FORMAT)}</div>
      <div className="info">{LOCATION}</div>
    </LazyDiv>
  )
}
import { useEffect, useState } from "react"
