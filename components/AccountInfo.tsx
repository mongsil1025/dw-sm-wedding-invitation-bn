"use client"

import React, { useState } from "react"
import Image from "next/image"
import { useSearchParams } from "next/navigation"
import { ChevronDown, Copy } from "lucide-react"

export const AccountInfo = () => {
  const searchParams = useSearchParams()
  const isBigFont = searchParams.get("type") === "bigFont"
  const [groomCollapsed, setGroomCollapsed] = useState(true)
  const [brideCollapsed, setBrideCollapsed] = useState(true)

  // 계좌번호 복사하기 함수
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

  return (
    <div className="pb-12 pt-12">
      <div className="text-center mb-6">
        <Image
          src="/bird.png"
          alt="Bird"
          width={65}
          height={40}
          className="mx-auto mb-2"
        />
        <p className="text-sm text-gray-600 mt-5 font-wedding-bold">마음 전하실 곳</p>
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
                <div className={isBigFont ? "space-y-2" : "flex justify-between items-center"}>
                  <p className="text-xs text-gray-600">국민은행 455402-01-422049</p>
                  <button
                    className={`text-xs text-gray-500 border border-gray-300 px-2 py-1 rounded ${isBigFont ? "w-fit" : ""}`}
                    onClick={copyAcctToClipboard}
                  >
                    <Copy className="w-3 h-3 inline mr-1" />
                    복사
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-800">아버지 이종호</p>
                <div className={isBigFont ? "space-y-2" : "flex justify-between items-center"}>
                  <p className="text-xs text-gray-600">국민은행 005210-42-2877</p>
                  <button
                    className={`text-xs text-gray-500 border border-gray-300 px-2 py-1 rounded ${isBigFont ? "w-fit" : ""}`}
                    onClick={copyAcctToClipboard}
                  >
                    <Copy className="w-3 h-3 inline mr-1" />
                    복사
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-800">어머니 한광숙</p>
                <div className={isBigFont ? "space-y-2" : "flex justify-between items-center"}>
                  <p className="text-xs text-gray-600">국민은행 093240-11-3574</p>
                  <button
                    className={`text-xs text-gray-500 border border-gray-300 px-2 py-1 rounded ${isBigFont ? "w-fit" : ""}`}
                    onClick={copyAcctToClipboard}
                  >
                    <Copy className="w-3 h-3 inline mr-1" />
                    복사
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
                <div className={isBigFont ? "space-y-2" : "flex justify-between items-center"}>
                  <p className="text-xs text-gray-600">우리은행 1002-346-723396</p>
                  <button
                    className={`text-xs text-gray-500 border border-gray-300 px-2 py-1 rounded ${isBigFont ? "w-fit" : ""}`}
                    onClick={copyAcctToClipboard}
                  >
                    <Copy className="w-3 h-3 inline mr-1" />
                    복사
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-800">어머니 이혜경</p>
                <div className={isBigFont ? "space-y-2" : "flex justify-between items-center"}>
                  <p className="text-xs text-gray-600">하나은행 559-910165-05807</p>
                  <button
                    className={`text-xs text-gray-500 border border-gray-300 px-2 py-1 rounded ${isBigFont ? "w-fit" : ""}`}
                    onClick={copyAcctToClipboard}
                  >
                    <Copy className="w-3 h-3 inline mr-1" />
                    복사
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}