import { createApp } from 'vue';
import App from './App.vue';
import vuetify from './plugins/vuetify';
import { loadFonts } from './plugins/webfontloader';
import '@/assets/global.css';
import "@/assets/bootstrap.min.css";
import {router} from './router'
import '@fortawesome/fontawesome-free/css/all.css'


loadFonts();


createApp(App).use(router).use(vuetify).mount('#app');
