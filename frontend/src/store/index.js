import { createStore } from 'vuex';

export const store = createStore({
    state: {
        token: null
    },
    mutations: {
        SET_TOKEN (state, value) {
            state.token = value;
            localStorage.setItem('token', value);
        },
        DELETE_TOKEN (state) {
            state.token = '';
            localStorage.setItem('token', '');
        }
    },
    actions: {
        setToken(store, value) {
            store.commit('SET_TOKEN', value);
        },
        deleteToken(store) {
            store.commit('DELETE_TOKEN');
        },
        init(store) {
            store.commit('SET_TOKEN', localStorage.getItem('token') || '');
        }
    },
    getters: {
        token: state => {
            return state.token;
        }
    },
});