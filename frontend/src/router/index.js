// @vue-ignore
import { createWebHistory, createRouter } from 'vue-router'
import axios from 'axios'

import Index from '../pages/Index.vue'
import Queue from '../pages/Queue.vue'
import AuthRedirect from '../pages/auth/AuthRedirect.vue'
import AuthCallback from '../pages/auth/AuthCallback.vue'

import NotFound from '../pages/errors/NotFound.vue'
import { renderSlot } from 'vue'

async function isAuthenticated() {
    try {
         const res = await axios.get('/users/auth', {
            baseURL: import.meta.env.VITE_API_URL,
            withCredentials: true,
        })
        return res.data
    } catch (e) {
        return false;
    }
}

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
    const auth = await isAuthenticated();

    if(auth && to.meta.protected == false) {
        return { path: '/queue' }
    } 
    
    if(!auth && to.meta.protected == true) {
        return { path: '/' }
    }
})

export default router;