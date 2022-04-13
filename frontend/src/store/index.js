import { createStore, createLogger } from 'vuex';
import mutations from './mutations';
import getters from './getters';
import actions from './actions';

const state = {
    user: null
}

export default createStore({
    state,
    getters,
    actions,
    mutations,
    plugins: [createLogger()]
})