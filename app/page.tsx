"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Heart, Camera, ChevronDown, Copy } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Image from "next/image"
import dynamic from "next/dynamic"
import { getHeartCount, incrementHeartCount } from "@/lib/firestore"
import { weddingPhotos, getOptimizedImageUrl, getPriorityPhotos, getLazyPhotos } from "@/lib/blob-images"
import { OptimizedImage } from "@/components/optimized-image"
import JSConfetti from "js-confetti"

// PhotoSwipe Gallery를 동적으로 로드 (SSR 방지)
const Gallery = dynamic(() => import("react-photoswipe-gallery").then((mod) => mod.Gallery), { ssr: false })

const Item = dynamic(() => import("react-photoswipe-gallery").then((mod) => mod.Item), { ssr: false })

// 네이버 지도 컴포넌트를 동적으로 로드 (SSR 방지)
const NaverMapComponent = dynamic(() => import("@/components/naver-map"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-48 bg-gray-100 rounded-lg flex items-center justify-center font-wedding-light">
      지도 로딩 중...
    </div>
  ),
})

// 카카오 SDK 타입 선언
declare global {
  interface Window {
    Kakao: any
  }
}

export default function WeddingInvitation() {
  const [currentPhoto, setCurrentPhoto] = useState(1)
  const totalPhotos = 6
  const [groomCollapsed, setGroomCollapsed] = useState(false)
  const [brideCollapsed, setBrideCollapsed] = useState(false)
  const [scrollY, setScrollY] = useState(0)
  const [isClient, setIsClient] = useState(false)
  const [isKakaoReady, setIsKakaoReady] = useState(false)
  const [heartCount, setHeartCount] = useState(0)
  const [isHeartLoading, setIsHeartLoading] = useState(false)
  const [jsConfetti, setJsConfetti] = useState<JSConfetti | null>(null)
  const [firstPageHeight, setFirstPageHeight] = useState(0)
  const [showAllPhotos, setShowAllPhotos] = useState(false)

  const [isFirebaseAvailable, setIsFirebaseAvailable] = useState(true)
  // Use optimized photo loading strategy
  const priorityPhotos = getPriorityPhotos() // First 9 photos
  const lazyPhotos = getLazyPhotos() // Remaining photos
  const mainPhoto = weddingPhotos[0] // Hero photo

  // 상록웨딩홀 좌표 (예시 - 실제 좌표로 변경 필요)
  const weddingHallLocation = {
    lat: 37.5040168,
    lng: 127.0429909,
    name: "상록아트홀",
  }

  useEffect(() => {
    setIsClient(true)

    // JSConfetti 초기화
    const confetti = new JSConfetti()
    setJsConfetti(confetti)

    const handleScroll = () => {
      const currentScrollY = window.scrollY
      setScrollY(currentScrollY)
    }

    const calculateFirstPageHeight = () => {
      // 첫 번째 페이지의 실제 높이를 계산
      const firstPageElement = document.getElementById("first-page")
      if (firstPageElement) {
        const rect = firstPageElement.getBoundingClientRect()
        const computedHeight = rect.height
        setFirstPageHeight(computedHeight)
      }
    }

    // 초기 계산
    calculateFirstPageHeight()

    // 리사이즈 시 재계산
    const handleResize = () => {
      calculateFirstPageHeight()
    }

    window.addEventListener("scroll", handleScroll)
    window.addEventListener("resize", handleResize)

    // 폰트 로드 후 재계산
    document.fonts.ready.then(() => {
      calculateFirstPageHeight()
    })

    return () => {
      window.removeEventListener("scroll", handleScroll)
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  // Firebase에서 하트 수 가져오기
  useEffect(() => {
    const fetchHeartCount = async () => {
      try {
        const count = await getHeartCount()
        setHeartCount(count)
        setIsFirebaseAvailable(true)
      } catch (error) {
        console.error("Error fetching heart count:", error)
        setIsFirebaseAvailable(false)
        // Firebase를 사용할 수 없을 때 로컬 스토리지에서 하트 수를 가져오거나 기본값 사용
        const localHeartCount = localStorage.getItem("wedding-heart-count")
        if (localHeartCount) {
          setHeartCount(Number.parseInt(localHeartCount, 10))
        } else {
          setHeartCount(0)
        }
      }
    }

    fetchHeartCount()
  }, [])

  // 하트 클릭 핸들러
  const handleHeartClick = async () => {
    if (isHeartLoading) return

    setIsHeartLoading(true)
    try {
      if (isFirebaseAvailable) {
        // Firebase를 사용할 수 있는 경우
        const newCount = await incrementHeartCount()
        setHeartCount(newCount)
      } else {
        // Firebase를 사용할 수 없는 경우 로컬 스토리지 사용
        const currentCount = heartCount + 1
        setHeartCount(currentCount)
        localStorage.setItem("wedding-heart-count", currentCount.toString())
      }

      // Confetti 효과 실행
      if (jsConfetti) {
        jsConfetti.addConfetti({
          emojis: ["💖", "💕", "💗", "💓", "💝"],
          emojiSize: 50,
          confettiNumber: 30,
        })
      }
    } catch (error) {
      console.error("Error incrementing heart:", error)

      // Firebase 에러인 경우 로컬 스토리지로 폴백
      if (!isFirebaseAvailable) {
        const currentCount = heartCount + 1
        setHeartCount(currentCount)
        localStorage.setItem("wedding-heart-count", currentCount.toString())

        // Confetti 효과 실행
        if (jsConfetti) {
          jsConfetti.addConfetti({
            emojis: ["💖", "💕", "💗", "💓", "💝"],
            emojiSize: 50,
            confettiNumber: 30,
          })
        }
      } else {
        // 에러 메시지 표시
        const errorMessage =
          error instanceof Error ? error.message : "하트를 보내는 중 오류가 발생했습니다. 다시 시도해주세요."
        alert(errorMessage)
      }
    } finally {
      setIsHeartLoading(false)
    }
  }

  // 카카오 SDK 초기화 - 더 안전한 방식
  useEffect(() => {
    const initKakao = () => {
      try {
        if (typeof window !== "undefined" && window.Kakao) {
          if (!window.Kakao.isInitialized()) {
            // 테스트용 키 - 실제 사용 시에는 본인의 카카오 앱 키를 사용해야 합니다
            const kakaoKey = process.env.NEXT_PUBLIC_KAKAO_APP_KEY
            window.Kakao.init(kakaoKey)
            console.log("카카오 SDK 초기화 완료:", window.Kakao.isInitialized())
          }

          // Link 객체가 존재하는지 확인
          if (window.Kakao.Link) {
            setIsKakaoReady(true)
            console.log("카카오 Link 준비 완료")
          } else {
            console.error("카카오 Link 객체를 찾을 수 없습니다.")
          }
        }
      } catch (error) {
        console.error("카카오 SDK 초기화 오류:", error)
      }
    }

    // SDK 로드 확인 및 초기화
    const checkKakaoSDK = () => {
      if (typeof window !== "undefined" && window.Kakao) {
        initKakao()
      } else {
        // SDK가 아직 로드되지 않았다면 재시도
        setTimeout(checkKakaoSDK, 100)
      }
    }

    // 페이지 로드 후 SDK 확인
    if (typeof window !== "undefined") {
      if (document.readyState === "complete") {
        checkKakaoSDK()
      } else {
        window.addEventListener("load", checkKakaoSDK)
        return () => window.removeEventListener("load", checkKakaoSDK)
      }
    }
  }, [])

  const openNaverMap = () => {
    const url = `https://map.naver.com/p/search/%EC%83%81%EB%A1%9D%EC%95%84%ED%8A%B8%ED%99%80/place/366784007?c=15.00,0,0,0,dh`
    window.open(url, "_blank")
  }

  const openKakaoMap = () => {
    const url = `https://map.kakao.com/link/map/${encodeURIComponent(weddingHallLocation.name)},${weddingHallLocation.lat},${weddingHallLocation.lng}`
    window.open(url, "_blank")
  }

  // 카카오톡 공유하기 함수 - 오류 처리 강화
  const shareToKakao = () => {
    try {
      // 카카오 SDK와 Link 객체 존재 확인
      if (!window.Kakao) {
        alert("카카오 SDK가 로드되지 않았습니다. 페이지를 새로고침해주세요.")
        return
      }

      if (!window.Kakao.isInitialized()) {
        alert("카카오 SDK가 초기화되지 않았습니다. 카카오 앱 키를 확인해주세요.")
        return
      }

      // 공유 실행
      window.Kakao.Share.sendDefault({
        objectType: "feed",
        content: {
          title: "💒 도원 ♥ 선민 결혼식 초대장",
          description:
            "2024년 10월 15일 토요일 오후 12시\n상록아트홀에서 열리는 결혼식에 초대합니다.\n\n저희 두 사람, 하나가 되어 함께 걸어갈 앞날을 약속합니다.\n소중한 분들의 따뜻한 사랑과 축복을 주세요.",
          imageUrl: typeof window !== "undefined" ? window.location.origin + "/background.png" : "",
          link: {
            mobileWebUrl: typeof window !== "undefined" ? window.location.href : "",
            webUrl: typeof window !== "undefined" ? window.location.href : "",
          },
        },
        social: {
          likeCount: 0,
          commentCount: 0,
        },
        buttons: [
          {
            title: "초대장 보기",
            link: {
              mobileWebUrl: typeof window !== "undefined" ? window.location.href : "",
              webUrl: typeof window !== "undefined" ? window.location.href : "",
            },
          },
        ],
      })
    } catch (error) {
      console.error("카카오톡 공유 오류:", error)
      alert("카카오톡 공유 중 오류가 발생했습니다. 다시 시도해주세요.")
    }
  }

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

  //계좌번호 복사하기 함수
  const copyAcctToClipboard = async (e: React.MouseEvent<HTMLButtonElement>) => {
    try {
      const button = e.currentTarget
      const parent = button.parentElement
      const targetP = parent?.querySelector("p")
      const textToCopy = targetP?.innerText || ""

      if (navigator.clipboard) {
        await navigator.clipboard.writeText(textToCopy)
        alert("복사되었습니다!")
      }
    } catch (err) {
      alert("복사에 실패했습니다.")
      console.error(err)
    }
  }
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
    <div className="min-h-screen bg-amber-50">
      {/* Fixed gradient background that doesn't scroll */}
      <div className="fixed inset-0 z-0" style={{ height: "100vh", backgroundColor: "rgb(241, 224, 206)" }}></div>

      {/* Envelope at bottom - disappears when scrolling */}
      {isClient && (
        <div
          className="fixed bottom-[-95px] left-1/2 transform -translate-x-1/2 z-30 transition-transform duration-500 ease-out w-full max-w-sm px-4"
          style={{
            transform: `translateX(-50%) translateY(${scrollY > 50 ? "100%" : "0%"})`,
          }}
        >
          <Image src="/envelope.png" alt="Envelope" width={384} height={230} className="w-full h-auto" />
        </div>
      )}

      {/* First Page - Fixed Behind (z-index lower) */}
      <div
        className="fixed inset-0 z-10 flex items-start justify-center px-4"
        style={{
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        {/* House-shaped Card - Much Taller */}
        <div
          id="first-page"
          className="pt-12 px-8 pb-8 relative w-full max-w-sm mx-auto"
          style={{
            backgroundImage: "url('/background.png')",
            backgroundSize: "cover",
            minHeight: "fit-content",
          }}
        >
          {/* Candle Icon */}
          <div className="text-center mb-10">
            <div className="w-12 h-12 mx-auto mb-4 relative">
              <div className="w-2 h-8 bg-amber-200 mx-auto rounded-full"></div>
              <div className="w-4 h-4 bg-orange-400 rounded-full mx-auto -mt-2 relative">
                <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-3 bg-orange-500 rounded-full animate-pulse"></div>
              </div>
            </div>
            <p className="text-sm text-gray-600 font-wedding-title">Wedding Invitation</p>
          </div>

          {/* Main Invitation Text */}
          <div className="text-center mb-8">
            <p className="text-gray-700 leading-relaxed text-lg font-wedding-elegant">도원과 선민의 결혼식에</p>
            <p className="text-gray-700 leading-relaxed text-lg font-wedding-elegant">소중한 분들을 초대합니다.</p>
          </div>

          {/* Date */}
          <div className="text-center mb-4">
            <p className="font-wedding-elegant text-gray-800" style={{ fontSize: "16px" }}>
              2025년 10월 18일 오전 11시
            </p>
          </div>

          {/* Simple Arrow right below the date */}
          <div className="text-center mb-8">
            <div className="text-gray-400 text-2xl">^</div>
          </div>
        </div>
      </div>

      {/* Spacer to push content down - 동적으로 계산된 높이 사용 */}
      <div style={{ height: firstPageHeight || "50vh" }}></div>

      {/* Second Page and Beyond - Scrollable In Front (z-index higher) */}
      <div className="relative z-20 px-4">
        <div className="w-full max-w-sm mx-auto">
          {/* Photo Section */}
          <div className="bg-white px-8 pt-8 pb-8 border border-gray-200">
            {/* Couple Photo - Priority loading */}
            <div className="mb-8">
              <div className="w-full h-90 rounded-lg overflow-hidden">
                {mainPhoto && (
                  <Image
                    src={getOptimizedImageUrl(mainPhoto.src, {
                      width: 320,
                      height: 320,
                      quality: 90 || "/placeholder.svg",
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
            <div className="text-center mb-6">
              <div className="text-xl text-gray-400 mb-4" style={{ fontFamily: "cursive" }}>
                ♡ ♡ ♡
              </div>
            </div>

            {/* Message */}
            <div className="text-center mb-8 space-y-3">
              <p className="text-sm text-gray-600 font-wedding-modern">저희 두 사람, 하나가 되어</p>
              <p className="text-sm text-gray-600 font-wedding-modern">함께 걸어갈 앞날을 약속합니다.</p>
              <p className="text-sm text-gray-600 font-wedding-modern">소중한 분들의 따뜻한 사랑과</p>
              <p className="text-sm text-gray-600 font-wedding-modern">축복을 주세요.</p>
            </div>

            {/* Divider */}
            <div className="flex justify-center mb-8">
              <div className="w-16 h-px bg-gray-300"></div>
            </div>

            {/* Names */}
            <div className="text-center mb-8">
              <div className="space-y-3">
                <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                  <p className="text-sm text-grey-600 font-wedding-modern bg-indigo-100">[신랑측]</p>
                  <p className="text-sm text-black-300 font-wedding-modern">&nbsp;&nbsp;이종호 • 한광숙</p>
                  <p style={{ fontSize: "10px" }}>&nbsp;&nbsp;의 장남</p>{" "}
                  <p className="text-sm text-black-300 font-wedding-modern">&nbsp;&nbsp;도원</p>
                </div>

                <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                  <p className="text-sm text-grey-600 font-wedding-modern bg-pink-100">[신부측]</p>
                  <p className="text-sm text-black-300 font-wedding-modern">&nbsp;&nbsp;정금영 • 이혜경</p>
                  <p style={{ fontSize: "10px" }}>&nbsp;&nbsp;의 장녀</p>{" "}
                  <p className="text-sm text-black-300 font-wedding-modern">&nbsp;&nbsp;선민</p>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="flex justify-center mb-8">
              <div className="w-16 h-px bg-gray-300"></div>
            </div>

            {/* Wedding Details */}
            <div className="text-center mb-8 space-y-2">
              <p className="text-sm text-gray-700 font-wedding-bold">2025년 10월 18일 토요일 오전 11시</p>
              <p className="text-sm text-gray-600 font-wedding-modern">상록아트홀 5F 아트홀</p>
            </div>

            {/* Gallery Section with Optimized Loading */}
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

            {/* Divider */}
            <div className="flex justify-center mb-8">
              <div className="w-16 h-px bg-gray-300"></div>
            </div>

            {/* Heart Transfer Section */}
            <div className="mb-8">
              <div className="text-center mb-6">
                <div className="text-2xl mb-2">👉</div>
                <p className="text-sm text-gray-600 font-wedding-modern">마음 전하실 곳</p>
              </div>

              <div className="space-y-4">
                {/* 신랑측 */}
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setGroomCollapsed(!groomCollapsed)}
                    className="w-full bg-indigo-100 px-4 py-3 flex justify-between items-center"
                  >
                    <span className="text-sm font-medium text-gray-700">신랑측</span>
                    <ChevronDown
                      className={`w-4 h-4 text-gray-500 transition-transform duration-300 ${groomCollapsed ? "rotate-180" : ""}`}
                    />
                  </button>

                  <div
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${groomCollapsed ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}
                  >
                    <div className="bg-white p-4 space-y-4">
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-gray-800">신랑 이도원</p>
                        <div className="flex justify-between items-center">
                          <p className="text-xs text-gray-600">국민은행 455402-01-422049</p>
                          <button
                            className="text-xs text-gray-500 border border-gray-300 px-2 py-1 rounded"
                            onClick={copyAcctToClipboard}
                          >
                            <Copy className="w-3 h-3 inline mr-1" />
                            복사하기
                          </button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <p className="text-sm font-medium text-gray-800">아버지 이종호</p>
                        <div className="flex justify-between items-center">
                          <p className="text-xs text-gray-600">농협 111-11-111111</p>
                          <button
                            className="text-xs text-gray-500 border border-gray-300 px-2 py-1 rounded"
                            onClick={copyAcctToClipboard}
                          >
                            <Copy className="w-3 h-3 inline mr-1" />
                            복사하기
                          </button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <p className="text-sm font-medium text-gray-800">어머니 한광숙</p>
                        <div className="flex justify-between items-center">
                          <p className="text-xs text-gray-600">국민은행 0000-000-0000000</p>
                          <button
                            className="text-xs text-gray-500 border border-gray-300 px-2 py-1 rounded"
                            onClick={copyAcctToClipboard}
                          >
                            <Copy className="w-3 h-3 inline mr-1" />
                            복사하기
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 신부측 */}
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setBrideCollapsed(!brideCollapsed)}
                    className="w-full bg-rose-50 px-4 py-3 flex justify-between items-center"
                  >
                    <span className="text-sm font-medium text-gray-700">신부측</span>
                    <ChevronDown
                      className={`w-4 h-4 text-gray-500 transition-transform duration-300 ${brideCollapsed ? "rotate-180" : ""}`}
                    />
                  </button>

                  <div
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${brideCollapsed ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}
                  >
                    <div className="bg-white p-4 space-y-4">
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-gray-800">신부 정선민</p>
                        <div className="flex justify-between items-center">
                          <p className="text-xs text-gray-600">우리은행 1002-346-723396</p>
                          <button
                            className="text-xs text-gray-500 border border-gray-300 px-2 py-1 rounded"
                            onClick={copyAcctToClipboard}
                          >
                            <Copy className="w-3 h-3 inline mr-1" />
                            복사하기
                          </button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <p className="text-sm font-medium text-gray-800">어머니 이혜경</p>
                        <div className="flex justify-between items-center">
                          <p className="text-xs text-gray-600">농협 000-00-0000000</p>
                          <button
                            className="text-xs text-gray-500 border border-gray-300 px-2 py-1 rounded"
                            onClick={copyAcctToClipboard}
                          >
                            <Copy className="w-3 h-3 inline mr-1" />
                            복사하기
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="flex justify-center mb-8">
              <div className="w-16 h-px bg-gray-300"></div>
            </div>

            {/* Directions Section (기존 축하의 글 섹션을 오시는길로 변경) */}
            <div className="mb-8">
              <div className="text-center mb-6">
                <div className="text-2xl mb-2">🗺️</div>
                <p className="text-sm text-gray-600">오시는길</p>
              </div>

              {/* 네이버 지도 */}
              <div className="mb-4">
                <NaverMapComponent
                  lat={weddingHallLocation.lat}
                  lng={weddingHallLocation.lng}
                  title={weddingHallLocation.name}
                />
              </div>

              <div className="flex space-x-2 mb-6">
                <Button size="sm" variant="outline" className="flex-1 text-xs bg-transparent" onClick={openNaverMap}>
                  네이버 지도로 보기
                </Button>
                <Button size="sm" variant="outline" className="flex-1 text-xs bg-transparent" onClick={openKakaoMap}>
                  카카오맵으로 보기
                </Button>
              </div>

              {/* 위치 상세 정보 */}
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-800 mb-2">지하철</h4>
                  <p className="text-xs text-black-500">📍 [2호선]/[수인분당선] 선릉역 5번 출구로 나와 도보 10분</p>
                  <p className="text-xs text-gray-600">
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;✓ 5번 출구 앞 셔틀버스 수시 운행
                  </p>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-800 mb-2">버스</h4>
                  <p className="text-xs text-black-500">📍 KT 강남지사 정류장 하차 시 도보 3분</p>
                  <p className="text-xs text-gray-600">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;✓ 간선버스[파랑] 141, 242, 361</p>
                  <br />
                  <p className="text-xs text-black-500">📍 서울상록회관 정류장 하차 시 도보 3분</p>
                  <p className="text-xs text-gray-600">
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;✓ 간선버스[파랑] 146, 341, 360, 740
                  </p>
                  <p className="text-xs text-gray-600">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;✓ 직행버스[빨강] 8001</p>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="flex justify-center mb-8">
              <div className="w-16 h-px bg-gray-300"></div>
            </div>

            {/* Wedding Information Section */}
            <div className="mb-8">
              <div className="text-center mb-6">
                <div className="text-2xl mb-2">📋</div>
                <p className="text-sm text-gray-600">예식안내</p>
              </div>

              <Tabs defaultValue="dining" className="w-full">
                <TabsList className="grid w-full grid-cols-3 bg-gray-100">
                  <TabsTrigger value="dining" className="text-xs">
                    식사안내
                  </TabsTrigger>
                  <TabsTrigger value="shuttle" className="text-xs">
                    셔틀버스
                  </TabsTrigger>
                  <TabsTrigger value="welcome" className="text-xs">
                    웰컴드링크
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="dining" className="mt-4">
                  <div className="space-y-3">
                    <div className="text-center">
                      <h4 className="text-sm font-medium text-gray-800 mb-2">식사 안내</h4>
                      <Image
                        src="/yy.png"
                        alt="연회장 사진"
                        width={320}
                        height={320}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="space-y-2">
                      <p className="text-xs text-blakc-500 text-left">
                        예식 시작 30분 전부터 4층 연회장에서 식사를 하실 수 있습니다 😊
                      </p>
                      <br />
                      <p className="text-xs text-black-500 text-left">🍽️ 대표 추천메뉴</p>
                      <p className="text-xs text-grey-600 text-left">
                        육회초밥, 스테이크 루꼴라 샐러드, 도가니탕, 블랙타이거 새우구이, LA목살구이, 국순당 캔 막걸리 등
                      </p>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="shuttle" className="mt-4">
                  <div className="space-y-3">
                    <div className="text-center">
                      <h4 className="text-sm font-medium text-gray-800 mb-2">셔틀버스 안내</h4>
                      <Image
                        src="/yy.png"
                        alt="셔틀버스 안내 사진"
                        width={320}
                        height={320}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="space-y-2">
                      <p className="text-xs text-black-500 text-left">
                        선릉역 5번 출구 앞에서 셔틀버스 3대가 5-10분 간격으로 수시 운행됩니다. 편하게 이용해주세요 😁
                      </p>
                      <br />
                      <p className="text-xs text-black-500 text-left">🚍 운행노선</p>
                      <p className="text-xs text-gray-600 text-left">&nbsp;&nbsp;&nbsp;✓ 선릉역 5번출구 ➡️ 정문(1층) </p>
                      <p className="text-xs text-gray-600 text-left">
                        &nbsp;&nbsp;&nbsp;✓ 웨딩홀 후문(L층) 또는 정문(1층) ➡️ 선릉역 5번출구{" "}
                      </p>
                      <br />
                      <p className="text-xs text-black-500 text-left">🏧 ATM 위치</p>
                      <p className="text-xs text-gray-600 text-left">&nbsp;&nbsp;&nbsp;✓ 건물 1층 국민은행 앞</p>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="welcome" className="mt-4">
                  <div className="space-y-3">
                    <div className="text-center">
                      <h4 className="text-sm font-medium text-gray-800 mb-2">웰컴드링크 안내</h4>
                      <Image
                        src="/yy.png"
                        alt="홀 사진"
                        width={320}
                        height={320}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="space-y-2">
                      <p className="text-xs text-black-500 text-left">
                        5층 아트홀 로비 좌측에는, 먼저 오신 하객분들을 위한 웰컴 드링크가 준비되어 있습니다. 예식홀
                        반입은 어려운 점 양해 부탁드립니다 ☕️
                      </p>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            {/* Final Heart */}
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

            {/* Share Button */}
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
          </div>
        </div>
      </div>
    </div>
  )
}
