import { createApp } from "vue";
import App from "./App.vue";

//import "./registerServiceWorker"
import router from './router'

import './assets/tailwind.css'
import { createPinia } from 'pinia'

createApp(App).use(createPinia()).use(router).use(require('vue-cookies')).mount("#app");
