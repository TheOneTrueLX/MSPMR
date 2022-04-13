import { createStore, createLogger } from 'vuex';
import mutations from './mutations';
import * as getters from './getters';
import * as actions from './actions';

const state = {
    username: null,
    id: null,
    profile_image: null,
}

export default createStore({
    state,
    getters,
    actions,
    mutations,
    plugins: [createLogger()]
})