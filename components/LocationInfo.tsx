"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import dynamic from "next/dynamic"

// 네이버 지도 컴포넌트를 동적으로 로드 (SSR 방지)
const NaverMapComponent = dynamic(() => import("@/components/naver-map"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-48 bg-gray-100 rounded-lg flex items-center justify-center font-wedding-light">
      지도 로딩 중...
    </div>
  ),
})

export const LocationInfo = () => {
  // 상록웨딩홀 좌표 (예시 - 실제 좌표로 변경 필요)
  const weddingHallLocation = {
    lat: 37.5040168,
    lng: 127.0429909,
    name: "상록아트홀",
  }

  const openNaverMap = () => {
    const url = `https://map.naver.com/p/search/%EC%83%81%EB%A1%9D%EC%95%84%ED%8A%B8%ED%99%80/place/366784007?c=15.00,0,0,0,dh`
    window.open(url, "_blank")
  }

  const openKakaoMap = () => {
    const url = `https://map.kakao.com/link/map/${encodeURIComponent(weddingHallLocation.name)},${weddingHallLocation.lat},${weddingHallLocation.lng}`
    window.open(url, "_blank")
  }

  return (
    <div className="pb-8 pt-8">
      <div className="text-center mb-6">
        <p className="text-sm text-gray-600 font-wedding-bold">오시는길</p>
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
  )
}