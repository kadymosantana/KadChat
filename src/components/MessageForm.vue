<script setup lang="ts">
import { inject } from "vue";

const props = defineProps(["messageText"]);
const emits = defineEmits(["send-message", "update:message"]);

const stateMenu = inject<boolean>("stateMenu");
</script>

<template>
  <form
    @submit.prevent="$emit('send-message', messageText)"
    class="w-full flex gap-2 bg-dark-700 p-3 rounded-b-2xl"
  >
    <input
      :value="messageText"
      @input="
        $emit('update:message', ($event.target as HTMLInputElement).value)
      "
      class="w-full bg-dark-700 outline-none"
      type="text"
      placeholder="Digite uma mensagem"
      required
    />
    <button
      class="bg-green-500 hover:bg-green-400 duration-500 p-2 rounded-full"
      type="submit"
    >
      <img src="../assets/svg/send.svg" alt="Enviar mensagem" />
    </button>
  </form>
</template>
