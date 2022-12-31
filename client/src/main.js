import { createApp } from "vue";
import App from "./App.vue";

//import "./registerServiceWorker"
import router from './router'

import './assets/tailwind.css'
import { createPinia } from 'pinia'
import VueCookies from 'vue3-cookies'

createApp(App).use(createPinia()).use(router).use(VueCookies).mount("#app");
