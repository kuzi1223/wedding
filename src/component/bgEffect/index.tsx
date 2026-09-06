import { useEffect, useRef } from "react"

// 눈송이의 이동 속도 설정
const X_SPEED = 0.15
const X_SPEED_VARIANCE = 0.35
const Y_SPEED = 0.45
const Y_SPEED_VARIANCE = 0.65
const SWAY_SPEED_VARIANCE = 0.025

/**
 * 개별 눈송이 객체를 관리하는 클래스입니다.
 */
class Snowflake {
  x: number
  y: number
  size: number = 0
  opacity: number = 0
  xSpeed: number = 0
  ySpeed: number = 0
  sway: number = 0
  swaySpeed: number = 0

  constructor(
    private canvas: HTMLCanvasElement,
    private ctx: CanvasRenderingContext2D,
  ) {
    this.x = Math.random() * canvas.width
    this.y = Math.random() * canvas.height * 2 - canvas.height
    this.initialize()
  }

  /**
   * 눈송이의 크기, 투명도, 속도 등을 무작위로 초기화합니다.
   */
  initialize() {
    this.size = 1.5 + Math.random() * 3.5
    this.opacity = 0.35 + Math.random() * 0.5
    this.sway = Math.random() * Math.PI * 2
    this.xSpeed = X_SPEED + Math.random() * X_SPEED_VARIANCE
    this.ySpeed = Y_SPEED + Math.random() * Y_SPEED_VARIANCE
    this.swaySpeed = 0.005 + Math.random() * SWAY_SPEED_VARIANCE
  }

  /**
   * 눈송이를 그립니다.
   */
  draw() {
    if (this.y > this.canvas.height || this.x > this.canvas.width) {
      this.initialize()

      const rand = Math.random() * (this.canvas.width + this.canvas.height)
      if (rand > this.canvas.width) {
        this.x = 0
        this.y = rand - this.canvas.width
      } else {
        this.x = rand
        this.y = 0
      }
    }

    this.ctx.globalAlpha = this.opacity
    this.ctx.fillStyle = "#ffffff"
    this.ctx.beginPath()
    this.ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
    this.ctx.fill()
  }

  /**
   * 눈송이의 위치를 업데이트하고 다시 그립니다.
   */
  animate() {
    this.x += this.xSpeed + Math.sin(this.sway) * 0.3
    this.y += this.ySpeed
    this.sway += this.swaySpeed
    this.draw()
  }
}

/**
 * 배경에 눈송이가 내리는 애니메이션 효과를 주는 컴포넌트입니다.
 *
 * @returns {JSX.Element} 배경 효과 컴포넌트
 */
export const BGEffect = () => {
  const ref = useRef<HTMLCanvasElement>({} as HTMLCanvasElement)
  const snowflakesRef = useRef<Snowflake[]>([])
  const resizeTimeoutRef = useRef(0)
  const animationFrameIdRef = useRef(0)

  useEffect(() => {
    const canvas = ref.current
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const ctx = canvas.getContext("2d") as CanvasRenderingContext2D

    /**
     * 화면 크기에 따른 적절한 눈송이 개수를 계산합니다.
     */
    const getSnowflakeNum = () => {
      return Math.floor((window.innerWidth * window.innerHeight) / 18000)
    }

    /**
     * 눈송이들을 생성하고 초기화합니다.
     */
    const initializeSnowflakes = () => {
      const count = getSnowflakeNum()
      const snowflakes = []
      for (let i = 0; i < count; i++) {
        snowflakes.push(new Snowflake(canvas, ctx))
      }
      snowflakesRef.current = snowflakes
    }

    initializeSnowflakes()

    /**
     * 매 프레임마다 눈송이를 렌더링합니다.
     */
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      snowflakesRef.current.forEach((snowflake) => snowflake.animate())
      animationFrameIdRef.current = requestAnimationFrame(render)
    }

    render()

    /**
     * 화면 크기 변경 시 캔버스 크기를 조정하고 눈송이 개수를 조절합니다.
     */
    const onResize = () => {
      clearTimeout(resizeTimeoutRef.current)
      resizeTimeoutRef.current = window.setTimeout(() => {
        canvas.width = window.innerWidth
        canvas.height = window.innerHeight
        const newSnowflakeNum = getSnowflakeNum()
        if (newSnowflakeNum > snowflakesRef.current.length) {
          for (let i = snowflakesRef.current.length; i < newSnowflakeNum; i++) {
            snowflakesRef.current.push(new Snowflake(canvas, ctx))
          }
        } else if (newSnowflakeNum < snowflakesRef.current.length) {
          snowflakesRef.current.splice(newSnowflakeNum)
        }
      }, 100)
    }

    window.addEventListener("resize", onResize)

    return () => {
      window.removeEventListener("resize", onResize)
      cancelAnimationFrame(animationFrameIdRef.current)
    }
  }, [])

  return (
    <div className="bg-effect">
      <canvas ref={ref} />
    </div>
  )
}
