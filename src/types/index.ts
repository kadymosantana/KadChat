import { Timestamp } from "firebase/firestore";

export interface UserRef {
  uid: string;
  username: string;
  email: string;
  status: string;
  photoURL: string;
}

export interface ConversationRef {
  conversation_id: string;
  uid: string;
  username: string;
  email: string;
  photoURL: string;
  messages: MessageRef[];
}

export interface MessageRef {
  sender_uid: string;
  sender_email: string;
  sender_photoURL: string;
  text: string;
  timestamp: Timestamp;
}
