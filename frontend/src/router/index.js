// @vue-ignore
import { createWebHistory, createRouter } from 'vue-router'
import { apiGet } from '../util/fetch'

import Index from '../pages/Index.vue'
import Queue from '../pages/Queue.vue'
import AuthRedirect from '../pages/auth/AuthRedirect.vue'
import AuthCallback from '../pages/auth/AuthCallback.vue'

import NotFound from '../pages/errors/NotFound.vue'
import { renderSlot } from 'vue'

const routes = [
    { path: '/', component: Index, meta: { protected: false }},
    { path: '/queue', component: Queue, meta: { protected: true }},
    // Authentication Pages
    { path: '/auth', component: AuthRedirect, meta: { protected: false }},
    { path: '/auth/callback', component: AuthCallback, meta: { protected: false }},
    // 404 Failsafe
    { path: '/:catchAll(.*)', component: NotFound }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

router.beforeEach(async (to, from) => {
    const auth = await apiGet('/users/auth');

    if(auth && to.meta.protected == false) {
        return { path: '/queue' }
    } 
    
    if(!auth && to.meta.protected == true) {
        return { path: '/' }
    }
})

export default router;