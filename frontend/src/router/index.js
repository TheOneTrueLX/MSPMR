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

router.beforeEach((to, from) => {
    // Authenticated users have no reason to be hitting /auth or /auth/callback.  As for /, we use this as
    // a convenience to route authenticated users directly to /queue.
    if(['/', '/auth', '/auth/callback'].includes(to.path) && localStorage.getItem('isAuthenticated') === '1') {
        console.log('Redirecting authenticated user to /queue')
        return { path: '/queue' }
    }

    // Unauthenticated users who wander to close to /queue will be unceremoniously deposited back in /.
    if(to.path === '/queue' && localStorage.getItem('isAuthenticated') === '0') {
        console.log('Redirecting unauthenticated user to /')
        return { path: '/' }
    }
})

export default router;