<template>
    <p>Testing Fetch API</p>
    <p>{{ user.username }}</p>
</template>

<script setup>
import { ref } from 'vue';

const user = ref(await fetchCurrentUser())
const channels = ref(await fetchChannelList())

async function fetchCurrentUser() {
    const response = await fetch('https://localhost:5000/api/v1/users/current', { method: 'GET', credentials: 'include' })
    if(response.status == 401) { 
        return null;
    } else {
        return await response.json();
    }
}

async function fetchChannelList() {
    const response = await fetch('https://localhost:5000/api/v1/channels', { method: 'GET', credentials: 'include' })
    if(response.status == 401) {
        return null;
    } else {
        return await response.json();
    }
}

</script>