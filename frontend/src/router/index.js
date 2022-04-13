// @vue-ignore
import { createWebHistory, createRouter } from 'vue-router'

import Index from '../pages/Index.vue'
import Queue from '../pages/Queue.vue'
import AuthRedirect from '../pages/auth/AuthRedirect.vue'
import AuthCallback from '../pages/auth/AuthCallback.vue'

import NotFound from '../pages/errors/NotFound.vue'

const routes = [
    { path: '/', component: Index },
    { path: '/queue', component: Queue },
    // Authentication Pages
    { path: '/auth', component: AuthRedirect },
    { path: '/auth/callback', component: AuthCallback },
    // 404 Failsafe
    { path: '/:catchAll(.*)', component: NotFound }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router;