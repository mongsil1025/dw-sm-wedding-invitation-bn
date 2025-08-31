"use client"

import React, { Suspense, useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"

interface BigFontProviderProps {
  children: React.ReactNode
}

function BigFontProviderInner({ children }: BigFontProviderProps) {
  const searchParams = useSearchParams()
  const [isBigFont, setIsBigFont] = useState(false)

  useEffect(() => {
    const typeParam = searchParams.get("type")
    setIsBigFont(typeParam === "bigFont")
  }, [searchParams])

  useEffect(() => {
    if (isBigFont) {
      document.body.classList.add("big-font")
    } else {
      document.body.classList.remove("big-font")
    }

    // Cleanup function to remove class when component unmounts
    return () => {
      document.body.classList.remove("big-font")
    }
  }, [isBigFont])

  return <>{children}</>
}

export function BigFontProvider({ children }: BigFontProviderProps) {
  return (
    <Suspense fallback={<>{children}</>}>
      <BigFontProviderInner>{children}</BigFontProviderInner>
    </Suspense>
  )
}
