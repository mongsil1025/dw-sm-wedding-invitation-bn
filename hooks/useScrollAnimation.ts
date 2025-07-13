import { useState, useEffect } from "react"

export const useScrollAnimation = () => {
  const [scrollY, setScrollY] = useState(0)
  const [isClient, setIsClient] = useState(false)
  const [firstPageHeight, setFirstPageHeight] = useState(0)

  useEffect(() => {
    setIsClient(true)

    const handleScroll = () => {
      const currentScrollY = window.scrollY
      setScrollY(currentScrollY)
    }

    const calculateFirstPageHeight = () => {
      // 첫 번째 페이지의 실제 높이를 계산
      const firstPageElement = document.getElementById("first-page")
      if (firstPageElement) {
        const rect = firstPageElement.getBoundingClientRect()
        const computedHeight = rect.height
        setFirstPageHeight(computedHeight)
      }
    }

    // 초기 계산
    calculateFirstPageHeight()

    // 리사이즈 시 재계산
    const handleResize = () => {
      calculateFirstPageHeight()
    }

    window.addEventListener("scroll", handleScroll)
    window.addEventListener("resize", handleResize)

    // 폰트 로드 후 재계산
    document.fonts.ready.then(() => {
      calculateFirstPageHeight()
    })

    return () => {
      window.removeEventListener("scroll", handleScroll)
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  return {
    scrollY,
    isClient,
    firstPageHeight,
  }
}