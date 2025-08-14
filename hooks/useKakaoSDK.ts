import { useState, useEffect } from "react"

// 카카오 SDK 타입 선언
declare global {
  interface Window {
    Kakao: any
  }
}

export const useKakaoSDK = () => {
  const [isKakaoReady, setIsKakaoReady] = useState(false)

  // 카카오 SDK 초기화
  useEffect(() => {
    const initKakao = () => {
      try {
        if (typeof window !== "undefined" && window.Kakao) {
          if (!window.Kakao.isInitialized()) {
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

  // 카카오톡 공유하기 함수
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
          title: "💌 도원 ♥ 선민 결혼식 초대장",
          description:
            "2025년 10월 18일 토요일 11시\n상록아트홀 5F 아트홀",
          imageUrl: typeof window !== "undefined" ? window.location.origin + "/assets/N1090778_cropped.webp" : "",
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

  return {
    isKakaoReady,
    shareToKakao,
  }
}