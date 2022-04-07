<template>
  <p>Please wait...</p>
  <!-- <p>DEBUG: we got code {{ code }}</p> -->
</template>

<script setup>
import { onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useStore } from 'vuex';
import axios from 'axios';

const router = useRouter();
const route = useRoute();

const store = useStore();

onMounted(() => {
  // @ts-ignore
  axios.post(`${import.meta.env.VITE_API_URL}/auth/callback`, { code: route.query.code }).then((res) => {
    store.dispatch('setToken', res.data);
  }).catch((err) => {
    // TODO: handle this error
    console.log(JSON.stringify(err))
  })
  router.push('/')
})

</script>