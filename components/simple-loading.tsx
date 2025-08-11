"use client"

import React from 'react'
import Image from 'next/image'

export const SimpleLoading = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-amber-50">
      <div className="text-center">
        <div className="w-12 h-12 mx-auto mb-4 animate-pulse">
          <Image
            src="/candle.png"
            alt="Loading"
            width={48}
            height={81}
            className="w-full h-full object-contain"
            priority={true}
          />
          <p className="text-sm text-gray-600 font-wedding-modern">Loading...</p>
        </div>
      </div>
    </div>
  )
}