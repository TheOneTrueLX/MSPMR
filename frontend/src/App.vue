<template>
  <router-view v-slot="{ Component }">
    <template v-if="Component">
      <Suspense>
        <component :is="Component"></component>
        <template #fallback>
          <p>Loading...</p>
        </template>
      </Suspense>
    </template>
  </router-view>
</template>

<script setup>
import { onMounted, onErrorCaptured, inject } from 'vue';
import { useRoute } from 'vue-router';
import { useToast } from 'vue-toastification';

const route = useRoute();
const axios = inject('axios');
const toast = useToast();

onMounted(() => { 
  if(!(route.path in ['/auth', '/auth/callback']) || localStorage.getItem('isAuthenticated') === '0')
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

onErrorCaptured((e) => {
  toast.error(`MSPMR Error: ${e.message}`)
  return true;
})

</script>