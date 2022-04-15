<template>
  <p>Redirecting to Twitch.tv for authentication...</p>
</template>

<script setup>
import { onMounted } from 'vue';

// @ts-ignore
const uri = `https://id.twitch.tv/oauth2/authorize?response_type=code&client_id=${import.meta.env.VITE_TWITCH_CLIENT_ID}&${import.meta.env.MODE === 'development' ? 'force_verify=1&' : ''}redirect_uri=https://localhost:3000/auth/callback&scope=channel:read:redemptions+channel:manage:redemptions+moderation:read+user:read:email`

onMounted(() => {
  window.location.href = uri;
})
</script>