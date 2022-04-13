// @vue-ignore
import { createWebHistory, createRouter } from 'vue-router'
import store from '../store'

import Index from '../pages/Index.vue'
import Queue from '../pages/Queue.vue'
import AuthRedirect from '../pages/auth/AuthRedirect.vue'
import AuthCallback from '../pages/auth/AuthCallback.vue'

import NotFound from '../pages/errors/NotFound.vue'

const routes = [
    { path: '/', component: Index, name: 'Index' },
    { path: '/queue', component: Queue, name: 'Queue' },
    // Authentication Pages
    { path: '/auth', component: AuthRedirect, name: 'AuthRedirect' },
    { path: '/auth/callback', component: AuthCallback, name: 'AuthCallback' },
    // 404 Failsafe
    { path: '/:catchAll(.*)', component: NotFound }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router;