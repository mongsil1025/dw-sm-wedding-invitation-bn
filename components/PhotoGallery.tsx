"use client"

import React, { useState, useEffect } from "react"
import { Camera } from "lucide-react"
import { Button } from "@/components/ui/button"
import dynamic from "next/dynamic"
import { weddingPhotos, getOptimizedImageUrl, getPriorityPhotos, getLazyPhotos } from "@/lib/blob-images"
import { OptimizedImage } from "@/components/optimized-image"

// PhotoSwipe Gallery를 동적으로 로드 (SSR 방지)
const Gallery = dynamic(() => import("react-photoswipe-gallery").then((mod) => mod.Gallery), { ssr: false })
const Item = dynamic(() => import("react-photoswipe-gallery").then((mod) => mod.Item), { ssr: false })

// 이미지 크기를 동적으로 가져오는 함수
const getImageDimensions = (src: string): Promise<{ width: number; height: number }> => {
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => {
      resolve({ width: img.naturalWidth, height: img.naturalHeight })
    }
    img.onerror = () => {
      // 에러 시 기본값 사용
      resolve({ width: 800, height: 600 })
    }
    img.src = src
  })
}

export const PhotoGallery = () => {
  const [showAllPhotos, setShowAllPhotos] = useState(false)
  const [imageDimensions, setImageDimensions] = useState<Record<number, { width: number; height: number }>>({})

  // Use optimized photo loading strategy
  const priorityPhotos = getPriorityPhotos() // First 9 photos
  const lazyPhotos = getLazyPhotos() // Remaining photos

  // 이미지 크기를 동적으로 계산 (55%로 축소)
  useEffect(() => {
    const loadImageDimensions = async () => {
      const dimensions: Record<number, { width: number; height: number }> = {}

      // 모든 이미지의 크기를 가져오고 55%로 계산
      for (const photo of weddingPhotos) {
        try {
          const { width, height } = await getImageDimensions(photo.src)
          dimensions[photo.id] = {
            width: Math.round(width * 0.55), // 55%로 축소
            height: Math.round(height * 0.55) // 55%로 축소
          }
        } catch (error) {
          console.error(`Error loading image ${photo.id}:`, error)
          dimensions[photo.id] = { width: 440, height: 330 } // 기본값 (800*0.55, 600*0.55)
        }
      }

      setImageDimensions(dimensions)
    }

    loadImageDimensions()
  }, [])

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
					zoom: false,
					close: true,
					counter: true,
					bgOpacity: 0.9,
					padding: { top: 20, bottom: 40, left: 100, right: 100 },
				}}
			>
				<div className="space-y-4">
          {/* Priority photos (first 9) - always visible */}
          <div className="grid grid-cols-3 gap-1">
            {weddingPhotos.slice(1, 10).map((photo, index) => (
              <Item
                key={photo.id}
                original={photo.src}
                thumbnail={getOptimizedImageUrl(photo.thumbnail, { width: 400, height: 400, quality: 85 })}
                width={imageDimensions[photo.id]?.width || 440}
                height={imageDimensions[photo.id]?.height || 330}
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
              {weddingPhotos.slice(10, 19).map((photo) => (
                <Item
                  key={photo.id}
                  original={photo.src}
                  thumbnail={getOptimizedImageUrl(photo.thumbnail, { width: 400, height: 400, quality: 85 })}
                  width={imageDimensions[photo.id]?.width || 440}
                  height={imageDimensions[photo.id]?.height || 330}
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

          {/* 숨겨진 PhotoSwipe 아이템들 - 나머지 모든 사진들 */}
          {weddingPhotos.slice(19).map((photo) => (
            <Item
              key={photo.id}
              original={photo.src}
              thumbnail={getOptimizedImageUrl(photo.thumbnail, { width: 400, height: 400, quality: 85 })}
              width={imageDimensions[photo.id]?.width || 440}
              height={imageDimensions[photo.id]?.height || 330}
              alt={photo.alt}
            >
              {({ ref, open }) => (
                <div style={{ display: 'none' }} ref={ref} onClick={open} />
              )}
            </Item>
          ))}

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