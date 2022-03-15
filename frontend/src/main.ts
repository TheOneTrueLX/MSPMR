import { createApp } from 'vue';
import { createWebHistory, createRouter } from 'vue-router';
import App from './App.vue';
import Home from './Home.vue';
import io from 'socket.io-client';
import './index.css';

const routes = [
    { path: '/', component: Home }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

const app = createApp(App);

app.use(router);

app.config.globalProperties.$socketio = io(import.meta.env.SOCKETIO_URL);

app.mount('#app');
