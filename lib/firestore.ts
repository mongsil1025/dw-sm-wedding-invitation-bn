import { doc, getDoc, setDoc, increment } from "firebase/firestore"
import { db } from "./firebase"

const HEART_DOC_ID = "wedding-hearts"

export async function getHeartCount(): Promise<number> {
  try {
    const docRef = doc(db, "counters", HEART_DOC_ID)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      return docSnap.data().count || 0
    } else {
      // 문서가 없으면 0으로 초기화
      await setDoc(docRef, { count: 0 })
      return 0
    }
  } catch (error) {
    console.error("Error getting heart count:", error)
    // Firebase가 오프라인이거나 연결에 문제가 있을 때 기본값 반환
    if (error instanceof Error && error.message.includes("offline")) {
      console.warn("Firebase is offline, returning default heart count")
      return 0
    }
    // 다른 에러의 경우에도 기본값 반환하여 앱이 계속 작동하도록 함
    return 0
  }
}

export async function incrementHeartCount(): Promise<number> {
  try {
    const docRef = doc(db, "counters", HEART_DOC_ID)

    // increment를 사용하여 원자적으로 증가
    await setDoc(
      docRef,
      {
        count: increment(1),
      },
      { merge: true },
    )

    // 업데이트된 값을 가져와서 반환
    const updatedDoc = await getDoc(docRef)
    return updatedDoc.data()?.count || 1
  } catch (error) {
    console.error("Error incrementing heart count:", error)

    // Firebase가 오프라인이거나 연결에 문제가 있을 때 에러 메시지 개선
    if (error instanceof Error && error.message.includes("offline")) {
      throw new Error("현재 네트워크 연결이 불안정합니다. 잠시 후 다시 시도해주세요.")
    }

    // 다른 Firebase 에러의 경우
    throw new Error("하트 전송 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요.")
  }
}
