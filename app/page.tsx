"use client"

import React from "react"
import Image from "next/image"
import { useScrollAnimation } from "@/hooks/useScrollAnimation"
import { MainContent } from "@/components/MainContent"

export default function WeddingInvitation() {
  const { scrollY, isClient, firstPageHeight } = useScrollAnimation()

  return (
    <div className="min-h-screen bg-amber-50">
      {/* Fixed gradient background that doesn't scroll */}
      <div className="fixed inset-0 z-0" style={{ height: "100vh", backgroundColor: "rgb(241, 224, 206)" }}></div>

      {/* Envelope at bottom - disappears when scrolling */}
      {isClient && (
        <div
          className="fixed bottom-[-95px] left-1/2 transform -translate-x-1/2 z-30 transition-transform duration-500 ease-out w-full max-w-sm min-w-[280px]"
          style={{
            transform: `translateX(-50%) translateY(${scrollY > 50 ? "100%" : "0%"})`,
          }}
        >
          <div className="mx-2 sm:mx-0">
            <Image src="/envelope.png" alt="Envelope" width={384} height={230} className="w-full h-auto" />
          </div>
        </div>
      )}

      {/* First Page - Fixed Behind (z-index lower) */}
      <div
        className="fixed inset-0 z-10 flex items-start justify-center px-2 sm:px-4"
        style={{
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        {/* House-shaped Card Container - 동일한 구조로 변경 */}
        <div className="w-full max-w-sm mx-auto min-w-[280px]">
          <div
            id="first-page"
            className="pt-8 sm:pt-12 px-4 sm:px-6 md:px-8 pb-6 sm:pb-8 relative mx-2 sm:mx-0"
            style={{
              backgroundImage: "url('/background.png')",
              backgroundSize: "cover",
              minHeight: "fit-content",
            }}
          >
            {/* Candle Icon */}
            <div className="text-center mb-8 sm:mb-10">
              <div className="w-10 sm:w-12 h-10 sm:h-12 mx-auto mb-3 sm:mb-4 relative">
                <div className="w-2 h-6 sm:h-8 bg-amber-200 mx-auto rounded-full"></div>
                <div className="w-3 sm:w-4 h-3 sm:h-4 bg-orange-400 rounded-full mx-auto -mt-2 relative">
                  <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-1.5 sm:w-2 h-2 sm:h-3 bg-orange-500 rounded-full animate-pulse"></div>
                </div>
              </div>
              <p className="text-xs sm:text-sm text-gray-600 font-wedding-title">Wedding Invitation</p>
            </div>

            {/* Main Invitation Text */}
            <div className="text-center mb-6 sm:mb-8">
              <p className="text-gray-700 leading-relaxed text-base sm:text-lg font-wedding-elegant">도원과 선민의 결혼식에</p>
              <p className="text-gray-700 leading-relaxed text-base sm:text-lg font-wedding-elegant">소중한 분들을 초대합니다.</p>
            </div>

            {/* Date */}
            <div className="text-center mb-3 sm:mb-4">
              <p className="font-wedding-elegant text-gray-800 text-sm sm:text-sm">2025년 10월 18일 오전 11시</p>
            </div>

            {/* Simple Arrow right below the date */}
            <div className="text-center mb-6 sm:mb-8">
              <div className="text-gray-400 text-xl sm:text-2xl">^</div>
            </div>
          </div>
        </div>
      </div>

      {/* Spacer to push content down - 동적으로 계산된 높이 사용 */}
      <div style={{ height: firstPageHeight || "50vh" }}></div>

      {/* Second Page and Beyond - Scrollable In Front (z-index higher) */}
      <div className="relative z-20 px-1 sm:px-4">
        <MainContent />
      </div>
    </div>
  )
}
