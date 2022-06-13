import { createApp } from "vue";
import App from "./App.vue";

//import "./registerServiceWorker";
import router from './router'

createApp(App).use(router).use(router).mount("#app");
