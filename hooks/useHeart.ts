import { useState, useEffect } from "react"
import { getHeartCount, incrementHeartCount } from "@/lib/firestore"
import JSConfetti from "js-confetti"

export const useHeart = () => {
  const [heartCount, setHeartCount] = useState(0)
  const [isHeartLoading, setIsHeartLoading] = useState(false)
  const [isFirebaseAvailable, setIsFirebaseAvailable] = useState(true)
  const [jsConfetti, setJsConfetti] = useState<JSConfetti | null>(null)

  // JSConfetti 초기화
  useEffect(() => {
    const confetti = new JSConfetti()
    setJsConfetti(confetti)
  }, [])

  // Firebase에서 하트 수 가져오기
  useEffect(() => {
    const fetchHeartCount = async () => {
      try {
        const count = await getHeartCount()
        setHeartCount(count)
        setIsFirebaseAvailable(true)
      } catch (error) {
        console.error("Error fetching heart count:", error)
        setIsFirebaseAvailable(false)
        // Firebase를 사용할 수 없을 때 로컬 스토리지에서 하트 수를 가져오거나 기본값 사용
        const localHeartCount = localStorage.getItem("wedding-heart-count")
        if (localHeartCount) {
          setHeartCount(Number.parseInt(localHeartCount, 10))
        } else {
          setHeartCount(0)
        }
      }
    }

    fetchHeartCount()
  }, [])

  // 하트 클릭 핸들러
  const handleHeartClick = async () => {
    if (isHeartLoading) return

    setIsHeartLoading(true)
    try {
      if (isFirebaseAvailable) {
        // Firebase를 사용할 수 있는 경우
        const newCount = await incrementHeartCount()
        setHeartCount(newCount)
      } else {
        // Firebase를 사용할 수 없는 경우 로컬 스토리지 사용
        const currentCount = heartCount + 1
        setHeartCount(currentCount)
        localStorage.setItem("wedding-heart-count", currentCount.toString())
      }

      // Confetti 효과 실행
      if (jsConfetti) {
        jsConfetti.addConfetti({
          emojis: ["💖", "💕", "💗", "💝", "🎉", "🐻", "🐥", "🥳"],
          emojiSize: 75,
          confettiNumber: 50,
        })
      }
    } catch (error) {
      console.error("Error incrementing heart:", error)

      // Firebase 에러인 경우 로컬 스토리지로 폴백
      if (!isFirebaseAvailable) {
        const currentCount = heartCount + 1
        setHeartCount(currentCount)
        localStorage.setItem("wedding-heart-count", currentCount.toString())

        // Confetti 효과 실행
        if (jsConfetti) {
          jsConfetti.addConfetti({
            emojis: ["💖", "💕", "💗", "💓", "💝"],
            emojiSize: 50,
            confettiNumber: 30,
          })
        }
      } else {
        // 에러 메시지 표시
        const errorMessage =
          error instanceof Error ? error.message : "하트를 보내는 중 오류가 발생했습니다. 다시 시도해주세요."
        alert(errorMessage)
      }
    } finally {
      setIsHeartLoading(false)
    }
  }

  return {
    heartCount,
    isHeartLoading,
    isFirebaseAvailable,
    handleHeartClick,
  }
}