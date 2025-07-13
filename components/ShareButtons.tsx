"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { useKakaoSDK } from "@/hooks/useKakaoSDK"

export const ShareButtons = () => {
  const { shareToKakao } = useKakaoSDK()

  // URL 복사하기 함수
  const copyToClipboard = async () => {
    try {
      if (typeof window !== "undefined") {
        await navigator.clipboard.writeText(window.location.href)
        alert("복사되었습니다")
      }
    } catch (err) {
      // 클립보드 API가 지원되지 않는 경우 fallback
      try {
        const textArea = document.createElement("textarea")
        textArea.value = window.location.href
        document.body.appendChild(textArea)
        textArea.select()
        document.execCommand("copy")
        document.body.removeChild(textArea)
        alert("복사되었습니다!")
      } catch (fallbackError) {
        console.error("클립보드 복사 실패:", fallbackError)
        alert("복사에 실패했습니다.")
      }
    }
  }

  return (
    <div className="text-center">
      <Button
        className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-800 rounded-full py-3 mb-4"
        onClick={shareToKakao}
      >
        카카오톡으로 공유하기
      </Button>

      <Button variant="outline" className="w-full rounded-full py-3 bg-transparent" onClick={copyToClipboard}>
        URL 링크 복사하기
      </Button>
    </div>
  )
}