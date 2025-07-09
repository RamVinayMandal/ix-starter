import './assets/global.css';
import './index.css';
import { createApp } from 'vue';
import { ixPlugin } from '@siemens/ix-vue';
import { setupI18n } from './i18n';
import App from './App.vue';
import router from './router/index';

const i18n = setupI18n();

const app = createApp(App);

app.use(i18n);

app.use(router);

app.use(ixPlugin);

app.mount('#app');
