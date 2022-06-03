// @vue-ignore
import { createWebHistory, createRouter } from 'vue-router'
import { apiGet } from '../util/fetch'

import Index from '../pages/Index.vue'
import Queue from '../pages/Queue.vue'
import Users from '../pages/Users.vue'
import Overlay from '../pages/Overlay.vue'
import AuthRedirect from '../pages/auth/AuthRedirect.vue'
import AuthCallback from '../pages/auth/AuthCallback.vue'
import Beta from '../pages/auth/Beta.vue'
import EULA from '../pages/auth/EULA.vue'

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
    { path: '/auth/beta', name: 'beta', component: Beta },
    { path: '/auth/eula', name: 'eula', component: EULA},
    // 404 Failsafe
    { path: '/:catchAll(.*)', component: NotFound }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

router.beforeEach(async (to, from, next) => {
    var user = {}
    const auth = await apiGet('/users/auth')
    if(auth) {
      user = await apiGet('/users/current')
    }

    // if user is authenticated but has not submitted their
    // beta access key...
    if(Object.keys(user).length > 0 && !user.beta_authorized) {
        // ...and they are already on their way to the beta page,
        // let them proceed...
        if(to.name === 'beta') next()
        // ...otherwise, redirect them to the beta page.
        else next({ name: 'beta' })
    }
    // if user is authenticated but has not accepted the EULA...
    else if(Object.keys(user).length > 0 && !user.eula_accepted) {
        // ...and they are already on the way to the EULA page,
        // let them proceed...
        if(to.name === 'eula') next()
        // ...otherwise, redirect them to the EULA page.
        else next({ name: 'eula' })
    }
    // if the user is unauthenticated and attempts to go to the
    // queue page, redirect them to home
    else if(to.name === 'queue' && !auth) next({ name: 'home' })
    // if the user is authenticated and loads the home page,
    // redirect them to the queue page
    else if(to.name === 'home' && auth) next({ name: 'queue' })
    // if the user is authenticated and attempts to go to the
    // auth or callback pages, shepherd them back to the queue page
    else if(['auth','callback'].includes(to.name) && auth) next({ name: 'queue' })
    // if none of the above conditions apply, route the user
    // to their original destination
    else next()
})

export default router;