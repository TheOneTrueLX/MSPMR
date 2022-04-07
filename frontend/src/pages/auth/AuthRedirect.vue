<template>
  <p>Redirecting to Twitch.tv for authentication...</p>
</template>

<script setup>
import { onMounted } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router'

const store = useStore()
const router = useRouter()

// @ts-ignore
const uri = `https://id.twitch.tv/oauth2/authorize?response_type=code&client_id=${import.meta.env.VITE_TWITCH_CLIENT_ID}&${import.meta.env.MODE === 'development' ? 'force_verify=1&' : ''}redirect_uri=http://localhost:3000/auth/callback&scope=channel:read:redemptions+channel:manage:redemptions+moderation:read+user:read:email`

onMounted(() => {
  if(store.getters.token === '') {
    // if there's no token in the store, we go through the auth process
    window.location.href = uri;
  } else {
    // if there is a token set, bypass auth and redirect back to home
    router.push('/')
  }
})
</script>