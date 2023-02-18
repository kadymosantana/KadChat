<script setup lang="ts">
import { inject } from "vue";

import CurrentUserCard from "./CurrentUserCard.vue";

import { User } from "@firebase/auth";
import { UserRef } from "../types";

const props = defineProps<{
  user: User;
  users: UserRef[];
  searchedUser: String;
}>();
const emits = defineEmits(["update:searchedUser", "select-user"]);

const stateMenu = inject<boolean>("stateMenu");
</script>

<template>
  <div
    class="users flex flex-col justify-between sm:w-64 h-full gap-3 duration-300"
    :class="{ 'w-64': stateMenu, 'w-20': !stateMenu }"
  >
    <TransitionGroup
      tag="ul"
      name="users"
      v-if="users"
      :class="{ 'items-center': !stateMenu }"
      class="flex flex-col sm:items-start bg-dark-700 w-full h-full overflow-y-auto object-cover p-3 rounded-2xl duration-300"
    >
      <input
        :value="searchedUser"
        @input="
          $emit(
            'update:searchedUser',
            ($event.target as HTMLInputElement).value
          )
        "
        :class="{ hidden: !stateMenu }"
        class="sm:block max-w-full bg-dark-800 px-3 mb-2 py-2 placeholder:text-gray-500 rounded-xl outline-none"
        type="text"
        placeholder="Busque um usuário"
      />
      <button
        :class="{ hidden: stateMenu }"
        class="sm:hidden bg-dark-800 p-2 mb-3 max-w-max rounded-xl w-full"
        @click="stateMenu = !stateMenu"
      >
        <img src="../assets/svg/menu.svg" alt="Menu" />
      </button>
      <li
        v-for="user in users"
        :key="user.uid"
        @click="$emit('select-user', user)"
        :class="{ 'justify-center': !stateMenu }"
        class="flex sm:justify-start items-center gap-3 relative w-full py-3 border-b border-solid border-dark-600 last:border-0 cursor-pointer durtaion-300"
      >
        <img
          width="40"
          class="rounded-full"
          :src="user.photoURL"
          :alt="user.username"
        />
        <div :class="{ hidden: !stateMenu }" class="flex sm:flex flex-col">
          <p>{{ user.username }}</p>
          <p class="flex gap-1 items-center text-sm text-gray-500">
            <span
              class="rounded-full w-1.5 h-1.5"
              :class="{
                'bg-green-500': user.status === 'online',
                'bg-red-800': user.status === 'offline',
              }"
            ></span>
            {{ user.status }}
          </p>
        </div>
      </li>
    </TransitionGroup>
    <CurrentUserCard :user="user" />
  </div>
</template>

<style>
.users-enter-active,
.users-leave-active {
  transition: all 0.3s ease;
}
.users-enter-from,
.users-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}
</style>
