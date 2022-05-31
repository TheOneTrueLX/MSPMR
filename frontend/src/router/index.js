// @vue-ignore
import { createWebHistory, createRouter } from 'vue-router'
import { apiGet } from '../util/fetch'

import Index from '../pages/Index.vue'
import Queue from '../pages/Queue.vue'
import Users from '../pages/Users.vue'
import Overlay from '../pages/Overlay.vue'
import AuthRedirect from '../pages/auth/AuthRedirect.vue'
import AuthCallback from '../pages/auth/AuthCallback.vue'

import NotFound from '../pages/errors/NotFound.vue'
import { renderSlot } from 'vue'

const routes = [
    { path: '/', name: 'home', component: Index },
    { path: '/queue', name: 'queue', component: Queue },
    { path: '/users/:username', name: 'user', component: Users },
    { path: '/overlay/:apikey', name: 'overlay', component: Overlay },
    // Authentication Pages
    { path: '/auth', name: 'auth', component: AuthRedirect },
    { path: '/auth/callback', name: 'callback', component: AuthCallback },
    // 404 Failsafe
    { path: '/:catchAll(.*)', component: NotFound }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

router.beforeEach(async (to, from, next) => {
    const auth = await apiGet('/users/auth')

    if(to.name === 'queue' && !auth) next({ name: 'home' })
    else if(to.name === 'home' && auth) next({ name: 'queue' })
    else if(['auth','callback'].includes(to.name) && auth) next({ name: 'queue' })
    else next()
})

export default router;