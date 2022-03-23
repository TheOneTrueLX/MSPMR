<template>
  <p>Please wait...</p>
</template>

<script lang="ts">
    import Vue from 'vue';

    export default Vue.extend({
        mounted() {
            window.location.href = `https://id.twitch.tv/oauth2/authorize?response_type=code&client_id=${process.env.TwitchClientID}&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fauth%2Fcallback&scope=viewing_activity_read%20channel:read:redemptions%20channel:manage:redemptions&force_verify=true`
        }
    })
</script>