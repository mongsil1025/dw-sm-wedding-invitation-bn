import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

// Firebase 설정이 모두 있는지 확인
const isFirebaseConfigured = Object.values(firebaseConfig).every((value) => value !== undefined && value !== "")

let app
let db

if (isFirebaseConfigured) {
  try {
    // Initialize Firebase
    app = initializeApp(firebaseConfig)

    // Initialize Cloud Firestore and get a reference to the service
    db = getFirestore(app)

    console.log("Firebase initialized successfully")
  } catch (error) {
    console.error("Firebase initialization error:", error)
  }
} else {
  console.warn("Firebase configuration is incomplete. Some features may not work.")
}

export { db }
