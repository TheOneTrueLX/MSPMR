<template>
  <p>Please wait...</p>
  <!-- <p>DEBUG: we got code {{ code }}</p> -->
</template>

<script setup>
import { onMounted, inject, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useStore } from 'vuex';
import { useToast } from 'vue-toastification';

const router = useRouter();
const route = useRoute();
const store = useStore();
const toast = useToast();

const isAuthenticated = computed(() => store.getters.isAuthenticated)

const axios = inject('axios');

onMounted(() => {
  if(!isAuthenticated.value) {
    if(!('error' in route.query)) {
      const payload = {
        code: route.query.code
      }
      axios.post('/auth/callback', payload).then((res) => {
        store.commit('saveId', res.data.id);
        store.commit('saveUsername', res.data.username);
        store.commit('saveProfileImage', res.data.profile_image);
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
  } else {
    // user is already authenticated so there's no point in sticking around here
    router.push('/queue')
  }
})

</script>