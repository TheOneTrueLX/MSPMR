import { createApp, useAttrs } from 'vue'
import router from './router'
import App from './App.vue'

import Toast from 'vue-toastification'
import { YoutubeVue3 } from 'youtube-vue3'

import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { fab } from '@fortawesome/free-brands-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

import './index.css'
import 'vue-toastification/dist/index.css'

library.add(fab)
library.add(fas)

const app = createApp(App)
.use(router)
.use(Toast)
.component('YoutubeVue3', YoutubeVue3)
.component('font-awesome-icon', FontAwesomeIcon)
.mount('#app')