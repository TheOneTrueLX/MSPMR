<template>
  <router-view />
</template>

<script setup>
import { onMounted, inject } from 'vue';
import { useStore } from 'vuex';

const store = useStore();
const axios = inject('axios');

onMounted(() => { 
  axios.get('/users/current').then((res) => {
    store.commit('save', res.data);
  }).catch((err) => {
    console.log(`Error checking user status in API: ${err.response.status} ${err.message}`)
    store.commit('save', null);
  })
});

</script>