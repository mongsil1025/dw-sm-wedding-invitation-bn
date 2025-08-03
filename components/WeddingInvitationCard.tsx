"use client"

import React from "react"
import Image from "next/image"
import { Flower } from "lucide-react"
import { weddingPhotos, getOptimizedImageUrl } from "@/lib/blob-images"
import { Divider } from "@/components/ui/divider"

export const WeddingInvitationCard = () => {
  const mainPhoto = weddingPhotos[0] // Hero photo

  return (
    <div>
      {/* Couple Photo - Priority loading */}
      <div className="pb-8 pt-8">
        <div className="w-full h-90 rounded-lg overflow-hidden">
          {mainPhoto && (
            <Image
              src={getOptimizedImageUrl(mainPhoto.src, {
                width: 320,
                height: 320,
                quality: 90,
              })}
              alt="신랑신부 사진"
              width={320}
              height={320}
              className="w-full h-full object-cover"
              priority={true}
              placeholder="blur"
              blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
            />
          )}
        </div>
      </div>

      {/* Decorative Hearts */}
      <div className="text-center">
        <div className="flex justify-center">
          <Image
            src="/welcome.png"
            alt="Welcome"
            width={120}
            height={40}
            className="object-contain"
          />
        </div>
      </div>

      {/* Message */}
      <div className="text-center space-y-3 pt-12 pb-12">
        <p className="text-sm text-gray-600 font-wedding-modern">저희 두 사람, 하나가 되어</p>
        <p className="text-sm text-gray-600 font-wedding-modern">함께 걸어갈 앞날을 약속합니다.</p>
        <p className="text-sm text-gray-600 font-wedding-modern">소중한 분들의 따뜻한 사랑과</p>
        <p className="text-sm text-gray-600 font-wedding-modern">축복을 주세요.</p>
      </div>

      <Divider />

      {/* Names */}
      <div className="text-center pt-12 pb-12">
        <div className="space-y-3 max-w-sm mx-auto">
          <div className="grid grid-cols-[auto_auto_auto_auto] gap-x-1 items-center justify-center">
            <p className="text-sm text-grey-600 font-wedding-modern bg-indigo-100">[신랑측]</p>
            <div className="flex items-center">
              <div className="w-3 h-3 mr-1"></div>
              <p className="text-sm text-black-300 font-wedding-modern">이종호 • 한광숙</p>
            </div>
            <p style={{ fontSize: "10px" }}>의 장남</p>
            <p className="text-sm text-black-300 font-wedding-modern">도원</p>
          </div>

          <div className="grid grid-cols-[auto_auto_auto_auto] gap-x-1 items-center justify-center">
            <p className="text-sm text-grey-600 font-wedding-modern bg-pink-100">[신부측]</p>
            <div className="flex items-center">
              <Flower className="w-3 h-3 text-gray-400 mr-1" />
              <p className="text-sm text-black-300 font-wedding-modern">정금영 • 이혜경</p>
            </div>
            <p style={{ fontSize: "10px" }}>의 장녀</p>
            <p className="text-sm text-black-300 font-wedding-modern">선민</p>
          </div>
        </div>
      </div>

      <Divider />

      {/* Wedding Details */}
      <div className="text-center space-y-2 pt-12 pb-12">
        <p className="text-sm text-gray-700 font-wedding-bold">2025년 10월 18일 토요일 오전 11시</p>
        <p className="text-sm text-gray-600 font-wedding-modern">상록아트홀 5F 아트홀</p>
      </div>
    </div>
  )
}