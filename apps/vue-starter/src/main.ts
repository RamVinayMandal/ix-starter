import "./assets/global.css";
import "./index.css";
import "@siemens/ix/dist/siemens-ix/siemens-ix.css";
import { createApp } from "vue";
import { createPinia } from "pinia";
import { ixPlugin } from "@siemens/ix-vue";
import { setupI18n } from "./i18n";
import App from "./App.vue";
import router from "./router/index";

function optionalTheme() {
  if (import.meta.env.DEV) {
    document.body.classList.add("theme-brand-dark");
  }
}

optionalTheme();

const i18n = setupI18n();
const pinia = createPinia();

const app = createApp(App);

app.use(i18n);

app.use(pinia);

app.use(router);

app.use(ixPlugin);

app.mount("#app");
