import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  CollectionReference,
  DocumentData,
} from "firebase/firestore";
import { ConversationRef, UserRef } from "../types";
import { currentUser } from "../main";

export const firebaseApp = initializeApp({
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: import.meta.env.VITE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_APP_ID,
  measurementId: import.meta.env.VITE_MEASUREMENT_ID,
});

const db = getFirestore(firebaseApp);

// Tipando dados do Firestore
const createCollection = <T = DocumentData>(collectionPath: string) =>
  collection(db, collectionPath) as CollectionReference<T>;

export const collections = {
  users: createCollection<UserRef>("users"),
  conversations: (email: string = currentUser.value?.email!) =>
    createCollection<ConversationRef>(`users/${email}/conversations`),
};
