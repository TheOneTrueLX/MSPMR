<template>
  <router-view />
</template>

<script setup>
import { onMounted, inject } from 'vue';
import { useStore } from 'vuex';
import { useRoute } from 'vue-router';

const store = useStore();
const route = useRoute();
const axios = inject('axios');

onMounted(() => { 
  if(!(route.path in ['/auth', '/auth/callback']))
  axios.get('/users/current').then((res) => {
    store.commit('saveId', res.data.id);
    store.commit('saveUsername', res.data.username);
    store.commit('saveProfileImage', res.data.profile_image);
  }).catch((err) => {
    // if it's a 401 error, it's because the user isn't authenticated
    // and we don't care about those errors
    if(err.response.status !== 401) console.log(`Error checking user status in API: ${err.response.status} ${err.message}`)
    store.commit('delete');
  })
});

</script>