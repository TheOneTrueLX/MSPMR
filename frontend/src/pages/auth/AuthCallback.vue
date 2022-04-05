<template>
  <p>Please wait...</p>
  <!-- <p>DEBUG: we got code {{ code }}</p> -->
</template>

<script setup>
import { Ref, ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import axios from 'axios';

const router = useRouter();
const route = useRoute();

// @ts-ignore
const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/auth/callback`, { code: route.query.code })

onMounted(() => {

})
</script>