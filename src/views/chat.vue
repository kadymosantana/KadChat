<script setup lang="ts">
import {
  arrayUnion,
  doc,
  setDoc,
  Timestamp,
  updateDoc,
} from "@firebase/firestore";
import { collections } from "../lib/firebase";
import { ref, computed, onMounted, provide } from "vue";
import { useCollection, useDocument } from "vuefire";
import { currentUser } from "../main";

import MessageForm from "../components/MessageForm.vue";
import MessagesHeader from "../components/MessagesHeader.vue";
import MessagesList from "../components/MessagesList.vue";
import UsersList from "../components/UsersList.vue";

import { User } from "@firebase/auth";
import { ConversationRef, MessageRef, UserRef } from "../types";

const currentUserRef = doc(collections.users, currentUser.value?.email!);
const users = useCollection(collections.users);
const currentUserConversations = useCollection(collections.conversations());

const searchedUser = ref("");
const messageText = ref("");
const selectedUser = ref<UserRef | null>(null);

// Lidando com o status de conexão do usuário
onMounted(() => {
  updateDoc(currentUserRef, {
    status: "online",
  });
});

addEventListener("beforeunload", () => {
  updateDoc(currentUserRef, {
    status: "offline",
  });
});

addEventListener("visibilitychange", () => {
  if (document.visibilityState === "visible") {
    updateDoc(currentUserRef, {
      status: "online",
    });
  } else {
    updateDoc(currentUserRef, {
      status: "offline",
    });
  }
});

// Lidando com a busca de usuários por nome de usuário
const searchedUsers = computed(() =>
  listableUsers.value?.filter((user) => {
    if (user.username) {
      return normalizeUsername(user.username).includes(
        normalizeUsername(searchedUser.value)
      );
    }
  })
);

const normalizeUsername = (username: string) => {
  return username
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();
};

// Ordenando a lista de usuários de acordo com a data/hora das mensagens
const listableUsers = computed(() => {
  const sortedUsers = users.value?.filter(
    (chatUser) => chatUser.email !== currentUser.value?.email
  );

  sortedUsers.sort((a, b) => {
    const aConversation = currentUserConversations.value?.find(
      (conversation) => conversation.email === a.email
    );

    const bConversation = currentUserConversations.value?.find(
      (conversation) => conversation.email === b.email
    );

    if (!aConversation) return 1;
    if (!bConversation) return -1;

    return (
      bConversation.messages.at(-1)!.timestamp.seconds -
      aConversation.messages.at(-1)!.timestamp.seconds
    );
  });
  return sortedUsers;
});

const selectUser = (user: UserRef) => {
  selectedUser.value = user;
  stateMenu.value = false;
};

// Definindo o identificador da conversa atualmente selecionada
const currentConversationId = computed(() => {
  const currentUserEmail = currentUser.value?.email;
  const selectedUserEmail = selectedUser.value?.email;

  if (currentUserEmail && selectedUserEmail) {
    if (currentUserEmail > selectedUserEmail) {
      return currentUserEmail + "_" + selectedUserEmail;
    } else {
      return selectedUserEmail + "_" + currentUserEmail;
    }
  }
});

// Referência reativa para a conversa atual
const currentConversation = computed(() => {
  const reference = useDocument(
    doc(collections.conversations(), currentConversationId.value)
  );
  if (reference.value) return reference.value;
});

// Verificando se já existe conversa com o usuário selecionado atualmete
const currentConversationExists = computed(() => {
  return currentUserConversations.value.find(
    (conversation) =>
      conversation.conversation_id === currentConversationId.value
  );
});

const sendMessage = (text: string) => {
  const currentConversationRef = (sender_email: string) =>
    doc(collections.conversations(sender_email), currentConversationId.value);

  const newConversation = (sender: User | UserRef): ConversationRef => {
    return {
      conversation_id: currentConversationId.value!,
      uid: sender.uid,
      username: "username" in sender ? sender.username : sender.displayName!,
      email: sender.email!,
      photoURL: sender.photoURL!,
      messages: [
        {
          sender_uid: currentUser.value?.uid!,
          sender_email: currentUser.value?.email!,
          sender_photoURL: currentUser.value?.photoURL!,
          text: text,
          timestamp: Timestamp.fromDate(new Date()),
        },
      ],
    };
  };

  const newMessage: MessageRef = {
    sender_uid: currentUser.value?.uid!,
    sender_email: currentUser.value?.email!,
    sender_photoURL: currentUser.value?.photoURL!,
    text: text,
    timestamp: Timestamp.fromDate(new Date()),
  };

  if (!currentConversationExists.value) {
    setDoc(
      doc(collections.conversations(), currentConversationId.value),
      newConversation(selectedUser.value!)
    );

    setDoc(
      doc(
        collections.conversations(selectedUser.value?.email),
        currentConversationId.value
      ),
      newConversation(currentUser.value!)
    );
  } else {
    updateDoc(currentConversationRef(currentUser.value?.email!), {
      messages: arrayUnion(newMessage),
    });

    updateDoc(currentConversationRef(selectedUser.value?.email!), {
      messages: arrayUnion(newMessage),
    });
  }

  messageText.value = "";
};

const stateMenu = ref(false);
provide("stateMenu", stateMenu);
provide("currentUserRef", currentUserRef);
</script>

<template>
  <main
    v-if="currentUser"
    class="w-screen h-screen bg-dark-800 flex flex-col items-center gap-9 justify-center p-3"
  >
    <img
      src="https://user-images.githubusercontent.com/98963793/223187232-2b09c391-be2f-4761-a796-4d49dcca15ce.png"
      alt="KadChat"
      width="150"
      height="auto"
    />

    <div
      class="flex gap-3 text-white overflow-hidden w-full h-[450px] sm:justify-center"
    >
      <UsersList
        :user="currentUser"
        :users="searchedUsers ? searchedUsers : listableUsers"
        v-model:searchedUser="searchedUser"
        @select-user="selectUser"
      />
      <div
        @click="stateMenu = false"
        :class="{
          'items-center justify-center': !selectedUser,
        }"
        class="messages flex flex-col relative shadow-xl w-[384px] h-full bg-dark-900 rounded-2xl"
      >
        <template v-if="selectedUser">
          <MessagesHeader :selectedUser="selectedUser" />
          <MessagesList
            :user="currentUser"
            :conversation="currentConversation"
          />
          <MessageForm
            v-model:message="messageText"
            :messageText="messageText"
            @send-message="sendMessage"
          />
        </template>
        <img
          v-else
          class="saturate-0 opacity-5"
          width="200"
          src="https://user-images.githubusercontent.com/98963793/215875591-c54e7943-7b8a-4999-a55d-c141bdf379b3.png"
          alt="KadChat"
        />
      </div>
    </div>
  </main>
</template>
