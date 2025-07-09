import { doc, getDoc, setDoc, updateDoc, increment } from "firebase/firestore"
import { db } from "./firebase"

const HEARTS_DOC_ID = "wedding-hearts"

export async function getHeartCount(): Promise<number> {
  try {
    const docRef = doc(db, "hearts", HEARTS_DOC_ID)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      return docSnap.data().count || 0
    } else {
      // 문서가 없으면 초기값 0으로 생성
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
    const docRef = doc(db, "hearts", HEARTS_DOC_ID)

    // 문서가 존재하는지 확인
    const docSnap = await getDoc(docRef)

    if (!docSnap.exists()) {
      // 문서가 없으면 1로 생성
      await setDoc(docRef, { count: 1 })
      return 1
    } else {
      // 문서가 있으면 1 증가
      await updateDoc(docRef, {
        count: increment(1),
      })

      // 업데이트된 값 반환
      const updatedDoc = await getDoc(docRef)
      return updatedDoc.data()?.count || 1
    }
  } catch (error) {
    console.error("Error incrementing heart count:", error)
    throw error
  }
}
