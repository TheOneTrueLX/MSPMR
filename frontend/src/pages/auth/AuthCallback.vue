<template>
  <p>Please wait...</p>
  <!-- <p>DEBUG: we got code {{ code }}</p> -->
</template>

<script setup>
import { onMounted, inject, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useToast } from 'vue-toastification';

const router = useRouter();
const route = useRoute();
const toast = useToast();

const axios = inject('axios');

onMounted(() => {
  if(!('error' in route.query)) {
    const payload = {
      code: route.query.code
    }
    axios.post('/auth/callback', payload).then((res) => {
      localStorage.setItem('isAuthenticated', '1')
      localStorage.setItem('id', res.data.id)
      localStorage.setItem('username', res.data.username)
      localStorage.setItem('profile_image', res.data.profile_image)
      toast.success('Successfully logged in!');
      router.push('/queue')
    }).catch((err) => {
      localStorage.setItem('isAuthenticated', '0')
      toast.error(`MSPMR API returned an error: ${err}`);
      console.log(`Error code: ${err.response.status}: ${err.message}`);
      router.push('/')
    })
  } else {
    toast.error(`Twitch returned an error: ${route.query.error_description}`)
    router.push('/')
  }
})

</script>