"use client"

import React from "react"
import Image from "next/image"

export const BrideGuestInfo = () => {
  return (
    <div className="pb-12 pt-12">
      <div className="text-center mb-6">
        <Image
          src="/cherry.png"
          alt="Cherry"
          width={65}
          height={40}
          className="mx-auto mb-2"
        />
        <p className="text-sm text-gray-600 mt-5 font-wedding-bold">신부하객맞이</p>
      </div>

      <div className="bg-rose-50 border border-rose-200 rounded-lg p-6">
        <div className="text-center">
          <p className="text-sm text-gray-700 leading-relaxed">
          신부가 로비에서 하객분들을 기다립니다!  <br/>
          이른 시간이지만 조금만 일찍 오셔서  <br/>
          같이 사진 남겨주시면 정말 감사하겠습니다 :) <br/>
          </p>
        </div>
      </div>
    </div>
  )
}
