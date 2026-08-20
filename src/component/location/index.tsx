import { Map } from "./map"
import CarIcon from "../../icons/car-icon.svg?react"
import BusIcon from "../../icons/bus-icon.svg?react"
import { LazyDiv } from "../lazyDiv"
import { LOCATION, LOCATION_ADDRESS } from "../../const"

/**
 * 오시는 길 정보를 표시하는 컴포넌트입니다.
 * 지도와 대중교통, 자가용 이용 방법을 안내합니다.
 *
 * @returns {JSX.Element} 오시는 길 섹션
 */
export const Location = () => {
  return (
    <>
      {/* 지도 및 주소 섹션 */}
      <LazyDiv className="card location">
        <h2 className="english">Location</h2>
        <div className="addr">
          {LOCATION}
          <div className="detail">{LOCATION_ADDRESS}</div>
        </div>
        <Map />
      </LazyDiv>

      {/* 대중교통 및 자가용 안내 섹션 */}
      <LazyDiv className="card location">
        {/* 대중교통 안내 */}
        <div className="location-info">
          <div className="transportation-icon-wrapper">
            <BusIcon className="transportation-icon" />
          </div>
          <div className="heading">대중교통</div>
          <div />
          <div className="content">
            * KTX / SRT 이용 시 (오송역)
            <br />
            - <b>택시 이용</b>
            <br />
            → 오송역 3번/4번 출구 택시 승강장 이용
            <br />
            → <b>벨리스 웨딩홀</b>까지 약 20분 소요 (약 18,000원)
            <br />
            <br />
            - <b>시외버스 이용 시</b>
            <br />
            → 오송역에서 남청주(남부) 방면 시외버스 탑승 후 이동 가능
          </div>
          <div />
          <div className="content">
            * 고속 / 시외버스 이용 시 (청주 터미널)
            <br />
            - <b>택시 이용</b>
            <br />
            → 청주고속·시외터미널 앞 택시 승강장 이용
            <br />
            → <b>벨리스 웨딩홀</b>까지 약 10~15분 소요 (약 8,000원)
            <br />
            <br />
            - <b>시내버스 이용 시 (청남로 방면)</b>
            <br />
            → 상당로/청남로 방면에서 <b>407번 버스</b> 직통 탑승
            <br />
            → <b>가마리(벨리스웨딩홀 앞)</b> 정류장 하차
          </div>
        </div>

        {/* 자가용 안내 */}
        <div className="location-info">
          <div className="transportation-icon-wrapper">
            <CarIcon className="transportation-icon" />
          </div>
          <div className="heading">자가용</div>
          <div />
          <div className="content">
            네이버 지도, 카카오 네비, 티맵 등 이용
            <br />
            <b>청주 벨리스 웨딩홀 </b> 검색
            <br />
            - 주차 요금은 무료입니다.
            <br />
            (주차장 이용 시 웨딩홀과 바로 연결)
          </div>
          <div />
        </div>
      </LazyDiv>
    </>
  )
}
