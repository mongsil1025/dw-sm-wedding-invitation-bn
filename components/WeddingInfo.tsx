"use client"

import React from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Image from "next/image"

export const WeddingInfo = () => {
  return (
    <div className="pb-12 pt-12">
      <div className="text-center mb-6">
        <Image
          src="/wine.png"
          alt="Wine"
          width={60}
          height={32}
          className="mx-auto mb-2"
        />
        <p className="text-sm text-gray-600 font-wedding-bold">예식안내</p>
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
              <Image
                src="/yy.png"
                alt="연회장 사진"
                width={320}
                height={320}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="space-y-2">
              <p className="text-sm text-blakc-500 text-left">
                예식 시작 30분 전부터 <span className="px-1 rounded bg-yellow-100 font-semibold">4층 연회장</span>에서 식사를 하실 수 있습니다 😊
              </p>

              <div className="py-2">
                <div className="border-t border-dashed border-gray-300 w-full"></div>
              </div>

              <p className="text-sm text-black-500 font-bold text-left">🍽️ 대표 추천메뉴</p>
              <p className="text-sm text-grey-600 text-left">
                육회초밥, 스테이크 루꼴라 샐러드, 도가니탕, 블랙타이거 새우구이, LA목살구이, <span className="px-1 rounded bg-yellow-100 font-semibold">국순당 캔 막걸리</span> 등
              </p>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="shuttle" className="mt-4">
          <div className="space-y-3">
            <div className="text-center">
              <Image
                src="/yy.png"
                alt="셔틀버스 안내 사진"
                width={320}
                height={320}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="space-y-2">
              <p className="text-sm text-black-500 text-left">
              <span className="px-1 rounded bg-yellow-100 font-semibold">선릉역 5번 출구</span> 앞에서 셔틀버스 3대가 5-10분 간격으로 수시 운행됩니다. 편하게 이용해주세요 😁
              </p>
              <br />
              <p className="text-sm text-black-500 text-left">🚍 운행노선</p>
              <p className="text-sm text-gray-600 text-left">&nbsp;&nbsp;&nbsp;✓ 선릉역 5번출구 ➡️ 정문(1층) 약 [3~5분 소요] </p>
              <p className="text-sm text-gray-600 text-left">
                &nbsp;&nbsp;&nbsp;✓ 웨딩홀 후문(L층) 또는 정문(1층) ➡️ 선릉역 5번출구{" "}
              </p>
              <br />
              <p className="text-sm text-black-500 text-left">🏧 ATM 위치</p>
              <p className="text-sm text-gray-600 text-left">&nbsp;&nbsp;&nbsp;✓ 건물 1층 국민은행 앞 3대</p>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="welcome" className="mt-4">
          <div className="space-y-3">
            <div className="text-center">
              <Image
                src="/yy.png"
                alt="홀 사진"
                width={320}
                height={320}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="space-y-2">
              <p className="text-sm text-black-500 text-left">
              ✓ 5층 아트홀 로비 좌측에는, 먼저 오신 하객분들을 위한 <span className="px-1 rounded bg-yellow-100 font-semibold">웰컴 드링크 ☕️</span>가 준비되어 있습니다.
              </p>
              <p className="text-sm text-black-500 text-left">
              ✓ 음료는 로비에서만 취식 가능하며, 예식홀 반입은 어렵습니다. 양해 부탁드립니다.
              </p>
            </div>

            <div className="py-2">
              <div className="border-t border-dashed border-gray-300 w-full"></div>
            </div>

            <p className="text-sm text-black-500 font-bold text-left">🥤 메뉴</p>
            <p className="text-sm text-grey-600 text-left">
              아메리카노, 진한 아메리카노, 에스프레소, 토마토 주스, 망고 주스, 생수
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}