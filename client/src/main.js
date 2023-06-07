import { createApp } from "vue";
import App from "./App.vue";
import { marked } from 'marked';

//import "./registerServiceWorker"
import router from './router'

import './assets/tailwind.css'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

import VueCookies from 'vue3-cookies'

const resolveMarkdown = {
    install(app) {
        app.config.globalProperties.$resolveMarkdown = (content) => {
            return marked.parse(content);
        }
    }
}

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

createApp(App).use(pinia).use(router).use(VueCookies).use(resolveMarkdown).mount("#app");
