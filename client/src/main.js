import { createApp } from "vue";
import App from "./App.vue";
import axios from 'axios'

//import "./registerServiceWorker"
import router from './router'

import './assets/tailwind.css'
import store from './store'

axios.defaults.withCredentials = true
axios.defaults.baseURL = process.env.VUE_APP_API_URL

createApp(App).use(router).use(store).mount("#app");
