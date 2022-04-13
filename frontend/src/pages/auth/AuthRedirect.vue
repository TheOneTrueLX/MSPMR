<template>
  <p>Redirecting to Twitch.tv for authentication...</p>
</template>

<script setup>
import { onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';

const router = useRouter();
const store = useStore();

const isAuthenticated = computed(() => store.getters.isAuthenticated) 

// @ts-ignore
const uri = `https://id.twitch.tv/oauth2/authorize?response_type=code&client_id=${import.meta.env.VITE_TWITCH_CLIENT_ID}&${import.meta.env.MODE === 'development' ? 'force_verify=1&' : ''}redirect_uri=https://localhost:3000/auth/callback&scope=channel:read:redemptions+channel:manage:redemptions+moderation:read+user:read:email`

onMounted(() => {
  if(isAuthenticated.value) {
    // if there is a token set, bypass auth and go straight to the queue
    router.push('/queue')
  } else {  
    // if there's no token cookie set, we go through the auth process
    window.location.href = uri;
  }
})
</script>