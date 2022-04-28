<template>
  <p>Please wait...</p>
  <!-- <p>DEBUG: we got code {{ code }}</p> -->
</template>

<script setup>
import { onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useToast } from 'vue-toastification';

import { apiPost } from '../../util/fetch'

const router = useRouter();
const route = useRoute();
const toast = useToast();

onMounted(async () => {
  if(!('error' in route.query)) {
    const payload = {
      code: route.query.code
    }
    const res = await apiPost('/auth/callback', payload);
    if(!('status' in res)) {
      toast.success('Successfully logged in!');
      router.push('/queue');
    } else {
      toast.error(`MSPMR Error [AuthCallback.vue:37]: ${res.message}`);
      router.push('/');
    }
  } else {
    toast.error(`Twitch returned an error: ${route.query.error_description}`)
    router.push('/')
  }
})

</script>