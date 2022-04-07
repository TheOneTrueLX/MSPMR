import { createApp } from 'vue'
import { store } from './store'
import router from './router'
import App from './App.vue'
import { library } from '@fortawesome/fontawesome-svg-core'
import { fab } from '@fortawesome/free-brands-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

import './index.css'

library.add(fab)

store.dispatch('init')

createApp(App)
.use(store)
.use(router)
.component('font-awesome-icon', FontAwesomeIcon)
.mount('#app')
