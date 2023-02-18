<script setup lang="ts">
import { ref, watchEffect } from "vue";

import { User } from "@firebase/auth";
import { Timestamp } from "@firebase/firestore";
import { ConversationRef } from "../types";

const props = defineProps<{
  user: User;
  conversation: ConversationRef | undefined;
}>();

const serializeTimestamp = (timestamp: Timestamp) => {
  return timestamp.toDate().toLocaleString("pt-BR").slice(0, 16);
};

const lastMessage = ref<Element[] | null>(null);
watchEffect(() => {
  if (lastMessage.value) {
    lastMessage.value?.at(-1)?.scrollIntoView({ behavior: "smooth" });
  }
});
</script>

<template>
  <ul
    class="flex flex-col gap-8 bg-dark-900 overflow-scroll h-full p-5 overflow-y-auto"
  >
    <li
      ref="lastMessage"
      v-for="message in conversation?.messages"
      class="flex gap-2 leading-5 mb-3"
      :class="{ 'self-end': message.sender_email === user.email }"
    >
      <img
        class="rounded-full self-start"
        :class="{ 'order-2': message.sender_email === user.email }"
        width="36"
        :src="message.sender_photoURL"
      />
      <span
        :class="{ 'bg-green-500': message.sender_email === user.email }"
        class="relative p-2 bg-dark-700 w-max max-w-[180px] h-max rounded-xl break-words"
        >{{ message.text }}
        <span
          :class="{
            'right-0': message.sender_email === user.email,
            'left-0': message.sender_email !== user.email,
          }"
          class="absolute bottom-[-23px] min-w-max text-xs text-gray-500"
          >{{ serializeTimestamp(message.timestamp) }}</span
        >
      </span>
    </li>
  </ul>
</template>
