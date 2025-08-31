"use client"

import React from "react"
import Image from "next/image"
import { useSearchParams } from "next/navigation"
import { WeddingInvitationCard } from "@/components/WeddingInvitationCard"
import { PhotoGallery } from "@/components/PhotoGallery"
import { AccountInfo } from "@/components/AccountInfo"
import { BrideGuestInfo } from "@/components/BrideGuestInfo"
import { LocationInfo } from "@/components/LocationInfo"
import { WeddingInfo } from "@/components/WeddingInfo"
import { HeartButton } from "@/components/HeartButton"
import { ShareButtons } from "@/components/ShareButtons"
import { Divider } from "@/components/ui/divider"

export const MainContent = () => {
  const searchParams = useSearchParams()
  const type = searchParams.get("type")
  const isBigFont = type === "bigFont"

  return (
    <div className="w-full max-w-sm mx-auto min-w-[280px] relative">
      <div className="bg-white px-4 sm:px-6 md:px-8 pt-6 sm:pt-8 pb-6 sm:pb-8 border border-gray-200 mx-2 sm:mx-0">
        {/* 초대장 카드 */}
        <WeddingInvitationCard />

        {/* 사진 갤러리 */}
        <PhotoGallery />

        {/* AccountInfo - when bigFont, place right after PhotoGallery */}
        {isBigFont && (
          <>
            <Divider />
            <AccountInfo />
            <LocationInfo />
          </>
        )}

        {/* 하트 버튼 */}
        <HeartButton />

        <Divider />

        {/* 예식 안내 */}
        <WeddingInfo />

        <Divider />

        {/* 신부하객맞이 - brideFriend일 때만 표시 */}
        {type === "brideFriend" && <BrideGuestInfo />}

        {type === "brideFriend" && <Divider />}

        {/* AccountInfo - when NOT bigFont, place in original position */}
        {!isBigFont && <AccountInfo />}

        {!isBigFont && <Divider />}

        {/* 오시는길 */}
        {!isBigFont && <LocationInfo />}

        {/* 공유 버튼 */}
        <ShareButtons />

        {/* 하단 여백 */}
        <div style={{ height: '10rem' }}></div>
      </div>
      {/* 하단 고정 Envelope - 메인 컨테이너 위에 겹침 */}
      <div className="absolute left-0 right-0 z-30 w-full" style={{ bottom: '-8rem' }}>
        <div className="w-full max-w-sm min-w-[280px] mx-auto">
          <div className="mx-2 sm:mx-0">
            <Image src="/envelope.png" alt="Envelope" width={384} height={200} className="w-full h-auto" />
          </div>
        </div>
      </div>
    </div>
  )
}