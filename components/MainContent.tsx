"use client"

import React from "react"
import { WeddingInvitationCard } from "@/components/WeddingInvitationCard"
import { PhotoGallery } from "@/components/PhotoGallery"
import { AccountInfo } from "@/components/AccountInfo"
import { LocationInfo } from "@/components/LocationInfo"
import { WeddingInfo } from "@/components/WeddingInfo"
import { HeartButton } from "@/components/HeartButton"
import { ShareButtons } from "@/components/ShareButtons"
import { Divider } from "@/components/ui/divider"

export const MainContent = () => {
  return (
    <div className="w-full max-w-sm mx-auto min-w-[280px]">
      <div className="bg-white px-4 sm:px-6 md:px-8 pt-6 sm:pt-8 pb-6 sm:pb-8 border border-gray-200 mx-2 sm:mx-0">
        {/* 초대장 카드 */}
        <WeddingInvitationCard />

        {/* 사진 갤러리 */}
        <PhotoGallery />

        <Divider />

        {/* 계좌 정보 */}
        <AccountInfo />

        <Divider />

        {/* 오시는길 */}
        <LocationInfo />

        <Divider />

        {/* 예식 안내 */}
        <WeddingInfo />

        <Divider />

        {/* 하트 버튼 */}
        <HeartButton />

        {/* 공유 버튼 */}
        <ShareButtons />
      </div>
    </div>
  )
}