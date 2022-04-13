import { createApp, useAttrs } from 'vue'
import store from './store'
import router from './router'
import App from './App.vue'

import axios from 'axios'
import VueAxios from 'vue-axios'

import Toast from 'vue-toastification'

import { library } from '@fortawesome/fontawesome-svg-core'
import { fab } from '@fortawesome/free-brands-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

import './index.css'
import 'vue-toastification/dist/index.css'

library.add(fab)

const app = createApp(App)
app.use(VueAxios, axios)
app.axios.defaults.baseURL = import.meta.env.VITE_API_URL
app.axios.defaults.withCredentials = true
app.provide('axios', app.config.globalProperties.axios)
app.use(store)
app.use(router)
app.use(Toast)
app.component('font-awesome-icon', FontAwesomeIcon)
app.mount('#app')