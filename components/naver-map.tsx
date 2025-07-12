"use client"

import { useEffect, useRef } from "react"

interface NaverMapComponentProps {
  lat: number
  lng: number
  title: string
}

declare global {
  interface Window {
    naver: any
  }
}

export default function NaverMapComponent({ lat, lng, title }: NaverMapComponentProps) {
  const mapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const initMap = () => {
      if (!window.naver || !mapRef.current) return

      const map = new window.naver.maps.Map(mapRef.current, {
        center: new window.naver.maps.LatLng(lat, lng),
        zoom: 14,
        zoomControl: true,
        zoomControlOptions: {
          style: window.naver.maps.ZoomControlStyle.SMALL,
          position: window.naver.maps.Position.TOP_RIGHT,
        },
        mapTypeControl: false,
        scaleControl: false,
        logoControl: false,
        mapDataControl: false,
      })

      // 마커 추가
      new window.naver.maps.Marker({
        position: new window.naver.maps.LatLng(lat, lng),
        map: map,
        title: title,
      })
    }

    // 네이버 지도 API 스크립트 로드
    if (!window.naver) {
      const script = document.createElement("script")
      script.src = `https://openapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${process.env.NEXT_PUBLIC_NCP_CLIENT_ID}`
      script.onload = initMap
      document.head.appendChild(script)
    } else {
      initMap()
    }
  }, [lat, lng, title])

  return (
    <div
      ref={mapRef}
      style={{
        width: "100%",
        height: "200px",
      }}
      className="rounded-lg overflow-hidden"
    />
  )
}
