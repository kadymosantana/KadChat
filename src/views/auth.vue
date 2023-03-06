<script setup lang="ts">
import { useRouter } from "vue-router";
import {
  browserSessionPersistence,
  GoogleAuthProvider,
  setPersistence,
  signInWithPopup,
  User,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { collections } from "../firebase/index";
import { useCollection, useFirebaseAuth } from "vuefire";

const router = useRouter();
const auth = useFirebaseAuth();
const provider = new GoogleAuthProvider();
provider.setCustomParameters({
  prompt: "select_account",
});

if (auth) setPersistence(auth, browserSessionPersistence);

const register = () => {
  if (auth) {
    signInWithPopup(auth, provider).then((result) => {
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential?.accessToken;
      const user = result.user;
      addUserToDatabase(user);
      router.push("/chat");
    });
  }
};

const addUserToDatabase = async (newUser: User) => {
  const users = useCollection(collections.users);
  const newUserExists = users.value.find(
    (user) => user.email === newUser.email
  );

  if (!newUserExists && newUser.email) {
    setDoc(doc(collections.users, newUser.email), {
      uid: newUser.uid,
      username: newUser.displayName!,
      email: newUser.email,
      photoURL: newUser.photoURL!,
      status: "online",
    });
  }
};
</script>

<template>
  <div
    class="w-screen h-screen flex flex-col md:flex-row items-center justify-center gap-10 md:gap-52 bg-dark-800 p-5 md:p-2"
  >
    <img
      class="justify-self-end"
      width="500"
      height="auto"
      src="../assets/svg/draw.svg"
      alt="Logo"
    />
    <div class="flex flex-col items-center gap-10">
      <div class="flex flex-col items-center gap-6">
        <img
          src="https://user-images.githubusercontent.com/98963793/215875591-c54e7943-7b8a-4999-a55d-c141bdf379b3.png"
          width="100"
          height="auto"
          alt="Ilustração"
        />
        <h1 class="text-4xl text-green-500 font-light tracking-tighter">
          KadChat
        </h1>
      </div>

      <div class="flex flex-col gap-3">
        <button
          @click="register"
          class="bg-dark-600 hover:bg-dark-700 duration-500 px-7 py-3 flex gap-3 items-center text-white rounded-xl font-light text-lg tracking-tight shadow-sm hover:shadow-md"
        >
          <img
            src="../assets/svg/google.svg"
            width="32"
            height="32"
            alt="Google"
          />
          Entre com o Google
        </button>
      </div>
    </div>
  </div>
</template>
