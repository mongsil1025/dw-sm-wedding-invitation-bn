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
    throw error
  }
}
