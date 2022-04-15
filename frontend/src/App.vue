<template>
  <router-view />
</template>

<script setup>
import { onMounted, inject } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const axios = inject('axios');

onMounted(() => { 
  if(!(route.path in ['/auth', '/auth/callback']))
  axios.get('/users/current').then((res) => {
    localStorage.setItem('isAuthenticated', '1')
    localStorage.setItem('id', res.data.id)
    localStorage.setItem('username', res.data.username)
    localStorage.setItem('profile_image', res.data.profile_image)
  }).catch((err) => {
    // if it's a 401 error, it's because the user isn't authenticated
    // and we don't care about those errors
    if(err.response.status !== 401) console.log(`Error checking user status in API: ${err.response.status} ${err.message}`)
    localStorage.setItem('isAuthenticated', '0')
    localStorage.removeItem('id');
    localStorage.removeItem('username');
    localStorage.removeItem('profile_image');
  })
});

</script>