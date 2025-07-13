"use client"

import React from "react"
import { Heart } from "lucide-react"
import { useHeart } from "@/hooks/useHeart"

export const HeartButton = () => {
  const { heartCount, isHeartLoading, isFirebaseAvailable, handleHeartClick } = useHeart()

  return (
    <div className="text-center mb-8">
      <button
        onClick={handleHeartClick}
        disabled={isHeartLoading}
        className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4 hover:bg-pink-200 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Heart
          className={`w-6 h-6 text-pink-400 fill-current ${isHeartLoading ? "animate-pulse" : "hover:scale-110 transition-transform duration-200"}`}
        />
      </button>
      <p className="text-xs text-gray-500">{heartCount.toLocaleString()}</p>
      {!isFirebaseAvailable && <p className="text-xs text-gray-400 mt-1">오프라인 모드</p>}
    </div>
  )
}