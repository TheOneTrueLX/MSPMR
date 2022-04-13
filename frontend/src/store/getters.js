export const isAuthenticated = state => {
    return !(state.username === null || state.id === null || state.profile_image === null);
}

export const getUsername = state => {
    return state.username;
}

export const getId = state => {
    return state.id;
}

export const getProfileImage = state => {
    return state.profile_image;
}