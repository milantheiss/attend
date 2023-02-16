import { createApp } from "vue";
import App from "./App.vue";
import { marked } from 'marked';

//import "./registerServiceWorker"
import router from './router'

import './assets/tailwind.css'
import { createPinia } from 'pinia'
import VueCookies from 'vue3-cookies'

const resolveMarkdown = {
    install(app) {
        app.config.globalProperties.$resolveMarkdown = (content) => {
            return marked.parse(content);
        }
    }
}

createApp(App).use(createPinia()).use(router).use(VueCookies).use(resolveMarkdown).mount("#app");
