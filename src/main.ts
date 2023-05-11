import { createApp } from 'vue';
import './index.css';
import App from './App.vue';
import { VueFire, VueFireAuth, getCurrentUser, useCurrentUser } from 'vuefire';
import { firebaseApp } from './lib/firebase';
import { createRouter, createWebHistory } from 'vue-router';

import Auth from './views/auth.vue';
import Chat from './views/chat.vue';

const app = createApp(App);
app.use(VueFire, {
  firebaseApp,
  modules: [VueFireAuth()],
});

const routes = [
  {
    name: 'Auth',
    path: '/',
    component: Auth,
  },

  {
    name: 'Chat',
    path: '/chat',
    component: Chat,
    meta: { requiresAuth: true },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to) => {
  if (to.meta.requiresAuth) {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return {
        path: '/',
      };
    }
  }
});

app.use(router);
app.mount('#app');

export const currentUser = useCurrentUser() 
