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
  apiKey: "AIzaSyBbq3st8FTsi4RTr7kyb_BnflN1K9CQOKg",
  authDomain: "chat-app-3ec25.firebaseapp.com",
  projectId: "chat-app-3ec25",
  storageBucket: "chat-app-3ec25.appspot.com",
  messagingSenderId: "117312411887",
  appId: "1:117312411887:web:30f9b67eb54112a063a31a",
  measurementId: "G-8MJ0FMJ4M5",
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