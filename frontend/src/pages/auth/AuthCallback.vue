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
      toast.success('Successfully logged in!');
      router.push('/queue')
    }).catch((err) => {
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