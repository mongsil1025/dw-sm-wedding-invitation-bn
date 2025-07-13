"use client"

import React, { useState } from "react"
import { Camera } from "lucide-react"
import { Button } from "@/components/ui/button"
import dynamic from "next/dynamic"
import { weddingPhotos, getOptimizedImageUrl, getPriorityPhotos, getLazyPhotos } from "@/lib/blob-images"
import { OptimizedImage } from "@/components/optimized-image"

// PhotoSwipe Gallery를 동적으로 로드 (SSR 방지)
const Gallery = dynamic(() => import("react-photoswipe-gallery").then((mod) => mod.Gallery), { ssr: false })
const Item = dynamic(() => import("react-photoswipe-gallery").then((mod) => mod.Item), { ssr: false })

export const PhotoGallery = () => {
  const [showAllPhotos, setShowAllPhotos] = useState(false)

  // Use optimized photo loading strategy
  const priorityPhotos = getPriorityPhotos() // First 9 photos
  const lazyPhotos = getLazyPhotos() // Remaining photos

  // 기본 갤러리 컴포넌트 (PhotoSwipe가 로드되지 않은 경우)
  const BasicGallery = () => (
    <div className="space-y-4">
      {/* Priority photos (first 6) - load immediately */}
      <div className="grid grid-cols-3 gap-1">
        {priorityPhotos.map((photo) => (
          <OptimizedImage
            key={photo.id}
            src={photo.thumbnail}
            alt={photo.alt}
            width={photo.width}
            height={photo.height}
            priority={true}
            quality={80}
          />
        ))}
      </div>

      {/* Lazy-loaded photos - only when "더보기" is clicked */}
      {showAllPhotos && (
        <div className="grid grid-cols-3 gap-1">
          {lazyPhotos.slice(0, 6).map((photo) => (
            <OptimizedImage
              key={photo.id}
              src={photo.thumbnail}
              alt={photo.alt}
              width={photo.width}
              height={photo.height}
              priority={false}
              quality={75}
            />
          ))}
        </div>
      )}

      {/* Show More / Show Less Button */}
      <div className="text-center mt-4">
        <Button
          variant="outline"
          onClick={() => setShowAllPhotos(!showAllPhotos)}
          className="w-full bg-transparent border-gray-300 text-gray-600 hover:bg-gray-50"
        >
          {showAllPhotos ? "접기" : `더보기 (${lazyPhotos.length}장 더)`}
        </Button>
      </div>
    </div>
  )

  return (
    <div className="mb-8">
      <div className="text-center mb-6">
        <Camera className="w-6 h-6 mx-auto mb-2 text-gray-400" />
        <p className="text-sm text-gray-600 font-wedding-light">Moment of love</p>
      </div>

      <Gallery
        options={{
          arrowPrev: true,
          arrowNext: true,
          zoom: true,
          close: true,
          counter: true,
          bgOpacity: 0.9,
          padding: { top: 20, bottom: 40, left: 100, right: 100 },
        }}
      >
        <div className="space-y-4">
          {/* Priority photos (first 9) - always visible */}
          <div className="grid grid-cols-3 gap-1">
            {priorityPhotos.map((photo) => (
              <Item
                key={photo.id}
                original={photo.src}
                thumbnail={getOptimizedImageUrl(photo.thumbnail, { width: 400, height: 400, quality: 85 })}
                width={photo.width}
                height={photo.height}
                alt={photo.alt}
              >
                {({ ref, open }) => (
                  <div
                    ref={ref}
                    onClick={open}
                    className="aspect-square bg-gray-100 overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
                  >
                    <OptimizedImage
                      src={photo.thumbnail}
                      alt={photo.alt}
                      width={photo.width}
                      height={photo.height}
                      priority={true}
                      quality={80}
                    />
                  </div>
                )}
              </Item>
            ))}
          </div>

          {/* Additional photos - shown when showAllPhotos is true */}
          {showAllPhotos && (
            <div className="grid grid-cols-3 gap-1">
              {lazyPhotos.slice(0, 9).map((photo) => (
                <Item
                  key={photo.id}
                  original={photo.src}
                  thumbnail={getOptimizedImageUrl(photo.thumbnail, { width: 400, height: 400, quality: 85 })}
                  width={photo.width}
                  height={photo.height}
                  alt={photo.alt}
                >
                  {({ ref, open }) => (
                    <div
                      ref={ref}
                      onClick={open}
                      className="aspect-square bg-gray-100 overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
                    >
                      <OptimizedImage
                        src={photo.thumbnail}
                        alt={photo.alt}
                        width={photo.width}
                        height={photo.height}
                        priority={false}
                        quality={75}
                      />
                    </div>
                  )}
                </Item>
              ))}
            </div>
          )}

          {/* Show More / Show Less Button */}
          <div className="text-center mt-4">
            <Button
              variant="outline"
              onClick={() => setShowAllPhotos(!showAllPhotos)}
              className="w-full bg-transparent border-gray-300 text-gray-600 hover:bg-gray-50"
            >
              {showAllPhotos ? "접기" : `더보기 (${lazyPhotos.length}장 더)`}
            </Button>
          </div>
        </div>
      </Gallery>
    </div>
  )
}