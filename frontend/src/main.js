import { createApp } from 'vue'
import App from './App.vue'
import { library } from '@fortawesome/fontawesome-svg-core'
import { fab } from '@fortawesome/free-brands-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

import './index.css'

library.add(fab)

createApp(App)
.component('font-awesome-icon', FontAwesomeIcon)
.mount('#app')
