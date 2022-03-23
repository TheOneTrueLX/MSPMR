<template>
    <p>{{ msg }}</p>
</template>

<script>
import Vue from 'vue';

export default Vue.extend({
    data() {
        return {
            msg: 'Please wait...'
        }
    },
    mounted() {
        this.$axios.get(`/auth?code=${this.$route.query.code}`).then(() => {
            this.msg = 'You have successfully authorized MSPMR with Twitch.  Redirecting...'
            this.$router.push('/')
        }).catch((err) => {
            this.msg = `Error occurred during Twitch API authorization: ${err}`;
        })
    }
})

</script>