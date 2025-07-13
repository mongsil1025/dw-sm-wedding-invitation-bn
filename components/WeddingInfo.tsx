"use client"

import React from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Image from "next/image"

export const WeddingInfo = () => {
  return (
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
  )
}