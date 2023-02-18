<script setup lang="ts">
import { inject } from "vue";
import { useRouter } from "vue-router";
import { signOut, User } from "firebase/auth";
import { DocumentReference, updateDoc } from "firebase/firestore";
import { useFirebaseAuth } from "vuefire";
import { UserRef } from "../types";

const props = defineProps<{
  user: User;
}>();
const currentUserRef = inject<DocumentReference<UserRef>>("currentUserRef");

const router = useRouter();
const auth = useFirebaseAuth();
const logout = () => {
  if (auth && currentUserRef) {
    signOut(auth).then(() => {
      updateDoc(currentUserRef, {
        status: "offline",
      });
      router.push("/");
    });
  }
};

const stateMenu = inject<boolean>("stateMenu");
</script>

<template>
  <div
    class="flex flex-col items-center sm:items-start justify-between gap-3 bg-dark-900 rounded-2xl shadow-lg p-3 w-full"
  >
    <div @click="stateMenu = true" class="flex gap-3 max-w-[208px]">
      <img
        class="rounded-full self-center"
        :src="user.photoURL!"
        alt=""
        width="40"
      />
      <div :class="{ hidden: !stateMenu }" class="truncate sm:block">
        <h2 class="font-semibold text-base truncate">
          {{ user.displayName }}
        </h2>
        <p class="text-gray-500 text-sm truncate">{{ user.email }}</p>
      </div>
    </div>
    <button
      @click="logout"
      :class="{ hidden: !stateMenu }"
      class="flex gap-2 justify-center items-center rounded-xl bg-[#7f1d1d4d] px-3 py-2 w-full sm:flex"
    >
      <img src="../assets/svg/signout.svg" alt="Sair" />
      <span class="text-red-500">Sair</span>
    </button>
  </div>
</template>
