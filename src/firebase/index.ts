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
  apiKey: process.env.API_KEY,
  authDomain: process.env.AUTH_DOMAIN,
  projectId: process.env.PROJECT_ID,
  storageBucket: process.env.STORAGE_BUCKET,
  messagingSenderId: process.env.MESSAGING_SENDER_ID,
  appId: process.env.APP_ID,
  measurementId: process.env.MEASUREMENT_ID,
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
