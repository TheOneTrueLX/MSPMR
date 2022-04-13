export default {
    saveUsername (state, payload) {
        state.username = payload
    },

    saveId (state, payload) {
        state.id = payload
    },

    saveProfileImage (state, payload) {
        state.profile_image = payload
    },

    delete (state) {
        state.user = null
        state.id = null
        state.profile_image = null
    }
}