// Для Vue 3
import { createApp } from "vue";
import App from "./App.vue";
import i18n from "./i18n";
import router from "./router/router";
import axios from "axios";
import SlideVerify from "vue-monoplasty-slide-verify";

axios.defaults.baseURL = "https://totalminers.io/api";

createApp(App).use(SlideVerify).use(i18n).use(router).mount("#app");
