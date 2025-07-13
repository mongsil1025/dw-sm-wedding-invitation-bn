"use client"

import React, { useState } from "react"
import { ChevronDown, Copy } from "lucide-react"

export const AccountInfo = () => {
  const [groomCollapsed, setGroomCollapsed] = useState(false)
  const [brideCollapsed, setBrideCollapsed] = useState(false)

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
  )
}