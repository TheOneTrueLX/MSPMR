import { createApp } from 'vue'
import App from './App.vue'
import io from 'socket.io-client'
import './index.css'

const app = createApp(App)

app.config.globalProperties.$socketio = io('http://localhost:5000')

app.mount('#app')
