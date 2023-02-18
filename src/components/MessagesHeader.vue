<script setup lang="ts">
import { inject } from "vue";
import { UserRef } from "../types";

const props = defineProps<{ selectedUser: UserRef }>();
const stateMenu = inject<boolean>("stateMenu");
</script>

<template>
  <header
    class="flex items-center gap-4 p-5 border-b border-solid border-dark-700"
  >
    <img class="rounded-full" :src="selectedUser.photoURL" width="50" />
    <div class="flex flex-col truncate">
      <h2
        class="text-lg sm:text-xl font-semibold truncate max-w-[200px] sm:max-w-[384px]"
      >
        {{ selectedUser.username }}
      </h2>
      <span
        class="text-sm text-gray-500 truncate max-w-[200px] sm:max-w-[384px]"
        >{{ selectedUser.email }}</span
      >
    </div>
  </header>
</template>
