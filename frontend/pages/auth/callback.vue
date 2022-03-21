<template>
    <p>Callback from Twitch API</p>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
    data(): any {
        return {
            msg: 'Please wait...'
        }
    },
    mounted(): void {
        this.$axios.get(`/auth?code=${this.$route.query.code}`).then(() => {
            this.msg = 'You have successfully authorized MSPMR with Twitch.  You can now close this window/tab.'
        }).catch((err) => {
            this.msg = `Error occurred during Twitch API authorization: ${err}`;
        })
    }
})

</script>